import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from "../../components/Spinner";
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/background3.jpg'; // Import your background image

const ShowDoctor = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [specializations, setSpecializations] = useState([]);
    const [selectedSpecialization, setSelectedSpecialization] = useState("");

    const navigate = useNavigate(); // For programmatic navigation

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://localhost:5000/doctors');
                if (response.data && Array.isArray(response.data.data)) {
                    setDoctors(response.data.data);
                    const hardcodedSpecializations = [
                        'Cardiology', 'Neurology', 'Pediatrics', 'Dermatology', 'Oncology',
                        'Orthopedics', 'Psychiatry', 'Gastroenterology', 'Endocrinology', 'General Practice'
                    ];
                    const uniqueSpecializations = [...new Set([...hardcodedSpecializations, ...response.data.data.map(doctor => doctor.Specialization)])];
                    setSpecializations(uniqueSpecializations);
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

    const filteredDoctors = selectedSpecialization 
        ? doctors.filter(doctor => doctor.Specialization === selectedSpecialization) 
        : doctors;

    const handleDoctorClick = (doctorId) => {
        navigate(`/DoctorSchedule/${doctorId}`);
    };

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen p-6"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.8)', // Slightly darken background
            }}
        >
            <h1 className="text-4xl font-extrabold my-4 text-blue-900 shadow-md">Doctor's List</h1>

            <h2 className="text-2xl my-4 text-white-900">Select Specialization</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {specializations.map((specialization, index) => (
                    <div 
                        key={index} 
                        className="bg-blue-600 text-white rounded-lg p-4 cursor-pointer transition-transform transform hover:scale-105"
                        onClick={() => setSelectedSpecialization(specialization)}
                    >
                        <h3 className="text-xl text-center font-semibold">{specialization}</h3>
                    </div>
                ))}
            </div>

            <h2 className="text-2xl my-4 text-white-900">Doctors with {selectedSpecialization || "all specializations"}</h2>

            {loading ? (
                <Spinner />
            ) : error ? (
                <div className="text-red-600">{error}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors.map((doctor) => (
                        <div 
                            key={doctor._id} 
                            className="bg-white rounded-lg shadow-lg p-4 flex flex-col cursor-pointer transition-shadow duration-200 hover:shadow-xl"
                            onClick={() => handleDoctorClick(doctor.DoctorID)}
                        >
                            <img src={doctor.image} alt="Profile Pic" className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-blue-300 mb-4" />
                            <h2 className="text-xl font-bold text-center text-blue-800">{doctor.Name}</h2>
                            <p className="text-center text-gray-600">{doctor.DoctorID}</p>
                            <p className="text-center text-gray-600">{doctor.Specialization}</p>
                            <p className="text-center text-gray-500">Contact: {doctor.ContactNo}</p>
                            <p className="text-center text-gray-500">Email: {doctor.Email}</p>
                            <p className="text-center text-gray-500">Address: {doctor.Address}</p>
                            <p className="text-center text-gray-500">Basic Salary: {doctor.BasicSalary}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShowDoctor;
