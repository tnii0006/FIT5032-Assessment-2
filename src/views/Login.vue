<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-5">
            <div class="text-center mb-5">
              <h1 class="display-6 fw-bold">Welcome Back</h1>
              <p class="text-muted">Sign in to your account</p>
            </div>

            <form @submit.prevent="handleLogin" class="needs-validation" novalidate>
              <div class="mb-4">
                <label for="email" class="form-label fw-medium">Email</label>
                <input
                  type="email"
                  class="form-control form-control-lg"
                  id="email"
                  v-model="email"
                  required
                  placeholder="Enter your email"
                />
                <div class="invalid-feedback">
                  Please enter a valid email address.
                </div>
              </div>

              <div class="mb-4">
                <label for="password" class="form-label fw-medium">Password</label>
                <input
                  type="password"
                  class="form-control form-control-lg"
                  id="password"
                  v-model="password"
                  required
                  placeholder="Enter your password"
                  minlength="6"
                />
                <div class="invalid-feedback">
                  Please enter your password.
                </div>
                <div class="form-text mt-2">
                  <a href="/forgot-password" class="text-decoration-none">Forgot password?</a>
                </div>
              </div>

              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary btn-lg">
                  <i class="bi bi-box-arrow-in-right me-2"></i> Sign In
                </button>
              </div>

              <div v-if="error" class="alert alert-danger mt-3 mb-0 text-center">{{ error }}</div>
            </form>

            <hr class="my-4">

            <div class="text-center">
              <p class="mb-0">
                Don't have an account?
                <router-link to="/register" class="text-decoration-none fw-medium">Create one</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import user from '../store/user'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const handleLogin = async () => {
  const form = document.querySelector('form');
  if (form.checkValidity()) {
    if (!email.value || !password.value) {
      error.value = 'Please fill in all fields';
      return;
    }

    try {
      await user.login(email.value, password.value);
      router.push('/');
    } catch (err) {
      error.value = err.message || 'Login failed';
    }
  } else {
    form.classList.add('was-validated');
  }
};
</script>

<style scoped>
.card {
  border-radius: 1rem;
}
.form-control {
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
}
.form-control:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
}
.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
}
</style>
