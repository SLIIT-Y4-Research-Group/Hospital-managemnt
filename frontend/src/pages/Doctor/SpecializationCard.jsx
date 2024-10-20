import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from "../../components/Spinner";
import { Link, useNavigate } from 'react-router-dom';

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

    // Update handleDoctorClick to pass doctor.DoctorID
    const handleDoctorClick = (doctorId) => {
        navigate(`/DoctorSchedule/${doctorId}`); // Use doctor.DoctorID when navigating
    };

    return (
        <div className='p-6 bg-gray-100 min-h-screen'>
            <li>
                <Link to="/" className="text-green-800 hover:text-green-600">Home</Link>
            </li>
            <h1 className="show-Doctors-title text-3xl my-4 text-green-800">Doctor's List</h1>

            <h2 className="text-2xl my-4 text-green-800">Select Specialization</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {specializations.map((specialization, index) => (
                    <div 
                        key={index} 
                        className="bg-green-500 text-white rounded-lg p-4 cursor-pointer hover:bg-green-600"
                        onClick={() => setSelectedSpecialization(specialization)}
                    >
                        <h3 className="text-xl text-center">{specialization}</h3>
                    </div>
                ))}
            </div>

            <h2 className="text-2xl my-4 text-green-800">Doctors with {selectedSpecialization ? selectedSpecialization : "all specializations"}</h2>

            {loading ? (
                <Spinner />
            ) : error ? (
                <div className="text-red-600">{error}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors.map((doctor) => (
                        <div 
                            key={doctor._id} 
                            className="bg-white rounded-lg shadow-md p-4 flex flex-col cursor-pointer"
                            onClick={() => handleDoctorClick(doctor.DoctorID)} // Pass doctor.DoctorID here
                        >
                            <img src={doctor.image} alt="Profile Pic" className="w-32 h-32 object-cover rounded-full mx-auto" />
                            <h2 className="text-xl font-bold text-center text-green-800 mt-2">{doctor.Name}</h2>
                            <p className="text-center text-gray-600">{doctor.DoctorID}</p>
                            <p className="text-center text-gray-600">{doctor.Specialization}</p>
                            <p className="text-center text-gray-500">Contact: {doctor.ContactNo}</p>
                            <p className="text-center text-gray-500">Email: {doctor.Email}</p>
                            <p className="text-center text-gray-500">Address: {doctor.Address}</p>
                            <p className="text-center text-gray-500">BasicSalary: {doctor.BasicSalary}</p>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShowDoctor;
