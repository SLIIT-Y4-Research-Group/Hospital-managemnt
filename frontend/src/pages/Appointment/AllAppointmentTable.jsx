import React, { useEffect, useState } from 'react';
import api from '../../config/api';
import Chart from 'react-apexcharts';

const AppointmentsTable = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [genderData, setGenderData] = useState({ male: 0, female: 0 });
    const [statusData, setStatusData] = useState({ confirmed: 0, pending: 0 });

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await api.get('/appointments/all'); // Adjust the endpoint as necessary
                setAppointments(response.data);

                // Count the genders
                const males = response.data.filter(appointment => appointment.gender === 'Male').length;
                const females = response.data.filter(appointment => appointment.gender === 'Female').length;
                setGenderData({ male: males, female: females });

                // Count the appointment statuses
                const confirmed = response.data.filter(appointment => appointment.status === 'Confirmed').length;
                const pending = response.data.filter(appointment => appointment.status === 'Pending').length;
                setStatusData({ confirmed, pending });
            } catch (err) {
                setError(err);
                console.error('Error fetching appointments:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    if (loading) {
        return <div>Loading appointments...</div>;
    }

    if (error) {
        return <div>Error fetching appointments: {error.message}</div>;
    }

    // Data for the gender pie chart
    const genderOptions = {
        chart: {
            type: 'pie',
        },
        labels: ['Male', 'Female'],
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '22px',
                        },
                        value: {
                            show: true,
                            fontSize: '16px',
                        }
                    }
                }
            },
        },
        colors: ['#008FFB', '#FF4560'],
    };

    const genderSeries = [genderData.male, genderData.female];

    // Data for the status pie chart
    const statusOptions = {
        chart: {
            type: 'pie',
        },
        labels: ['Confirmed', 'Pending'],
        plotOptions: {
            pie: {
                expandOnClick: false,
            }
        },
        colors: ['#28A745', '#FFC107'], // Different colors for status
    };

    const statusSeries = [statusData.confirmed, statusData.pending];

    return (
        <div className="container mx-auto p-6 bg-blue-100">
            <h1 className="show-Doctors-title text-4xl my-4 text-blue-800">Appointments Report</h1>

            <div className="flex justify-between mb-6">
                {/* Card for Gender Data */}
                <div className="bg-white rounded-lg p-4 shadow-md w-1/2 mr-4">
                    <h3 className="font-bold text-lg">Patient Gender Summary</h3>
                    <p>Male Patients: <span className="font-semibold">{genderData.male}</span></p>
                    <p>Female Patients: <span className="font-semibold">{genderData.female}</span></p>
                </div>

                {/* Card for Appointment Status Data */}
                <div className="bg-white rounded-lg p-4 shadow-md w-1/2">
                    <h3 className="font-bold text-lg">Total Appointments Summary</h3>
                    <p>Total Appointments: <span className="font-semibold">{appointments.length}</span></p>
                    <p>Confirmed: <span className="font-semibold">{statusData.confirmed}</span></p>
                    <p>Pending: <span className="font-semibold">{statusData.pending}</span></p>
                </div>
            </div>

            <div className="flex justify-between mb-6">
                {/* Pie Chart Card for Gender */}
                <div className="bg-white rounded-lg p-4 shadow-md w-1/2">
                    <h3>Female and Male Patients with Appointments</h3>
                    <Chart options={genderOptions} series={genderSeries} type="pie" width="400" />
                </div>

                {/* Pie Chart Card for Status */}
                <div className="bg-white rounded-lg p-4 shadow-md w-1/2 ml-4">
                    <h3>Confirmed and Pending Appointments</h3>
                    <Chart options={statusOptions} series={statusSeries} type="pie" width="400" />
                </div>
            </div>

            <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md text-sm">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-1 px-2 border-b text-left">First Name</th>
                        <th className="py-1 px-2 border-b text-left">Last Name</th>
                        <th className="py-1 px-2 border-b text-left">Contact</th>
                        <th className="py-1 px-2 border-b text-left">Email</th>
                        <th className="py-1 px-2 border-b text-left">NIC</th>
                        <th className="py-1 px-2 border-b text-left">Hospital</th>
                        <th className="py-1 px-2 border-b text-left">Gender</th>
                        <th className="py-1 px-2 border-b text-left">Appointment Date</th>
                        <th className="py-1 px-2 border-b text-left">Time</th>
                        <th className="py-1 px-2 border-b text-left">Doctor</th>
                        <th className="py-1 px-2 border-b text-left">Status</th>
                        <th className="py-1 px-2 border-b text-left">Reason</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment) => (
                        <tr key={appointment._id} className="hover:bg-gray-100">
                            <td className="py-1 px-2 border-b">{appointment.firstName}</td>
                            <td className="py-1 px-2 border-b">{appointment.lastName}</td>
                            <td className="py-1 px-2 border-b">{appointment.contactNumber}</td>
                            <td className="py-1 px-2 border-b">{appointment.email}</td>
                            <td className="py-1 px-2 border-b">{appointment.nic}</td>
                            <td className="py-1 px-2 border-b">{appointment.hospital}</td>
                            <td className="py-1 px-2 border-b">{appointment.gender}</td>
                            <td className="py-1 px-2 border-b">{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                            <td className="py-1 px-2 border-b">{appointment.appointmentTime}</td>
                            <td className="py-1 px-2 border-b">{appointment.doctor}</td>
                            <td className="py-1 px-2 border-b">{appointment.status}</td>
                            <td className="py-1 px-2 border-b">{appointment.reasonForVisit}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AppointmentsTable;
