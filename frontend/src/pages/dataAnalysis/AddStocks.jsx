import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import './AddStocks.css';

const AddStocks = () => {
  const [stockData, setStockData] = useState({
    drugName: '',
    expireDate: '',
    manfDate: '',
    price: '',
    quantity: ''
  });
  const [message, setMessage] = useState('');

  // Fetch CSRF token once. Axios will then auto-include it via xsrfCookieName/xsrfHeaderName.
  useEffect(() => {
    (async () => {
      try {
        await api.get('/csrf-token'); // sets cookies + returns token
      } catch (err) {
        setMessage('Error fetching CSRF token');
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStockData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/stocks/add', stockData);
      setMessage('Stock added successfully!');
      setStockData({ drugName: '', expireDate: '', manfDate: '', price: '', quantity: '' });
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      setMessage('Error adding stock: ' + msg);
    }
  };

  return (
    <div className="add-stock-container">
      <h1>Add Stock</h1>
      <form onSubmit={handleSubmit} className="stock-form">
        <label htmlFor="drugName">Drug Name:</label>
        <input id="drugName" name="drugName" value={stockData.drugName} onChange={handleChange} required />

        <label htmlFor="manfDate">Manufacturing Date:</label>
        <input type="date" id="manfDate" name="manfDate" value={stockData.manfDate} onChange={handleChange} required />

        <label htmlFor="expireDate">Expiry Date:</label>
        <input type="date" id="expireDate" name="expireDate" value={stockData.expireDate} onChange={handleChange} required />

        <label htmlFor="price">Price:</label>
        <input type="number" id="price" name="price" value={stockData.price} onChange={handleChange} min="0" required />

        <label htmlFor="quantity">Quantity:</label>
        <input type="number" id="quantity" name="quantity" value={stockData.quantity} onChange={handleChange} min="0" required />

        <button type="submit">Add Stock</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AddStocks;
