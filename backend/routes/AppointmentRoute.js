import express from "express";
import AppointmentController from "../controllers/AppointmentController.js";
import {
  authenticateToken,
  requireAdmin,
  requireStaffOrAdmin,
  requirePatientDoctorOrAdmin,
} from "../middleware/authMiddleware.js";
import {
  validateAppointment,
  validateMongoId,
  validateUserId,
  sanitizeInputs,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

// Apply sanitization to all routes
router.use(sanitizeInputs);

// Routes for appointments
router
  .route("/add")
  .post(
    authenticateToken,
    validateAppointment,
    AppointmentController.addAppointment
  );

router
  .route("/all")
  .get(
    authenticateToken,
    requireStaffOrAdmin,
    AppointmentController.getAllAppointments
  ); // Get all appointments (staff/admin only)

router
  .route("/:id")
  .get(
    authenticateToken,
    validateMongoId,
    AppointmentController.getAppointmentById
  ); // Get an appointment by ID (authenticated users with ID validation)

router
  .route("/:id")
  .delete(
    authenticateToken,
    requireStaffOrAdmin,
    validateMongoId,
    AppointmentController.deleteAppointment
  ); // Delete an appointment by ID (staff/admin only with ID validation)

router
  .route("/:id")
  .put(
    authenticateToken,
    validateMongoId,
    validateAppointment,
    AppointmentController.updateAppointment
  ); // Update an appointment by ID (authenticated users with validation)

router.get(
  "/user/:userId",
  authenticateToken,
  validateUserId,
  AppointmentController.getAppointmentsByUserId
); // Get appointments by user ID (authenticated users with user ID validation)

export default router;
