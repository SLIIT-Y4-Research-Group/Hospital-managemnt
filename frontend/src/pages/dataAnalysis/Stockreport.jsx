import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // To navigate to Add Stocks page
import './StockReport.css'; // To style the page

const StockReport = () => {
    const [stocks, setStocks] = useState([]);
    const navigate = useNavigate();

    // Fetch all stock details
    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/stocks/all'); // Replace <your_port> with the actual backend port
                setStocks(response.data);
            } catch (error) {
                console.error("Error fetching stock data:", error);
            }
        };

        fetchStocks();
    }, []);

    // Function to navigate to Add Stocks page
    const handleAddStock = () => {
        navigate('/addstock'); // Ensure this route exists in your app's routing configuration
    };

    return (
        <div className="stock-report-container">
            <h1>Stock Report</h1>
            <button className="add-stock-button" onClick={handleAddStock}>
                + Add Stock
            </button>
            <table className="stock-table">
                <thead>
                    <tr>
                        <th>Drug Name</th>
                        <th>Manufacturing Date</th>
                        <th>Expiry Date</th>
                        <th>Price</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.length === 0 ? (
                        <tr>
                            <td colSpan="5">No stock details available</td>
                        </tr>
                    ) : (
                        stocks.map(stock => (
                            <tr key={stock._id}>
                                <td>{stock.drugName}</td>
                                <td>{new Date(stock.manfDate).toLocaleDateString()}</td>
                                <td>{new Date(stock.expireDate).toLocaleDateString()}</td>
                                <td>{stock.price}</td>
                                <td>{stock.quantity}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StockReport;
