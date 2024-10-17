import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const StockSchema = new Schema({
    drugName: {
        type: String,
        required: true,
        trim: true
    },
    expireDate: {
        type: Date,
        required: true
    },
    manfDate: {  // Manufacturing Date
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true }); // Added timestamps here

const Stock = mongoose.model('Stock', StockSchema);

export default Stock;
