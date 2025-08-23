<template>
  <div class="interactive-table">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-row">
        <div v-for="column in searchableColumns" :key="column.key" class="search-input">
          <label>{{ column.label }}:</label>
          <input 
            v-model="searchFilters[column.key]" 
            :placeholder="`Search ${column.label}`"
            @input="handleSearch"
            type="text"
          />
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th 
              v-for="column in columns" 
              :key="column.key"
              @click="handleSort(column.key)"
              :class="{ 'sortable': column.sortable !== false }"
            >
              {{ column.label }}
              <span v-if="sortKey === column.key" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paginatedData" :key="row.id">
            <td v-for="column in columns" :key="column.key">
              {{ formatValue(row[column.key], column) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <button 
        @click="goToPage(currentPage - 1)" 
        :disabled="currentPage === 1"
        class="pagination-btn"
      >
        Previous
      </button>
      
      <span class="page-info">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      
      <button 
        @click="goToPage(currentPage + 1)" 
        :disabled="currentPage === totalPages"
        class="pagination-btn"
      >
        Next
      </button>
      
      <select v-model="itemsPerPage" @change="updatePagination" class="page-size-selector">
        <option value="10">10 per page</option>
        <option value="20">20 per page</option>
        <option value="50">50 per page</option>
      </select>
    </div>

    <div class="table-info">
      {{ filteredData.length }} total records, showing {{ paginatedData.length }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'InteractiveTable',
  props: {
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      searchFilters: {},
      sortKey: '',
      sortOrder: 'asc',
      currentPage: 1,
      itemsPerPage: 10
    }
  },
  computed: {
    searchableColumns() {
      return this.columns.filter(col => col.searchable !== false)
    },
    filteredData() {
      let filtered = [...this.data]
      
      // 应用搜索过滤器
      Object.keys(this.searchFilters).forEach(key => {
        const searchValue = this.searchFilters[key]?.toLowerCase()
        if (searchValue) {
          filtered = filtered.filter(item => 
            String(item[key] || '').toLowerCase().includes(searchValue)
          )
        }
      })
      
      return filtered
    },
    sortedData() {
      if (!this.sortKey) return this.filteredData
      
      return [...this.filteredData].sort((a, b) => {
        let aVal = a[this.sortKey]
        let bVal = b[this.sortKey]
        
        // 处理数字类型
        if (!isNaN(aVal) && !isNaN(bVal)) {
          aVal = Number(aVal)
          bVal = Number(bVal)
        }
        
        if (this.sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.sortedData.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.sortedData.length / this.itemsPerPage)
    }
  },
  methods: {
    handleSort(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortKey = key
        this.sortOrder = 'asc'
      }
      this.currentPage = 1 // 重置到第一页
    },
    handleSearch() {
      this.currentPage = 1 // 搜索时重置到第一页
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    },
    updatePagination() {
      this.currentPage = 1
    },
    formatValue(value, column) {
      if (column.formatter && typeof column.formatter === 'function') {
        return column.formatter(value)
      }
      return value || '-'
    }
  },
  watch: {
    data() {
      // 数据变化时重置分页
      this.currentPage = 1
    }
  }
}
</script>

<style scoped>
.interactive-table {
  max-width: 100%;
  margin: 0 auto;
}

.search-section {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.search-row {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.search-input {
  display: flex;
  flex-direction: column;
  min-width: 150px;
}

.search-input label {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 14px;
}

.search-input input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f8f9fa;
  font-weight: bold;
  position: relative;
}

th.sortable {
  cursor: pointer;
  user-select: none;
}

th.sortable:hover {
  background-color: #e9ecef;
}

.sort-indicator {
  margin-left: 5px;
  font-weight: bold;
  color: #007bff;
}

tr:hover {
  background-color: #f8f9fa;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
}

.pagination-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f8f9fa;
}

.pagination-btn:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
  opacity: 0.6;
}

.page-info {
  font-weight: bold;
  color: #495057;
}

.page-size-selector {
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.table-info {
  text-align: center;
  color: #6c757d;
  font-size: 14px;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .search-row {
    flex-direction: column;
  }
  
  .search-input {
    min-width: 100%;
  }
  
  .pagination {
    flex-direction: column;
    gap: 10px;
  }
}
</style>