import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../../components/Spinner';

const ViewStocks = () => {
    const { id } = useParams(); // Get the stock ID from the URL
    const [stock, setStock] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStockById = async () => {
            try {
                console.log('Fetching stock with ID:', id); // Log the stock ID
                const response = await axios.get(`http://localhost:5000/stocks/${id}`);
                console.log('Stock data fetched:', response.data); // Log the response data
                setStock(response.data); // Set the stock item data
            } catch (error) {
                console.error('Error fetching stock item:', error.message);
                setError('Error fetching stock item: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStockById();
    }, [id]);

    return (
        <div className='min-h-screen p-6' style={{ backgroundImage: "url('/assets/blue_bg.jpg')", backgroundSize: 'cover' }}>
            <h1 className="text-4xl font-bold text-white mb-6">Stock Item Details</h1>

            {loading ? (
                <Spinner /> // Show loading spinner
            ) : error ? (
                <div className="text-red-500">{error}</div> // Show error if there is one
            ) : stock ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-blue-800 mb-4">{stock.itemName || 'N/A'}</h2>
                    <p><strong>Stock ID:</strong> {stock._id || 'N/A'}</p>
                    <p><strong>Quantity:</strong> {stock.quantity || 'N/A'}</p>
                    <p><strong>Price:</strong> ${stock.price || 'N/A'}</p>
                    <p><strong>Supplier:</strong> {stock.supplier || 'N/A'}</p>
                    <p><strong>Category:</strong> {stock.category || 'N/A'}</p>
                    <p><strong>Description:</strong> {stock.description || 'N/A'}</p>
                </div>
            ) : (
                <div className="text-white">Stock item not found</div> // Show if stock is not found
            )}
        </div>
    );
};

export default ViewStocks;
