<template>
  <div class="appointment-booking">
    <div class="header">
      <h1>📅 Appointment Booking</h1>
      <p>Book your health consultation appointments with our medical professionals</p>
    </div>

    <!-- Booking Form -->
    <div class="booking-form" v-if="showBookingForm">
      <div class="form-overlay" @click="closeBookingForm"></div>
      <div class="form-content">
        <h3>Book Appointment</h3>
        <form @submit.prevent="submitBooking">
          <div class="form-group">
            <label>Patient Name:</label>
            <input v-model="bookingForm.patientName" type="text" required />
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input v-model="bookingForm.email" type="email" required />
          </div>
          <div class="form-group">
            <label>Phone:</label>
            <input v-model="bookingForm.phone" type="tel" required />
          </div>
          <div class="form-group">
            <label>Appointment Type:</label>
            <select v-model="bookingForm.type" required>
              <option value="">Select Type</option>
              <option value="General Consultation">General Consultation</option>
              <option value="Health Checkup">Health Checkup</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
          <div class="form-group">
            <label>Notes:</label>
            <textarea v-model="bookingForm.notes" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Selected Date & Time:</label>
            <input :value="formatSelectedDateTime" readonly />
          </div>
          <div class="form-actions">
            <button type="button" @click="closeBookingForm" class="btn-cancel">Cancel</button>
            <button type="submit" class="btn-submit">Book Appointment</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Calendar Container -->
    <div class="calendar-container">
      <div id="calendar"></div>
    </div>

    <!-- Appointments List -->
    <div class="appointments-list">
      <h3>📋 Upcoming Appointments</h3>
      <div v-if="appointments.length === 0" class="no-appointments">
        <p>No appointments scheduled</p>
      </div>
      <div v-else class="appointment-cards">
        <div
          v-for="appointment in upcomingAppointments"
          :key="appointment.id"
          class="appointment-card"
        >
          <div class="appointment-header">
            <h4>{{ appointment.title }}</h4>
            <span class="appointment-type">{{ appointment.extendedProps.type }}</span>
          </div>
          <div class="appointment-details">
            <p><strong>Patient:</strong> {{ appointment.extendedProps.patientName }}</p>
            <p><strong>Date:</strong> {{ formatDate(appointment.start) }}</p>
            <p><strong>Time:</strong> {{ formatTime(appointment.start) }}</p>
            <p><strong>Email:</strong> {{ appointment.extendedProps.email }}</p>
            <p><strong>Phone:</strong> {{ appointment.extendedProps.phone }}</p>
            <p v-if="appointment.extendedProps.notes">
              <strong>Notes:</strong> {{ appointment.extendedProps.notes }}
            </p>
          </div>
          <div class="appointment-actions">
            <button @click="cancelAppointment(appointment.id)" class="btn-cancel-appointment">
              ❌ Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  name: 'AppointmentBooking',
  data() {
    return {
      calendar: null,
      showBookingForm: false,
      selectedDateTime: null,
      appointments: [],
      bookingForm: {
        patientName: '',
        email: '',
        phone: '',
        type: '',
        notes: '',
      },
    }
  },
  computed: {
    formatSelectedDateTime() {
      if (!this.selectedDateTime) return ''
      return this.selectedDateTime.toLocaleString()
    },
    upcomingAppointments() {
      const now = new Date()
      return this.appointments
        .filter((apt) => new Date(apt.start) >= now)
        .sort((a, b) => new Date(a.start) - new Date(b.start))
    },
  },
  mounted() {
    this.initializeCalendar()
    this.loadAppointments()
  },
  methods: {
    initializeCalendar() {
      const calendarEl = document.getElementById('calendar')

      this.calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        },
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        events: this.appointments,

        // Handle date selection
        select: (selectInfo) => {
          this.handleDateSelect(selectInfo)
        },

        // Handle event click
        eventClick: (clickInfo) => {
          this.handleEventClick(clickInfo)
        },

        // Prevent selection of past dates
        selectConstraint: {
          start: new Date().toISOString().split('T')[0],
        },

        // Business hours constraint
        businessHours: {
          daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
          startTime: '09:00',
          endTime: '17:00',
        },

        // Styling
        eventColor: '#3788d8',
        eventTextColor: '#ffffff',
      })

      this.calendar.render()
    },

    handleDateSelect(selectInfo) {
      const selectedDate = selectInfo.start
      const now = new Date()

      // Prevent booking in the past
      if (selectedDate < now) {
        alert('Cannot book appointments in the past')
        this.calendar.unselect()
        return
      }

      // Check for conflicts
      const hasConflict = this.appointments.some((apt) => {
        const aptStart = new Date(apt.start)
        const aptEnd = new Date(apt.end)
        return selectedDate >= aptStart && selectedDate < aptEnd
      })

      if (hasConflict) {
        alert('This time slot is already booked. Please select another time.')
        this.calendar.unselect()
        return
      }

      this.selectedDateTime = selectedDate
      this.showBookingForm = true
    },

    handleEventClick(clickInfo) {
      const appointment = clickInfo.event
      const message = `Appointment Details:\n\nPatient: ${appointment.extendedProps.patientName}\nType: ${appointment.extendedProps.type}\nDate: ${this.formatDate(appointment.start)}\nTime: ${this.formatTime(appointment.start)}\n\nWould you like to cancel this appointment?`

      if (confirm(message)) {
        this.cancelAppointment(appointment.id)
      }
    },

    submitBooking() {
      if (!this.selectedDateTime) {
        alert('Please select a date and time')
        return
      }

      const appointmentId = Date.now().toString()
      const endDateTime = new Date(this.selectedDateTime.getTime() + 60 * 60 * 1000) // 1 hour duration

      const newAppointment = {
        id: appointmentId,
        title: `${this.bookingForm.type} - ${this.bookingForm.patientName}`,
        start: this.selectedDateTime.toISOString(),
        end: endDateTime.toISOString(),
        extendedProps: {
          patientName: this.bookingForm.patientName,
          email: this.bookingForm.email,
          phone: this.bookingForm.phone,
          type: this.bookingForm.type,
          notes: this.bookingForm.notes,
        },
      }

      this.appointments.push(newAppointment)
      this.calendar.addEvent(newAppointment)
      this.saveAppointments()

      // Reset form
      this.resetBookingForm()
      this.closeBookingForm()

      alert('Appointment booked successfully!')
    },

    cancelAppointment(appointmentId) {
      if (confirm('Are you sure you want to cancel this appointment?')) {
        this.appointments = this.appointments.filter((apt) => apt.id !== appointmentId)
        const event = this.calendar.getEventById(appointmentId)
        if (event) {
          event.remove()
        }
        this.saveAppointments()
        alert('Appointment cancelled successfully')
      }
    },

    closeBookingForm() {
      this.showBookingForm = false
      this.selectedDateTime = null
      this.resetBookingForm()
      this.calendar.unselect()
    },

    resetBookingForm() {
      this.bookingForm = {
        patientName: '',
        email: '',
        phone: '',
        type: '',
        notes: '',
      }
    },

    loadAppointments() {
      const saved = localStorage.getItem('healthAppointments')
      if (saved) {
        this.appointments = JSON.parse(saved)
        this.appointments.forEach((apt) => {
          this.calendar.addEvent(apt)
        })
      }
    },

    saveAppointments() {
      localStorage.setItem('healthAppointments', JSON.stringify(this.appointments))
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },

    formatTime(date) {
      return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
  },
}
</script>

<style scoped>
.appointment-booking {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.header p {
  color: #7f8c8d;
  font-size: 16px;
}

.calendar-container {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.booking-form {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.form-content {
  background: white;
  border-radius: 10px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}

.form-content h3 {
  margin-bottom: 20px;
  color: #2c3e50;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #34495e;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-cancel,
.btn-submit {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-cancel {
  background: #95a5a6;
  color: white;
}

.btn-cancel:hover {
  background: #7f8c8d;
}

.btn-submit {
  background: #27ae60;
  color: white;
}

.btn-submit:hover {
  background: #229954;
}

.appointments-list {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.appointments-list h3 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.no-appointments {
  text-align: center;
  color: #7f8c8d;
  padding: 40px;
}

.appointment-cards {
  display: grid;
  gap: 20px;
}

.appointment-card {
  border: 1px solid #ecf0f1;
  border-radius: 8px;
  padding: 20px;
  background: #f8f9fa;
}

.appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.appointment-header h4 {
  color: #2c3e50;
  margin: 0;
}

.appointment-type {
  background: #3498db;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.appointment-details p {
  margin: 5px 0;
  color: #34495e;
}

.appointment-actions {
  margin-top: 15px;
  text-align: right;
}

.btn-cancel-appointment {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s;
}

.btn-cancel-appointment:hover {
  background: #c0392b;
}

@media (max-width: 768px) {
  .appointment-booking {
    padding: 10px;
  }

  .form-content {
    width: 95%;
    padding: 20px;
  }

  .form-actions {
    flex-direction: column;
  }

  .appointment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
