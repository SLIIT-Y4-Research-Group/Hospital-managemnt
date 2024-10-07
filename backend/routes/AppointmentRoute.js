import express from 'express';
import AppointmentController from '../controllers/AppointmentController.js'; // Adjust the path as needed

const router = express.Router();

// Routes for appointments
router.route('/add').post(AppointmentController.addAppointment); // Add an appointment
router.route('/all').get(AppointmentController.getAllAppointments); // Get all appointments
router.route('/:id').get(AppointmentController.getAppointmentById); // Get an appointment by ID
router.route('/:id').delete(AppointmentController.deleteAppointment); // Delete an appointment by ID
router.route('/:id').put(AppointmentController.updateAppointment); // Update an appointment by ID

export default router;
