// Google Apps Script 配置
const GOOGLE_APPS_SCRIPT_CONFIG = {
  // 替换为你的Google Apps Script Web应用URL
  API_URL:
    'https://script.google.com/macros/s/AKfycbyW7CIsgjcSXLXutxjzXJi24cqOEmhc3JZjh73UShi0SQ7pKTXiucY61ToLjqN_Z-0uBw/exec',
  // 请求超时时间（毫秒）
  TIMEOUT: 30000,
}

// 支持通过环境变量覆盖 GAS URL（Vite 提供 import.meta.env，直接读取即可）
const GAS_WEBAPP_URL =
  import.meta && import.meta.env && import.meta.env.VITE_GAS_WEBAPP_URL
    ? import.meta.env.VITE_GAS_WEBAPP_URL
    : GOOGLE_APPS_SCRIPT_CONFIG.API_URL

/**
 * Google Apps Script 邮件发送服务
 */
class EmailService {
  constructor() {
    // 验证配置
    if (!GAS_WEBAPP_URL) {
      console.warn(
        '⚠️ Google Apps Script API URL not configured, please set the correct URL via VITE_GAS_WEBAPP_URL or GOOGLE_APPS_SCRIPT_CONFIG',
      )
    }

    console.log('Google Apps Script email service initialized:', {
      API_URL: GAS_WEBAPP_URL,
      TIMEOUT: GOOGLE_APPS_SCRIPT_CONFIG.TIMEOUT,
    })
  }

  /**
   * 验证Google Apps Script连接
   * @returns {Promise} 验证结果
   */
  async validateConnection() {
    console.log('🔍 Starting connection validation...')
    console.log('📍 API URL:', GAS_WEBAPP_URL)

    try {
      // 先通过 GET doGet 进行轻量级连通性测试（避免触发预检）
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), GOOGLE_APPS_SCRIPT_CONFIG.TIMEOUT)

      const pingUrl = GAS_WEBAPP_URL + (GAS_WEBAPP_URL.includes('?') ? '&' : '?') + 'ping=1'
      const resp = await fetch(pingUrl, {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!resp.ok) {
        throw new Error(`HTTP error on ping! status: ${resp.status}`)
      }

      // 尝试解析 JSON（如果不是 JSON 也不强制）
      let data = null
      try {
        const ct = resp.headers.get('content-type') || ''
        if (ct.includes('application/json')) {
          data = await resp.json()
        } else {
          const text = await resp.text()
          data = { raw: text }
        }
      } catch (_) {
        // ignore parse error
      }

      console.log('✅ Connection ping successful:', data)
      return {
        valid: true,
        message: 'Google Apps Script connection successful',
        response: data,
      }
    } catch (error) {
      let validationMessage = 'Google Apps Script connection failed'

      if (
        error.message &&
        (error.message.includes('Network connection failed') ||
          error.message.includes('Failed to fetch'))
      ) {
        validationMessage = 'Network connection error - please check if the API URL is correct'
      } else if (error.message && error.message.includes('CORS')) {
        validationMessage =
          'CORS error - please ensure Google Apps Script is properly configured with access permissions'
      } else if (
        error.message &&
        (error.message.includes('timeout') || error.message.includes('Request timeout'))
      ) {
        validationMessage = 'Request timeout - please check network connection'
      }

      console.error('Connection validation failed:', error)

      return {
        valid: false,
        message: validationMessage,
        error: error.message,
      }
    }
  }

  /**
   * 向Google Apps Script发送请求
   * @param {Object} data - 请求数据
   * @param {boolean} isTest - 是否为测试请求
   * @returns {Promise} 请求结果
   */
  async makeRequest(data, isTest = false) {
    console.log('🚀 Making request to Google Apps Script...')
    console.log('📍 URL:', GAS_WEBAPP_URL)
    console.log('📦 Request data:', data)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), GOOGLE_APPS_SCRIPT_CONFIG.TIMEOUT)

    try {
      console.log('⏳ Sending fetch request...')
      // 避免 CORS 预检：不设置 application/json 头，直接发送字符串（text/plain 属于 safelisted）
      const response = await fetch(GAS_WEBAPP_URL, {
        method: 'POST',
        // 不显式设置 Content-Type，保持为浏览器默认的 text/plain;charset=UTF-8
        body: JSON.stringify(data),
        signal: controller.signal,
      })

      console.log('📡 Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ Response parsed successfully:', result)
      return result
    } catch (error) {
      clearTimeout(timeoutId)

      console.error('❌ Request failed:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      })

      if (error.name === 'AbortError') {
        console.error('⏰ Request timed out after', GOOGLE_APPS_SCRIPT_CONFIG.TIMEOUT, 'ms')
        throw new Error('Request timeout')
      }

      // 添加更详细的错误信息
      if (error.message.includes('Failed to fetch')) {
        console.error('🌐 Network fetch failed - possible causes:')
        console.error('  - Google Apps Script URL is incorrect')
        console.error('  - Network connectivity issues')
        console.error('  - Google Apps Script is not deployed or accessible')
        throw new Error(
          'Network connection failed - please check if the Google Apps Script URL is correct and accessible',
        )
      }

      if (error.message.includes('CORS')) {
        console.error('🚫 CORS error detected - possible causes:')
        console.error('  - Google Apps Script deployment settings')
        console.error('  - Cross-origin request blocked')
        throw new Error(
          'CORS error - please ensure Google Apps Script is deployed with proper permissions',
        )
      }

      console.error('🔧 General error:', error.message)
      throw error
    }
  }

  /**
   * 将文件转换为Base64格式
   * @param {File} file - 文件对象
   * @returns {Promise<Object>} Base64数据和文件信息
   */
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        // 移除data:前缀，只保留base64数据
        const base64Data = reader.result.split(',')[1]

        resolve({
          name: file.name,
          data: base64Data,
          mimeType: file.type,
          size: file.size,
        })
      }

      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }

      reader.readAsDataURL(file)
    })
  }

  /**
   * 发送带附件的邮件
   * @param {Object} emailData - 邮件数据
   * @param {string} emailData.to_email - 收件人邮箱
   * @param {string} emailData.subject - 邮件主题
   * @param {string} emailData.message - 邮件内容
   * @param {File} emailData.attachment - 附件文件
   * @returns {Promise} 发送结果
   */
  async sendEmailWithAttachment(emailData) {
    try {
      // 验证必需字段
      if (!emailData.to_email || !emailData.subject || !emailData.message) {
        return {
          success: false,
          message: 'Missing required fields: recipient email, subject or content',
        }
      }

      // 验证邮箱格式
      if (!this.validateEmail(emailData.to_email)) {
        return {
          success: false,
          message: 'Invalid recipient email format',
        }
      }

      // 构建请求数据
      const requestData = {
        to_email: emailData.to_email,
        subject: emailData.subject,
        message: emailData.message,
      }

      // 处理附件：支持 File 或 预先转换好的 {name,data,mimeType,size}
      if (emailData.attachment) {
        let attachmentPayload = null

        if (typeof emailData.attachment === 'object' && 'data' in emailData.attachment) {
          // 已经是 Base64 对象
          attachmentPayload = emailData.attachment
        } else {
          // 认为是 File 对象，校验并转换
          const file = emailData.attachment

          if (!this.validateFileSize(file)) {
            return {
              success: false,
              message: 'Attachment size exceeds 10MB limit',
            }
          }

          if (!this.validateFileType(file)) {
            return {
              success: false,
              message: 'Unsupported file type',
            }
          }

          try {
            attachmentPayload = await this.fileToBase64(file)
          } catch (error) {
            return {
              success: false,
              message: 'Attachment processing failed: ' + error.message,
            }
          }
        }

        requestData.attachment = attachmentPayload
      }

      // 发送请求到Google Apps Script
      const response = await this.makeRequest(requestData)

      if (response && response.success) {
        return {
          success: true,
          message: response.message || 'Email sent successfully',
          data: response.data,
        }
      } else {
        return {
          success: false,
          message: (response && response.message) || 'Email sending failed',
          error: response && response.error,
        }
      }
    } catch (error) {
      console.error('Email sending failed:', error)

      // Provide more specific error information
      let errorMessage = 'Email sending failed'

      if (error.message) {
        if (error.message.includes('timeout')) {
          errorMessage = 'Request timeout, please check network connection or try again later'
        } else if (error.message.includes('fetch')) {
          errorMessage =
            'Network connection error, please check Google Apps Script URL configuration'
        } else if (error.message.includes('CORS')) {
          errorMessage =
            'CORS error, please ensure Google Apps Script is properly configured with access permissions'
        } else if (error.message.includes('HTTP error')) {
          errorMessage = 'Google Apps Script service error, please check script deployment status'
        } else {
          errorMessage = `Sending failed: ${error.message}`
        }
      }

      return {
        success: false,
        message: errorMessage,
        error: error.message,
        debug: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      }
    }
  }

  // 发送简单邮件（无附件）
  async sendSimpleEmail(emailData) {
    return this.sendEmailWithAttachment(emailData)
  }

  // 批量发送邮件
  async sendBulkEmail(bulkEmailData) {
    const { recipients, subject, message, attachment } = bulkEmailData || {}

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return {
        success: false,
        message: 'No recipients specified for bulk email',
      }
    }

    if (!subject || !message) {
      return {
        success: false,
        message: 'Missing required fields: subject or content',
      }
    }

    // 预处理附件（如果有，转换一次）
    let preConvertedAttachment = null
    if (attachment) {
      try {
        if (typeof attachment === 'object' && 'data' in attachment) {
          preConvertedAttachment = attachment
        } else {
          if (!this.validateFileSize(attachment)) {
            return {
              success: false,
              message: 'Attachment size exceeds 10MB limit',
            }
          }
          if (!this.validateFileType(attachment)) {
            return {
              success: false,
              message: 'Unsupported file type',
            }
          }
          preConvertedAttachment = await this.fileToBase64(attachment)
        }
      } catch (error) {
        return {
          success: false,
          message: 'Attachment processing failed: ' + error.message,
        }
      }
    }

    const results = {
      total: recipients.length,
      successful: 0,
      failed: 0,
      errors: [],
    }

    await Promise.all(
      recipients.map(async (email) => {
        try {
          if (!this.validateEmail(email)) {
            results.failed++
            results.errors.push({ email, error: 'Invalid email format' })
            return
          }

          const res = await this.sendEmailWithAttachment({
            to_email: email,
            subject,
            message,
            attachment: preConvertedAttachment,
          })

          if (res.success) {
            results.successful++
          } else {
            results.failed++
            results.errors.push({ email, error: res.message })
          }
        } catch (err) {
          results.failed++
          results.errors.push({ email, error: err.message })
        }
      }),
    )

    let resultMessage
    if (results.successful === results.total) {
      resultMessage = `All ${results.total} emails sent successfully!`
    } else if (results.successful > 0) {
      resultMessage = `${results.successful} of ${results.total} emails sent successfully. ${results.failed} failed.`
    } else {
      resultMessage = `All ${results.total} emails failed to send.`
    }

    return {
      success: results.successful > 0,
      message: resultMessage,
      data: results,
    }
  }

  // 校验邮箱
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // 校验文件大小（<=10MB）
  validateFileSize(file) {
    const maxSize = 10 * 1024 * 1024
    return file && file.size <= maxSize
  }

  // 校验文件类型
  validateFileType(
    file,
    allowedTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  ) {
    return !!(file && allowedTypes.includes(file.type))
  }
}

// 创建单例实例
const emailService = new EmailService()

export default emailService
export { EmailService }
