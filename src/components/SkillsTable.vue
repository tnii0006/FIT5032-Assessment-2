<template>
  <div class="skills-table">
    <h2>Digital Skills Assessment Table</h2>
    <InteractiveTable 
      :data="skillsData" 
      :columns="skillsColumns" 
    />
  </div>
</template>

<script>
import InteractiveTable from './InteractiveTable.vue'

export default {
  name: 'SkillsTable',
  components: {
    InteractiveTable
  },
  data() {
    return {
      skillsColumns: [
        { key: 'id', label: 'ID', sortable: true, searchable: false },
        { key: 'skillName', label: 'Skill Name', sortable: true, searchable: true },
        { key: 'category', label: 'Category', sortable: true, searchable: true },
        { key: 'level', label: 'Proficiency', sortable: true, searchable: true },
        { key: 'experience', label: 'Experience', sortable: true, searchable: false, formatter: this.formatExperience },
        { key: 'certification', label: 'Certification', sortable: true, searchable: true },
        { key: 'lastUpdated', label: 'Last Updated', sortable: true, searchable: false, formatter: this.formatDate },
        { key: 'importance', label: 'Importance', sortable: true, searchable: false, formatter: this.formatImportance }
      ],
      skillsData: [
        {
          id: 1,
          skillName: 'JavaScript',
          category: '前端开发',
          level: '高级',
          experience: 5,
          certification: '已认证',
          lastUpdated: '2024-12-15',
          importance: 9
        },
        {
          id: 2,
          skillName: 'Python',
          category: '后端开发',
          level: '中级',
          experience: 3,
          certification: '已认证',
          lastUpdated: '2024-12-10',
          importance: 8
        },
        {
          id: 3,
          skillName: 'React',
          category: '前端开发',
          level: '高级',
          experience: 4,
          certification: '进行中',
          lastUpdated: '2024-12-18',
          importance: 9
        },
        {
          id: 4,
          skillName: 'Node.js',
          category: '后端开发',
          level: '中级',
          experience: 2.5,
          certification: '未认证',
          lastUpdated: '2024-12-05',
          importance: 7
        },
        {
          id: 5,
          skillName: 'MySQL',
          category: '数据库',
          level: '初级',
          experience: 1,
          certification: '已认证',
          lastUpdated: '2024-12-12',
          importance: 6
        },
        {
          id: 6,
          skillName: 'Vue.js',
          category: '前端开发',
          level: '高级',
          experience: 4,
          certification: '已认证',
          lastUpdated: '2024-12-20',
          importance: 8
        },
        {
          id: 7,
          skillName: 'Docker',
          category: 'DevOps',
          level: '中级',
          experience: 2,
          certification: '进行中',
          lastUpdated: '2024-12-08',
          importance: 7
        },
        {
          id: 8,
          skillName: 'AWS',
          category: '云服务',
          level: '初级',
          experience: 1.5,
          certification: '未认证',
          lastUpdated: '2024-12-01',
          importance: 8
        },
        {
          id: 9,
          skillName: 'Git',
          category: '版本控制',
          level: '高级',
          experience: 6,
          certification: '已认证',
          lastUpdated: '2024-12-19',
          importance: 9
        },
        {
          id: 10,
          skillName: 'MongoDB',
          category: '数据库',
          level: '中级',
          experience: 2,
          certification: '已认证',
          lastUpdated: '2024-12-14',
          importance: 6
        },
        {
          id: 11,
          skillName: 'TypeScript',
          category: '前端开发',
          level: '中级',
          experience: 2,
          certification: '进行中',
          lastUpdated: '2024-12-16',
          importance: 8
        },
        {
          id: 12,
          skillName: 'Kubernetes',
          category: 'DevOps',
          level: '初级',
          experience: 0.5,
          certification: '未认证',
          lastUpdated: '2024-12-03',
          importance: 7
        },
        {
          id: 13,
          skillName: 'GraphQL',
          category: 'API开发',
          level: '中级',
          experience: 1.5,
          certification: '已认证',
          lastUpdated: '2024-12-11',
          importance: 6
        },
        {
          id: 14,
          skillName: 'Redis',
          category: '缓存',
          level: '中级',
          experience: 2,
          certification: '未认证',
          lastUpdated: '2024-12-07',
          importance: 6
        },
        {
          id: 15,
          skillName: 'Tailwind CSS',
          category: '前端开发',
          level: '高级',
          experience: 3,
          certification: '已认证',
          lastUpdated: '2024-12-17',
          importance: 7
        },
        {
          id: 16,
          skillName: 'Spring Boot',
          category: '后端开发',
          level: '初级',
          experience: 1,
          certification: '未认证',
          lastUpdated: '2024-12-09',
          importance: 7
        },
        {
          id: 17,
          skillName: 'Nginx',
          category: '服务器',
          level: '中级',
          experience: 2.5,
          certification: '已认证',
          lastUpdated: '2024-12-13',
          importance: 6
        },
        {
          id: 18,
          skillName: 'Elasticsearch',
          category: '搜索',
          level: '初级',
          experience: 1,
          certification: '进行中',
          lastUpdated: '2024-12-06',
          importance: 5
        },
        {
          id: 19,
          skillName: 'Jest',
          category: '测试',
          level: '中级',
          experience: 2,
          certification: '已认证',
          lastUpdated: '2024-12-04',
          importance: 6
        },
        {
          id: 20,
          skillName: 'Webpack',
          category: '构建工具',
          level: '高级',
          experience: 4,
          certification: '已认证',
          lastUpdated: '2024-12-02',
          importance: 8
        }
      ]
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('en-US')
    },
    formatExperience(years) {
      return `${years} years`
    },
    formatImportance(value) {
      return '★'.repeat(Math.floor(value / 2)) + '☆'.repeat(5 - Math.floor(value / 2))
    }
  }
}
</script>

<style scoped>
.skills-table {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.skills-table h2 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}
</style>