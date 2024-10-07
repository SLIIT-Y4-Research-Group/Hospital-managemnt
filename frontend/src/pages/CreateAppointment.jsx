import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';

const CreateAppointment = () => {
    const { user } = useContext(UserContext);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        contactNumber: '',
        email: '',
        nic: '',
        dob: '',
        gender: '',
        appointmentDate: '',
        appointmentTime: '',
        doctor: '',
        address: '',
        reasonForVisit: '',
        status: 'pending',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const appointmentData = { ...formData, user_id: user._id };
            await axios.post('http://localhost:5000/appointments', appointmentData);
            alert('Appointment created successfully');
            navigate('/appointments');
        } catch (error) {
            console.error('Error creating appointment:', error);
            alert('Failed to create appointment: ' + error.response.data);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Create Appointment</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                        type="text" 
                        name="firstName" 
                        placeholder="First Name" 
                        value={formData.firstName} 
                        onChange={handleChange} 
                        required 
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input 
                        type="text" 
                        name="lastName" 
                        placeholder="Last Name" 
                        value={formData.lastName} 
                        onChange={handleChange} 
                        required 
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input 
                        type="tel" 
                        name="contactNumber" 
                        placeholder="Contact Number" 
                        value={formData.contactNumber} 
                        onChange={handleChange} 
                        required 
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input 
                        type="text" 
                        name="nic" 
                        placeholder="NIC" 
                        value={formData.nic} 
                        onChange={handleChange} 
                        required 
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input 
                        type="date" 
                        name="dob" 
                        placeholder="Date of Birth" 
                        value={formData.dob} 
                        onChange={handleChange} 
                        required 
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <select 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleChange} 
                        required 
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <input 
                        type="date" 
                        name="appointmentDate" 
                        placeholder="Appointment Date" 
                        value={formData.appointmentDate} 
                        onChange={handleChange} 
                        required 
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input 
                        type="time" 
                        name="appointmentTime" 
                        placeholder="Appointment Time" 
                        value={formData.appointmentTime} 
                        onChange={handleChange} 
                        required 
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input 
                        type="text" 
                        name="doctor" 
                        placeholder="Doctor's Name" 
                        value={formData.doctor} 
                        onChange={handleChange} 
                        required 
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input 
                        type="text" 
                        name="address" 
                        placeholder="Address" 
                        value={formData.address} 
                        onChange={handleChange} 
                        required 
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <textarea 
                        name="reasonForVisit" 
                        placeholder="Reason for Visit" 
                        value={formData.reasonForVisit} 
                        onChange={handleChange} 
                        required 
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 h-32 resize-none"
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300">
                    Create Appointment
                </button>
            </form>
        </div>
    );
};

export default CreateAppointment;
