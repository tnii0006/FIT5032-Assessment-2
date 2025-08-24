/**
 * Cloudflare Workers 函数测试
 * 用于验证BR(E.1)要求的实现
 */

const BASE_URL = 'http://localhost:8787' // 本地开发服务器

// 测试用例
const tests = [
  {
    name: '健康检查',
    method: 'GET',
    endpoint: '/api/health',
    expectedStatus: 200,
  },
  {
    name: '获取用户列表',
    method: 'GET',
    endpoint: '/api/users',
    expectedStatus: 200,
  },
  {
    name: '注册新用户',
    method: 'POST',
    endpoint: '/api/users',
    body: {
      name: 'Test User',
      email: 'test@example.com',
      age: 70,
    },
    expectedStatus: 201,
  },
  {
    name: '数据验证',
    method: 'POST',
    endpoint: '/api/users/validate',
    body: {
      name: 'Valid User',
      email: 'valid@example.com',
      age: 65,
    },
    expectedStatus: 200,
  },
  {
    name: '获取技能列表',
    method: 'GET',
    endpoint: '/api/skills',
    expectedStatus: 200,
  },
  {
    name: '添加技能',
    method: 'POST',
    endpoint: '/api/skills',
    body: {
      userId: 1,
      name: 'Test Skill',
      category: 'Testing',
      level: 'Beginner',
    },
    expectedStatus: 201,
  },
  {
    name: '获取技能统计',
    method: 'GET',
    endpoint: '/api/skills/stats',
    expectedStatus: 200,
  },
  {
    name: '处理邮件数据',
    method: 'POST',
    endpoint: '/api/email/process',
    body: {
      recipient: 'test@example.com',
      subject: 'Test Email',
      content: 'This is a test email content',
    },
    expectedStatus: 200,
  },
  {
    name: '生成报告',
    method: 'POST',
    endpoint: '/api/reports/generate',
    body: {
      type: 'user_summary',
    },
    expectedStatus: 200,
  },
  {
    name: '数据备份',
    method: 'POST',
    endpoint: '/api/data/backup',
    expectedStatus: 200,
  },
  {
    name: '技能分析',
    method: 'POST',
    endpoint: '/api/skills/analyze',
    body: {
      userId: 1,
    },
    expectedStatus: 200,
  },
  {
    name: '发送通知',
    method: 'POST',
    endpoint: '/api/notifications/send',
    body: {
      recipients: ['test1@example.com', 'test2@example.com'],
      message: 'Test notification',
      type: 'info',
    },
    expectedStatus: 200,
  },
]

// 执行测试
async function runTests() {
  console.log('🚀 开始测试 Cloudflare Workers 函数...')
  console.log('='.repeat(50))

  let passed = 0
  let failed = 0

  for (const test of tests) {
    try {
      console.log(`\n📋 测试: ${test.name}`)

      const options = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      if (test.body) {
        options.body = JSON.stringify(test.body)
      }

      const response = await fetch(`${BASE_URL}${test.endpoint}`, options)
      const data = await response.json()

      if (response.status === test.expectedStatus) {
        console.log(`✅ 通过 - 状态码: ${response.status}`)
        console.log(`   响应: ${JSON.stringify(data, null, 2).substring(0, 200)}...`)
        passed++
      } else {
        console.log(`❌ 失败 - 期望状态码: ${test.expectedStatus}, 实际: ${response.status}`)
        console.log(`   响应: ${JSON.stringify(data, null, 2)}`)
        failed++
      }
    } catch (error) {
      console.log(`❌ 错误 - ${error.message}`)
      failed++
    }

    // 避免请求过快
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  console.log('\n' + '='.repeat(50))
  console.log(`📊 测试结果: ${passed} 通过, ${failed} 失败`)
  console.log(`✨ 总共测试了 ${tests.length} 个函数`)

  if (failed === 0) {
    console.log('🎉 所有测试通过！BR(E.1) 要求已满足。')
  } else {
    console.log('⚠️  部分测试失败，请检查函数实现。')
  }
}

// 如果直接运行此文件
if (require.main === module) {
  runTests().catch(console.error)
}

module.exports = { runTests, tests }
