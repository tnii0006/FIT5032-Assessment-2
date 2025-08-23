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
          </div>
          <div class="card-body">
            <form @submit.prevent="sendEmail" class="needs-validation" novalidate>
              <!-- 收件人邮箱 -->
              <div class="mb-3">
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
                  :disabled="isLoading || !isFormValid"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i v-else class="bi bi-send-fill me-2"></i>
                  {{ isLoading ? 'Sending...' : 'Send Email' }}
                </button>
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
                  :class="result.success ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-triangle-fill'"
                  class="me-2"
                ></i>
                {{ result.message }}
              </div>
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
              <li><i class="bi bi-check text-success me-2"></i>Fill in complete recipient email, subject, and message</li>
              <li><i class="bi bi-check text-success me-2"></i>Attachment is optional, supports common file formats</li>
              <li><i class="bi bi-check text-success me-2"></i>Single attachment maximum 10MB</li>
              <li><i class="bi bi-check text-success me-2"></i>Please verify all information before sending</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import emailService from '@/services/emailService.js'

// 表单数据
const emailForm = reactive({
  to_email: '',
  subject: '',
  message: '',
  attachment: null
})

// 错误信息
const errors = reactive({
  to_email: '',
  subject: '',
  message: '',
  attachment: ''
})

// 状态管理
const isLoading = ref(false)
const selectedFile = ref(null)
const result = reactive({
  success: false,
  message: ''
})

// 表单验证
const isFormValid = computed(() => {
  return emailForm.to_email && 
         emailForm.subject && 
         emailForm.message &&
         !errors.to_email && 
         !errors.subject && 
         !errors.message
})

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
  Object.keys(errors).forEach(key => errors[key] = '')
  result.message = ''

  // 验证邮箱
  if (!emailForm.to_email) {
    errors.to_email = 'Please enter recipient email'
    isValid = false
  } else if (!emailService.validateEmail(emailForm.to_email)) {
    errors.to_email = 'Please enter a valid email address'
    isValid = false
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

// 发送邮件
const sendEmail = async () => {
  if (!validateForm()) return

  isLoading.value = true
  result.message = ''

  try {
    const response = await emailService.sendEmailWithAttachment({
      ...emailForm,
      attachment: selectedFile.value
    })

    result.success = response.success
    result.message = response.message

    if (response.success) {
      // 清空表单
      emailForm.to_email = ''
      emailForm.subject = ''
      emailForm.message = ''
      removeFile()
    }
  } catch (error) {
    result.success = false
    result.message = 'Failed to send: ' + error.message
  } finally {
    isLoading.value = false
  }
}
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