import emailjs from '@emailjs/browser';

// EmailJS 配置 - 需要替换为你的实际配置
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_p39qzh8',      // 替换为你的Service ID
  TEMPLATE_ID: 'template_09wydro',    // 替换为你的Template ID
  PUBLIC_KEY: 'Q0oao9YVGsj0c2TTC',         // 替换为你的Public Key
};

/**
 * 发送邮件服务
 */
class EmailService {
  constructor() {
    // 初始化EmailJS
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    
    // 验证配置
    console.log('EmailJS配置:', {
      SERVICE_ID: EMAILJS_CONFIG.SERVICE_ID,
      TEMPLATE_ID: EMAILJS_CONFIG.TEMPLATE_ID,
      PUBLIC_KEY: EMAILJS_CONFIG.PUBLIC_KEY.substring(0, 8) + '...'
    });
  }

  /**
   * 验证EmailJS模板配置
   * @returns {Promise} 验证结果
   */
  async validateTemplate() {
    try {
      const testParams = {
        to_email: 'test@example.com',
        subject: '模板验证测试',
        message: '这是模板验证测试邮件',
        from_name: '验证器',
        reply_to: 'test@example.com'
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        testParams
      );

      return {
        valid: true,
        message: '模板配置正确',
        response: response
      };
    } catch (error) {
      let validationMessage = '模板配置错误';
      
      if (error.text && error.text.includes('recipient')) {
        validationMessage = '模板中收件人变量未正确设置，请确保模板中使用 {{to_email}} 变量';
      } else if (error.text && error.text.includes('Service')) {
        validationMessage = 'Service ID配置错误';
      } else if (error.text && error.text.includes('Template')) {
        validationMessage = 'Template ID配置错误';
      }

      return {
        valid: false,
        message: validationMessage,
        error: error.text || error.message
      };
    }
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
      // 使用EmailJS模板期望的标准变量名
      const templateParams = {
        to_email: emailData.to_email,    // 收件人邮箱 - 必须匹配模板变量
        subject: emailData.subject,      // 邮件主题 - 必须匹配模板变量
        message: emailData.message,      // 邮件内容 - 必须匹配模板变量
        from_name: 'Web Application',
        reply_to: 'noreply@yourapp.com',
      };

      // 如果有附件，添加到参数中
      if (emailData.attachment) {
        templateParams.attachment = emailData.attachment;
      }

      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      return {
        success: true,
        message: '邮件发送成功',
        data: response
      };
    } catch (error) {
      console.error('邮件发送失败:');
      console.error('错误状态:', error.status);
      console.error('错误文本:', error.text);
      console.error('错误详情:', JSON.stringify(error, null, 2));
      
      // 提供更具体的错误信息
      let errorMessage = '邮件发送失败';
      if (error.text) {
        if (error.text.includes('Service ID')) {
          errorMessage = '服务ID配置错误，请检查EmailJS控制台中的Service ID';
        } else if (error.text.includes('Template ID')) {
          errorMessage = '模板ID配置错误，请检查EmailJS控制台中的Template ID';
        } else if (error.text.includes('recipient')) {
          errorMessage = '收件人邮箱格式错误或无效';
        } else if (error.text.includes('quota')) {
          errorMessage = 'EmailJS配额已用完，请检查账户状态';
        } else {
          errorMessage = `发送失败: ${error.text}`;
        }
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.text || error.message,
        debug: {
          status: error.status,
          text: error.text,
          fullError: error
        }
      };
    }
  }

  /**
   * 发送简单邮件（无附件）
   * @param {Object} emailData - 邮件数据
   * @returns {Promise} 发送结果
   */
  async sendSimpleEmail(emailData) {
    return this.sendEmailWithAttachment(emailData);
  }

  /**
   * 验证邮箱格式
   * @param {string} email - 邮箱地址
   * @returns {boolean} 是否有效
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 验证文件大小（限制在10MB以内）
   * @param {File} file - 文件对象
   * @returns {boolean} 是否有效
   */
  validateFileSize(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    return file.size <= maxSize;
  }

  /**
   * 验证文件类型
   * @param {File} file - 文件对象
   * @param {Array} allowedTypes - 允许的文件类型数组
   * @returns {boolean} 是否有效
   */
  validateFileType(file, allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain']) {
    return allowedTypes.includes(file.type);
  }
}

// 创建单例实例
const emailService = new EmailService();

export default emailService;
export { EmailService };