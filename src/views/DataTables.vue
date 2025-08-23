<template>
  <div class="data-tables">
    <div class="container">
      <h1>Interactive Data Tables</h1>
      <p class="description">
        The following tables support sorting, searching, and pagination features. You can click
        column headers to sort, use search boxes to filter by column, and navigate through data
        using pagination controls.
      </p>

      <div class="tables-container">
        <UserTable />
        <SkillsTable />
      </div>
    </div>
  </div>
</template>

<script>
import UserTable from '@/components/UserTable.vue'
import SkillsTable from '@/components/SkillsTable.vue'

export default {
  name: 'DataTables',
  components: {
    UserTable,
    SkillsTable,
  },
}
</script>

<style scoped>
.data-tables {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 10px;
  font-size: 2.5rem;
}

.description {
  text-align: center;
  color: #666;
  margin-bottom: 40px;
  font-size: 1.1rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.tables-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.tables-container > * {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  h1 {
    font-size: 2rem;
  }

  .description {
    font-size: 1rem;
    padding: 0 10px;
  }

  .tables-container {
    gap: 20px;
  }
}
</style>
