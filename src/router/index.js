import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import HealthInfo from '../views/HealthInfo.vue'
import DigitalSkills from '../views/DigitalSkills.vue'
import About from '../views/About.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import EmailSender from '../views/EmailSender.vue'
import DataTables from '../views/DataTables.vue'
import ServerlessFunctions from '../views/ServerlessFunctions.vue'
import GeoLocation from '../views/GeoLocation.vue'
import AppointmentBooking from '../views/AppointmentBooking.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/health', name: 'HealthInfo', component: HealthInfo },
  { path: '/skills', name: 'DigitalSkills', component: DigitalSkills },
  { path: '/about', name: 'About', component: About },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/email', name: 'EmailSender', component: EmailSender },
  { path: '/tables', name: 'DataTables', component: DataTables },
  { path: '/serverless', name: 'ServerlessFunctions', component: ServerlessFunctions },
  { path: '/geolocation', name: 'GeoLocation', component: GeoLocation },
  { path: '/appointments', name: 'AppointmentBooking', component: AppointmentBooking },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
