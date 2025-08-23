<template>
  <div class="user-table">
    <h2>User Management Table</h2>
    <InteractiveTable 
      :data="userData" 
      :columns="userColumns" 
    />
  </div>
</template>

<script>
import InteractiveTable from './InteractiveTable.vue'

export default {
  name: 'UserTable',
  components: {
    InteractiveTable
  },
  data() {
    return {
      userColumns: [
        { key: 'id', label: 'ID', sortable: true, searchable: false },
        { key: 'name', label: 'Name', sortable: true, searchable: true },
        { key: 'email', label: 'Email', sortable: true, searchable: true },
        { key: 'role', label: 'Role', sortable: true, searchable: true },
        { key: 'status', label: 'Status', sortable: true, searchable: true },
        { key: 'joinDate', label: 'Join Date', sortable: true, searchable: false, formatter: this.formatDate },
        { key: 'lastLogin', label: 'Last Login', sortable: true, searchable: false, formatter: this.formatDateTime }
      ],
      userData: [
        {
          id: 1,
          name: 'John Smith',
          email: 'john.smith@example.com',
          role: 'Administrator',
          status: 'Active',
          joinDate: '2024-01-15',
          lastLogin: '2024-12-20 14:30:00'
        },
        {
          id: 2,
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          role: 'User',
          status: 'Active',
          joinDate: '2024-02-20',
          lastLogin: '2024-12-19 09:15:00'
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          role: 'User',
          status: 'Inactive',
          joinDate: '2024-03-10',
          lastLogin: null
        },
        {
          id: 4,
          name: 'Sarah Williams',
          email: 'sarah.williams@example.com',
          role: 'Editor',
          status: 'Active',
          joinDate: '2024-01-30',
          lastLogin: '2024-12-20 11:45:00'
        },
        {
          id: 5,
          name: 'David Brown',
          email: 'david.brown@example.com',
          role: 'User',
          status: 'Suspended',
          joinDate: '2024-04-05',
          lastLogin: '2024-12-15 16:20:00'
        },
        {
          id: 6,
          name: 'Emily Davis',
          email: 'emily.davis@example.com',
          role: 'Administrator',
          status: 'Active',
          joinDate: '2024-02-15',
          lastLogin: '2024-12-20 08:30:00'
        },
        {
          id: 7,
          name: 'Chris Wilson',
          email: 'chris.wilson@example.com',
          role: 'User',
          status: 'Active',
          joinDate: '2024-03-25',
          lastLogin: '2024-12-19 20:10:00'
        },
        {
          id: 8,
          name: 'Lisa Anderson',
          email: 'lisa.anderson@example.com',
          role: 'Editor',
          status: 'Active',
          joinDate: '2024-04-10',
          lastLogin: '2024-12-20 13:25:00'
        },
        {
          id: 9,
          name: 'Robert Taylor',
          email: 'robert.taylor@example.com',
          role: 'User',
          status: 'Inactive',
          joinDate: '2024-05-01',
          lastLogin: null
        },
        {
          id: 10,
          name: 'Maria Garcia',
          email: 'maria.garcia@example.com',
          role: 'User',
          status: 'Active',
          joinDate: '2024-05-15',
          lastLogin: '2024-12-18 15:40:00'
        },
        {
          id: 11,
          name: 'James Miller',
          email: 'james.miller@example.com',
          role: 'User',
          status: 'Active',
          joinDate: '2024-06-01',
          lastLogin: '2024-12-19 12:00:00'
        },
        {
          id: 12,
          name: 'Patricia Jones',
          email: 'patricia.jones@example.com',
          role: 'Administrator',
          status: 'Active',
          joinDate: '2024-06-15',
          lastLogin: '2024-12-20 10:15:00'
        },
        {
          id: 13,
          name: 'Kevin White',
          email: 'kevin.white@example.com',
          role: 'User',
          status: 'Suspended',
          joinDate: '2024-07-01',
          lastLogin: '2024-12-10 14:50:00'
        },
        {
          id: 14,
          name: 'Jennifer Lee',
          email: 'jennifer.lee@example.com',
          role: 'Editor',
          status: 'Active',
          joinDate: '2024-07-15',
          lastLogin: '2024-12-20 09:30:00'
        },
        {
          id: 15,
          name: 'Daniel Clark',
          email: 'daniel.clark@example.com',
          role: 'User',
          status: 'Active',
          joinDate: '2024-08-01',
          lastLogin: '2024-12-19 18:20:00'
        }
      ]
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('en-US')
    },
    formatDateTime(dateTimeString) {
      if (!dateTimeString) return '-'
      return new Date(dateTimeString).toLocaleString('en-US')
    }
  }
}
</script>

<style scoped>
.user-table {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.user-table h2 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}
</style>