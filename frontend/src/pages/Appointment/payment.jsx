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
    const [doctorFee, setDoctorFee] = useState(0); // State for storing the doctor's fee
    const navigate = useNavigate();
    const location = useLocation();
    const [appointmentId, setAppointmentId] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get('appointmentId');
        if (id) {
            setAppointmentId(id);
            fetchDoctorFee(id); // Fetch the doctor's fee when the appointment ID is available
        }
    }, [location]);

    const fetchDoctorFee = async (appointmentId) => {
        try {
            const response = await axios.get(`http://localhost:5000/appointments/${appointmentId}`);
            const { doctor } = response.data; // Assuming the appointment object contains a reference to the doctor
            const doctorResponse = await axios.get(`http://localhost:5000/api/doctors/${doctor}`); // Fetch the doctor details by ID
            setDoctorFee(doctorResponse.data.fee); // Assuming the doctor object has a 'fee' property
            setFormData((prevData) => ({
                ...prevData,
                amount: doctorResponse.data.fee, // Set the amount field to the doctor's fee
            }));
        } catch (error) {
            console.error('Error fetching doctor fee:', error);
            alert('Failed to fetch doctor fee: ' + (error.response ? error.response.data : error.message));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/payments/add', {
                ...formData,
                appointmentId,
            });
            alert('Payment successful');
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
                    <label className="block text-gray-700">Doctor's Fee:</label>
                    <p className="text-lg font-semibold text-gray-800">${doctorFee}</p>
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
