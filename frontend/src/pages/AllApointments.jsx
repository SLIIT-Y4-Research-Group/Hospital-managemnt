import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const UserAppointments = () => {
    const { user } = useContext(UserContext); // Retrieve user info from context
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!user) {
                setError('User not logged in');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/appointments/user/${user.user._id}`); // Adjust the endpoint as necessary
                setAppointments(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setError('Failed to fetch appointments');
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [user]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Your Appointments</h1>
            {appointments.length > 0 ? (
                <div className="space-y-4">
                    {appointments.map((appointment) => (
                        <div key={appointment._id} className="bg-white shadow-md rounded-lg p-4">
                            <h2 className="text-xl font-semibold">Appointment with Dr. {appointment.doctor.name}</h2>
                            <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {appointment.appointmentTime}</p>
                            <p><strong>Hospital:</strong> {appointment.hospital}</p>
                            <p><strong>Status:</strong> {appointment.status}</p>
                            <p><strong>Reason:</strong> {appointment.reasonForVisit}</p>
                            <p><strong>Address:</strong> {appointment.address}</p>
                            <p><strong>Contact Number:</strong> {appointment.contactNumber}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div>No appointments found.</div>
            )}
        </div>
    );
};

export default UserAppointments;
