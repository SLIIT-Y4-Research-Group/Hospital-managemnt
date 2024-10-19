import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AppointmentsTable = () => {
    const { id } = useParams(); // Get the Doctor ID from the URL params
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get('http://localhost:5000/appointments/all'); // Adjust the endpoint as necessary
                // Filter appointments by doctor ID
                const filteredAppointments = response.data.filter(appointment => appointment.doctor === id);
                setAppointments(filteredAppointments);
            } catch (err) {
                setError(err);
                console.error('Error fetching appointments:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [id]);

    const handleStatusChange = async (appointmentId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/appointments/${appointmentId}`, { status: newStatus });
            setAppointments((prevAppointments) =>
                prevAppointments.map((appointment) =>
                    appointment._id === appointmentId ? { ...appointment, status: newStatus } : appointment
                )
            );
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    if (loading) {
        return <div>Loading appointments...</div>;
    }

    if (error) {
        return <div>Error fetching appointments: {error.message}</div>;
    }

    if (appointments.length === 0) {
        return <div>No appointments found for this doctor.</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Appointments for Doctor {id}</h1>
            <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 border-b">First Name</th>
                        <th className="py-2 px-4 border-b">Last Name</th>
                        <th className="py-2 px-4 border-b">Contact Number</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">NIC</th>
                        <th className="py-2 px-4 border-b">Hospital</th>
                        <th className="py-2 px-4 border-b">Gender</th>
                        <th className="py-2 px-4 border-b">Appointment Date</th>
                        <th className="py-2 px-4 border-b">Appointment Time</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Reason for Visit</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment) => (
                        <tr key={appointment._id} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b">{appointment.firstName}</td>
                            <td className="py-2 px-4 border-b">{appointment.lastName}</td>
                            <td className="py-2 px-4 border-b">{appointment.contactNumber}</td>
                            <td className="py-2 px-4 border-b">{appointment.email}</td>
                            <td className="py-2 px-4 border-b">{appointment.nic}</td>
                            <td className="py-2 px-4 border-b">{appointment.hospital}</td>
                            <td className="py-2 px-4 border-b">{appointment.gender}</td>
                            <td className="py-2 px-4 border-b">{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                            <td className="py-2 px-4 border-b">{appointment.appointmentTime}</td>
                            <td className="py-2 px-4 border-b">
                                <select
                                    value={appointment.status}
                                    onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                                    className="border rounded-md p-1"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Cancelled">Cancelled</option>
                                    {/* Add more status options as needed */}
                                </select>
                            </td>
                            <td className="py-2 px-4 border-b">{appointment.reasonForVisit}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AppointmentsTable;
