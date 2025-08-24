<template>
  <div class="skills-table">
    <h2>Digital Skills Assessment Table</h2>
    <InteractiveTable :data="skillsData" :columns="skillsColumns" />
  </div>
</template>

<script>
import InteractiveTable from './InteractiveTable.vue'

export default {
  name: 'SkillsTable',
  components: {
    InteractiveTable,
  },
  data() {
    return {
      skillsColumns: [
        { key: 'id', label: 'ID', sortable: true, searchable: false },
        { key: 'skillName', label: 'Skill Name', sortable: true, searchable: true },
        { key: 'category', label: 'Category', sortable: true, searchable: true },
        { key: 'level', label: 'Proficiency', sortable: true, searchable: true },
        {
          key: 'experience',
          label: 'Experience',
          sortable: true,
          searchable: false,
          formatter: this.formatExperience,
        },
        { key: 'certification', label: 'Certification', sortable: true, searchable: true },
        {
          key: 'lastUpdated',
          label: 'Last Updated',
          sortable: true,
          searchable: false,
          formatter: this.formatDate,
        },
        {
          key: 'importance',
          label: 'Importance',
          sortable: true,
          searchable: false,
          formatter: this.formatImportance,
        },
      ],
      skillsData: [
        {
          id: 1,
          skillName: 'JavaScript',
          category: 'Frontend Development',
          level: 'Advanced',
          experience: 5,
          certification: 'Certified',
          lastUpdated: '2024-12-15',
          importance: 9,
        },
        {
          id: 2,
          skillName: 'Python',
          category: 'Backend Development',
          level: 'Intermediate',
          experience: 3,
          certification: 'Certified',
          lastUpdated: '2024-12-10',
          importance: 8,
        },
        {
          id: 3,
          skillName: 'React',
          category: 'Frontend Development',
          level: 'Advanced',
          experience: 4,
          certification: 'In Progress',
          lastUpdated: '2024-12-18',
          importance: 9,
        },
        {
          id: 4,
          skillName: 'Node.js',
          category: 'Backend Development',
          level: 'Intermediate',
          experience: 2.5,
          certification: 'Not Certified',
          lastUpdated: '2024-12-05',
          importance: 7,
        },
        {
          id: 5,
          skillName: 'MySQL',
          category: 'Database',
          level: 'Beginner',
          experience: 1,
          certification: 'Certified',
          lastUpdated: '2024-12-12',
          importance: 6,
        },
        {
          id: 6,
          skillName: 'Vue.js',
          category: 'Frontend Development',
          level: 'Advanced',
          experience: 4,
          certification: 'Certified',
          lastUpdated: '2024-12-20',
          importance: 8,
        },
        {
          id: 7,
          skillName: 'Docker',
          category: 'DevOps',
          level: 'Intermediate',
          experience: 2,
          certification: 'In Progress',
          lastUpdated: '2024-12-08',
          importance: 7,
        },
        {
          id: 8,
          skillName: 'AWS',
          category: 'Cloud Services',
          level: 'Beginner',
          experience: 1.5,
          certification: 'Not Certified',
          lastUpdated: '2024-12-01',
          importance: 8,
        },
        {
          id: 9,
          skillName: 'Git',
          category: 'Version Control',
          level: 'Advanced',
          experience: 6,
          certification: 'Certified',
          lastUpdated: '2024-12-19',
          importance: 9,
        },
        {
          id: 10,
          skillName: 'MongoDB',
          category: 'Database',
          level: 'Intermediate',
          experience: 2,
          certification: 'Certified',
          lastUpdated: '2024-12-14',
          importance: 6,
        },
        {
          id: 11,
          skillName: 'TypeScript',
          category: 'Frontend Development',
          level: 'Intermediate',
          experience: 2,
          certification: 'In Progress',
          lastUpdated: '2024-12-16',
          importance: 8,
        },
        {
          id: 12,
          skillName: 'Kubernetes',
          category: 'DevOps',
          level: 'Beginner',
          experience: 0.5,
          certification: 'Not Certified',
          lastUpdated: '2024-12-03',
          importance: 7,
        },
        {
          id: 13,
          skillName: 'GraphQL',
          category: 'API Development',
          level: 'Intermediate',
          experience: 1.5,
          certification: 'Certified',
          lastUpdated: '2024-12-11',
          importance: 6,
        },
        {
          id: 14,
          skillName: 'Redis',
          category: 'Cache',
          level: 'Intermediate',
          experience: 2,
          certification: 'Not Certified',
          lastUpdated: '2024-12-07',
          importance: 6,
        },
        {
          id: 15,
          skillName: 'Tailwind CSS',
          category: 'Frontend Development',
          level: 'Advanced',
          experience: 3,
          certification: 'Certified',
          lastUpdated: '2024-12-17',
          importance: 7,
        },
        {
          id: 16,
          skillName: 'Spring Boot',
          category: 'Backend Development',
          level: 'Beginner',
          experience: 1,
          certification: 'Not Certified',
          lastUpdated: '2024-12-09',
          importance: 7,
        },
        {
          id: 17,
          skillName: 'Nginx',
          category: 'Server',
          level: 'Intermediate',
          experience: 2.5,
          certification: 'Certified',
          lastUpdated: '2024-12-13',
          importance: 6,
        },
        {
          id: 18,
          skillName: 'Elasticsearch',
          category: 'Search',
          level: 'Beginner',
          experience: 1,
          certification: 'In Progress',
          lastUpdated: '2024-12-06',
          importance: 5,
        },
        {
          id: 19,
          skillName: 'Jest',
          category: 'Testing',
          level: 'Intermediate',
          experience: 2,
          certification: 'Certified',
          lastUpdated: '2024-12-04',
          importance: 6,
        },
        {
          id: 20,
          skillName: 'Webpack',
          category: 'Build Tools',
          level: 'Advanced',
          experience: 4,
          certification: 'Certified',
          lastUpdated: '2024-12-02',
          importance: 8,
        },
      ],
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
    },
  },
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
