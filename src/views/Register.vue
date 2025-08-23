<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-9 col-lg-7">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-5">
            <div class="text-center mb-5">
              <h1 class="display-6 fw-bold">Create Your Account</h1>
              <p class="text-muted">Join our community in just a few simple steps</p>
            </div>

            <form @submit.prevent="handleRegister" class="needs-validation" novalidate>
              <div class="row g-3">
                <div class="col-12">
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

                <div class="col-12">
                  <label for="password" class="form-label fw-medium">Password</label>
                  <input
                    type="password"
                    class="form-control form-control-lg"
                    id="password"
                    v-model="password"
                    required
                    placeholder="Create a password"
                  />
                  <div v-if="password && password.length < 6" class="text-danger">
                    Password must be at least 6 characters long.
                  </div>
                  <div class="form-text mt-2">
                    Use at least 6 characters
                  </div>
                </div>

                <div class="col-12">
                  <label for="confirmPassword" class="form-label fw-medium">Confirm Password</label>
                  <input
                    type="password"
                    class="form-control form-control-lg"
                    id="confirmPassword"
                    v-model="confirmPassword"
                    required
                    placeholder="Confirm your password"
                  />
                  <div v-if="confirmPassword && confirmPassword !== password" class="text-danger">
                    Passwords do not match.
                  </div>
                </div>

                <div class="col-12">
                  <div class="d-grid gap-2">
                    <button type="submit" class="btn btn-success btn-lg">
                      <i class="bi bi-person-plus me-2"></i> Create Account
                    </button>
                  </div>
                  <div v-if="error" class="alert alert-danger mt-3 mb-0">{{ error }}</div>
                </div>
              </div>
            </form>

            <hr class="my-4">

            <div class="text-center">
              <p class="mb-0">
                Already have an account?
                <a href="/login" class="text-decoration-none fw-medium">Sign in</a>
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
const confirmPassword = ref('')
const error = ref('')
const router = useRouter()

async function handleRegister(event) {
  const form = event.target.closest('form');
  if (form.checkValidity()) {
    if (!email.value || !password.value || !confirmPassword.value) {
      error.value = 'Please fill in all fields';
      return;
    }

    if (password.value !== confirmPassword.value) {
      error.value = 'Passwords do not match';
      return;
    }

    if (password.value.length < 6) {
      error.value = 'Password must be at least 6 characters long';
      return;
    }

    try {
      await user.register(email.value, password.value);
      router.push('/');
    } catch (err) {
      error.value = err.message || 'Registration failed';
    }
  } else {
    form.classList.add('was-validated');
  }
}
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
.form-check-input {
  border-radius: 0.375rem;
}
.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
}
</style>
