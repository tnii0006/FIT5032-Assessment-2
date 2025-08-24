<template>
  <div class="serverless-functions">
    <div class="container mx-auto px-4 py-8">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <div class="hero-icon">
            <i class="fas fa-cloud"></i>
          </div>
          <h1 class="hero-title">Serverless Functions</h1>
          <p class="hero-subtitle">Cloud-Native Functions powered by Cloudflare Workers</p>
        </div>
      </div>

      <!-- API Status Section -->
      <div class="api-status-section">
        <div class="status-card">
          <div class="status-header">
            <i class="fas fa-server"></i>
            <span>API Endpoint Status</span>
          </div>
          <div class="status-body">
            <div class="endpoint-info">
              <span class="endpoint-label">Base URL:</span>
              <code class="endpoint-url">{{ apiBaseUrl }}</code>
              <div class="status-indicator" :class="{ online: isOnline, offline: !isOnline }">
                <span class="status-dot"></span>
                {{ isOnline ? 'Online' : 'Checking...' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Core Functions Grid -->
      <div class="functions-grid">
        <!-- Health Check -->
        <div class="function-card health-card">
          <div class="card-header">
            <div class="card-icon health-icon">
              <i class="fas fa-heartbeat"></i>
            </div>
            <div class="card-title-section">
              <h3 class="card-title">Health Check</h3>
              <p class="card-description">Monitor API service status and response time</p>
            </div>
          </div>
          <div class="card-body">
            <button
              @click="testHealthCheck"
              class="function-btn health-btn"
              :disabled="loading.health"
            >
              <i class="fas fa-play" v-if="!loading.health"></i>
              <i class="fas fa-spinner fa-spin" v-else></i>
              <span>{{ loading.health ? 'Checking...' : 'Run Health Check' }}</span>
            </button>
            <div v-if="results.health" class="result-container">
              <div class="result-header">
                <i class="fas fa-check-circle"></i>
                <span>Response</span>
              </div>
              <pre class="result-content">{{ JSON.stringify(results.health, null, 2) }}</pre>
            </div>
          </div>
        </div>

        <!-- User Management -->
        <div class="function-card user-card">
          <div class="card-header">
            <div class="card-icon user-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="card-title-section">
              <h3 class="card-title">User Management</h3>
              <p class="card-description">Create and manage user accounts</p>
            </div>
          </div>
          <div class="card-body">
            <div class="btn-group">
              <button @click="testGetUsers" class="function-btn user-btn" :disabled="loading.users">
                <i class="fas fa-list" v-if="!loading.users"></i>
                <i class="fas fa-spinner fa-spin" v-else></i>
                <span>{{ loading.users ? 'Loading...' : 'Get Users' }}</span>
              </button>
              <button
                @click="testRegisterUser"
                class="function-btn user-btn-alt"
                :disabled="loading.register"
              >
                <i class="fas fa-user-plus" v-if="!loading.register"></i>
                <i class="fas fa-spinner fa-spin" v-else></i>
                <span>{{ loading.register ? 'Creating...' : 'Register User' }}</span>
              </button>
            </div>
            <div v-if="results.users || results.register" class="result-container">
              <div class="result-header">
                <i class="fas fa-user-check"></i>
                <span>User Data</span>
              </div>
              <pre class="result-content scrollable">{{
                JSON.stringify(results.users || results.register, null, 2)
              }}</pre>
            </div>
          </div>
        </div>

        <!-- Data Validation -->
        <div class="function-card validation-card">
          <div class="card-header">
            <div class="card-icon validation-icon">
              <i class="fas fa-shield-check"></i>
            </div>
            <div class="card-title-section">
              <h3 class="card-title">Data Validation</h3>
              <p class="card-description">Validate input data format and integrity</p>
            </div>
          </div>
          <div class="card-body">
            <button
              @click="testValidateData"
              class="function-btn validation-btn"
              :disabled="loading.validate"
            >
              <i class="fas fa-shield-alt" v-if="!loading.validate"></i>
              <i class="fas fa-spinner fa-spin" v-else></i>
              <span>{{ loading.validate ? 'Validating...' : 'Validate Data' }}</span>
            </button>
            <div v-if="results.validate" class="result-container">
              <div class="result-header">
                <i class="fas fa-check-double"></i>
                <span>Validation Result</span>
              </div>
              <pre class="result-content">{{ JSON.stringify(results.validate, null, 2) }}</pre>
            </div>
          </div>
        </div>

        <!-- Skills Management -->
        <div class="function-card skills-card">
          <div class="card-header">
            <div class="card-icon skills-icon">
              <i class="fas fa-cogs"></i>
            </div>
            <div class="card-title-section">
              <h3 class="card-title">Skills Management</h3>
              <p class="card-description">Manage and analyze user skills</p>
            </div>
          </div>
          <div class="card-body">
            <div class="btn-group">
              <button
                @click="testGetSkills"
                class="function-btn skills-btn"
                :disabled="loading.skills"
              >
                <i class="fas fa-list-ul" v-if="!loading.skills"></i>
                <i class="fas fa-spinner fa-spin" v-else></i>
                <span>{{ loading.skills ? 'Loading...' : 'Get Skills' }}</span>
              </button>
              <button
                @click="testSkillStats"
                class="function-btn skills-btn-alt"
                :disabled="loading.skillStats"
              >
                <i class="fas fa-chart-bar" v-if="!loading.skillStats"></i>
                <i class="fas fa-spinner fa-spin" v-else></i>
                <span>{{ loading.skillStats ? 'Analyzing...' : 'Skills Stats' }}</span>
              </button>
            </div>
            <div v-if="results.skills || results.skillStats" class="result-container">
              <div class="result-header">
                <i class="fas fa-tools"></i>
                <span>Skills Data</span>
              </div>
              <pre class="result-content scrollable">{{
                JSON.stringify(results.skills || results.skillStats, null, 2)
              }}</pre>
            </div>
          </div>
        </div>

        <!-- Email Processing -->
        <div class="function-card email-card">
          <div class="card-header">
            <div class="card-icon email-icon">
              <i class="fas fa-envelope"></i>
            </div>
            <div class="card-title-section">
              <h3 class="card-title">Email Processing</h3>
              <p class="card-description">Process and handle email communications</p>
            </div>
          </div>
          <div class="card-body">
            <button
              @click="testEmailProcess"
              class="function-btn email-btn"
              :disabled="loading.email"
            >
              <i class="fas fa-paper-plane" v-if="!loading.email"></i>
              <i class="fas fa-spinner fa-spin" v-else></i>
              <span>{{ loading.email ? 'Processing...' : 'Process Email' }}</span>
            </button>
            <div v-if="results.email" class="result-container">
              <div class="result-header">
                <i class="fas fa-mail-bulk"></i>
                <span>Email Result</span>
              </div>
              <pre class="result-content">{{ JSON.stringify(results.email, null, 2) }}</pre>
            </div>
          </div>
        </div>

        <!-- Report Generation -->
        <div class="function-card report-card">
          <div class="card-header">
            <div class="card-icon report-icon">
              <i class="fas fa-file-alt"></i>
            </div>
            <div class="card-title-section">
              <h3 class="card-title">Report Generation</h3>
              <p class="card-description">Generate comprehensive user reports</p>
            </div>
          </div>
          <div class="card-body">
            <button
              @click="testGenerateReport"
              class="function-btn report-btn"
              :disabled="loading.report"
            >
              <i class="fas fa-file-export" v-if="!loading.report"></i>
              <i class="fas fa-spinner fa-spin" v-else></i>
              <span>{{ loading.report ? 'Generating...' : 'Generate Report' }}</span>
            </button>
            <div v-if="results.report" class="result-container">
              <div class="result-header">
                <i class="fas fa-chart-line"></i>
                <span>Report Data</span>
              </div>
              <pre class="result-content scrollable">{{
                JSON.stringify(results.report, null, 2)
              }}</pre>
            </div>
          </div>
        </div>

        <!-- Data Backup -->
        <div class="function-card backup-card">
          <div class="card-header">
            <div class="card-icon backup-icon">
              <i class="fas fa-database"></i>
            </div>
            <div class="card-title-section">
              <h3 class="card-title">Data Backup</h3>
              <p class="card-description">Secure data backup and recovery operations</p>
            </div>
          </div>
          <div class="card-body">
            <button
              @click="testDataBackup"
              class="function-btn backup-btn"
              :disabled="loading.backup"
            >
              <i class="fas fa-cloud-upload-alt" v-if="!loading.backup"></i>
              <i class="fas fa-spinner fa-spin" v-else></i>
              <span>{{ loading.backup ? 'Backing up...' : 'Start Backup' }}</span>
            </button>
            <div v-if="results.backup" class="result-container">
              <div class="result-header">
                <i class="fas fa-hdd"></i>
                <span>Backup Status</span>
              </div>
              <pre class="result-content">{{ JSON.stringify(results.backup, null, 2) }}</pre>
            </div>
          </div>
        </div>

        <!-- Skills Analysis -->
        <div class="function-card analysis-card">
          <div class="card-header">
            <div class="card-icon analysis-icon">
              <i class="fas fa-chart-pie"></i>
            </div>
            <div class="card-title-section">
              <h3 class="card-title">Skills Analysis</h3>
              <p class="card-description">Advanced analytics for user skills</p>
            </div>
          </div>
          <div class="card-body">
            <button
              @click="testSkillAnalysis"
              class="function-btn analysis-btn"
              :disabled="loading.analysis"
            >
              <i class="fas fa-analytics" v-if="!loading.analysis"></i>
              <i class="fas fa-spinner fa-spin" v-else></i>
              <span>{{ loading.analysis ? 'Analyzing...' : 'Analyze Skills' }}</span>
            </button>
            <div v-if="results.analysis" class="result-container">
              <div class="result-header">
                <i class="fas fa-brain"></i>
                <span>Analysis Result</span>
              </div>
              <pre class="result-content">{{ JSON.stringify(results.analysis, null, 2) }}</pre>
            </div>
          </div>
        </div>

        <!-- Notification Service -->
        <div class="function-card notification-card">
          <div class="card-header">
            <div class="card-icon notification-icon">
              <i class="fas fa-bell"></i>
            </div>
            <div class="card-title-section">
              <h3 class="card-title">Notification Service</h3>
              <p class="card-description">Send and manage system notifications</p>
            </div>
          </div>
          <div class="card-body">
            <button
              @click="testSendNotification"
              class="function-btn notification-btn"
              :disabled="loading.notification"
            >
              <i class="fas fa-paper-plane" v-if="!loading.notification"></i>
              <i class="fas fa-spinner fa-spin" v-else></i>
              <span>{{ loading.notification ? 'Sending...' : 'Send Notification' }}</span>
            </button>
            <div v-if="results.notification" class="result-container">
              <div class="result-header">
                <i class="fas fa-check-circle"></i>
                <span>Notification Sent</span>
              </div>
              <pre class="result-content">{{ JSON.stringify(results.notification, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Control Panel -->
      <div class="control-panel">
        <div class="control-header">
          <h2 class="control-title">
            <i class="fas fa-sliders-h"></i>
            Function Controls
          </h2>
          <p class="control-subtitle">Manage and test all serverless functions</p>
        </div>
        <div class="control-actions">
          <button @click="clearAllResults" class="control-btn clear-btn">
            <i class="fas fa-trash-alt"></i>
            <span>Clear All Results</span>
          </button>
          <button
            @click="testAllFunctions"
            class="control-btn test-all-btn"
            :disabled="isAnyLoading"
          >
            <i class="fas fa-play-circle" v-if="!isAnyLoading"></i>
            <i class="fas fa-spinner fa-spin" v-else></i>
            <span>{{ isAnyLoading ? 'Testing in Progress...' : 'Test All Functions' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServerlessFunctions',
  data() {
    return {
      apiBaseUrl: 'https://fit5032-cloud-functions.tnii0006.workers.dev',
      isOnline: false,
      loading: {
        health: false,
        users: false,
        register: false,
        validate: false,
        skills: false,
        skillStats: false,
        email: false,
        report: false,
        backup: false,
        analysis: false,
        notification: false,
      },
      results: {},
    }
  },
  computed: {
    isAnyLoading() {
      return Object.values(this.loading).some((loading) => loading)
    },
  },
  mounted() {
    this.checkApiStatus()
  },
  methods: {
    async checkApiStatus() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/api/health`)
        this.isOnline = response.ok
      } catch (error) {
        this.isOnline = false
      }
    },

    async makeApiCall(endpoint, options = {}) {
      try {
        const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
          method: options.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          body: options.body ? JSON.stringify(options.body) : undefined,
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        return await response.json()
      } catch (error) {
        return {
          error: true,
          message: error.message,
          timestamp: new Date().toISOString(),
        }
      }
    },

    async testHealthCheck() {
      this.loading.health = true
      this.results.health = await this.makeApiCall('/api/health')
      this.loading.health = false
    },

    async testGetUsers() {
      this.loading.users = true
      this.results.users = await this.makeApiCall('/api/users')
      this.loading.users = false
    },

    async testRegisterUser() {
      this.loading.register = true
      const userData = {
        name: 'John Smith',
        email: 'john.smith@example.com',
        age: 72,
        skills: ['Computer Basics', 'Internet Safety'],
      }
      this.results.register = await this.makeApiCall('/api/users/register', {
        method: 'POST',
        body: userData,
      })
      this.loading.register = false
    },

    async testValidateData() {
      this.loading.validate = true
      const testData = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        age: 68,
        phone: '+1-555-0123',
      }
      this.results.validate = await this.makeApiCall('/api/validate', {
        method: 'POST',
        body: testData,
      })
      this.loading.validate = false
    },

    async testGetSkills() {
      this.loading.skills = true
      this.results.skills = await this.makeApiCall('/api/skills')
      this.loading.skills = false
    },

    async testSkillStats() {
      this.loading.skillStats = true
      this.results.skillStats = await this.makeApiCall('/api/skills/stats')
      this.loading.skillStats = false
    },

    async testEmailProcess() {
      this.loading.email = true
      const emailData = {
        recipient: 'elderly@example.com',
        subject: 'Digital Skills Workshop Reminder',
        content: 'This is a reminder about your upcoming digital skills workshop.',
      }
      this.results.email = await this.makeApiCall('/api/email/process', {
        method: 'POST',
        body: emailData,
      })
      this.loading.email = false
    },

    async testGenerateReport() {
      this.loading.report = true
      this.results.report = await this.makeApiCall('/api/reports/generate?type=user_summary')
      this.loading.report = false
    },

    async testDataBackup() {
      this.loading.backup = true
      this.results.backup = await this.makeApiCall('/api/backup', {
        method: 'POST',
      })
      this.loading.backup = false
    },

    async testSkillAnalysis() {
      this.loading.analysis = true
      this.results.analysis = await this.makeApiCall('/api/skills/analyze', {
        method: 'POST',
        body: { userId: 1 },
      })
      this.loading.analysis = false
    },

    async testSendNotification() {
      this.loading.notification = true
      const notificationData = {
        recipients: ['user1@example.com', 'user2@example.com'],
        message: 'New digital skills resources are now available!',
        type: 'info',
      }
      this.results.notification = await this.makeApiCall('/api/notifications/send', {
        method: 'POST',
        body: notificationData,
      })
      this.loading.notification = false
    },

    async testAllFunctions() {
      const functions = [
        this.testHealthCheck,
        this.testGetUsers,
        this.testRegisterUser,
        this.testValidateData,
        this.testGetSkills,
        this.testSkillStats,
        this.testEmailProcess,
        this.testGenerateReport,
        this.testDataBackup,
        this.testSkillAnalysis,
        this.testSendNotification,
      ]

      for (const func of functions) {
        await func()
        // Small delay between calls
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    },

    clearAllResults() {
      this.results = {}
    },
  },
}
</script>

<style scoped>
/* Global Styles */
.serverless-functions {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}

.container {
  max-width: 1400px;
}

/* Hero Section */
.hero-section {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
}

.hero-content {
  position: relative;
}

.hero-icon {
  font-size: 4rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  font-weight: 300;
}

.hero-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  padding: 0.5rem 1.5rem;
}

.badge-text {
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

/* API Status Section */
.api-status-section {
  margin-bottom: 3rem;
}

.status-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.status-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.endpoint-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.endpoint-label {
  font-weight: 500;
  color: #6b7280;
}

.endpoint-url {
  background: #f3f4f6;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9rem;
  color: #1f2937;
  border: 1px solid #e5e7eb;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-indicator.online .status-dot {
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
}

.status-indicator.offline .status-dot {
  background: #f59e0b;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.3);
}

.status-indicator.online {
  color: #10b981;
}

.status-indicator.offline {
  color: #f59e0b;
}

/* Functions Grid */
.functions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

/* Function Cards */
.function-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.function-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--card-color), var(--card-color-light));
}

.function-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

/* Card Color Themes */
.health-card {
  --card-color: #10b981;
  --card-color-light: #34d399;
}

.user-card {
  --card-color: #3b82f6;
  --card-color-light: #60a5fa;
}

.validation-card {
  --card-color: #8b5cf6;
  --card-color-light: #a78bfa;
}

.skills-card {
  --card-color: #f59e0b;
  --card-color-light: #fbbf24;
}

.email-card {
  --card-color: #ef4444;
  --card-color-light: #f87171;
}

.report-card {
  --card-color: #06b6d4;
  --card-color-light: #22d3ee;
}

.backup-card {
  --card-color: #6b7280;
  --card-color-light: #9ca3af;
}

.analysis-card {
  --card-color: #ec4899;
  --card-color-light: #f472b6;
}

.notification-card {
  --card-color: #84cc16;
  --card-color-light: #a3e635;
}

/* Card Header */
.card-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  background: linear-gradient(135deg, var(--card-color), var(--card-color-light));
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.card-title-section {
  flex: 1;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.card-description {
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Card Body */
.card-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Button Groups */
.btn-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Function Buttons */
.function-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
  flex: 1;
  min-width: 140px;
}

.function-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.function-btn i {
  font-size: 1rem;
}

/* Button Color Themes */
.health-btn {
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.health-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.user-btn {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  color: white;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.user-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.user-btn-alt {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: 2px solid #3b82f6;
}

.user-btn-alt:hover:not(:disabled) {
  background: #3b82f6;
  color: white;
}

.validation-btn {
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
  color: white;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

.validation-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

.skills-btn {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: white;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

.skills-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
}

.skills-btn-alt {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border: 2px solid #f59e0b;
}

.skills-btn-alt:hover:not(:disabled) {
  background: #f59e0b;
  color: white;
}

.email-btn {
  background: linear-gradient(135deg, #ef4444, #f87171);
  color: white;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
}

.email-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.report-btn {
  background: linear-gradient(135deg, #06b6d4, #22d3ee);
  color: white;
  box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
}

.report-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(6, 182, 212, 0.4);
}

.backup-btn {
  background: linear-gradient(135deg, #6b7280, #9ca3af);
  color: white;
  box-shadow: 0 4px 15px rgba(107, 114, 128, 0.3);
}

.backup-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(107, 114, 128, 0.4);
}

.analysis-btn {
  background: linear-gradient(135deg, #ec4899, #f472b6);
  color: white;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}

.analysis-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
}

.notification-btn {
  background: linear-gradient(135deg, #84cc16, #a3e635);
  color: white;
  box-shadow: 0 4px 15px rgba(132, 204, 22, 0.3);
}

.notification-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(132, 204, 22, 0.4);
}

/* Result Container */
.result-container {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 1rem;
}

.result-header {
  background: #f1f5f9;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #475569;
  font-size: 0.9rem;
}

.result-content {
  padding: 1rem;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.8rem;
  line-height: 1.5;
  color: #374151;
  background: white;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 300px;
  overflow-y: auto;
}

.result-content.scrollable {
  max-height: 200px;
}

/* Control Panel */
.control-panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
}

.control-header {
  margin-bottom: 2rem;
}

.control-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.control-subtitle {
  color: #6b7280;
  font-size: 1rem;
}

.control-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 180px;
  justify-content: center;
}

.control-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.clear-btn {
  background: linear-gradient(135deg, #6b7280, #9ca3af);
  color: white;
  box-shadow: 0 4px 15px rgba(107, 114, 128, 0.3);
}

.clear-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(107, 114, 128, 0.4);
}

.test-all-btn {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  color: white;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.test-all-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .functions-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .function-card {
    padding: 1.5rem;
  }

  .btn-group {
    flex-direction: column;
  }

  .function-btn {
    min-width: auto;
  }

  .control-actions {
    flex-direction: column;
    align-items: center;
  }

  .control-btn {
    min-width: 200px;
  }

  .endpoint-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .function-card {
    padding: 1rem;
  }

  .card-header {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .card-icon {
    align-self: center;
  }
}

/* Scrollbar Styling */
.result-content::-webkit-scrollbar {
  width: 6px;
}

.result-content::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.result-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.result-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
