import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';
import backgroundImage from '../../assets/background.png'; // Import your background image

const CreateAppointment = () => {
    const { user } = useContext(UserContext);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        contactNumber: '',
        email: '',
        nic: '',
        gender: '',
        appointmentDate: '',
        appointmentTime: '',
        doctor: '',
        hospital: '',  // Added hospital field
        address: '',
        reasonForVisit: '',
        status: 'Pending', // Default to 'Pending'
    });
    
    const [doctors, setDoctors] = useState([]); // State for storing doctor names
    const [hospitals, setHospitals] = useState([]); // State for storing hospitals based on selected doctor

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/doctors'); // Adjust the endpoint as necessary
                setDoctors(response.data); // Assume the response data is an array of doctor objects
            } catch (error) {
                console.error('Error fetching doctors:', error);
                alert('Failed to fetch doctors: ' + (error.response ? error.response.data : error.message));
            }
        };

        fetchDoctors();
    }, []);

    // Fetch hospitals based on selected doctor
    useEffect(() => {
        const fetchHospitals = async () => {
            if (formData.doctor) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/doctors/${formData.doctor}`); // Endpoint to get doctor by ID
                    setHospitals(response.data.hospitals); // Assume hospitals is an array in the doctor object
                } catch (error) {
                    console.error('Error fetching hospitals:', error);
                    alert('Failed to fetch hospitals: ' + (error.response ? error.response.data : error.message));
                }
            } else {
                setHospitals([]); // Reset hospitals if no doctor is selected
            }
        };

        fetchHospitals();
    }, [formData.doctor]); // Dependency on selected doctor

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('User is not logged in. Please log in to create an appointment.');
            return;
        }
        try {
            const appointmentData = { ...formData, user_id: user.user._id };  // Use user._id from context
            const response = await axios.post('http://localhost:5000/appointments/add', appointmentData);
    
            // Get the appointment ID from the response
            const { appointmentId } = response.data;
    
            alert('Appointment created successfully');
    
            // Navigate based on appointment status
            if (formData.status === 'Confirmed') {
                // Navigate to the payment page with the appointment ID as a parameter
                navigate(`/payment?appointmentId=${appointmentId}`);
            } else {
                // Navigate to the home page for pending appointments
                navigate('/');
            }
        } catch (error) {
            console.error('Error creating appointment:', error);
            alert('Failed to create appointment: ' + (error.response ? error.response.data : error.message));
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen"
            style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="bg-white bg-opacity-90 shadow-md rounded-lg p-8 w-11/12 mt-5 mb-6 md:w-1/2">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h1 className="text-3xl font-bold text-center mb-6">Create Appointment</h1>
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
                        <select 
                            name="gender" 
                            value={formData.gender} 
                            onChange={handleChange} 
                            required 
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        <select 
                            name="status" 
                            value={formData.status} 
                            onChange={handleChange} 
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                        </select>
                    
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date</label>
                            <input 
                                type="date" 
                                name="appointmentDate" 
                                value={formData.appointmentDate} 
                                onChange={handleChange} 
                                required 
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                            />
                        </div>
                        {/* Select box for Doctor's Name */}
                        <select 
                            name="doctor" 
                            value={formData.doctor} 
                            onChange={handleChange} 
                            required 
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select Doctor</option>
                            {doctors.map((doctor) => (
                                <option key={doctor._id} value={doctor._id}>{doctor.name}</option>
                            ))}
                        </select>

                        {/* Conditionally render the hospital select box */}
                        {formData.doctor && (
                            <select 
                                name="hospital" 
                                value={formData.hospital} 
                                onChange={handleChange} 
                                required 
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">Select Hospital</option>
                                {hospitals.map((hospital) => (
                                    <option key={hospital._id} value={hospital.name}>{hospital.name}</option>
                                ))}
                            </select>
                        )}
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Time</label>
                            <input 
                                type="time" 
                                name="appointmentTime" 
                                value={formData.appointmentTime} 
                                onChange={handleChange} 
                                required 
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                            />
                        </div>
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
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Create Appointment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateAppointment;
