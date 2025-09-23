import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../config/api';
import Spinner from '../../components/Spinner';
import backgroundImage from '../../assets/blue_bg.jpg'; // Import the background image
import BackButton from '../../components/BackButton';

const ViewStocks = () => {
    const { id } = useParams(); // Get the stock ID from the URL
    const [stock, setStock] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        api
            .get(`/stocks/${id}`) // Adjust the API URL as needed
            .then((response) => {
                setStock(response.data); // Adjust according to your API response structure
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [id]);

    return (
        <div 
            className='p-4 h-screen flex items-center justify-center'
            style={{
                backgroundColor: '#d1ffbd', // Background color
                backgroundImage: `url(${backgroundImage})`, // Background image
                backgroundSize: 'cover', // Cover the whole container
                backgroundPosition: 'center', // Center the background image
            }}
        >
            <div className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4 bg-white shadow-lg'>
                <h1 className='text-3xl mb-4 text-center'>View Stock Details</h1>
                <BackButton destination='/stocks' /> {/* Adjust the destination path as needed */}
                {loading ? (
                    <Spinner />
                ) : (
                    <>
                        <div className='my-4'>
                            <span className='text-xl mr-4 text-gray-500'>Id:</span>
                            <span>{id}</span> {/* Displaying the ID directly */}
                        </div>
                        <div className='my-4'>
                            <span className='text-xl mr-4 text-gray-500'>Drug Name:</span>
                            <span>{stock.drugName || 'N/A'}</span>
                        </div>
                        <div className='my-4'>
                            <span className='text-xl mr-4 text-gray-500'>Manufacturing Date:</span>
                            <span>{stock.manfDate ? new Date(stock.manfDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div className='my-4'>
                            <span className='text-xl mr-4 text-gray-500'>Expiry Date:</span>
                            <span>{stock.expireDate ? new Date(stock.expireDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div className='my-4'>
                            <span className='text-xl mr-4 text-gray-500'>Price:</span>
                            <span>${stock.price || 'N/A'}</span>
                        </div>
                        <div className='my-4'>
                            <span className='text-xl mr-4 text-gray-500'>Quantity:</span>
                            <span>{stock.quantity || 'N/A'}</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ViewStocks;
