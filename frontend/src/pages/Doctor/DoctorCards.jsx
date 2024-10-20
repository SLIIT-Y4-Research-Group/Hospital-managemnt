import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from "../../components/Spinner";
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';

const ShowDoctor = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://localhost:5000/doctors'); // Adjust API endpoint if needed
                if (response.data && Array.isArray(response.data.data)) {
                    setDoctors(response.data.data); // Access the array of doctors here
                } else {
                    console.error("Invalid data format:", response.data);
                }
            } catch (error) {
                console.error("Error fetching doctors:", error);
                setError("Failed to fetch doctors.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchDoctors();
    }, []);
    
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredDoctors = doctors.filter(doctor =>
        Object.values(doctor).some(value =>
            value.toString().toLowerCase().includes(searchQuery)
        )
    );

    return (
        <div className='p-6 bg-gray-100 min-h-screen'>
           
            <h1 className="show-Doctors-title text-3xl my-4 text-green-800">Doctor's List</h1>
            <div className='flex flex-col md:flex-row justify-between items-center mb-6'>
                <label htmlFor="search" className="sr-only">Search doctors</label>
                <input
                    id="search"
                    type="text"
                    placeholder="Search doctors..."
                    className='text-lg my-4 p-2 border border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
                    onChange={handleSearchChange}
                />
                
            </div>

            {loading ? (
                <Spinner />
            ) : error ? (
                <div className="text-red-600">{error}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors.map((doctor) => (
                        <div key={doctor._id} className="bg-white rounded-lg shadow-md p-4 flex flex-col">
                            <img src={doctor.image} alt="Profile Pic" className="w-32 h-32 object-cover rounded-full mx-auto" />
                            <h2 className="text-xl font-bold text-center text-green-800 mt-2">{doctor.Name}</h2>
                            <p className="text-center text-gray-600">{doctor.Specialization}</p>
                            <p className="text-center text-gray-500">Contact: {doctor.ContactNo}</p>
                            <p className="text-center text-gray-500">Email: {doctor.Email}</p>
                            <p className="text-center text-gray-500">Address: {doctor.Address}</p>
                            
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShowDoctor;
