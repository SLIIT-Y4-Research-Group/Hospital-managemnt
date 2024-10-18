import React, { useState } from 'react';
import axios from 'axios';

const DoctorRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        specialization: '',
        contact: '',
        hospitals: [{ name: '', timeSlot: { start: '', end: '' } }],
        fee: '',
        email: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleHospitalChange = (index, e) => {
        const { name, value } = e.target;
        const newHospitals = [...formData.hospitals];
        newHospitals[index][name] = value;
        setFormData({ ...formData, hospitals: newHospitals });
    };

    const handleTimeSlotChange = (index, e) => {
        const { name, value } = e.target;
        const newHospitals = [...formData.hospitals];
        newHospitals[index].timeSlot[name] = value;
        setFormData({ ...formData, hospitals: newHospitals });
    };

    const addHospital = () => {
        setFormData({
            ...formData,
            hospitals: [...formData.hospitals, { name: '', timeSlot: { start: '', end: '' } }]
        });
    };

    const removeHospital = (index) => {
        const newHospitals = formData.hospitals.filter((_, i) => i !== index);
        setFormData({ ...formData, hospitals: newHospitals });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/doctors/register', formData);
            alert(response.data.message);
        } catch (error) {
            alert('Error registering doctor: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Register Doctor</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Doctor Name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                    type="text" 
                    name="specialization" 
                    placeholder="Specialization" 
                    value={formData.specialization} 
                    onChange={handleChange} 
                    required 
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                    type="text" 
                    name="contact" 
                    placeholder="Contact Number" 
                    value={formData.contact} 
                    onChange={handleChange} 
                    required 
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="space-y-2">
                    <h3 className="text-lg font-medium">Hospitals & Time Slots</h3>
                    {formData.hospitals.map((hospital, index) => (
                        <div key={index} className="space-y-2 border p-4 rounded-md">
                            <input
                                type="text"
                                name="name"
                                placeholder="Hospital Name"
                                value={hospital.name}
                                onChange={(e) => handleHospitalChange(index, e)}
                                required
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex space-x-2">
                                <input
                                    type="time"
                                    name="start"
                                    placeholder="Start Time"
                                    value={hospital.timeSlot.start}
                                    onChange={(e) => handleTimeSlotChange(index, e)}
                                    required
                                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="time"
                                    name="end"
                                    placeholder="End Time"
                                    value={hospital.timeSlot.end}
                                    onChange={(e) => handleTimeSlotChange(index, e)}
                                    required
                                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            {formData.hospitals.length > 1 && (
                                <button 
                                    type="button" 
                                    onClick={() => removeHospital(index)} 
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
                                >
                                    Remove Hospital
                                </button>
                            )}
                        </div>
                    ))}
                    <button 
                        type="button" 
                        onClick={addHospital} 
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Add Hospital
                    </button>
                </div>

                <input 
                    type="number" 
                    name="fee" 
                    placeholder="Consultation Fee" 
                    value={formData.fee} 
                    onChange={handleChange} 
                    required 
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <button 
                    type="submit" 
                    className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition duration-300"
                >
                    Register Doctor
                </button>
            </form>
        </div>
    );
};

export default DoctorRegister;
