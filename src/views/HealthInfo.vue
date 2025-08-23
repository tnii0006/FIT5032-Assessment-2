<template>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <div class="container py-5">
    <div class="text-center mb-5">
      <h1 class="display-5 fw-bold">Health Information & Resources</h1>
      <p class="lead">Comprehensive health resources and medical support services.</p>
    </div>

    <div class="row g-5">
      <div class="col-md-4">
        <div class="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
          <button class="nav-link active d-flex align-items-center gap-2 p-3 mb-2 rounded-3" id="v-pills-overview-tab"
            data-bs-toggle="pill" data-bs-target="#v-pills-overview" type="button" role="tab"
            aria-controls="v-pills-overview" aria-selected="true">
            <i class="bi bi-graph-up-arrow fs-5"></i>
            <span class="fw-medium">Health Overview</span>
          </button>
          <button class="nav-link d-flex align-items-center gap-2 p-3 mb-2 rounded-3" id="v-pills-nutrition-tab"
             data-bs-toggle="pill" data-bs-target="#v-pills-nutrition" type="button" role="tab" aria-controls="v-pills-nutrition"
            aria-selected="false">
            <i class="bi bi-apple fs-5"></i>
            <span class="fw-medium">Nutrition Guide</span>
          </button>
          <button class="nav-link d-flex align-items-center gap-2 p-3 mb-2 rounded-3" id="v-pills-exercise-tab"
             data-bs-toggle="pill" data-bs-target="#v-pills-exercise" type="button" role="tab"
            aria-controls="v-pills-exercise" aria-selected="false">
            <i class="bi bi-person-walking fs-5"></i>
            <span class="fw-medium">Exercise Programs</span>
          </button>
          <button class="nav-link d-flex align-items-center gap-2 p-3 mb-2 rounded-3" id="v-pills-medication-tab"
             data-bs-toggle="pill" data-bs-target="#v-pills-medication" type="button" role="tab"
            aria-controls="v-pills-medication" aria-selected="false">
            <i class="bi bi-capsule fs-5"></i>
            <span class="fw-medium">Medication Management</span>
          </button>
          <button class="nav-link d-flex align-items-center gap-2 p-3 mb-2 rounded-3" id="v-pills-emergency-tab"
             data-bs-toggle="pill" data-bs-target="#v-pills-emergency" type="button" role="tab"
            aria-controls="v-pills-emergency" aria-selected="false">
            <i class="bi bi-hospital fs-5"></i>
            <span class="fw-medium">Emergency Preparedness</span>
          </button>
        </div>
      </div>

      <div class="col-md-8">
        <div class="tab-content" id="v-pills-tabContent">
          <!-- Health Overview Tab -->
          <div class="tab-pane fade show active" id="v-pills-overview" role="tabpanel"
            aria-labelledby="v-pills-overview-tab">
            <div class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <h2 class="h4 fw-bold mb-4">Health Overview</h2>
                <p class="mb-4">Comprehensive health resources and medical support services to help you maintain your
                  independence and quality of life.</p>

                <div class="row g-3 mb-4">
                  <div class="col-md-6">
                    <div class="d-flex align-items-start gap-3">
                      <i class="bi bi-check-circle-fill text-success fs-4"></i>
                      <div>
                        <h5 class="h6 fw-bold">Preventive Care</h5>
                        <p class="mb-0">Regular check-ups, vaccinations, and screenings to prevent health issues.</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="d-flex align-items-start gap-3">
                      <i class="bi bi-check-circle-fill text-success fs-4"></i>
                      <div>
                        <h5 class="h6 fw-bold">Chronic Disease Management</h5>
                        <p class="mb-0">Specialized programs for managing conditions like diabetes and hypertension.</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="d-flex align-items-start gap-3">
                      <i class="bi bi-check-circle-fill text-success fs-4"></i>
                      <div>
                        <h5 class="h6 fw-bold">Mental Wellness</h5>
                        <p class="mb-0">Support for cognitive health and emotional well-being.</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="d-flex align-items-start gap-3">
                      <i class="bi bi-check-circle-fill text-success fs-4"></i>
                      <div>
                        <h5 class="h6 fw-bold">Nutritional Support</h5>
                        <p class="mb-0">Personalized meal plans and dietary counseling services.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="alert alert-primary d-flex align-items-center" role="alert">
                  <i class="bi bi-info-circle-fill me-2"></i>
                  <div>
                    Regular health assessments help identify potential issues before they become serious.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Nutrition Guide Tab -->
          <div class="tab-pane fade" id="v-pills-nutrition" role="tabpanel" aria-labelledby="v-pills-nutrition-tab">
            <div class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <h2 class="h4 fw-bold mb-4">Nutrition Guide</h2>
                <p class="mb-4">Proper nutrition plays a crucial role in maintaining health and preventing disease. As
                  we age, our nutritional needs change, and it's important to adjust our diets accordingly.</p>

                <div class="row g-3 mb-4">
                  <div class="col-md-6">
                    <div class="card h-100 border-0 bg-light">
                      <div class="card-body">
                        <h5 class="card-title fw-bold">Essential Nutrients</h5>
                        <ul class="list-check">
                          <li><i class="bi bi-check2-circle text-success me-2"></i>Calcium and Vitamin D for bone health
                          </li>
                          <li><i class="bi bi-check2-circle text-success me-2"></i>Protein for muscle maintenance</li>
                          <li><i class="bi bi-check2-circle text-success me-2"></i>Fiber for digestive health</li>
                          <li><i class="bi bi-check2-circle text-success me-2"></i>Omega-3 fatty acids for heart health
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="card h-100 border-0 bg-light">
                      <div class="card-body">
                        <h5 class="card-title fw-bold">Hydration Tips</h5>
                        <ul class="list-check">
                          <li><i class="bi bi-check2-circle text-success me-2"></i>Drink water regularly throughout the
                            day</li>
                          <li><i class="bi bi-check2-circle text-success me-2"></i>Include water-rich foods like fruits
                            and vegetables</li>
                          <li><i class="bi bi-check2-circle text-success me-2"></i>Limit caffeine and alcohol intake
                          </li>
                          <li><i class="bi bi-check2-circle text-success me-2"></i>Monitor urine color for hydration
                            status</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button class="btn btn-primary">Download Meal Plan</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Exercise Programs Tab -->
          <div class="tab-pane fade" id="v-pills-exercise" role="tabpanel" aria-labelledby="v-pills-exercise-tab">
            <div class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <h2 class="h4 fw-bold mb-4">Exercise Programs</h2>
                <p class="mb-4">Regular physical activity is one of the most important things you can do for your
                  health. It can help control weight, reduce the risk of chronic diseases, improve mental health and
                  mood, and strengthen bones and muscles.</p>

                <div class="row g-4 mb-4">
                  <div class="col-md-6">
                    <div class="card h-100 border-0 shadow-sm hover-lift">
                      <div class="card-body">
                        <h5 class="card-title fw-bold d-flex align-items-center gap-2">
                          <i class="bi bi-person-walking text-primary"></i> Walking Programs
                        </h5>
                        <p class="card-text">Structured walking plans to improve cardiovascular health and maintain
                          mobility.</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="card h-100 border-0 shadow-sm hover-lift">
                      <div class="card-body">
                        <h5 class="card-title fw-bold d-flex align-items-center gap-2">
                          <i class="bi bi-yin-yang text-primary"></i> Balance Training
                        </h5>
                        <p class="card-text">Specialized exercises to improve balance and prevent falls.</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="card h-100 border-0 shadow-sm hover-lift">
                      <div class="card-body">
                        <h5 class="card-title fw-bold d-flex align-items-center gap-2">
                          <i class="bi bi-body-text text-primary"></i> Strength Training
                        </h5>
                        <p class="card-text">Resistance exercises to maintain muscle mass and bone density.</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="card h-100 border-0 shadow-sm hover-lift">
                      <div class="card-body">
                        <h5 class="card-title fw-bold d-flex align-items-center gap-2">
                          <i class="bi bi-heart-pulse text-primary"></i> Cardiac Rehabilitation
                        </h5>
                        <p class="card-text">Supervised exercise programs for individuals with heart conditions.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="alert alert-warning d-flex align-items-center" role="alert">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>
                    Consult with your healthcare provider before starting any new exercise program.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Medication Management Tab -->
          <div class="tab-pane fade" id="v-pills-medication" role="tabpanel" aria-labelledby="v-pills-medication-tab">
            <div class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <h2 class="h4 fw-bold mb-4">Medication Management</h2>
                <p class="mb-4">Proper medication management is crucial for those taking multiple medications. Our
                  comprehensive approach helps ensure safety, effectiveness, and adherence to prescribed treatment
                  plans.</p>

                <div class="row g-4 mb-4">
                  <div class="col-md-6">
                    <div class="card h-100 border-0 bg-light">
                      <div class="card-body">
                        <h5 class="card-title fw-bold">Key Components</h5>
                        <ul class="list-check">
                          <li><i class="bi bi-check2-circle text-success me-2"></i>Medication review and evaluation</li>
                          <li><i class="bi bi-check2-circle text-success me-2"></i>Drug interaction screening</li>
                          <li><i class="bi bi-check2-circle text-success me-2"></i>Dosage optimization</li>
                          <li><i class="bi bi-check2-circle text-success me-2"></i>Adherence monitoring</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="card h-100 border-0 bg-light">
                      <div class="card-body">
                        <h5 class="card-title fw-bold">Support Services</h5>
                        <ul class="list-check">
                          <li><i class="bi bi-check2-circle text-success me-2"></i>Medication organizers</li>
                          <li><i class="bi bi-check2-circle text-success me-2"></i>Reminder systems</li>
                          <li><i class="bi bi-check2-circle text-success me-2"></i>Pharmacist consultation</li>
                          <li><i class="bi bi-check2-circle text-success me-2"></i>Refill management</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button class="btn btn-primary">Request Medication Review</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Emergency Preparedness Tab -->
          <div class="tab-pane fade" id="v-pills-emergency" role="tabpanel" aria-labelledby="v-pills-emergency-tab">
            <div class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <h2 class="h4 fw-bold mb-4">Emergency Preparedness</h2>
                <p class="mb-4">Being prepared for emergencies is especially important. Our comprehensive emergency
                  preparedness program helps ensure safety and quick response in critical situations.</p>

                <div class="row g-4 mb-4">
                  <div class="col-md-6">
                    <div class="card h-100 border-0 shadow-sm hover-lift">
                      <div class="card-body">
                        <h5 class="card-title fw-bold d-flex align-items-center gap-2">
                          <i class="bi bi-shield-check text-primary"></i> Emergency Response System
                        </h5>
                        <p class="card-text">Wearable emergency alert devices that connect to 24/7 monitoring services.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="card h-100 border-0 shadow-sm hover-lift">
                      <div class="card-body">
                        <h5 class="card-title fw-bold d-flex align-items-center gap-2">
                          <i class="bi bi-telephone-inbound text-primary"></i> Emergency Contact List
                        </h5>
                        <p class="card-text">Comprehensive list of emergency numbers and family contacts.</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="card h-100 border-0 shadow-sm hover-lift">
                      <div class="card-body">
                        <h5 class="card-title fw-bold d-flex align-items-center gap-2">
                          <i class="bi bi-house-check text-primary"></i> Home Safety Assessment
                        </h5>
                        <p class="card-text">Professional evaluation of home environments to identify and mitigate
                          risks.</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="card h-100 border-0 shadow-sm hover-lift">
                      <div class="card-body">
                        <h5 class="card-title fw-bold d-flex align-items-center gap-2">
                          <i class="bi bi-bandaid text-primary"></i> First Aid Training
                        </h5>
                        <p class="card-text">Training programs for seniors and caregivers in basic emergency response
                          techniques.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="alert alert-danger d-flex align-items-center" role="alert">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>
                    Keep your emergency contact information easily accessible at all times.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Future logic for fetching articles can be added here
</script>

<style scoped>
.card-header h4 {
  margin-bottom: 0;
}

.card:hover {
  transform: translateY(-5px);
  transition: all 0.2s ease-in-out;
}

/* Add new styles for modern design */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.list-check li {
  margin-bottom: 0.5rem;
}
</style>
