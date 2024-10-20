import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Spinner from "../../components/Spinner";
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';

const ShowDoctorSchedule = () => {
    const { doctorId } = useParams(); // Get DoctorID from URL params
    const [doctorSchedules, setDoctorSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchDoctorSchedules = async () => {
            try {
                const response = await axios.get('http://localhost:5000/doctorShedules'); // Adjust API endpoint if needed
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
        <div className="doctor-schedule-container">
            <div className="sidebar">
                <h2>Sidebar</h2>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/doctors/cards">Doctor cards</Link></li>
                    <li><Link to={`/myAppointments/${doctorId}`}>My Appointments</Link></li>
                    <li><Link to={`/mySchedule/${doctorId}`}>My Schedule</Link></li>
                    <li><Link to="/SpecializationCard">SpecializationCard</Link></li>
                </ul>
            </div>

            <div className="schedule-content">
                <h1 className="show-doctorSchedules-title text-3xl my-4 text-blue-800">Doctor's Schedule List</h1>
                <div className='flex flex-col md:flex-row justify-between items-center mb-6'>
                    <label htmlFor="search" className="sr-only">Search doctorSchedules</label>
                    <input
                        id="search"
                        type="text"
                        placeholder="Search doctorSchedules..."
                        className='text-lg my-4 p-2 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onChange={handleSearchChange}
                    />
                    
                </div>

                {loading ? (
                    <Spinner />
                ) : error ? (
                    <div className="text-red-600">{error}</div>
                ) : (
                    <table className='w-full border border-blue-500 rounded-lg bg-white'>
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
                                <th className='p-4 border border-blue-300'>Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDoctorSchedules.map((schedule) => (
                                <tr key={schedule._id} className='text-center bg-white even:bg-blue-50'>
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
                                    <td className='p-4 border border-blue-300'>
                                        <div className='flex justify-center gap-4'>
                                            <Link to={`/doctorShedules/details/${schedule._id}`}>
                                                <BsInfoCircle className='text-2xl text-blue-800 hover:text-blue-600' />
                                            </Link>
                                           
                                        </div>
                                    </td>
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

                .schedule-content {
                    flex: 1;
                    padding: 20px;
                }

                .show-doctorSchedules-title {
                    color: #333;
                    margin-bottom: 20px;
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
                }

                .flex {
                    display: flex;
                }

                .flex-col {
                    flex-direction: column;
                }

                .md\\:flex-row {
                    flex-direction: row;
                }

                .justify-between {
                    justify-content: space-between;
                }

                .text-blue-800 {
                    color: #27ae60;
                }

                .text-yellow-600 {
                    color: #f39c12;
                }

                .text-red-600 {
                    color: #e74c3c;
                }

                .hover\\:text-blue-600:hover {
                    color: #219653;
                }

                .hover\\:text-yellow-500:hover {
                    color: #e67e22;
                }

                .hover\\:text-red-500:hover {
                    color: #c0392b;
                }
            `}</style>
        </div>
    );
};

export default ShowDoctorSchedule;
