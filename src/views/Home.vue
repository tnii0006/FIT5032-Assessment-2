<template>
  <div class="container py-5">
    <div class="text-center mb-5">
      <h1 class="display-4 fw-bold">Elderly Care Services</h1>
      <p class="lead">Comprehensive support for senior citizens to enhance quality of life.</p>
    </div>

    <div class="row g-5 align-items-center">
      <div class="col-md-6">
        <div class="position-relative">
          <img
            src="https://images.pexels.com/photos/3822839/pexels-photo-3822839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            class="img-fluid rounded-4 shadow-sm"
            alt="Caregiver assisting elderly person with a smile"
            style="width: 100%; max-width: 600px; height: auto; object-fit: cover; aspect-ratio: 4/3;"
          />
          <div class="position-absolute top-0 start-0 p-3">
            <span class="badge bg-primary">New Services</span>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <h2 class="fw-bold mb-4">Our Mission</h2>
        <p class="mb-4">We strive to provide compassionate care and support services that empower elderly individuals to maintain their independence, dignity, and quality of life.</p>

        <div class="d-flex align-items-start gap-3 mb-3">
          <i class="bi bi-heart-pulse fs-3 text-primary flex-shrink-0"></i>
          <div>
            <h5>Health & Wellness</h5>
            <p class="mb-0">Comprehensive health monitoring and medical support services.</p>
          </div>
        </div>

        <div class="d-flex align-items-start gap-3 mb-3">
          <i class="bi bi-chat-dots fs-3 text-primary flex-shrink-0"></i>
          <div>
            <h5>Social Engagement</h5>
            <p class="mb-0">Community activities and social programs to prevent isolation.</p>
          </div>
        </div>

        <div class="d-flex align-items-start gap-3 mb-4">
          <i class="bi bi-building fs-3 text-primary flex-shrink-0"></i>
          <div>
            <h5>Life Services</h5>
            <p class="mb-0">Daily living assistance and home services tailored to individual needs.</p>
          </div>
        </div>

        <div class="d-grid gap-2 d-md-block">
          <a href="/services" class="btn btn-primary btn-lg me-md-2">Explore Services</a>
          <a href="/contact" class="btn btn-outline-primary btn-lg">Contact Us</a>
        </div>
      </div>
    </div>

    <div class="mt-5 pt-5">
      <h2 class="text-center fw-bold mb-5">Our Service Highlights</h2>
      <div class="row g-4">
        <div class="col-md-4">
          <div class="card h-100 border-0 shadow-sm hover-lift">
            <div class="card-body d-flex flex-column align-items-center text-center p-4">
              <i class="bi bi-calendar-check fs-1 text-primary mb-3"></i>
              <h5 class="card-title fw-bold">Easy Scheduling</h5>
              <p class="card-text">Book and manage appointments through our user-friendly online platform.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 border-0 shadow-sm hover-lift">
            <div class="card-body d-flex flex-column align-items-center text-center p-4">
              <i class="bi bi-person-check fs-1 text-primary mb-3"></i>
              <h5 class="card-title fw-bold">Trusted Providers</h5>
              <p class="card-text">All our caregivers are professionally trained and thoroughly vetted.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 border-0 shadow-sm hover-lift">
            <div class="card-body d-flex flex-column align-items-center text-center p-4">
              <i class="bi bi-shield-check fs-1 text-primary mb-3"></i>
              <h5 class="card-title fw-bold">Safety First</h5>
              <p class="card-text">Comprehensive safety protocols and emergency response systems in place.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No script needed for this static page
</script>

<style scoped>
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Added a subtle background color for the page */
body {
  background-color: #f8f9fa; /* Light gray background */
}

/* Ensures the image maintains aspect ratio and covers its container */
.img-fluid {
  object-fit: cover;
  /* Added a fixed aspect ratio for consistent image sizing */
  aspect-ratio: 4/3; /* Adjust as needed, e.g., 16/9 for wider, 1/1 for square */
}
</style>
