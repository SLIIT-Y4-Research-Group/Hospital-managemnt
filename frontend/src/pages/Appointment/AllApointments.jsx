import React, { useContext, useState, useEffect } from 'react';
import api from '../../config/api';
import { UserContext } from '../../context/UserContext';

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
                const response = await api.get(`/appointments/user/${user.user._id}`);
                const appointmentsData = response.data;

                // Fetch doctor names for each appointment
                const appointmentsWithDoctors = await Promise.all(
                    appointmentsData.map(async (appointment) => {
                        try {
                            // Fetch by DoctorID
                            const doctorResponse = await api.get(`/api/doctors/${appointment.doctorId}`);
                            return {
                                ...appointment,
                                doctorName: doctorResponse.data.Name, // Use the doctor's name from the response
                            };
                        } catch (error) {
                            console.error('Error fetching doctor details:', error.message);
                            return {
                                ...appointment,
                                doctorName: 'N/A',
                            };
                        }
                    })
                );

                setAppointments(appointmentsWithDoctors);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching appointments:', error.message);
                setError('Failed to fetch appointments or doctor details');
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
                            <h2 className="text-xl font-semibold">Appointment with Dr. {appointment.doctorName}</h2>
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
