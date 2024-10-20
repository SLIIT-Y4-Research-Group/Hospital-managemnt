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
        hospital: '', // Added hospital field
        address: '',
        reasonForVisit: '',
        status: 'Pending', // Default to 'Pending'
    });
    const [error, setError] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [hospitals, setHospitals] = useState([]); // State to hold hospitals
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctorSchedules = async () => {
            try {
                const response = await axios.get('http://localhost:5000/doctorShedules'); // Adjust API endpoint if needed
                if (response.data && Array.isArray(response.data.data)) {
                    setDoctors(response.data.data); // Access the array of doctorSchedules here
                } else {
                    console.error("Invalid data format:", response.data);
                }
            } catch (error) {
                console.error("Error fetching doctorSchedules:", error);
                setError("Failed to fetch doctorSchedules.");
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorSchedules();
    }, []);

    // Fetch hospitals based on the selected doctor
    useEffect(() => {
        const fetchHospitals = async () => {
            if (formData.doctor) {
                try {
                    const response = await axios.get(`http://localhost:5000/doctorShedules?doctorId=${formData.doctor}`); // Adjust API endpoint to match your backend
                    if (response.data && Array.isArray(response.data.data)) {
                        const selectedDoctor = response.data.data.find(doctor => doctor.DoctorID === formData.doctor);
                        if (selectedDoctor) {
                            // Extract hospitals from the selected doctor's schedule
                            setHospitals([{ _id: selectedDoctor.ShedulesID, Location: selectedDoctor.Location }]); // Adjust if needed to your data structure
                        }
                    } else {
                        console.error("Invalid hospital data format:", response.data);
                    }
                } catch (error) {
                    console.error("Error fetching hospitals:", error);
                    setError("Failed to fetch hospitals.");
                }
            } else {
                setHospitals([]); // Clear hospitals if no doctor is selected
            }
        };

        fetchHospitals();
    }, [formData.doctor]); // Fetch hospitals when doctor changes

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

            const { appointmentId } = response.data;

            alert('Appointment created successfully');

            if (formData.status === 'Confirmed') {
                navigate(`/payment?appointmentId=${appointmentId}`);
            } else {
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
                                min={new Date().toISOString().split("T")[0]} // Set minimum date to today
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
                                <option key={doctor.DoctorID} value={doctor.DoctorID}>
                                    {doctor.DoctorName} : {doctor.Specialization}
                                </option>
                            ))}
                        </select>

                        {/* Conditionally render the hospital select box based on the selected doctor */}
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
                                                        <option key={hospital._id} value={hospital.Location}>
                                                            {hospital.Location}
                                                        </option>
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
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4 w-full hover:bg-blue-700 transition"
                    >
                        Create Appointment
                    </button>
                    {error && <p className="text-red-500">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default CreateAppointment;
