import React, { useEffect, useState } from 'react';
import api from '../../config/api';
import UpdateAppointment from './UpdateAppointment'; // Import the UpdateAppointment component
import { useNavigate } from 'react-router-dom';

const AppointmentsList = ({ userId }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentAppointment, setCurrentAppointment] = useState(null);
    const [doctorNames, setDoctorNames] = useState({}); // Store doctor names by their IDs
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await api.get(`/appointments/user/${userId}`);
                const fetchedAppointments = response.data;
                setAppointments(fetchedAppointments);
                
                // Fetch doctor details for each appointment's doctorId
                const doctorIds = fetchedAppointments.map((appointment) => appointment.doctor);
                
                const doctorDetails = await Promise.all(
                    doctorIds.map(async (id) => {
                        try {
                            const res = await api.get(`/api/doctors/${id}`);
                            return res.data; // return doctor details
                        } catch (error) {
                            console.error(`Error fetching doctor ${id}:`, error.message);
                            return { _id: id, name: 'Unknown Doctor' }; // Fallback if the doctor is not found
                        }
                    })
                );

                // Map doctor IDs to their names
                const namesMap = doctorDetails.reduce((acc, doctor) => {
                    acc[doctor._id] = doctor.DoctorName; // Assuming doctor data has _id and name
                    return acc;
                }, {});

                setDoctorNames(namesMap);
            } catch (error) {
                console.error('Error fetching appointments or doctor details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchAppointments();
        }
    }, [userId]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            try {
                await api.delete(`/appointments/${id}`);
                setAppointments(appointments.filter((appointment) => appointment._id !== id));
            } catch (error) {
                console.error('Error deleting appointment:', error);
            }
        }
    };

    const handleUpdate = (appointment) => {
        setCurrentAppointment(appointment);
        setIsUpdating(true);
    };

    const makePayment = (appointmentId) => {
        console.log(`Initiating payment for appointment ID: ${appointmentId}`);
        navigate(`/payment?appointmentId=${appointmentId}`);
    };

    if (loading) {
        return <p className="text-center text-gray-500">Loading appointments...</p>;
    }

    if (appointments.length === 0) {
        return <p className="text-center text-gray-500">No appointments found.</p>;
    }

    return (
        <div className="mt-6">
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appointments.map((appointment) => (
                    <li key={appointment._id} className="border rounded-lg p-4 shadow-lg bg-white">
                        <p className="text-gray-800 font-medium">
                            <strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}
                        </p>
                        <p className="text-gray-800 font-medium">
                            <strong>Time:</strong> {appointment.appointmentTime}
                        </p>
                        <p className="text-gray-800 font-medium">
                            <strong>Doctor:</strong> {doctorNames[appointment.doctor] }
                        </p>
                        <p className="text-gray-800 font-medium">
                            <strong>Hospital:</strong> {appointment.hospital}
                        </p>
                        <p className="text-gray-800 font-medium">
                            <strong>Reason:</strong> {appointment.reasonForVisit}
                        </p>
                        <p className={`text-sm font-semibold ${appointment.status === 'Pending' ? 'text-yellow-500' : 'text-green-500'}`}>
                            <strong>Status:</strong> {appointment.status}
                        </p>
                        <div className="flex justify-end mt-4 space-x-4">
                            {appointment.status === 'Pending' && (
                                <button onClick={() => makePayment(appointment._id)} className="text-blue-500 hover:text-blue-600 font-medium">
                                    Go to Payment
                                </button>
                            )}
                            <button
                                className="text-red-500 hover:text-red-600 font-medium"
                                onClick={() => handleDelete(appointment._id)}
                            >
                                Delete
                            </button>
                            <button
                                className="text-blue-500 hover:text-blue-600 font-medium"
                                onClick={() => handleUpdate(appointment)}
                            >
                                Update
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {isUpdating && (
                <UpdateAppointment
                    appointment={currentAppointment}
                    onClose={() => setIsUpdating(false)}
                    onUpdate={(updatedAppointment) => {
                        setAppointments((prev) =>
                            prev.map((appointment) =>
                                appointment._id === updatedAppointment._id ? updatedAppointment : appointment
                            )
                        );
                        setIsUpdating(false);
                    }}
                />
            )}
        </div>
    );
};

export default AppointmentsList;
