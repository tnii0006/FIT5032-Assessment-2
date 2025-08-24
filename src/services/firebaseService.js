/**
 * Firebase Cloud Functions API 服务
 * 提供与Firebase Cloud Functions交互的API接口
 */

// Firebase Cloud Functions API 服务
// 本地开发时使用模拟器，生产环境使用真实部署

// 根据环境选择API端点
const isDevelopment = process.env.NODE_ENV === 'development'
const FUNCTIONS_BASE_URL = isDevelopment
  ? 'http://localhost:5001/assignment3-4d2ad/us-central1'
  : 'https://us-central1-assignment3-4d2ad.cloudfunctions.net'

console.log('Firebase Functions URL:', FUNCTIONS_BASE_URL)

// 通用请求函数
async function makeRequest(endpoint, options = {}) {
  const url = `${FUNCTIONS_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API请求失败 (${endpoint}):`, error)
    throw error
  }
}

// 用户管理相关API
export async function getUsers() {
  return await makeRequest('/getUsers')
}

export async function registerUser(userData) {
  return await makeRequest('/registerUser', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

export async function validateData(data, type) {
  return await makeRequest('/validateData', {
    method: 'POST',
    body: JSON.stringify({ data, type }),
  })
}

// 技能管理相关API
export async function getUserSkills(userId) {
  return await makeRequest(`/getUserSkills?userId=${userId}`)
}

export async function addSkill(skillData) {
  return await makeRequest('/addSkill', {
    method: 'POST',
    body: JSON.stringify(skillData),
  })
}

export async function updateSkill(skillId, skillData) {
  return await makeRequest(`/updateSkill/${skillId}`, {
    method: 'PUT',
    body: JSON.stringify(skillData),
  })
}

export async function deleteSkill(skillId) {
  return await makeRequest(`/deleteSkill/${skillId}`, {
    method: 'DELETE',
  })
}

export async function getSkillStats(userId) {
  return await makeRequest(`/getSkillStats?userId=${userId}`)
}

// 数据处理相关API
export async function processEmailData(emailData) {
  return await makeRequest('/processEmailData', {
    method: 'POST',
    body: JSON.stringify({ emailData }),
  })
}

export async function generateReport(reportData) {
  return await makeRequest('/generateReport', {
    method: 'POST',
    body: JSON.stringify(reportData),
  })
}

export async function backupData(backupConfig) {
  return await makeRequest('/backupData', {
    method: 'POST',
    body: JSON.stringify(backupConfig),
  })
}

// 分析相关API
export async function analyzeSkills(userId) {
  return await makeRequest(`/analyzeSkills?userId=${userId}`)
}

export async function sendNotification(notificationData) {
  return await makeRequest('/sendNotification', {
    method: 'POST',
    body: JSON.stringify(notificationData),
  })
}

// 测试连接函数
export async function testConnection() {
  try {
    const result = await getUsers()
    console.log('Cloud Functions连接成功:', result)
    return { success: true, message: '连接成功' }
  } catch (error) {
    console.error('Cloud Functions连接失败:', error)
    return { success: false, message: error.message }
  }
}

/**
 * 批量操作工具函数
 */
export const skillApi = {
  /**
   * 获取当前用户ID（示例实现，实际应根据你的认证系统调整）
   */
  getCurrentUserId() {
    // 这里应该从你的认证系统获取当前用户ID
    // 示例：从localStorage或Vuex store获取
    return localStorage.getItem('userId') || 'default-user-id'
  },

  /**
   * 获取完整的用户技能数据
   */
  async loadUserSkills() {
    const userId = this.getCurrentUserId()
    const skillsResult = await getUserSkills(userId)
    const statsResult = await getSkillStats(userId)

    return {
      skills: skillsResult.data || [],
      stats: statsResult.data || {},
    }
  },

  /**
   * 创建新技能
   */
  async createSkill(skillData) {
    const userId = this.getCurrentUserId()
    const fullSkillData = {
      ...skillData,
      userId,
    }

    return await addSkill(fullSkillData)
  },

  /**
   * 批量更新技能
   */
  async batchUpdateSkills(skillsToUpdate) {
    const results = []

    for (const { skillId, data } of skillsToUpdate) {
      try {
        const result = await updateSkill(skillId, data)
        results.push({ skillId, success: true, result })
      } catch (error) {
        results.push({ skillId, success: false, error: error.message })
      }
    }

    return results
  },
}

/**
 * 错误处理工具函数
 */
export function handleApiError(error) {
  if (error.message.includes('NetworkError')) {
    return {
      type: 'network',
      message: '网络连接错误，请检查网络连接',
    }
  } else if (error.message.includes('HTTP error')) {
    return {
      type: 'server',
      message: '服务器错误，请稍后重试',
    }
  } else {
    return {
      type: 'unknown',
      message: '发生未知错误，请稍后重试',
    }
  }
}

/**
 * 本地模拟数据（用于开发测试）
 */
export const mockData = {
  skills: [
    {
      id: 'skill-1',
      skillName: 'JavaScript',
      category: 'Frontend Development',
      level: 'Advanced',
      experience: 5,
      certification: 'Certified',
      lastUpdated: '2024-12-15',
      importance: 9,
    },
    {
      id: 'skill-2',
      skillName: 'Python',
      category: 'Backend Development',
      level: 'Intermediate',
      experience: 3,
      certification: 'Certified',
      lastUpdated: '2024-12-10',
      importance: 8,
    },
  ],

  stats: {
    totalSkills: 2,
    categoryCount: {
      'Frontend Development': 1,
      'Backend Development': 1,
    },
    levelDistribution: {
      Advanced: 1,
      Intermediate: 1,
    },
    certificationStatus: {
      Certified: 2,
      'In Progress': 0,
      'Not Certified': 0,
    },
    averageExperience: 4,
    totalExperience: 8,
  },
}

// 导出默认配置
export default {
  FUNCTIONS_BASE_URL,
  skillApi,
  handleApiError,
  mockData,
}
