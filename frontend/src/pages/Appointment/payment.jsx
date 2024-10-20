import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const PaymentForm = () => {
    const [formData, setFormData] = useState({
        cardNumber: '',
        cardHolderName: '',
        expiryDate: '',
        cvv: '',
        amount: '',
    });
    const [doctorSalary, setDoctorSalary] = useState(0); // State for storing the doctor's salary
    const navigate = useNavigate();
    const location = useLocation();
    const [appointmentId, setAppointmentId] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get('appointmentId');
        if (id) {
            setAppointmentId(id);
            fetchDoctorSalary(id); // Fetch the doctor's salary when the appointment ID is available
        }
    }, [location]);

    const fetchDoctorSalary = async (appointmentId) => {
        try {
            const response = await axios.get(`http://localhost:5000/appointments/${appointmentId}`);
            const { doctor } = response.data; // Assuming the appointment object contains a reference to the doctor
            const doctorResponse = await axios.get(`http://localhost:5000/doctors/${doctor}`); // Fetch the doctor details by ID
            setDoctorSalary(doctorResponse.data.BasicSalary); // Assuming the doctor object has a 'BasicSalary' property
            setFormData((prevData) => ({
                ...prevData,
                amount: doctorResponse.data.BasicSalary, // Set the amount field to the doctor's salary
            }));
        } catch (error) {
            console.error('Error fetching doctor salary:', error);
            alert('Failed to fetch doctor salary: ' + (error.response ? error.response.data : error.message));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Process the payment
            const paymentResponse = await axios.post('http://localhost:5000/payments/add', {
                ...formData,
                appointmentId,
            });
            alert('Payment successful');

            // Update appointment status to "Confirmed"
            await axios.put(`http://localhost:5000/appointments/${appointmentId}`, {
                status: 'Confirmed',
            });

            alert('Appointment status updated to confirmed');
            navigate('/profile'); // Redirect to a list of appointments or success page.
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Payment failed: ' + (error.response ? error.response.data : error.message));
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Payment</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 space-y-4">
                <div className="mb-4">
                    <label className="block text-gray-700">Doctor's Salary:</label>
                    <p className="text-lg font-semibold text-gray-800">${doctorSalary}</p>
                </div>
                <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card Number"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="text"
                    name="cardHolderName"
                    placeholder="Card Holder Name"
                    value={formData.cardHolderName}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="text"
                    name="expiryDate"
                    placeholder="Expiry Date (MM/YY)"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    value={formData.cvv}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    disabled // Make this field disabled to prevent editing
                />
                <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300">
                    Make Payment
                </button>
            </form>
        </div>
    );
};

export default PaymentForm;
