import Stock from '../models/StockModel.js'; // Assuming the Stock model is correctly named

// Add a new stock item
const addStock = async (req, res) => {
    try {
        const { drugName, expireDate, manfDate, price, quantity } = req.body;

        const newStock = new Stock({
            drugName,
            expireDate,
            manfDate,
            price,
            quantity
        });

        await newStock.save();
        res.json('Stock added successfully');
    } catch (err) {
        res.status(400).json('Error: ' + err.message);
    }
};

// Get all stock items
const getAllStock = async (req, res) => {
    try {
        const stockItems = await Stock.find();
        if (!stockItems.length) {
            return res.status(404).json('No stock items found');
        }
        res.json(stockItems);
    } catch (err) {
        res.status(400).json('Error: ' + err.message);
    }
};

// Get stock item by ID
const getStockById = async (req, res) => {
    try {
        const { id } = req.params;
        const stockItem = await Stock.findById(id);
        if (!stockItem) {
            return res.status(404).json('Stock item not found');
        }
        res.json(stockItem);
    } catch (err) {
        res.status(400).json('Error: ' + err.message);
    }
};

// Update stock item by ID
const updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { drugName, expireDate, manfDate, price, quantity } = req.body;

        const stockItem = await Stock.findById(id);
        if (!stockItem) {
            return res.status(404).json('Stock item not found');
        }

        // Update fields if provided
        if (drugName) stockItem.drugName = drugName;
        if (expireDate) stockItem.expireDate = expireDate;
        if (manfDate) stockItem.manfDate = manfDate;
        if (price) stockItem.price = price;
        if (quantity) stockItem.quantity = quantity;

        await stockItem.save();
        res.json('Stock updated successfully');
    } catch (err) {
        res.status(400).json('Error: ' + err.message);
    }
};

export default {
    addStock,
    getAllStock,
    getStockById,
    updateStock
};
