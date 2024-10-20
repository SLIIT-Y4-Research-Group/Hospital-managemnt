import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

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
        return <div className="spinner">Loading appointments...</div>;
    }

    if (error) {
        return <div>Error fetching appointments: {error.message}</div>;
    }

    if (appointments.length === 0) {
        return <div>No appointments found for this doctor.</div>;
    }

    return (
        <div className="appointments-table-container">
            <div className="sidebar">
                <h2>Sidebar</h2>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/doctors/cards">Doctor cards</Link></li>
                    <li><Link to={`/myAppointments/${id}`}>My Appointments</Link></li>
                    <li><Link to={`/mySchedule/${id}`}>My Schedule</Link></li> 
                    <li><Link to="/SpecializationCard">Specialization Card</Link></li>
                </ul>
            </div>

            <div className="table-content">
                <h1 className="text-3xl font-bold text-center mb-6">Appointments for Doctor {id}</h1>
                <table className="appointments-table">
                    <thead>
                        <tr className="table-header">
                            <th className="table-cell">First Name</th>
                            <th className="table-cell">Last Name</th>
                            <th className="table-cell">Contact Number</th>
                            <th className="table-cell">Email</th>
                            <th className="table-cell">NIC</th>
                            <th className="table-cell">Hospital</th>
                            <th className="table-cell">Gender</th>
                            <th className="table-cell">Appointment Date</th>
                            <th className="table-cell">Appointment Time</th>
                            <th className="table-cell">Status</th>
                            <th className="table-cell">Reason for Visit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appointment) => (
                            <tr key={appointment._id} className="hover:bg-gray-100">
                                <td className="table-cell">{appointment.firstName}</td>
                                <td className="table-cell">{appointment.lastName}</td>
                                <td className="table-cell">{appointment.contactNumber}</td>
                                <td className="table-cell">{appointment.email}</td>
                                <td className="table-cell">{appointment.nic}</td>
                                <td className="table-cell">{appointment.hospital}</td>
                                <td className="table-cell">{appointment.gender}</td>
                                <td className="table-cell">{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                                <td className="table-cell">{appointment.appointmentTime}</td>
                                <td className="table-cell">
                                    <select
                                        value={appointment.status}
                                        onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Cancelled">Cancelled</option>
                                        {/* Add more status options as needed */}
                                    </select>
                                </td>
                                <td className="table-cell">{appointment.reasonForVisit}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Inline CSS */}
            <style jsx>{`
                .appointments-table-container {
                    display: flex;
                    justify-content: flex-start;
                    min-height: 100vh;
                    background-color: #eaf0f7;
                }

                .sidebar {
                    width: 200px;
                    background-color: #3498db;
                    color: white;
                    padding: 20px;
                    margin-right: 20px;
                }

                .sidebar h2 {
                    margin-bottom: 20px;
                    font-size: 1.5rem;
                }

                .sidebar ul {
                    list-style: none;
                    padding: 0;
                }

                .sidebar ul li {
                    margin: 10px 0;
                }

                .sidebar ul li a {
                    color: white;
                    text-decoration: none;
                }

                .table-content {
                    flex: 1;
                    padding: 20px;
                }

                .appointments-table {
                    width: 100%;
                    border-collapse: collapse;
                    background-color: #ffffff;
                    border-radius: 10px;
                    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
                }

                .table-header {
                    background-color: #3498db;
                    color: white;
                }

                .table-cell {
                    padding: 10px;
                    border: 1px solid #dcdcdc;
                    text-align: left;
                }

                .status-select {
                    border: 1px solid #3498db;
                    border-radius: 4px;
                    padding: 5px;
                }

                .hover\:bg-gray-100:hover {
                    background-color: #f0f0f0;
                }

                .spinner {
                    text-align: center;
                    font-size: 1.5rem;
                    color: #3498db;
                }
            `}</style>
        </div>
    );
};

export default AppointmentsTable;
