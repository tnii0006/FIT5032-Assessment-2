<template>
  <main class="container py-5" role="main">
    <header class="text-center mb-5">
      <h1 class="display-4 fw-bold" id="main-heading">Elderly Care Services</h1>
      <p class="lead">Comprehensive support for senior citizens to enhance quality of life.</p>
    </header>

    <section class="row g-5 align-items-center" aria-labelledby="main-heading">
      <div class="col-md-6">
        <figure class="position-relative">
          <img
            src="https://images.pexels.com/photos/3822839/pexels-photo-3822839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            class="img-fluid rounded-4 shadow-sm"
            alt="Professional caregiver assisting an elderly person with a warm smile, demonstrating compassionate care and support"
            style="
              width: 100%;
              max-width: 600px;
              height: auto;
              object-fit: cover;
              aspect-ratio: 4/3;
            "
            loading="lazy"
          />
          <div class="position-absolute top-0 start-0 p-3">
            <span class="badge bg-primary" role="status" aria-label="New services available"
              >New Services</span
            >
          </div>
        </figure>
      </div>

      <div class="col-md-6">
        <article>
          <h2 class="fw-bold mb-4" id="mission-heading">Our Mission</h2>
          <p class="mb-4">
            We strive to provide compassionate care and support services that empower elderly
            individuals to maintain their independence, dignity, and quality of life.
          </p>

          <section aria-labelledby="services-heading">
            <h3 id="services-heading" class="sr-only">Our Key Services</h3>

            <div class="d-flex align-items-start gap-3 mb-3" role="article">
              <i class="bi bi-heart-pulse fs-3 text-primary flex-shrink-0" aria-hidden="true"></i>
              <div>
                <h4 class="h5">Health & Wellness</h4>
                <p class="mb-0">Comprehensive health monitoring and medical support services.</p>
              </div>
            </div>

            <div class="d-flex align-items-start gap-3 mb-3" role="article">
              <i class="bi bi-chat-dots fs-3 text-primary flex-shrink-0" aria-hidden="true"></i>
              <div>
                <h4 class="h5">Social Engagement</h4>
                <p class="mb-0">Community activities and social programs to prevent isolation.</p>
              </div>
            </div>

            <div class="d-flex align-items-start gap-3 mb-4" role="article">
              <i class="bi bi-building fs-3 text-primary flex-shrink-0" aria-hidden="true"></i>
              <div>
                <h4 class="h5">Life Services</h4>
                <p class="mb-0">
                  Daily living assistance and home services tailored to individual needs.
                </p>
              </div>
            </div>
          </section>

          <nav class="d-grid gap-2 d-md-block" aria-label="Main action buttons">
            <a
              href="/services"
              class="btn btn-primary btn-lg me-md-2"
              role="button"
              aria-describedby="services-desc"
              >Explore Services</a
            >
            <div id="services-desc" class="sr-only">
              Learn more about our comprehensive elderly care services
            </div>
            <a
              href="/contact"
              class="btn btn-outline-primary btn-lg"
              role="button"
              aria-describedby="contact-desc"
              >Contact Us</a
            >
            <div id="contact-desc" class="sr-only">
              Get in touch with our care team for personalized assistance
            </div>
          </nav>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
// No script needed for this static page
</script>

<style scoped>
.hover-lift {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
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
