/**
 * Cloudflare Workers - BR(E.1) Cloud Functions Implementation
 * 自定义serverless函数，不同于云数据库和云API
 */

// CORS 头部配置
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// 模拟数据存储（实际应用中应使用KV存储或数据库）
let users = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    age: 65,
    skills: ['Email', 'Internet'],
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    age: 72,
    skills: ['Video Calls', 'Social Media'],
  },
  {
    id: 3,
    name: 'Carol Davis',
    email: 'carol@example.com',
    age: 68,
    skills: ['Online Shopping', 'Banking'],
  },
]

let skills = [
  {
    id: 1,
    userId: 1,
    name: 'Email',
    category: 'Communication',
    level: 'Advanced',
    dateAdded: '2024-01-15',
  },
  {
    id: 2,
    userId: 1,
    name: 'Internet Browsing',
    category: 'General',
    level: 'Intermediate',
    dateAdded: '2024-01-16',
  },
  {
    id: 3,
    userId: 2,
    name: 'Video Calls',
    category: 'Communication',
    level: 'Beginner',
    dateAdded: '2024-01-17',
  },
]

// 主要的请求处理函数
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const path = url.pathname
    const method = request.method

    // 处理 CORS 预检请求
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      })
    }

    try {
      // 路由处理
      if (path === '/api/users' && method === 'GET') {
        return handleGetUsers()
      } else if (path === '/api/users' && method === 'POST') {
        return handleRegisterUser(request)
      } else if (path === '/api/users/validate' && method === 'POST') {
        return handleValidateData(request)
      } else if (path === '/api/validate' && method === 'POST') {
        return handleValidateData(request)
      } else if (path === '/api/skills' && method === 'GET') {
        return handleGetSkills(url)
      } else if (path === '/api/skills' && method === 'POST') {
        return handleAddSkill(request)
      } else if (path.startsWith('/api/skills/') && method === 'PUT') {
        return handleUpdateSkill(request, path)
      } else if (path.startsWith('/api/skills/') && method === 'DELETE') {
        return handleDeleteSkill(path)
      } else if (path === '/api/skills/stats' && method === 'GET') {
        return handleGetSkillStats()
      } else if (path === '/api/email/process' && method === 'POST') {
        return handleProcessEmailData(request)
      } else if (path === '/api/reports/generate' && (method === 'POST' || method === 'GET')) {
        return handleGenerateReport(request)
      } else if (path === '/api/data/backup' && method === 'POST') {
        return handleBackupData()
      } else if (path === '/api/backup' && method === 'POST') {
        return handleBackupData()
      } else if (path === '/api/skills/analyze' && method === 'POST') {
        return handleAnalyzeSkills(request)
      } else if (path === '/api/analyze' && method === 'POST') {
        return handleAnalyzeSkills(request)
      } else if (path === '/api/notifications/send' && method === 'POST') {
        return handleSendNotification(request)
      } else if (path === '/api/health' && method === 'GET') {
        return handleHealthCheck()
      } else {
        return new Response('Not Found', {
          status: 404,
          headers: corsHeaders,
        })
      }
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: 'Internal Server Error',
          message: error.message,
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        },
      )
    }
  },
}

// 1. 获取用户列表
async function handleGetUsers() {
  return new Response(
    JSON.stringify({
      success: true,
      data: users,
      count: users.length,
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    },
  )
}

// 2. 用户注册
async function handleRegisterUser(request) {
  const userData = await request.json()

  // 数据验证
  if (!userData.name || !userData.email) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Name and email are required',
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    )
  }

  // 检查邮箱是否已存在
  const existingUser = users.find((user) => user.email === userData.email)
  if (existingUser) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Email already exists',
      }),
      {
        status: 409,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    )
  }

  const newUser = {
    id: users.length + 1,
    name: userData.name,
    email: userData.email,
    age: userData.age || null,
    skills: userData.skills || [],
    registeredAt: new Date().toISOString(),
  }

  users.push(newUser)

  return new Response(
    JSON.stringify({
      success: true,
      data: newUser,
      message: 'User registered successfully',
    }),
    {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    },
  )
}

// 3. 数据验证
async function handleValidateData(request) {
  const data = await request.json()
  const errors = []

  // 验证规则
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format')
  }

  if (data.age && (data.age < 0 || data.age > 120)) {
    errors.push('Age must be between 0 and 120')
  }

  if (data.name && data.name.length < 2) {
    errors.push('Name must be at least 2 characters long')
  }

  return new Response(
    JSON.stringify({
      success: errors.length === 0,
      valid: errors.length === 0,
      errors: errors,
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    },
  )
}

// 4. 获取技能列表
async function handleGetSkills(url) {
  const userId = url.searchParams.get('userId')
  let filteredSkills = skills

  if (userId) {
    filteredSkills = skills.filter((skill) => skill.userId == userId)
  }

  return new Response(
    JSON.stringify({
      success: true,
      data: filteredSkills,
      count: filteredSkills.length,
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    },
  )
}

// 5. 添加技能
async function handleAddSkill(request) {
  const skillData = await request.json()

  if (!skillData.name || !skillData.userId) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Skill name and userId are required',
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    )
  }

  const newSkill = {
    id: skills.length + 1,
    userId: skillData.userId,
    name: skillData.name,
    category: skillData.category || 'General',
    level: skillData.level || 'Beginner',
    dateAdded: new Date().toISOString().split('T')[0],
  }

  skills.push(newSkill)

  return new Response(
    JSON.stringify({
      success: true,
      data: newSkill,
      message: 'Skill added successfully',
    }),
    {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    },
  )
}

// 6. 更新技能
async function handleUpdateSkill(request, path) {
  const skillId = parseInt(path.split('/').pop())
  const updateData = await request.json()

  const skillIndex = skills.findIndex((skill) => skill.id === skillId)
  if (skillIndex === -1) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Skill not found',
      }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    )
  }

  skills[skillIndex] = { ...skills[skillIndex], ...updateData }

  return new Response(
    JSON.stringify({
      success: true,
      data: skills[skillIndex],
      message: 'Skill updated successfully',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    },
  )
}

// 7. 删除技能
async function handleDeleteSkill(path) {
  const skillId = parseInt(path.split('/').pop())

  const skillIndex = skills.findIndex((skill) => skill.id === skillId)
  if (skillIndex === -1) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Skill not found',
      }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    )
  }

  const deletedSkill = skills.splice(skillIndex, 1)[0]

  return new Response(
    JSON.stringify({
      success: true,
      data: deletedSkill,
      message: 'Skill deleted successfully',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    },
  )
}

// 8. 获取技能统计
async function handleGetSkillStats() {
  const stats = {
    totalSkills: skills.length,
    skillsByCategory: {},
    skillsByLevel: {},
    averageSkillsPerUser: 0,
    mostPopularSkills: [],
  }

  // 按类别统计
  skills.forEach((skill) => {
    stats.skillsByCategory[skill.category] = (stats.skillsByCategory[skill.category] || 0) + 1
    stats.skillsByLevel[skill.level] = (stats.skillsByLevel[skill.level] || 0) + 1
  })

  // 计算平均技能数
  if (users.length > 0) {
    stats.averageSkillsPerUser = (skills.length / users.length).toFixed(2)
  }

  // 最受欢迎的技能
  const skillCounts = {}
  skills.forEach((skill) => {
    skillCounts[skill.name] = (skillCounts[skill.name] || 0) + 1
  })

  stats.mostPopularSkills = Object.entries(skillCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }))

  return new Response(
    JSON.stringify({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    },
  )
}

// 9. 处理邮件数据
async function handleProcessEmailData(request) {
  const emailData = await request.json()

  // 模拟邮件数据处理
  const processedData = {
    id: Date.now(),
    recipient: emailData.recipient,
    subject: emailData.subject || 'Processed Email',
    content: emailData.content,
    processedAt: new Date().toISOString(),
    status: 'processed',
    wordCount: emailData.content ? emailData.content.split(' ').length : 0,
    hasAttachment: emailData.hasAttachment || false,
  }

  return new Response(
    JSON.stringify({
      success: true,
      data: processedData,
      message: 'Email data processed successfully',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    },
  )
}

// 10. 生成报告
async function handleGenerateReport(request) {
  let reportType = 'user_summary'

  if (request.method === 'GET') {
    const url = new URL(request.url)
    reportType = url.searchParams.get('type') || 'user_summary'
  } else {
    const reportRequest = await request.json()
    reportType = reportRequest.type || 'user_summary'
  }

  let reportData = {}

  switch (reportType) {
    case 'user_summary':
      reportData = {
        totalUsers: users.length,
        totalSkills: skills.length,
        userList: users.map((user) => ({
          name: user.name,
          email: user.email,
          skillCount: skills.filter((skill) => skill.userId === user.id).length,
        })),
        generatedAt: new Date().toISOString(),
      }
      break
    case 'skill_analysis':
      reportData = {
        skillDistribution: {},
        levelDistribution: {},
        generatedAt: new Date().toISOString(),
      }
      skills.forEach((skill) => {
        reportData.skillDistribution[skill.category] =
          (reportData.skillDistribution[skill.category] || 0) + 1
        reportData.levelDistribution[skill.level] =
          (reportData.levelDistribution[skill.level] || 0) + 1
      })
      break
    default:
      reportData = {
        message: 'Unknown report type',
        availableTypes: ['user_summary', 'skill_analysis'],
        generatedAt: new Date().toISOString(),
      }
  }

  return new Response(
    JSON.stringify({
      success: true,
      reportType: reportType,
      data: reportData,
      message: 'Report generated successfully',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    },
  )
}

// 11. 数据备份
async function handleBackupData() {
  const backupData = {
    users: users,
    skills: skills,
    backupId: `backup_${Date.now()}`,
    createdAt: new Date().toISOString(),
    version: '1.0',
    recordCount: {
      users: users.length,
      skills: skills.length,
    },
  }

  return new Response(
    JSON.stringify({
      success: true,
      data: backupData,
      message: 'Data backup created successfully',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    },
  )
}

// 12. 技能分析
async function handleAnalyzeSkills(request) {
  const analysisRequest = await request.json()
  const userId = analysisRequest.userId

  let userSkills = skills
  if (userId) {
    userSkills = skills.filter((skill) => skill.userId == userId)
  }

  const analysis = {
    totalSkills: userSkills.length,
    skillCategories: {},
    levelDistribution: {},
    recommendations: [],
    strengths: [],
    improvementAreas: [],
  }

  // 分析技能分布
  userSkills.forEach((skill) => {
    analysis.skillCategories[skill.category] = (analysis.skillCategories[skill.category] || 0) + 1
    analysis.levelDistribution[skill.level] = (analysis.levelDistribution[skill.level] || 0) + 1
  })

  // 生成建议
  if (analysis.levelDistribution['Advanced'] > 2) {
    analysis.strengths.push('Strong advanced skills foundation')
  }
  if (analysis.levelDistribution['Beginner'] > analysis.levelDistribution['Advanced']) {
    analysis.improvementAreas.push('Consider advancing beginner skills')
    analysis.recommendations.push('Focus on practicing beginner skills to reach intermediate level')
  }
  if (analysis.skillCategories['Communication'] < 2) {
    analysis.recommendations.push('Consider learning more communication skills')
  }

  return new Response(
    JSON.stringify({
      success: true,
      userId: userId,
      data: analysis,
      analyzedAt: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    },
  )
}

// 13. 发送通知
async function handleSendNotification(request) {
  const notificationData = await request.json()

  const notification = {
    id: `notif_${Date.now()}`,
    recipients: notificationData.recipients || [],
    message: notificationData.message,
    type: notificationData.type || 'info',
    sentAt: new Date().toISOString(),
    status: 'sent',
    deliveryCount: notificationData.recipients ? notificationData.recipients.length : 0,
  }

  return new Response(
    JSON.stringify({
      success: true,
      data: notification,
      message: 'Notification sent successfully',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    },
  )
}

// 健康检查
async function handleHealthCheck() {
  return new Response(
    JSON.stringify({
      status: 'healthy',
      service: 'FIT5032 Cloud Functions',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: 'Running',
      functions: {
        total: 13,
        available: [
          'getUsers',
          'registerUser',
          'validateData',
          'getSkills',
          'addSkill',
          'updateSkill',
          'deleteSkill',
          'getSkillStats',
          'processEmailData',
          'generateReport',
          'backupData',
          'analyzeSkills',
          'sendNotification',
        ],
      },
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    },
  )
}
