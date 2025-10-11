import Stock from "../models/StockModel.js"; 


const addStock = async (req, res) => {
  try {
    
    const { drugName, expireDate, manfDate, price, quantity } = req.body;

    
    const manufacturingDate = new Date(manfDate);
    const expirationDate = new Date(expireDate);
    const today = new Date();

    
    if (manufacturingDate >= expirationDate) {
      return res.status(400).json({
        message: "Manufacturing date must be before expiration date",
      });
    }

    if (expirationDate <= today) {
      return res.status(400).json({
        message: "Expiration date must be in the future",
      });
    }

   
    const existingStock = await Stock.findOne({
      drugName: { $regex: new RegExp(`^${drugName.trim()}$`, "i") },
    });

    if (existingStock) {
      return res.status(409).json({
        message: "Stock item with this drug name already exists",
        suggestion: "Consider updating the existing stock quantity instead",
      });
    }

    const newStock = new Stock({
      drugName: drugName.trim(),
      expireDate,
      manfDate,
      price: parseFloat(price),
      quantity: parseInt(quantity),
    });

    await newStock.save();

    res.status(201).json({
      message: "Stock added successfully",
      stockId: newStock._id,
      stock: {
        id: newStock._id,
        drugName: newStock.drugName,
        quantity: newStock.quantity,
        price: newStock.price,
        expireDate: newStock.expireDate,
      },
    });
  } catch (err) {
    console.error("Stock creation error:", err);

    // Handle specific MongoDB errors
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Duplicate stock item detected",
        error: "A stock item with similar details already exists",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Database validation failed",
        errors: Object.values(err.errors).map((e) => e.message),
      });
    }

    res.status(500).json({
      message: "Internal server error while creating stock item",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
    });
  }
};


const getAllStock = async (req, res) => {
  try {
    const stockItems = await Stock.find();
    if (!stockItems.length) {
      return res.status(404).json({
        message: "No stock items found",
      });
    }

    res.status(200).json({
      message: "Stock items retrieved successfully",
      count: stockItems.length,
      stocks: stockItems,
    });
  } catch (err) {
    console.error("Get all stock error:", err);
    res.status(500).json({
      message: "Internal server error while retrieving stock items",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
    });
  }
};


const getStockById = async (req, res) => {
  try {
    const { id } = req.params;
    const stockItem = await Stock.findById(id);
    if (!stockItem) {
      return res.status(404).json("Stock item not found");
    }
    res.json(stockItem);
  } catch (err) {
    res.status(400).json("Error: " + err.message);
  }
};


const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { drugName, expireDate, manfDate, price, quantity } = req.body;

    const stockItem = await Stock.findById(id);
    if (!stockItem) {
      return res.status(404).json("Stock item not found");
    }
    if (drugName) stockItem.drugName = drugName;
    if (expireDate) stockItem.expireDate = expireDate;
    if (manfDate) stockItem.manfDate = manfDate;
    if (price) stockItem.price = price;
    if (quantity) stockItem.quantity = quantity;

    await stockItem.save();
    res.json("Stock updated successfully");
  } catch (err) {
    res.status(400).json("Error: " + err.message);
  }
};

export default {
  addStock,
  getAllStock,
  getStockById,
  updateStock,
};
