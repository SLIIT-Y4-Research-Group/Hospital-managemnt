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

                // Calculate total stock count for pie chart
                const totalStock = stockItems.reduce((total, item) => total + item.quantity, 0);

                // Data for pie chart
                const drugNames = stockItems.map(item => item.drugName); // Extract drug names
                const percentages = stockItems.map(item => (item.quantity / totalStock) * 100); // Calculate percentage

                // Prepare pie chart options
                const pieOptions = {
                    series: percentages,
                    chart: {
                        width: '100%', // Make pie chart responsive
                        height: '350px', // Fixed height for better readability
                        type: 'pie',
                    },
                    labels: drugNames,
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

                // Render pie chart
                const pieChart = new ApexCharts(document.querySelector("#pie-chart"), pieOptions);
                pieChart.render();

                // Data for range bar chart (drug lifetime from manufacturing date to expiry date)
                const rangeBarSeries = stockItems.map(item => ({
                    name: item.drugName,
                    data: [
                        {
                            x: item.drugName,
                            y: [
                                new Date(item.manfDate).getTime(),
                                new Date(item.expireDate).getTime(),
                            ],
                        },
                    ],
                }));

                // Prepare range bar chart options
                const rangeBarOptions = {
                    series: rangeBarSeries,
                    chart: {
                        width: '100%', // Make range bar chart responsive
                        height: '350px', // Fixed height for better readability
                        type: 'rangeBar',
                    },
                    plotOptions: {
                        bar: {
                            horizontal: true,
                        },
                    },
                    xaxis: {
                        type: 'datetime',
                        title: {
                            text: 'Date',
                        },
                    },
                    yaxis: {
                        title: {
                            text: 'Drug Name',
                        },
                    },
                };

                // Render range bar chart
                const rangeBarChart = new ApexCharts(document.querySelector("#range-bar-chart"), rangeBarOptions);
                rangeBarChart.render();
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

    // Function to navigate to Doctors Report page
    const handleDoctorsReport = () => {
        navigate('/doctorsreport'); // Ensure this route exists in your app's routing configuration
    };

    // Get the current date
    const currentDate = new Date();

    return (
        <div className="stock-report-container">
            <h1>Stock Report</h1>

            {/* Container with white background for the chart and table */}
            <div className="report-content">
                {/* Charts side by side */}
                <div className="charts-container">
                    {/* Pie Chart */}
                    <div id="pie-chart" className="chart-container"></div>

                    {/* Range Bar Chart */}
                    <div id="range-bar-chart" className="chart-container"></div>
                </div>

                {/* Action buttons */}
                <div className="button-container">
                    <button className="add-stock-button" onClick={handleAddStock}>
                        + Add Stock
                    </button>
                    <button className="doctor-report-button" onClick={handleDoctorsReport}>
                        View Doctors Report
                    </button>
                </div>

                {/* Stock table */}
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
                            stocks.map(stock => {
                                const expireDate = new Date(stock.expireDate);
                                const daysToExpiry = (expireDate - currentDate) / (1000 * 60 * 60 * 24); // Days until expiry

                                // Determine row color based on expiry status
                                let rowClass = '';
                                if (daysToExpiry < 0) {
                                    rowClass = 'expired'; // Red for expired
                                } else if (daysToExpiry <= 5) {
                                    rowClass = 'expiring-soon'; // Yellow for soon-to-expire
                                }

                                return (
                                    <tr key={stock._id} className={rowClass}>
                                        <td>{stock.drugName}</td>
                                        <td>{new Date(stock.manfDate).toLocaleDateString()}</td>
                                        <td>{expireDate.toLocaleDateString()}</td>
                                        <td>{stock.price}</td>
                                        <td>{stock.quantity}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockReport;
