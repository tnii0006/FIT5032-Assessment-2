<template>
  <div id="app-container">
    <!-- Skip to main content link for keyboard navigation -->
    <a href="#main-content" class="skip-link">Skip to main content</a>
    
    <Header />

    <main id="main-content" class="flex-shrink-0 py-4 bg-app-main" role="main" tabindex="-1">
      <router-view />
    </main>

    <footer class="footer mt-auto py-4 bg-white border-top" role="contentinfo">
      <template v-if="!['/login', '/register'].includes($route.path)">
        <!-- Comments Section -->
        <section class="container mt-4" aria-labelledby="comments-heading">
          <h5 id="comments-heading" class="text-center">User Comments and Ratings</h5>
          <div class="rating-section" role="region" aria-label="Rating information">
            <p aria-live="polite">Average Rating: {{ averageRating.toFixed(1) }} out of 5 stars</p>
            <div v-for="(comment, index) in comments" :key="index" class="comment" role="article">
              <p>
                <strong>{{ comment.username }}</strong
                >: {{ comment.text }}
              </p>
              <p>Rating: {{ comment.rating }} out of 5 stars</p>
            </div>
          </div>
          <form class="submit-section mt-3" @submit.prevent="submitComment" role="form" aria-labelledby="comment-form-heading">
            <h6 id="comment-form-heading" class="sr-only">Submit a comment</h6>
            <label for="comment-input" class="sr-only">Your comment</label>
            <input
              id="comment-input"
              v-model="newComment.text"
              type="text"
              placeholder="Enter your comment"
              class="form-control mb-2"
              aria-required="true"
              aria-describedby="comment-help"
            />
            <div id="comment-help" class="sr-only">Enter your feedback about our services</div>
            <label for="rating-select" class="sr-only">Your rating</label>
            <select id="rating-select" v-model="newComment.rating" class="form-select mb-2" aria-required="true">
              <option disabled value="">Select Rating</option>
              <option v-for="n in 5" :key="n" :value="n">{{ n }} star{{ n > 1 ? 's' : '' }}</option>
            </select>
            <button type="submit" class="btn btn-gradient" :disabled="!newComment.text || !newComment.rating">
              Submit Comment
            </button>
          </form>
        </section>
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
