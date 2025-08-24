# Google Apps Script Email Service 部署指南

本文档说明如何部署和配置Google Apps Script邮件服务，以替代EmailJS实现邮件发送功能。

## 🚀 部署步骤

### 1. 创建Google Apps Script项目

1. 访问 [Google Apps Script](https://script.google.com/)
2. 点击「新建项目」
3. 将项目重命名为「Email Service」
4. 删除默认的 `myFunction()` 代码
5. 复制 `Code.gs` 文件中的所有代码并粘贴到编辑器中

### 2. 授权权限

1. 点击「保存」按钮（Ctrl+S）
2. 点击「运行」按钮来触发权限授权
3. 在弹出的授权对话框中：
   - 点击「审核权限」
   - 选择你的Google账户
   - 点击「高级」
   - 点击「转至 Email Service（不安全）」
   - 点击「允许」

### 3. 部署为Web应用

1. 点击右上角的「部署」按钮
2. 选择「新建部署」
3. 在「类型」中选择「网络应用」
4. 配置部署设置：
   - **说明**：Email Service API
   - **执行身份**：我
   - **访问权限**：任何人
5. 点击「部署」
6. **重要**：复制生成的「网络应用网址」，这就是你的API端点

### 4. 测试部署

1. 在Apps Script编辑器中，选择 `testEmailFunction` 函数
2. 点击「运行」
3. 检查日志输出确认功能正常

## 🔧 API使用说明

### 端点URL

```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### 发送单个邮件

**请求方法**: POST  
**Content-Type**: application/json

**请求体示例**:

```json
{
  "to_email": "recipient@example.com",
  "subject": "邮件主题",
  "message": "邮件内容",
  "attachment": {
    "name": "document.pdf",
    "data": "base64编码的文件数据",
    "mimeType": "application/pdf"
  }
}
```

**响应示例**:

```json
{
  "success": true,
  "message": "Email sent successfully",
  "data": {
    "to": "recipient@example.com",
    "subject": "邮件主题",
    "hasAttachment": true
  }
}
```

### 批量发送邮件

**请求体示例**:

```json
{
  "type": "bulk",
  "recipients": ["user1@example.com", "user2@example.com"],
  "subject": "批量邮件主题",
  "message": "批量邮件内容",
  "attachment": {
    "name": "report.pdf",
    "data": "base64编码的文件数据",
    "mimeType": "application/pdf"
  }
}
```

## 📋 功能特性

- ✅ 发送HTML格式邮件
- ✅ 支持文件附件（最大25MB）
- ✅ 批量邮件发送
- ✅ 邮箱格式验证
- ✅ 错误处理和日志记录
- ✅ CORS支持
- ✅ 自动HTML格式化

## 🔒 安全注意事项

1. **访问权限**: 部署时选择「任何人」访问权限是为了允许前端调用
2. **配额限制**: Google Apps Script有每日邮件发送配额限制
3. **附件大小**: 单个附件最大25MB（Gmail限制）
4. **速率限制**: 避免过于频繁的API调用

## 🐛 常见问题

### 问题1: 权限被拒绝

**解决方案**: 重新运行授权流程，确保授予了Gmail发送权限

### 问题2: 配额超限

**解决方案**: 等待24小时后重试，或升级到Google Workspace账户

### 问题3: CORS错误

**解决方案**: 确保在doPost和doOptions函数中正确设置了CORS头

### 问题4: 附件无法发送

**解决方案**:

- 检查Base64编码是否正确
- 确认文件大小不超过25MB
- 验证MIME类型设置

## 📝 更新部署

当你修改代码后：

1. 保存更改
2. 点击「部署」→「管理部署」
3. 点击现有部署旁的编辑图标
4. 更改「版本」为「新版本」
5. 点击「部署」

## 📞 支持

如果遇到问题，请检查：

1. Google Apps Script执行记录
2. 浏览器开发者工具的网络请求
3. 确认API端点URL正确

---

**注意**: 请将生成的Web应用URL更新到前端代码的emailService.js文件中。
