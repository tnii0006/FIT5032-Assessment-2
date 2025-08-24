<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h3 class="mb-0">
              <i class="bi bi-envelope-fill me-2"></i>
              Email System
            </h3>
            <div class="mt-2">
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="emailMode"
                  id="singleEmail"
                  value="single"
                  v-model="emailMode"
                />
                <label class="form-check-label text-white" for="singleEmail"> Single Email </label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="emailMode"
                  id="bulkEmail"
                  value="bulk"
                  v-model="emailMode"
                />
                <label class="form-check-label text-white" for="bulkEmail"> Bulk Email </label>
              </div>
            </div>
          </div>
          <div class="card-body">
            <form @submit.prevent="sendEmail" class="needs-validation" novalidate>
              <!-- Single Email Mode -->
              <div v-if="emailMode === 'single'" class="mb-3">
                <label for="toEmail" class="form-label">
                  <i class="bi bi-at me-1"></i>
                  Recipient Email *
                </label>
                <input
                  type="email"
                  class="form-control"
                  id="toEmail"
                  v-model="emailForm.to_email"
                  :class="{ 'is-invalid': errors.to_email }"
                  required
                  placeholder="example@domain.com"
                />
                <div class="invalid-feedback" v-if="errors.to_email">
                  {{ errors.to_email }}
                </div>
              </div>

              <!-- Bulk Email Mode -->
              <div v-if="emailMode === 'bulk'" class="mb-3">
                <label class="form-label">
                  <i class="bi bi-people me-1"></i>
                  Select Recipients *
                </label>
                <div class="row">
                  <div class="col-md-6">
                    <div class="card">
                      <div class="card-header">
                        <h6 class="mb-0">Available Users</h6>
                        <small class="text-muted">{{ availableUsers.length }} users</small>
                      </div>
                      <div class="card-body" style="max-height: 200px; overflow-y: auto">
                        <div class="mb-2">
                          <button
                            type="button"
                            class="btn btn-sm btn-outline-primary me-2"
                            @click="selectAllUsers"
                          >
                            Select All
                          </button>
                          <button
                            type="button"
                            class="btn btn-sm btn-outline-secondary"
                            @click="clearAllUsers"
                          >
                            Clear All
                          </button>
                        </div>
                        <div v-for="user in availableUsers" :key="user.id" class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="'user-' + user.id"
                            :value="user"
                            v-model="selectedUsers"
                          />
                          <label class="form-check-label" :for="'user-' + user.id">
                            {{ user.name }} ({{ user.email }})
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="card">
                      <div class="card-header">
                        <h6 class="mb-0">Selected Recipients</h6>
                        <small class="text-muted">{{ selectedUsers.length }} selected</small>
                      </div>
                      <div class="card-body" style="max-height: 200px; overflow-y: auto">
                        <div v-if="selectedUsers.length === 0" class="text-muted text-center py-3">
                          No recipients selected
                        </div>
                        <div
                          v-for="user in selectedUsers"
                          :key="user.id"
                          class="d-flex justify-content-between align-items-center mb-2"
                        >
                          <span>{{ user.name }}</span>
                          <button
                            type="button"
                            class="btn btn-sm btn-outline-danger"
                            @click="removeUser(user)"
                          >
                            <i class="bi bi-x"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="invalid-feedback" v-if="errors.recipients" style="display: block">
                  {{ errors.recipients }}
                </div>
              </div>

              <!-- Email Subject -->
              <div class="mb-3">
                <label for="subject" class="form-label">
                  <i class="bi bi-chat-dots me-1"></i>
                  Subject *
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="subject"
                  v-model="emailForm.subject"
                  :class="{ 'is-invalid': errors.subject }"
                  required
                  placeholder="Enter email subject"
                />
                <div class="invalid-feedback" v-if="errors.subject">
                  {{ errors.subject }}
                </div>
              </div>

              <!-- Email Content -->
              <div class="mb-3">
                <label for="message" class="form-label">
                  <i class="bi bi-file-text me-1"></i>
                  Message *
                </label>
                <textarea
                  class="form-control"
                  id="message"
                  rows="4"
                  v-model="emailForm.message"
                  :class="{ 'is-invalid': errors.message }"
                  required
                  placeholder="Enter your message..."
                ></textarea>
                <div class="invalid-feedback" v-if="errors.message">
                  {{ errors.message }}
                </div>
              </div>

              <!-- 附件上传 -->
              <div class="mb-3">
                <label for="attachment" class="form-label">
                  <i class="bi bi-paperclip me-1"></i>
                  Attachment (Optional)
                </label>
                <input
                  type="file"
                  class="form-control"
                  id="attachment"
                  @change="handleFileUpload"
                  accept=".jpg,.jpeg,.png,.pdf,.txt,.doc,.docx"
                />
                <div class="form-text">
                  Supported file types: JPG, PNG, PDF, TXT, DOC, DOCX (Max 10MB)
                </div>
                <div class="invalid-feedback" v-if="errors.attachment">
                  {{ errors.attachment }}
                </div>
              </div>

              <!-- 附件预览 -->
              <div v-if="selectedFile" class="mb-3">
                <div class="alert alert-info">
                  <i class="bi bi-file-earmark-check me-2"></i>
                  Selected file: {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
                  <button type="button" class="btn-close float-end" @click="removeFile"></button>
                </div>
              </div>

              <!-- 发送按钮 -->
              <div class="d-grid">
                <button
                  type="submit"
                  class="btn btn-primary btn-lg"
                  :disabled="isLoading || !isFormValid || !connectionStatus.isConnected"
                >
                  <span
                    v-if="isLoading"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  <i v-else class="bi bi-send-fill me-2"></i>
                  {{
                    isLoading
                      ? 'Sending...'
                      : emailMode === 'bulk'
                        ? `Send to ${selectedUsers.length} Recipients`
                        : 'Send Email'
                  }}
                </button>

                <!-- 连接状态提示 -->
                <div
                  v-if="!connectionStatus.isConnected && !connectionStatus.isChecking"
                  class="alert alert-warning mt-2 mb-0"
                >
                  <i class="bi bi-exclamation-triangle me-2"></i>
                  Email service not connected, please check Google Apps Script configuration and reconnect
                </div>
              </div>
            </form>

            <!-- 结果提示 -->
            <div v-if="result.message" class="mt-3">
              <div
                class="alert"
                :class="result.success ? 'alert-success' : 'alert-danger'"
                role="alert"
              >
                <i
                  :class="
                    result.success ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-triangle-fill'
                  "
                  class="me-2"
                ></i>
                {{ result.message }}
              </div>
            </div>
          </div>
        </div>

        <!-- 连接状态 -->
        <div class="card mt-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-cloud me-2"></i>
              Service Status
            </h5>
          </div>
          <div class="card-body">
            <div v-if="connectionStatus.isChecking" class="d-flex align-items-center">
              <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
              <span>{{ connectionStatus.message }}</span>
            </div>
            <div v-else class="d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center">
                <i
                  :class="
                    connectionStatus.isConnected
                      ? 'bi bi-check-circle-fill text-success'
                      : 'bi bi-exclamation-triangle-fill text-warning'
                  "
                  class="me-2"
                ></i>
                <span>{{ connectionStatus.message }}</span>
              </div>
              <button
                @click="checkConnection"
                class="btn btn-outline-primary btn-sm"
                :disabled="connectionStatus.isChecking"
              >
                <i class="bi bi-arrow-clockwise me-1"></i>
                Recheck
              </button>
            </div>
          </div>
        </div>

        <!-- 使用说明 -->
        <div class="card mt-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-info-circle me-2"></i>
              Instructions
            </h5>
          </div>
          <div class="card-body">
            <ul class="list-unstyled">
              <li>
                <i class="bi bi-check text-success me-2"></i>Fill in complete recipient email,
                subject, and message
              </li>
              <li>
                <i class="bi bi-check text-success me-2"></i>Attachment is optional, supports common
                file formats
              </li>
              <li><i class="bi bi-check text-success me-2"></i>Single attachment maximum 10MB</li>
              <li>
                <i class="bi bi-check text-success me-2"></i>Please verify all information before
                sending
              </li>
              <li>
                <i class="bi bi-info text-info me-2"></i>Using Google Apps Script for email delivery
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import emailService from '@/services/emailService.js'

// 邮件模式
const emailMode = ref('single')

// 表单数据
const emailForm = reactive({
  to_email: '',
  subject: '',
  message: '',
  attachment: null,
})

// 错误信息
const errors = reactive({
  to_email: '',
  subject: '',
  message: '',
  attachment: '',
  recipients: '',
})

// 用户数据
const availableUsers = ref([
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
  { id: 3, name: 'Carol Davis', email: 'carol@example.com' },
  { id: 4, name: 'David Wilson', email: 'david@example.com' },
  { id: 5, name: 'Emma Brown', email: 'emma@example.com' },
  { id: 6, name: 'Frank Miller', email: 'frank@example.com' },
  { id: 7, name: 'Grace Lee', email: 'grace@example.com' },
  { id: 8, name: 'Henry Taylor', email: 'henry@example.com' },
])
const selectedUsers = ref([])

// 状态管理
const isLoading = ref(false)
const selectedFile = ref(null)
const result = reactive({
  success: false,
  message: '',
})
const connectionStatus = ref({
  isConnected: false,
  isChecking: true,
  message: '',
})

// 表单验证
const isFormValid = computed(() => {
  const baseValid = emailForm.subject && emailForm.message && !errors.subject && !errors.message

  if (emailMode.value === 'single') {
    return baseValid && emailForm.to_email && !errors.to_email
  } else {
    return baseValid && selectedUsers.value.length > 0 && !errors.recipients
  }
})

// 用户选择相关方法
const selectAllUsers = () => {
  selectedUsers.value = [...availableUsers.value]
}

const clearAllUsers = () => {
  selectedUsers.value = []
}

const removeUser = (userToRemove) => {
  selectedUsers.value = selectedUsers.value.filter((user) => user.id !== userToRemove.id)
}

// 文件上传处理
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // 验证文件大小
    if (!emailService.validateFileSize(file)) {
      errors.attachment = 'File size exceeds 10MB limit'
      selectedFile.value = null
      return
    }

    // 验证文件类型
    if (!emailService.validateFileType(file)) {
      errors.attachment = 'Unsupported file type'
      selectedFile.value = null
      return
    }

    errors.attachment = ''
    selectedFile.value = file
    emailForm.attachment = file
  }
}

// 移除文件
const removeFile = () => {
  selectedFile.value = null
  emailForm.attachment = null
  document.getElementById('attachment').value = ''
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 验证表单
const validateForm = () => {
  let isValid = true

  // 清除之前的错误
  Object.keys(errors).forEach((key) => (errors[key] = ''))
  result.message = ''

  // 验证收件人
  if (emailMode.value === 'single') {
    if (!emailForm.to_email) {
      errors.to_email = 'Please enter recipient email'
      isValid = false
    } else if (!emailService.validateEmail(emailForm.to_email)) {
      errors.to_email = 'Please enter a valid email address'
      isValid = false
    }
  } else {
    if (selectedUsers.value.length === 0) {
      errors.recipients = 'Please select at least one recipient'
      isValid = false
    }
  }

  // 验证主题
  if (!emailForm.subject.trim()) {
    errors.subject = 'Please enter email subject'
    isValid = false
  }

  // 验证内容
  if (!emailForm.message.trim()) {
    errors.message = 'Please enter email message'
    isValid = false
  }

  return isValid
}

// 检查邮件服务连接
const checkConnection = async () => {
  connectionStatus.value.isChecking = true
  connectionStatus.value.message = 'Checking Google Apps Script connection...'

  try {
    const result = await emailService.validateConnection()
    connectionStatus.value.isConnected = result.valid
    connectionStatus.value.message = result.valid
      ? 'Google Apps Script email service connection successful'
      : result.message
  } catch (error) {
    connectionStatus.value.isConnected = false
    connectionStatus.value.message = 'Connection check failed: ' + error.message
  } finally {
    connectionStatus.value.isChecking = false
  }
}

// 发送邮件
const sendEmail = async () => {
  if (!validateForm()) return

  // 检查连接状态
  if (!connectionStatus.value.isConnected) {
    result.success = false
    result.message = 'Email service not connected, please check Google Apps Script configuration'
    return
  }

  isLoading.value = true
  result.message = ''

  try {
    let response

    if (emailMode.value === 'single') {
      // 单个邮件发送
      response = await emailService.sendEmailWithAttachment({
        ...emailForm,
        attachment: selectedFile.value,
      })
    } else {
      // 批量邮件发送
      const bulkEmailData = {
        recipients: selectedUsers.value.map((user) => user.email),
        subject: emailForm.subject,
        message: emailForm.message,
        attachment: selectedFile.value,
      }

      response = await emailService.sendBulkEmail(bulkEmailData)
    }

    result.success = response.success
    result.message = response.message

    if (response.success) {
      // 清空表单
      emailForm.to_email = ''
      emailForm.subject = ''
      emailForm.message = ''
      selectedUsers.value = []
      removeFile()
    }
  } catch (error) {
    result.success = false
    result.message = 'Failed to send: ' + error.message
  } finally {
    isLoading.value = false
  }
}

// 组件挂载时检查连接
onMounted(() => {
  checkConnection()
})
</script>

<style scoped>
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  transform: translateY(-1px);
}

.card {
  border: none;
  border-radius: 15px;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.alert {
  border-radius: 10px;
}
</style>
