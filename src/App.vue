<template>
  <div id="app-container">
    <Header />

    <main class="flex-shrink-0 py-4 bg-app-main">
      <router-view />
    </main>

    <footer class="footer mt-auto py-4 bg-white border-top">
      <template v-if="!['/login', '/register'].includes($route.path)">
        <!-- Comments Section -->
        <div class="container mt-4">
          <h5 class="text-center">User Comments and Ratings</h5>
          <div class="rating-section">
            <p>Average Rating: {{ averageRating.toFixed(1) }} / 5</p>
            <div v-for="(comment, index) in comments" :key="index" class="comment">
              <p>
                <strong>{{ comment.username }}</strong
                >: {{ comment.text }}
              </p>
              <p>Rating: {{ comment.rating }} / 5</p>
            </div>
          </div>
          <div class="submit-section mt-3">
            <input
              v-model="newComment.text"
              type="text"
              placeholder="Enter your comment"
              class="form-control mb-2"
            />
            <select v-model="newComment.rating" class="form-select mb-2">
              <option disabled value="">Select Rating</option>
              <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
            </select>
            <button @click="submitComment" class="btn btn-gradient">Submit Comment</button>
          </div>
        </div>
      </template>
      <div class="container text-center">
        <span class="text-muted">© 2024 Elderly Wellbeing Platform. All Rights Reserved.</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import Header from './components/navigation/Header.vue'
import user from './store/user'
import { ref, onMounted } from 'vue'
import DOMPurify from 'dompurify'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const comments = ref([
  { username: 'Alice', text: 'Very helpful platform!', rating: 5 },
  { username: 'Bob', text: 'User-friendly interface and comprehensive features.', rating: 4 },
])
const newComment = ref({ text: '', rating: '' })
const averageRating = ref(
  comments.value.reduce((sum, comment) => sum + comment.rating, 0) / comments.value.length,
)

const sanitizeInput = (input) => {
  return DOMPurify.sanitize(input)
}

const submitComment = () => {
  if (!user.isLoggedIn) {
    alert('You must be logged in to submit a comment!')
    return
  }

  if (newComment.value.text && newComment.value.rating) {
    const sanitizedText = sanitizeInput(newComment.value.text)
    comments.value.push({
      username: user.info.email || 'User',
      text: sanitizedText,
      rating: parseInt(newComment.value.rating, 10),
    })
    averageRating.value =
      comments.value.reduce((sum, comment) => sum + comment.rating, 0) / comments.value.length
    newComment.value.text = ''
    newComment.value.rating = ''
  } else {
    alert('Please fill in both comment and rating!')
  }
}

onMounted(() => {
  // Bootstrap JavaScript is now initialized via ES module import
})
</script>

<style>
#app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
  background: #f6f8fa;
}

main.bg-app-main {
  background: linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%);
  min-height: 80vh;
  padding: 2rem 0;
}

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

.footer {
  background: #fff;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
}

.rating-section {
  margin-top: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 0.5rem;
}
.comment {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-bottom: 1px solid #ddd;
}
.submit-section {
  margin-top: 1rem;
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
