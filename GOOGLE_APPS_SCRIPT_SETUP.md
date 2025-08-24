# Google Apps Script 邮件服务配置指南

## 概述

本应用已从 EmailJS 迁移到 Google Apps Script 邮件服务。Google Apps Script 提供了更强大的邮件发送功能，支持附件和批量发送。

## 配置步骤

### 1. 创建 Google Apps Script 项目

1. 访问 [Google Apps Script](https://script.google.com/)
2. 点击「新建项目」
3. 将项目重命名为「Email Service」

### 2. 添加代码

1. 删除默认的 `myFunction()` 代码
2. 复制 `google-apps-script/Code.gs` 文件中的所有代码
3. 粘贴到 Google Apps Script 编辑器中
4. 保存项目（Ctrl+S）

### 3. 设置权限

1. 点击「运行」按钮测试代码
2. 系统会提示需要授权，点击「审查权限」
3. 选择你的 Google 账户
4. 点击「高级」→「转至项目名称（不安全）」
5. 点击「允许」授予必要权限

### 4. 部署为 Web 应用

1. 点击「部署」→「新建部署」
2. 选择类型：「Web 应用」
3. 配置设置：
   - **说明**：Email Service API
   - **执行身份**：我
   - **访问权限**：任何人
4. 点击「部署」
5. **重要**：复制生成的 Web 应用 URL

### 5. 更新前端配置

1. 打开 `src/services/emailService.js` 文件
2. 找到第 4 行的 `API_URL` 配置：
   ```javascript
   API_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
   ```
3. 将 `YOUR_SCRIPT_ID` 替换为步骤 4 中复制的 Web 应用 URL

### 6. 测试 Google Apps Script

在部署前，建议先测试脚本功能：

1. 在 Google Apps Script 编辑器中，选择 `testDoPost` 函数
2. 点击「运行」按钮
3. 查看「执行记录」，确认所有测试通过
4. 如果有错误，检查权限设置和代码

### 7. 测试前端配置

1. 启动开发服务器：`npm run dev`
2. 访问邮件发送页面：`http://localhost:5173/email`
3. 查看「Service Status」部分，应显示「Google Apps Script邮件服务连接正常」
4. 尝试发送测试邮件

## 功能特性

### ✅ 支持的功能

- 单个邮件发送
- 批量邮件发送
- 附件支持（最大 10MB）
- 支持的附件格式：JPG, PNG, PDF, TXT, DOC, DOCX
- 邮箱格式验证
- 连接状态检查
- 详细的错误提示

### 📧 邮件格式

- 自动 HTML 格式化
- 保持文本换行
- 专业的邮件样式

## 故障排除

### CORS 错误解决方案

如果遇到 CORS 错误（如 "Response to preflight request doesn't pass access control check"）：

**步骤 1：重新部署 Google Apps Script**
1. 在 Google Apps Script 编辑器中，点击「部署」→「管理部署」
2. 点击现有部署旁边的「编辑」按钮（铅笔图标）
3. 在「版本」下拉菜单中选择「新版本」
4. 确认配置：
   - **执行身份**：我
   - **访问权限**：任何人
5. 点击「部署」
6. 复制新的 Web 应用 URL

**步骤 2：更新前端 URL**
1. 将新的 URL 更新到 `src/services/emailService.js` 中的 `API_URL`
2. 重启开发服务器：`npm run dev`

**步骤 3：清除浏览器缓存**
1. 按 F12 打开开发者工具
2. 右键点击刷新按钮，选择「清空缓存并硬性重新加载」

### ContentService setHeaders 错误

如果遇到 `TypeError: ContentService.createTextOutput(...).setMimeType(...).setHeaders is not a function` 错误：

- **原因**：Google Apps Script 的 ContentService 不支持 setHeaders 方法
- **解决方案**：已在代码中移除所有 setHeaders 调用，Google Apps Script 会自动处理 CORS

### postData 未定义错误

如果在 Google Apps Script 执行记录中看到 "Cannot read properties of undefined (reading 'postData')"：

1. 确认请求方法为 POST
2. 检查请求头包含 `Content-Type: application/json`
3. 确认请求体包含有效的 JSON 数据
4. 运行 `testDoPost` 函数验证脚本逻辑

### 连接失败

如果显示「连接检查失败」：

1. 检查 Google Apps Script URL 是否正确
2. 确认 Web 应用已正确部署
3. 检查网络连接
4. 运行 Google Apps Script 中的测试函数

### 发送失败

如果邮件发送失败：

1. 检查收件人邮箱格式
2. 确认附件大小不超过 10MB
3. 检查 Google 账户的邮件发送配额
4. 查看 Google Apps Script 执行记录中的详细错误

### CORS 错误

如果出现 CORS 错误：

1. Google Apps Script Web 应用会自动处理 CORS
2. 确认 Google Apps Script 的访问权限设置为「任何人」
3. 重新部署 Web 应用

## 安全注意事项

- Google Apps Script 使用你的 Google 账户发送邮件
- 请勿在公共环境中暴露 Web 应用 URL
- 定期检查 Google Apps Script 的使用配额
- 建议为生产环境创建专用的 Google 账户

## 更新部署

如果需要修改 Google Apps Script 代码：

1. 在 Google Apps Script 编辑器中修改代码
2. 保存更改
3. 点击「部署」→「管理部署」
4. 点击现有部署旁的「编辑」
5. 更新版本并重新部署

## 支持

如果遇到问题，请检查：

1. Google Apps Script 控制台的执行记录
2. 浏览器开发者工具的网络请求
3. 前端应用的控制台错误信息
