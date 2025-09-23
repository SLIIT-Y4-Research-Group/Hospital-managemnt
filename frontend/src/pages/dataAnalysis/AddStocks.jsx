import React, { useState } from 'react';
import api from '../../config/api';
import './AddStocks.css'; // Add custom styles for the page

const AddStocks = () => {
    const [stockData, setStockData] = useState({
        drugName: '',
        expireDate: '',
        manfDate: '',
        price: '',
        quantity: ''
    });

    const [message, setMessage] = useState('');

    // Handle input changes
    const handleChange = (e) => {
        setStockData({
            ...stockData,
            [e.target.name]: e.target.value
        });
    };

    // Submit stock data to backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/stocks/add', stockData); // Replace <your_port> with the actual backend port
            setMessage('Stock added successfully!',response);
            setStockData({
                drugName: '',
                expireDate: '',
                manfDate: '',
                price: '',
                quantity: ''
            });
        } catch (error) {
            setMessage('Error adding stock: ' + error.message);
        }
    };

    return (
        <div className="add-stock-container">
            <h1>Add Stock</h1>
            <form onSubmit={handleSubmit} className="stock-form">
                <label htmlFor="drugName">Drug Name:</label>
                <input
                    type="text"
                    id="drugName"
                    name="drugName"
                    value={stockData.drugName}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="manfDate">Manufacturing Date:</label>
                <input
                    type="date"
                    id="manfDate"
                    name="manfDate"
                    value={stockData.manfDate}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="expireDate">Expiry Date:</label>
                <input
                    type="date"
                    id="expireDate"
                    name="expireDate"
                    value={stockData.expireDate}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="price">Price:</label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    value={stockData.price}
                    onChange={handleChange}
                    min="0"
                    required
                />

                <label htmlFor="quantity">Quantity:</label>
                <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={stockData.quantity}
                    onChange={handleChange}
                    min="0"
                    required
                />

                <button type="submit">Add Stock</button>
            </form>

            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default AddStocks;
