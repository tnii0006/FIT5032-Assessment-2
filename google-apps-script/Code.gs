/**
 * Google Apps Script Email Service
 * 用于处理邮件发送请求，支持附件功能
 */

/**
 * 处理POST请求 - 发送邮件
 * @param {Object} e - 请求事件对象
 * @returns {Object} 响应结果
 */
function doPost(e) {
  try {
    // 检查请求数据是否存在
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          message: 'No request data received',
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    // 解析请求数据
    let requestData
    try {
      requestData = JSON.parse(e.postData.contents)
    } catch (parseError) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          message: 'Invalid JSON format in request data',
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    // 验证必需字段
    if (!requestData.to_email || !requestData.subject || !requestData.message) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          message: 'Missing required fields: to_email, subject, or message',
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    // 发送邮件
    const result = sendEmailWithAttachment(requestData)

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString())
    Logger.log('Request object: ' + JSON.stringify(e))

    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: 'Server error: ' + error.toString(),
        debug: {
          hasEvent: !!e,
          hasPostData: !!(e && e.postData),
          hasContents: !!(e && e.postData && e.postData.contents)
        }
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

/**
 * 处理OPTIONS请求 - CORS预检
 * @returns {Object} CORS响应
 */
function doOptions() {
  const output = ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
  
  // 注意：Google Apps Script的ContentService不支持setHeaders方法
  // CORS头部需要通过其他方式处理，或者在部署时配置
  
  return output
}

/**
 * 发送带附件的邮件
 * @param {Object} emailData - 邮件数据
 * @param {string} emailData.to_email - 收件人邮箱
 * @param {string} emailData.subject - 邮件主题
 * @param {string} emailData.message - 邮件内容
 * @param {Object} emailData.attachment - 附件数据（可选）
 * @param {string} emailData.attachment.name - 附件文件名
 * @param {string} emailData.attachment.data - 附件Base64数据
 * @param {string} emailData.attachment.mimeType - 附件MIME类型
 * @returns {Object} 发送结果
 */
function sendEmailWithAttachment(emailData) {
  try {
    const { to_email, subject, message, attachment } = emailData

    // 验证邮箱格式
    if (!isValidEmail(to_email)) {
      return {
        success: false,
        message: 'Invalid email address format',
      }
    }

    // 构建邮件选项
    const emailOptions = {
      htmlBody: formatEmailContent(message),
      name: 'Web Application Email Service',
    }

    // 处理附件
    if (attachment && attachment.data && attachment.name) {
      try {
        // 将Base64数据转换为Blob
        const attachmentBlob = Utilities.newBlob(
          Utilities.base64Decode(attachment.data),
          attachment.mimeType || 'application/octet-stream',
          attachment.name,
        )

        emailOptions.attachments = [attachmentBlob]

        // 验证附件大小（限制25MB，Gmail限制）
        if (attachmentBlob.getBytes().length > 25 * 1024 * 1024) {
          return {
            success: false,
            message: 'Attachment size exceeds 25MB limit',
          }
        }
      } catch (attachmentError) {
        Logger.log('Attachment processing error: ' + attachmentError.toString())
        return {
          success: false,
          message: 'Failed to process attachment: ' + attachmentError.toString(),
        }
      }
    }

    // 发送邮件
    GmailApp.sendEmail(to_email, subject, message, emailOptions)

    Logger.log(`Email sent successfully to: ${to_email}`)

    return {
      success: true,
      message: 'Email sent successfully',
      data: {
        to: to_email,
        subject: subject,
        hasAttachment: !!attachment,
      },
    }
  } catch (error) {
    Logger.log('Email sending error: ' + error.toString())

    // 处理常见错误
    let errorMessage = 'Failed to send email'

    if (error.toString().includes('quota')) {
      errorMessage = 'Daily email quota exceeded. Please try again tomorrow.'
    } else if (error.toString().includes('permission')) {
      errorMessage = 'Permission denied. Please authorize the script to send emails.'
    } else if (error.toString().includes('invalid')) {
      errorMessage = 'Invalid email address or content.'
    }

    return {
      success: false,
      message: errorMessage,
      error: error.toString(),
    }
  }
}

/**
 * 批量发送邮件
 * @param {Object} bulkData - 批量邮件数据
 * @param {Array} bulkData.recipients - 收件人数组
 * @param {string} bulkData.subject - 邮件主题
 * @param {string} bulkData.message - 邮件内容
 * @param {Object} bulkData.attachment - 附件数据（可选）
 * @returns {Object} 批量发送结果
 */
function sendBulkEmail(bulkData) {
  const { recipients, subject, message, attachment } = bulkData

  if (!recipients || recipients.length === 0) {
    return {
      success: false,
      message: 'No recipients specified',
    }
  }

  const results = {
    total: recipients.length,
    successful: 0,
    failed: 0,
    errors: [],
  }

  // 逐个发送邮件
  recipients.forEach((email) => {
    try {
      const emailData = {
        to_email: email,
        subject: subject,
        message: message,
        attachment: attachment,
      }

      const result = sendEmailWithAttachment(emailData)

      if (result.success) {
        results.successful++
      } else {
        results.failed++
        results.errors.push({
          email: email,
          error: result.message,
        })
      }
    } catch (error) {
      results.failed++
      results.errors.push({
        email: email,
        error: error.toString(),
      })
    }
  })

  // 构建结果消息
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

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否有效
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 格式化邮件内容为HTML
 * @param {string} message - 原始消息
 * @returns {string} HTML格式的消息
 */
function formatEmailContent(message) {
  // 将换行符转换为HTML换行
  const htmlMessage = message.replace(/\n/g, '<br>')

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          ${htmlMessage}
        </div>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
          <p>This email was sent from Web Application Email Service.</p>
        </div>
      </div>
    </div>
  `
}

/**
 * 测试函数 - 用于调试
 */
function testEmailFunction() {
  const testData = {
    to_email: 'test@example.com',
    subject: 'Test Email from Google Apps Script',
    message: 'This is a test email to verify the email service is working correctly.',
  }

  const result = sendEmailWithAttachment(testData)
  Logger.log('Test result: ' + JSON.stringify(result))

  return result
}

/**
 * 测试 doPost 函数的各种场景
 */
function testDoPost() {
  console.log('=== 测试修复后的 doPost 函数 ===')
  
  // 测试1: 正常请求
  const normalRequest = {
    postData: {
      contents: JSON.stringify({
        to_email: 'test@example.com',
        subject: '测试邮件',
        message: '这是一封测试邮件'
      })
    }
  }
  
  console.log('测试1 - 正常请求:')
  try {
    const result1 = doPost(normalRequest)
    console.log('成功:', result1.getContent())
  } catch (error) {
    console.log('错误:', error.toString())
  }
  
  // 测试2: 空请求
  console.log('\n测试2 - 空请求:')
  try {
    const result2 = doPost({})
    console.log('成功:', result2.getContent())
  } catch (error) {
    console.log('错误:', error.toString())
  }
  
  // 测试3: 无效 JSON
  const invalidJsonRequest = {
    postData: {
      contents: 'invalid json string'
    }
  }
  
  console.log('\n测试3 - 无效 JSON:')
  try {
    const result3 = doPost(invalidJsonRequest)
    console.log('成功:', result3.getContent())
  } catch (error) {
    console.log('错误:', error.toString())
  }
  
  console.log('\n=== 测试完成 ===')
}
