import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import api from '../config/api';
import PDF from '../components/reportPDF';
import Sidebar from './verticalNavBar'; // Import the Sidebar component
import backgroundImage from '../assets/background.png';
import medicalLogo from '../assets/logo.jpg'; // Replace with your logo path

const AllTreatment = () => {
    const [treatments, setTreatments] = useState([]);
    const [search, setSearch] = useState([]);
    const [selectedTreatment, setSelectedTreatment] = useState(null); // State to track the selected treatment
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/myTreatment').then((response) => {
            const treatments = response.data;
            setTreatments(treatments);
            setSearch(treatments);
        }).catch((err) => {
            console.log(err);
        });
    }, [treatments]);

    const togglePopupFertilizer = (treatment) => {
        setSelectedTreatment(treatment); // Set the selected treatment
    };

    const deleteTreatment = async (id) => {
        try {
            await api.delete('/Treatment/delete/' + id);
        } catch (error) {
            console.log(error);
        }
    };

    const updateTreatment = async (id) => {
        navigate(`/updateTreatment/${id}`);
    };

    const filter = (e) => {
        setSearch(
            treatments.filter((f) =>
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
                    <h2 className='text-3xl font-bold text-gray-800'>My Treatment Records</h2>
                    <h4 className='text-gray-600'>View & manage all treatment records</h4>
                </header>
                <div className="mb-6">
                    <input
                        type="text"
                        className="h-12 w-1/3 p-3 border-2 border-blue-500 shadow-md bg-slate-50 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        onChange={filter}
                        placeholder="Search Record"
                    />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {search.map((treatment) => (
                        <div
                            className="p-5 border-2 border-blue-700 shadow-md bg-blue-500 text-white rounded-lg transition-transform transform hover:scale-105"
                            key={treatment._id}
                        >
                            <h3 className='font-bold text-xl mb-3'>{treatment.CropName}</h3>
                            <p>Date: {new Date(treatment.createdAt).toLocaleDateString()}</p>
                            <div className='mt-5'>
                                <button
                                    className="bg-white hover:bg-blue-500 text-black font-bold py-2 px-4 rounded inline-flex items-center transition-colors duration-300"
                                    onClick={() => togglePopupFertilizer(treatment)} // Pass the treatment to the function
                                >
                                    <span>View</span>
                                </button>
                                <button
                                    className="bg-red-500 ml-4 hover:bg-red-800 text-white font-bold py-2 px-4 rounded inline-flex items-center transition-colors duration-300"
                                    onClick={() => deleteTreatment(treatment._id)} // Pass the crop to the function
                                >
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Popup Modal */}
                {selectedTreatment && (
                    <div className="overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setSelectedTreatment(null)}>
                        <div className="popup bg-white rounded-lg p-5 shadow-lg" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center mb-4">
                                <img src={medicalLogo} alt="Medical Logo" className="w-12 h-12 mr-3" />
                                <div>
                                    <h3 className='text-2xl font-bold'>Medicare</h3>
                                    <p className='text-gray-700'>Address: 123 Medical St, Health City</p>
                                    <p className='text-gray-700'>Contact: (123) 456-7890</p>
                                </div>
                            </div>
                            <div className="modal_info">
                                <h2 className='mb-4 border-b-2 text-xl'>Treatment Plan</h2>
                                <div className='info'>
                                    <h6>Id: <span className='text-gray-700'>{selectedTreatment._id}</span></h6>
                                    <h6>Patient Name: <span className='text-gray-700'>{selectedTreatment.CropArea}</span></h6>
                                    <h6>Treatment Name: <span className='text-gray-700'>{selectedTreatment.CropName}</span></h6>
                                    <h6>Doctor Name: <span className='text-gray-700'>{selectedTreatment.ScientificName}</span></h6>
                                    <h6>Start Date: <span className='text-gray-700'>{selectedTreatment.RainFall}</span></h6>
                                    <h6>End Date: <span className='text-gray-700'>{selectedTreatment.Temperature}</span></h6>
                                    <h6>Medication: <span className='text-gray-700'>{selectedTreatment.SoilpHLevel}</span></h6>
                                    <h6>Frequency: <span className='text-gray-700'>{selectedTreatment.IrrigationType}</span></h6>
                                </div>
                            </div>
                            <button className="mt-4 bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600" onClick={() => setSelectedTreatment(null)}>Close</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default AllTreatment;
