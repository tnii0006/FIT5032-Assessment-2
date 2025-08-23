# EmailJS 配置指南

## 🚀 快速开始

邮件发送失败通常是因为EmailJS服务未正确配置。请按照以下步骤完成配置：

## 📋 步骤1：注册EmailJS账户

1. 访问 [EmailJS官网](https://www.emailjs.com/)
2. 点击 "Sign Up" 注册新账户
3. 登录后进入控制台

## 📧 步骤2：创建邮件服务

1. 点击左侧菜单 "Email Services"
2. 点击 "Add New Service"
3. 选择邮件提供商（推荐Gmail）
4. 按照向导完成服务配置
5. 记录 **Service ID**

## 📝 步骤3：创建邮件模板

1. 点击左侧菜单 "Email Templates"
2. 点击 "Create New Template"
3. 设置模板内容：

**模板示例：**
```
Subject: {{subject}}

From: {{from_name}} <{{reply_to}}>
To: {{to_email}}

{{message}}

---
此邮件由Web应用自动发送
```

4. 保存模板并记录 **Template ID**

## 🔑 步骤4：获取Public Key

1. 点击左侧菜单 "Account"
2. 找到 "Public Key" 部分
3. 复制 **Public Key**

## ⚙️ 步骤5：更新配置

编辑 `src/services/emailService.js` 文件：

```javascript
const EMAILJS_CONFIG = {
  SERVICE_ID: '你的_service_id',      // 从步骤2获取
  TEMPLATE_ID: '你的_template_id',    // 从步骤3获取
  PUBLIC_KEY: '你的_public_key',     // 从步骤4获取
};
```

## 🔧 步骤6：测试配置

1. 重启开发服务器：
```bash
npm run dev
```

2. 访问 http://localhost:5173/email
3. 填写测试信息：
   - 收件人：2239111945@qq.com
   - 主题：测试邮件
   - 内容：这是一封测试邮件

## 🎯 常见问题排查

### 问题1：服务未启用
- 确保在EmailJS中已启用邮件服务
- 检查服务状态是否为 "Active"

### 问题2：模板变量错误
- 确保模板中的变量名与代码中的参数名匹配
- 检查模板是否已发布

### 问题3：域名限制
- 在EmailJS控制台中添加你的域名到允许列表
- 本地测试时添加 `localhost` 到允许列表

### 问题4：邮件被拦截
- 检查垃圾邮件文件夹
- 确认发件邮箱已验证

## 📞 技术支持

如果仍有问题：
1. 检查浏览器控制台错误信息
2. 确认网络连接正常
3. 联系EmailJS官方支持

## ✅ 验证清单

- [ ] EmailJS账户已注册
- [ ] 邮件服务已创建并启用
- [ ] 邮件模板已创建并发布
- [ ] Public Key已获取
- [ ] 配置文件已更新
- [ ] 域名已添加到允许列表

完成以上步骤后，邮件发送功能应该能正常工作！