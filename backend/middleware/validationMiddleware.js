import Joi from "joi";
import { validationResult, body, param, query } from "express-validator";
import mongoSanitize from "mongoose-sanitize";


// GENERAL VALIDATION MIDDLEWARE



export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};


export const sanitizeInputs = (req, res, next) => {
  req.body = mongoSanitize(req.body);
  req.params = mongoSanitize(req.params);
  req.query = mongoSanitize(req.query);
  next();
};


// APPOINTMENT VALIDATION SCHEMAS


export const validateAppointment = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2-50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2-50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),

  body("contactNumber")
    .trim()
    .notEmpty()
    .withMessage("Contact number is required")
    .matches(/^[0-9\+\-\s\(\)]{10,15}$/)
    .withMessage("Contact number must be valid (10-15 digits)"),

  body("nic")
    .trim()
    .notEmpty()
    .withMessage("NIC is required")
    .matches(/^([0-9]{9}[vVxX]|[0-9]{12})$/)
    .withMessage(
      "NIC must be valid Sri Lankan format (9 digits + V/X or 12 digits)"
    ),

  body("hospital")
    .trim()
    .notEmpty()
    .withMessage("Hospital is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Hospital name must be between 2-100 characters"),

  body("gender")
    .trim()
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),

  body("appointmentDate")
    .notEmpty()
    .withMessage("Appointment date is required")
    .isISO8601()
    .withMessage("Appointment date must be a valid date")
    .custom((value) => {
      const appointmentDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (appointmentDate < today) {
        throw new Error("Appointment date cannot be in the past");
      }

      // Check if appointment is within 3 months
      const threeMonthsFromNow = new Date();
      threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

      if (appointmentDate > threeMonthsFromNow) {
        throw new Error(
          "Appointment date cannot be more than 3 months in advance"
        );
      }

      return true;
    }),

  body("appointmentTime")
    .trim()
    .notEmpty()
    .withMessage("Appointment time is required")
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Appointment time must be in HH:MM format"),

  body("doctor")
    .trim()
    .notEmpty()
    .withMessage("Doctor is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Doctor name must be between 2-100 characters"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 10, max: 200 })
    .withMessage("Address must be between 10-200 characters"),

  body("reasonForVisit")
    .trim()
    .notEmpty()
    .withMessage("Reason for visit is required")
    .isLength({ min: 5, max: 500 })
    .withMessage("Reason for visit must be between 5-500 characters"),

  body("status")
    .optional()
    .trim()
    .isIn(["pending", "confirmed", "completed", "cancelled"])
    .withMessage("Status must be pending, confirmed, completed, or cancelled"),

  body("user_id")
    .trim()
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("User ID must be a valid MongoDB ObjectId"),

  checkValidationResult,
];


// STOCK VALIDATION


export const validateStock = [
  body("drugName")
    .trim()
    .notEmpty()
    .withMessage("Drug name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Drug name must be between 2-100 characters")
    .matches(/^[a-zA-Z0-9\s\-\.]+$/)
    .withMessage(
      "Drug name can only contain letters, numbers, spaces, hyphens, and dots"
    ),

  body("expireDate")
    .notEmpty()
    .withMessage("Expire date is required")
    .isISO8601()
    .withMessage("Expire date must be a valid date")
    .custom((value) => {
      const expireDate = new Date(value);
      const today = new Date();

      if (expireDate <= today) {
        throw new Error("Expire date must be in the future");
      }
      return true;
    }),

  body("manfDate")
    .notEmpty()
    .withMessage("Manufacturing date is required")
    .isISO8601()
    .withMessage("Manufacturing date must be a valid date")
    .custom((value, { req }) => {
      const manfDate = new Date(value);
      const expireDate = new Date(req.body.expireDate);
      const today = new Date();

      if (manfDate > today) {
        throw new Error("Manufacturing date cannot be in the future");
      }

      if (manfDate >= expireDate) {
        throw new Error("Manufacturing date must be before expire date");
      }
      return true;
    }),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0.01, max: 999999.99 })
    .withMessage("Price must be a positive number between 0.01 and 999999.99"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1, max: 99999 })
    .withMessage("Quantity must be a positive integer between 1 and 99999"),

  checkValidationResult,
];


// TREATMENT VALIDATION SCHEMAS


export const validateTreatment = [
  body("CropName")
    .trim()
    .notEmpty()
    .withMessage("Crop name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Crop name must be between 2-100 characters"),

  body("ScientificName")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Scientific name cannot exceed 150 characters"),

  body("Location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Location must be between 2-100 characters"),

  body("Temperature")
    .optional()
    .isFloat({ min: -50, max: 70 })
    .withMessage("Temperature must be between -50°C and 70°C"),

  body("RainFall")
    .optional()
    .isFloat({ min: 0, max: 10000 })
    .withMessage("Rainfall must be between 0 and 10000mm"),

  body("SoilpHLevel")
    .optional()
    .isFloat({ min: 0, max: 14 })
    .withMessage("Soil pH level must be between 0 and 14"),

  body("CropArea")
    .optional()
    .isFloat({ min: 0.01, max: 999999 })
    .withMessage("Crop area must be a positive number"),

  checkValidationResult,
];


// ID PARAMETER VALIDATION


export const validateMongoId = [
  param("id").isMongoId().withMessage("Invalid ID format"),
  checkValidationResult,
];

export const validateUserId = [
  param("userId").isMongoId().withMessage("Invalid user ID format"),
  checkValidationResult,
];


// QUERY PARAMETER VALIDATION


export const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage("Page must be between 1 and 1000"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  checkValidationResult,
];


// SEARCH VALIDATION


export const validateSearch = [
  query("search")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search term must be between 1-100 characters")
    .matches(/^[a-zA-Z0-9\s\-\.]+$/)
    .withMessage(
      "Search term can only contain letters, numbers, spaces, hyphens, and dots"
    ),

  checkValidationResult,
];


// EMAIL VALIDATION


export const validateEmail = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),

  checkValidationResult,
];


// CUSTOM VALIDATION FUNCTIONS



export const validateWithJoi = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        })),
      });
    }

    req.body = value; 
    next();
  };
};
