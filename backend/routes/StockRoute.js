import express from "express";
import StockController from "../controllers/StockController.js"; // Adjust the path as needed
import {
  authenticateToken,
  requireStaffOrAdmin,
} from "../middleware/authMiddleware.js";
import {
  validateStock,
  validateMongoId,
  sanitizeInputs,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

// Apply sanitization to all routes
router.use(sanitizeInputs);

// Routes for stock with validation
router
  .route("/add")
  .post(
    authenticateToken,
    requireStaffOrAdmin,
    validateStock,
    StockController.addStock
  ); // Add a stock item (staff/admin only with validation)

router.route("/all").get(authenticateToken, StockController.getAllStock); // Get all stock items (authenticated users)

router
  .route("/:id")
  .get(authenticateToken, validateMongoId, StockController.getStockById); // Get a stock item by ID (authenticated users with ID validation)

router
  .route("/:id")
  .put(
    authenticateToken,
    requireStaffOrAdmin,
    validateMongoId,
    validateStock,
    StockController.updateStock
  ); // Update a stock item by ID (staff/admin only with validation)

export default router;
