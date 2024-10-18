import React, { useState } from 'react';
import axios from 'axios';

const DoctorDetails = () => {
    const [name, setName] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setName(e.target.value);
    };

    const fetchDoctorDetailsByName = async () => {
        if (!name) {
            alert('Please enter a name');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.get(`http://localhost:5000/api/doctors/name/${name}`);
            setDoctors(response.data);
        } catch (error) {
            setError(
                error.response ? error.response.data.message : 'Failed to fetch doctor details'
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchAllDoctors = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.get('http://localhost:5000/api/doctors');
            setDoctors(response.data);
        } catch (error) {
            setError(
                error.response ? error.response.data.message : 'Failed to fetch doctor details'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Doctor Details</h1>
            <div className="flex space-x-2 mb-6">
                <input
                    type="text"
                    value={name}
                    onChange={handleInputChange}
                    placeholder="Enter doctor's name"
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={fetchDoctorDetailsByName}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                >
                    Search
                </button>
                <button
                    onClick={fetchAllDoctors}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
                >
                    Show All Doctors
                </button>
            </div>

            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}

            <div className="space-y-4">
                {doctors.length > 0 ? (
                    doctors.map((doctor) => (
                        <div key={doctor._id} className="border p-4 rounded-md shadow-sm">
                            <h2 className="text-xl font-semibold">{doctor.name}</h2>
                            <p><strong>Specialization:</strong> {doctor.specialization}</p>
                            <p><strong>Contact:</strong> {doctor.contact}</p>
                            <p><strong>Email:</strong> {doctor.email}</p>
                            <p><strong>Consultation Fee:</strong> {doctor.fee}</p>

                            <div className="mt-2">
                                <h3 className="text-lg font-medium">Hospitals & Time Slots</h3>
                                <ul className="list-disc list-inside">
                                    {doctor.hospitals.map((hospital, index) => (
                                        <li key={index} className="mt-1">
                                            <strong>{hospital.name}:</strong> {hospital.timeSlot.start} - {hospital.timeSlot.end}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">No doctors found.</p>
                )}
            </div>
        </div>
    );
};

export default DoctorDetails;
