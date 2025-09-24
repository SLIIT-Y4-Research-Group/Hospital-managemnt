import express from 'express';
import AppointmentController from '../controllers/AppointmentController.js'; // Adjust the path as needed
import { authenticateToken, requireAdmin, requireStaffOrAdmin, requirePatientDoctorOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes for appointments
router.route('/add').post(authenticateToken, AppointmentController.addAppointment); // Add an appointment (authenticated users)
router.route('/all').get(authenticateToken, requireStaffOrAdmin, AppointmentController.getAllAppointments); // Get all appointments (staff/admin only)
router.route('/:id').get(authenticateToken, AppointmentController.getAppointmentById); // Get an appointment by ID (authenticated users)
router.route('/:id').delete(authenticateToken, requireStaffOrAdmin, AppointmentController.deleteAppointment); // Delete an appointment by ID (staff/admin only)
router.route('/:id').put(authenticateToken, AppointmentController.updateAppointment); // Update an appointment by ID (authenticated users)
router.get('/user/:userId', authenticateToken, AppointmentController.getAppointmentsByUserId); // Get appointments by user ID (authenticated users)

export default router;
