import express from 'express';
import StockController from '../controllers/StockController.js'; // Adjust the path as needed

const router = express.Router();

// Routes for stock
router.route('/add').post(StockController.addStock); // Add a stock item
router.route('/all').get(StockController.getAllStock); // Get all stock items
router.route('/:id').get(StockController.getStockById); // Get a stock item by ID
router.route('/:id').put(StockController.updateStock); // Update a stock item by ID

export default router;
