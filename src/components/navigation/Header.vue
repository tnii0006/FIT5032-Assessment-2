<template>
  <header role="banner">
    <nav
      class="navbar navbar-expand-lg navbar-dark bg-gradient-primary shadow-sm"
      role="navigation"
      aria-label="Main navigation"
    >
      <div class="container-fluid ps-2 ps-md-3 ps-lg-3 ps-xl-4">
        <router-link class="navbar-brand fw-bold fs-3" to="/" aria-label="Elderly Wellbeing - Home">
          <img
            src="/favicon.ico"
            alt="Elderly Wellbeing Platform Logo"
            width="32"
            height="32"
            class="d-inline-block align-text-top me-2 rounded-circle"
          />
          Elderly Wellbeing
        </router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation menu"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-2 ms-3 ms-lg-4 ms-xl-5" role="menubar">
            <li class="nav-item dropdown" role="none">
              <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="wellbeingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fas fa-heartbeat me-2" aria-hidden="true"></i>Wellbeing
              </a>
              <ul class="dropdown-menu" aria-labelledby="wellbeingDropdown">
                <li><router-link class="dropdown-item d-flex align-items-center" to="/health" role="menuitem"><i class="fas fa-heartbeat me-2" aria-hidden="true"></i>Health</router-link></li>
                <li><router-link class="dropdown-item d-flex align-items-center" to="/skills" role="menuitem"><i class="fas fa-laptop me-2" aria-hidden="true"></i>Digital Skills</router-link></li>
                <li><router-link class="dropdown-item d-flex align-items-center" to="/about" role="menuitem"><i class="fas fa-info-circle me-2" aria-hidden="true"></i>About</router-link></li>
              </ul>
            </li>
            <li class="nav-item dropdown" role="none">
              <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="dataToolsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-kanban me-2" aria-hidden="true"></i>Data & Tools
              </a>
              <ul class="dropdown-menu" aria-labelledby="dataToolsDropdown">
                <li><router-link class="dropdown-item d-flex align-items-center" to="/email" role="menuitem"><i class="bi bi-envelope me-2" aria-hidden="true"></i>Email</router-link></li>
                <li><router-link class="dropdown-item d-flex align-items-center" to="/tables" role="menuitem"><i class="bi bi-people me-2" aria-hidden="true"></i>Data Tables</router-link></li>
                <li><router-link class="dropdown-item d-flex align-items-center" to="/serverless" role="menuitem"><i class="fas fa-cloud me-2" aria-hidden="true"></i>Serverless Functions</router-link></li>
              </ul>
            </li>
            <li class="nav-item dropdown" role="none">
              <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="locationBookingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fas fa-map-marker-alt me-2" aria-hidden="true"></i>Location & Booking
              </a>
              <ul class="dropdown-menu" aria-labelledby="locationBookingDropdown">
                <li><router-link class="dropdown-item d-flex align-items-center" to="/geolocation" role="menuitem"><i class="fas fa-map-marker-alt me-2" aria-hidden="true"></i>Geo Location</router-link></li>
                <li><router-link class="dropdown-item d-flex align-items-center" to="/appointments" role="menuitem"><i class="fas fa-calendar-alt me-2" aria-hidden="true"></i>Appointments</router-link></li>
              </ul>
            </li>
          </ul>
          <!-- spacer to push user section further right on large screens -->
          <div class="flex-grow-1 d-none d-lg-block"></div>
          <ul class="navbar-nav ms-auto ms-lg-4 ms-xl-5 gap-2 flex-nowrap align-items-center" role="menubar" aria-label="User account actions">
            <template v-if="user.isLoggedIn">
              <li class="nav-item" role="none">
                <span class="navbar-text me-2 ms-lg-2 fs-6 welcome-text d-none d-md-inline" role="status" aria-live="polite">Welcome, {{ truncatedEmail }}!</span>
               </li>
              <li class="nav-item" role="none">
                <button
                  class="btn btn-gradient rounded-pill px-4 py-2 fw-bold"
                  @click="handleLogout"
                  :disabled="user.loading"
                  role="menuitem"
                  :aria-label="
                    user.loading ? 'Logging out, please wait' : 'Logout from your account'
                  "
                >
                  {{ user.loading ? 'Logging out...' : 'Logout' }}
                </button>
              </li>
            </template>
            <template v-else>
              <li class="nav-item" role="none">
                <router-link
                  class="btn btn-outline-light rounded-pill px-3 py-2 fw-bold me-2 text-nowrap"
                  to="/login"
                  role="menuitem"
                  aria-label="Login to your account"
                  >Login</router-link
                >
              </li>
              <li class="nav-item" role="none">
                <router-link
                  class="btn btn-light rounded-pill px-3 py-2 fw-bold text-nowrap"
                  to="/register"
                  role="menuitem"
                  aria-label="Sign up for a new account"
                  >Sign Up</router-link
                >
              </li>
            </template>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import user from '@/store/user'

const router = useRouter()

const truncatedEmail = computed(() => {
  const email = (user?.info?.email) || 'User'
  if (email.length <= 18) return email
  const parts = email.split('@')
  if (parts.length !== 2) return email.slice(0, 15) + '…'
  const [name, domain] = parts
  const shortName = name.length > 6 ? name.slice(0, 6) + '…' : name
  return `${shortName}@${domain}`
})

const handleLogout = async () => {
  try {
    await user.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(90deg, #4f46e5 0%, #3b82f6 100%) !important;
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.2);
}

.btn-gradient {
  background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
  color: #fff;
  border: none;
  transition: all 0.3s ease;
}

.btn-gradient:hover {
  background: linear-gradient(90deg, #60a5fa 0%, #6366f1 100%);
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.nav-link {
  padding: 0.7rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.btn {
  white-space: nowrap;
}

.btn-light,
.btn-outline-light {
  min-width: 86px;
}

.navbar {
  font-size: 0.95rem;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-exact-active {
  font-weight: 600;
  color: #fff !important;
  background: rgba(255, 255, 255, 0.15);
}

.navbar-brand {
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.navbar-brand:hover {
  background: rgba(255, 255, 255, 0.1);
}

.welcome-text {
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Responsive Design */
@media (max-width: 768px) {
  .navbar-nav {
    flex-direction: column;
    text-align: center;
  }
  .nav-link {
    padding: 0.5rem 1rem;
  }
  .btn-gradient {
    width: 100%;
  }
  .navbar-toggler {
    display: flex !important;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    background-color: #4f46e5;
    border-radius: 50%;
  }
  .navbar-toggler-icon {
    width: 20px;
    height: 20px;
  }
}

@media (max-width: 576px) {
}
</style>
