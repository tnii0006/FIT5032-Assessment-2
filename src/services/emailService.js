// Google Apps Script 配置
const GOOGLE_APPS_SCRIPT_CONFIG = {
  // 替换为你的Google Apps Script Web应用URL
  API_URL:
    'https://script.google.com/macros/s/AKfycbwIYuc-h59Qk5X6ArGBPtJe2XNlBtr3MwASlbbNUbSStaDGBbc-lWOBVr5XunZrHebayQ/exec',
  // 请求超时时间（毫秒）
  TIMEOUT: 30000,
}

/**
 * Google Apps Script 邮件发送服务
 */
class EmailService {
  constructor() {
    // 验证配置
    if (
      !GOOGLE_APPS_SCRIPT_CONFIG.API_URL ||
      GOOGLE_APPS_SCRIPT_CONFIG.API_URL.includes(
        'AKfycbwIYuc-h59Qk5X6ArGBPtJe2XNlBtr3MwASlbbNUbSStaDGBbc-lWOBVr5XunZrHebayQ',
      )
    ) {
      console.warn(
        '⚠️ Google Apps Script API URL not configured, please set the correct URL in GOOGLE_APPS_SCRIPT_CONFIG',
      )
    }

    console.log('Google Apps Script email service initialized:', {
      API_URL: GOOGLE_APPS_SCRIPT_CONFIG.API_URL,
      TIMEOUT: GOOGLE_APPS_SCRIPT_CONFIG.TIMEOUT,
    })
  }

  /**
   * 验证Google Apps Script连接
   * @returns {Promise} 验证结果
   */
  async validateConnection() {
    console.log('🔍 Starting connection validation...')
    console.log('📍 API URL:', GOOGLE_APPS_SCRIPT_CONFIG.API_URL)

    try {
      // 发送测试请求验证连接
      const testData = {
        to_email: 'test@example.com',
        subject: 'Connection Test',
        message: 'This is a connection test message',
      }

      console.log('📤 Sending test request with data:', testData)
      const response = await this.makeRequest(testData, true) // true表示测试模式
      console.log('✅ Connection test successful:', response)

      return {
        valid: true,
        message: 'Google Apps Script connection successful',
        response: response,
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
    console.log('📍 URL:', GOOGLE_APPS_SCRIPT_CONFIG.API_URL)
    console.log('📦 Request data:', data)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), GOOGLE_APPS_SCRIPT_CONFIG.TIMEOUT)

    try {
      console.log('⏳ Sending fetch request...')
      const response = await fetch(GOOGLE_APPS_SCRIPT_CONFIG.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

      // 处理附件
      if (emailData.attachment) {
        // 验证文件大小和类型
        if (!this.validateFileSize(emailData.attachment)) {
          return {
            success: false,
            message: 'Attachment size exceeds 10MB limit',
          }
        }

        if (!this.validateFileType(emailData.attachment)) {
          return {
            success: false,
            message: 'Unsupported file type',
          }
        }

        // 转换文件为Base64
        try {
          const attachmentData = await this.fileToBase64(emailData.attachment)
          requestData.attachment = attachmentData
        } catch (error) {
          return {
            success: false,
            message: 'Attachment processing failed: ' + error.message,
          }
        }
      }

      // 发送请求到Google Apps Script
      const response = await this.makeRequest(requestData)

      if (response.success) {
        return {
          success: true,
          message: 'Email sent successfully',
          data: response.data,
        }
      } else {
        return {
          success: false,
          message: response.message || 'Email sending failed',
          error: response.error,
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

  /**
   * 发送简单邮件（无附件）
   * @param {Object} emailData - 邮件数据
   * @returns {Promise} 发送结果
   */
  async sendSimpleEmail(emailData) {
    return this.sendEmailWithAttachment(emailData)
  }

  /**
   * 批量发送邮件
   * @param {Object} bulkEmailData - 批量邮件数据
   * @param {Array} bulkEmailData.recipients - 收件人邮箱数组
   * @param {string} bulkEmailData.subject - 邮件主题
   * @param {string} bulkEmailData.message - 邮件内容
   * @param {File} bulkEmailData.attachment - 附件文件（可选）
   * @returns {Promise} 发送结果
   */
  async sendBulkEmail(bulkEmailData) {
    const { recipients, subject, message, attachment } = bulkEmailData

    if (!recipients || recipients.length === 0) {
      return {
        success: false,
        message: 'No recipients specified for bulk email',
      }
    }

    // 验证基本字段
    if (!subject || !message) {
      return {
        success: false,
        message: 'Missing required fields: subject or content',
      }
    }

    const results = {
      total: recipients.length,
      successful: 0,
      failed: 0,
      errors: [],
    }

    // 处理附件（如果有）
    let attachmentData = null
    if (attachment) {
      try {
        // 验证文件
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

        // 转换附件为Base64（只需要转换一次）
        attachmentData = await this.fileToBase64(attachment)
      } catch (error) {
        return {
          success: false,
          message: 'Attachment processing failed: ' + error.message,
        }
      }
    }

    // 批量发送邮件，每个收件人单独发送
    const sendPromises = recipients.map(async (email) => {
      try {
        // Validate email format
        if (!this.validateEmail(email)) {
          results.failed++
          results.errors.push({
            email: email,
            error: 'Invalid email format',
          })
          return { email, success: false, message: 'Invalid email format' }
        }

        const emailData = {
          to_email: email,
          subject: subject,
          message: message,
        }

        // 添加附件数据（如果有）
        if (attachmentData) {
          emailData.attachment = attachmentData
        }

        const result = await this.sendEmailWithAttachment(emailData)

        if (result.success) {
          results.successful++
        } else {
          results.failed++
          results.errors.push({
            email: email,
            error: result.message,
          })
        }

        return { email, success: result.success, message: result.message }
      } catch (error) {
        results.failed++
        results.errors.push({
          email: email,
          error: error.message,
        })
        return { email, success: false, message: error.message }
      }
    })

    // 等待所有邮件发送完成
    await Promise.all(sendPromises)

    // 返回批量发送结果
    const success = results.successful > 0
    let resultMessage

    if (results.successful === results.total) {
      resultMessage = `All ${results.total} emails sent successfully!`
    } else if (results.successful > 0) {
      resultMessage = `${results.successful} of ${results.total} emails sent successfully. ${results.failed} failed.`
    } else {
      resultMessage = `All ${results.total} emails failed to send.`
    }

    return {
      success: success,
      message: resultMessage,
      data: results,
    }
  }

  /**
   * 验证邮箱格式
   * @param {string} email - 邮箱地址
   * @returns {boolean} 是否有效
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * 验证文件大小（限制在10MB以内）
   * @param {File} file - 文件对象
   * @returns {boolean} 是否有效
   */
  validateFileSize(file) {
    const maxSize = 10 * 1024 * 1024 // 10MB
    return file.size <= maxSize
  }

  /**
   * 验证文件类型
   * @param {File} file - 文件对象
   * @param {Array} allowedTypes - 允许的文件类型数组
   * @returns {boolean} 是否有效
   */
  validateFileType(
    file,
    allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'],
  ) {
    return allowedTypes.includes(file.type)
  }
}

// 创建单例实例
const emailService = new EmailService()

export default emailService
export { EmailService }
