import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import api from '../config/api';
import PDF from '../components/reportPDF';
import Sidebar from './verticalNavBar'; // Import the Sidebar component
import backgroundImage from '../assets/background.png';
import medicalLogo from '../assets/logo.jpg'; // Replace with your logo path

const AllCrops = () => {
    const [crops, setCrops] = useState([]);
    const [search, setSearch] = useState([]);
    const [selectedCrop, setSelectedCrop] = useState(null); // State to track the selected crop
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/myReports').then((response) => {
            const crops = response.data;
            setCrops(crops);
            setSearch(crops);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    const togglePopupFretilizer = (crop) => {
        setSelectedCrop(crop); // Set the selected crop
    };

    const deleteCrop = async (id) => {
        try {
            await api.delete('/Report/delete/' + id);
        } catch (error) {
            console.log(error);
        }
    };

    const updateCrop = async (id) => {
        navigate(`/updateCrop/${id}`);
    };

    const filter = (e) => {
        setSearch(
            crops.filter((f) =>
                f.CropName.toLowerCase().includes(e.target.value.toLowerCase())
            )
        );
    };

    return (
        <div
            className="flex min-h-screen"
            style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            {/* Fixed Sidebar */}
            <div className="fixed mt-20">
                <Sidebar />
            </div>
            <div className="flex-1 ml-72 p-6 bg-white bg-opacity-90 rounded-lg shadow-lg mt-10 mr-10">
                <header className="mb-6">
                    <h2 className='text-3xl font-bold text-gray-800'>My Test Records</h2>
                    <h4 className='text-gray-600'>View & manage all test records</h4>
                </header>
                <div className="mb-6">
                    <input
                        type="text"
                        className="h-12 w-1/3 p-3 border-2 border-blue-500 shadow-md bg-slate-50 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={filter}
                        placeholder="Search Record"
                    />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {search.map((crop) => (
                        <div
                            className="p-5 border-2 border-blue-800 shadow-md bg-blue-500 text-white rounded-lg transition-transform transform hover:scale-105"
                            key={crop._id}
                        >
                            <h3 className='font-bold text-xl mb-3'>{crop.CropName}</h3>
                            <p>Date: {new Date(crop.createdAt).toLocaleDateString()}</p>
                            <div className='mt-5'>
                                <button
                                    className="bg-white hover:bg-blue-400 text-black font-bold py-2 px-4 rounded inline-flex items-center transition-colors duration-300"
                                    onClick={() => togglePopupFretilizer(crop)} // Pass the crop to the function
                                >
                                    <span>View</span>
                                </button>
                                <button
                                    className="bg-red-500 ml-4 hover:bg-red-800 text-white font-bold py-2 px-4 rounded inline-flex items-center transition-colors duration-300"
                                    onClick={() => deleteCrop(crop._id)} // Pass the crop to the function
                                >
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Popup Modal */}
                {selectedCrop && (
                    <div className="overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setSelectedCrop(null)}>
                        <div className="popup bg-white rounded-lg p-5 shadow-lg" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center mb-4">
                                <img src={medicalLogo} alt="Medical Logo" className="w-12 h-12 mr-3" />
                                <div>
                                    <h3 className='text-2xl font-bold'>MediCare</h3>
                                    <p className='text-gray-700'>Address: 123 Medical St, Health City</p>
                                    <p className='text-gray-700'>Contact: (123) 456-7890</p>
                                </div>
                            </div>
                            <div className="modal_info">
                                <h2 className='mb-4 border-b-2 text-xl'>Medical Record</h2>
                                <div className='info'>
                                    <h6>Id: <span className='text-gray-700'>{selectedCrop._id}</span></h6>
                                    <h6>Patient Name: <span className='text-gray-700'>{selectedCrop.SoilType}</span></h6>
                                    <h6>Test Type: <span className='text-gray-700'>{selectedCrop.CropName}</span></h6>
                                    <h6>Test Name: <span className='text-gray-700'>{selectedCrop.ScientificName}</span></h6>
                                    <h6>Result: <span className='text-gray-700'>{selectedCrop.Location}</span></h6>
                                    <h6>Date: <span className='text-gray-700'>{selectedCrop.GrowthStage}</span></h6>
                                    <h6>Comment: <span className='text-gray-700'>{selectedCrop.SoilpHLevel}</span></h6>
                                </div>
                            </div>
                            <button className="mt-4 bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600" onClick={() => setSelectedCrop(null)}>Close</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default AllCrops;
