import express from 'express';
import StockController from '../controllers/StockController.js';

const router = express.Router();

// POST/PUT are already CSRF-protected by the global guard in app.js
router.post('/add', StockController.addStock);
router.get('/all',  StockController.getAllStock);
router.get('/:id',  StockController.getStockById);
router.put('/:id',  StockController.updateStock);

export default router;
