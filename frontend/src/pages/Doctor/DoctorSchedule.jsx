import React, { useEffect, useState } from 'react';
import api from '../../config/api';
import { Link, useParams } from 'react-router-dom';
import Spinner from "../../components/Spinner";
import { BsInfoCircle } from 'react-icons/bs';
import backgroundImage from '../../assets/background.png'; // Import your background image

const ShowDoctorSchedule = () => {
    const { doctorId } = useParams(); // Get DoctorID from URL params
    const [doctorSchedules, setDoctorSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchDoctorSchedules = async () => {
            try {
                const response = await api.get('/doctorShedules'); // Adjust API endpoint if needed
                if (response.data && Array.isArray(response.data.data)) {
                    setDoctorSchedules(response.data.data);
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

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    // Filter schedules based on the DoctorID from the URL and the search query
    const filteredDoctorSchedules = doctorSchedules.filter(schedule =>
        schedule.DoctorID === doctorId && 
        Object.values(schedule).some(value =>
            value.toString().toLowerCase().includes(searchQuery)
        )
    );

    return (
        <div
            className="flex items-center justify-center min-h-screen"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="schedule-content max-w-4xl w-full p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-3xl my-4 text-blue-800 font-bold">Doctor's Schedule List</h1>
                <div className='flex flex-col md:flex-row justify-between items-center mb-6'>
                    <label htmlFor="search" className="sr-only">Search doctorSchedules</label>
                    <input
                        id="search"
                        type="text"
                        placeholder="Search doctorSchedules..."
                        className='text-lg my-4 p-2 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200'
                        onChange={handleSearchChange}
                    />
                </div>

                {loading ? (
                    <Spinner />
                ) : error ? (
                    <div className="text-red-600">{error}</div>
                ) : (
                    <table className='w-full border border-blue-500 rounded-lg'>
                        <thead>
                            <tr className='bg-blue-100'>
                                <th className='p-4 border border-blue-300'>Schedule ID</th>
                                <th className='p-4 border border-blue-300'>Doctor ID</th>
                                <th className='p-4 border border-blue-300'>Doctor Name</th>
                                <th className='p-4 border border-blue-300'>Specialization</th>
                                <th className='p-4 border border-blue-300'>Date</th>
                                <th className='p-4 border border-blue-300'>Time Slots</th>
                                <th className='p-4 border border-blue-300'>Max Appointments</th>
                                <th className='p-4 border border-blue-300'>Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDoctorSchedules.map((schedule) => (
                                <tr key={schedule._id} className='text-center bg-white even:bg-blue-50 hover:bg-blue-100 transition duration-150'>
                                    <td className='p-4 border border-blue-300'>{schedule.SheduleID}</td>
                                    <td className='p-4 border border-blue-300'>{schedule.DoctorID}</td>
                                    <td className='p-4 border border-blue-300'>{schedule.DoctorName}</td>
                                    <td className='p-4 border border-blue-300'>{schedule.Specialization}</td>
                                    <td className='p-4 border border-blue-300'>{schedule.Date}</td>
                                    <td className='p-4 border border-blue-300'>
                                        {schedule.TimeSlots && schedule.TimeSlots.length > 0 ? schedule.TimeSlots.join(', ') : 'No time slots available.'}
                                    </td>
                                    <td className='p-4 border border-blue-300'>{schedule.MaxAppointments}</td>
                                    <td className='p-4 border border-blue-300'>{schedule.Location}</td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Inline CSS */}
            <style jsx>{`
                .doctor-schedule-container {
                    display: flex;
                    justify-content: flex-start;
                    min-height: 100vh;
                    background-color: #eaf0f7;
                }

                .schedule-content {
                    flex: 1;
                    padding: 20px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th, td {
                    padding: 10px;
                    border: 1px solid #dcdcdc;
                }

                th {
                    background-color: #f0f0f0;
                    font-weight: 600;
                }

                .text-blue-800 {
                    color: #007bff;
                }

                .text-red-600 {
                    color: #dc3545;
                }

                .hover\\:text-blue-600:hover {
                    color: #0056b3;
                }
            `}</style>
        </div>
    );
};

export default ShowDoctorSchedule;
