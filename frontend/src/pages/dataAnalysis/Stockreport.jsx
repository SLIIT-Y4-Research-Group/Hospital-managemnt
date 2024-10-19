import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ApexCharts from 'apexcharts';
import './StockReport.css'; // To style the page

const StockReport = () => {
    const [stocks, setStocks] = useState([]);
    const navigate = useNavigate();

    // Fetch all stock details
    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/stocks/all'); // Replace with actual backend URL
                const stockItems = response.data;
                setStocks(stockItems);

                // Calculate total stock count for chart
                const totalStock = stockItems.reduce((total, item) => total + item.quantity, 0);

                // Map data for chart
                const drugNames = stockItems.map(item => item.drugName); // Extract drug names
                const percentages = stockItems.map(item => (item.quantity / totalStock) * 100); // Calculate percentage

                // Prepare chart options
                const options = {
                    series: percentages,
                    chart: {
                        width: '70%', // Reduce the width
                        height: '70%', // Reduce the height
                        type: 'pie',
                    },
                    labels: drugNames,  // Use drug names as labels
                    theme: {
                        monochrome: {
                            enabled: true,
                        },
                    },
                    plotOptions: {
                        pie: {
                            dataLabels: {
                                offset: -5,
                            },
                        },
                    },
                    grid: {
                        padding: {
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        },
                    },
                    dataLabels: {
                        formatter(val, opts) {
                            const name = opts.w.globals.labels[opts.seriesIndex];
                            return [name, val.toFixed(1) + '%'];
                        },
                    },
                    legend: {
                        show: false,
                    },
                };

                // Render chart with updated options
                const chart = new ApexCharts(document.querySelector("#chart"), options);
                chart.render();
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

            {/* Container with white background for the chart and table */}
            <div className="report-content">
                {/* Pie Chart */}
                <div id="chart" className="chart-container"></div>

                {/* Space between chart and table */}
                <div className="chart-space"></div>

                {/* Stock table */}
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
        </div>
    );
};

export default StockReport;
