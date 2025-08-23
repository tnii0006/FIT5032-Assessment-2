<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-gradient-primary shadow-sm">
      <div class="container-fluid">
        <router-link class="navbar-brand fw-bold fs-3" to="/">
          <img
            src="/favicon.ico"
            alt="Logo"
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
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-2">
            <li class="nav-item">
              <router-link class="nav-link d-flex align-items-center" to="/health">
                <i class="fas fa-heartbeat me-2"></i>Health
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link d-flex align-items-center" to="/skills">
                <i class="fas fa-laptop me-2"></i>Digital Skills
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link d-flex align-items-center" to="/about">
                <i class="fas fa-info-circle me-2"></i>About
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link d-flex align-items-center" to="/email">
                <i class="bi bi-envelope me-1"></i>Email
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link d-flex align-items-center" to="/tables">
                <i class="bi bi-people me-1"></i>Data Tables
              </router-link>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto gap-2">
            <template v-if="user.isLoggedIn">
              <li class="nav-item">
                <span class="navbar-text me-3 fs-5"
                  >Welcome, {{ user.info.email || 'User' }}!</span
                >
              </li>
              <li class="nav-item">
                <button
                  class="btn btn-gradient rounded-pill px-4 py-2 fw-bold"
                  @click="handleLogout"
                  :disabled="user.loading"
                >
                  {{ user.loading ? 'Logging out...' : 'Logout' }}
                </button>
              </li>
            </template>
            <template v-else>
              <li class="nav-item">
                <router-link
                  class="btn btn-outline-light rounded-pill px-4 py-2 fw-bold me-2"
                  to="/login"
                  >Login</router-link
                >
              </li>
              <li class="nav-item">
                <router-link class="btn btn-light rounded-pill px-4 py-2 fw-bold" to="/register"
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
import { useRouter } from 'vue-router'
import user from '@/store/user'

const router = useRouter()

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
  padding: 0.8rem 1.2rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
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
  .navbar-brand {
    font-size: 1.5rem;
  }
  .navbar-toggler {
    display: flex !important;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    background-color: #4f46e5;
    border-radius: 50%;
  }
  .navbar-toggler-icon {
    width: 15px;
    height: 15px;
  }
}
</style>
