import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from "../../components/Spinner";
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';

const ShowDoctorSchedule = () => {
    const [doctorSchedules, setdoctorSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchdoctorSchedules = async () => {
            try {
                const response = await axios.get('http://localhost:5000/doctorShedules'); // Adjust API endpoint if needed
                if (response.data && Array.isArray(response.data.data)) {
                    setdoctorSchedules(response.data.data); // Access the array of doctorSchedules here
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
    
        fetchdoctorSchedules();
    }, []);
    
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filtereddoctorSchedules = doctorSchedules.filter(schedule =>
        Object.values(schedule).some(value =>
            value.toString().toLowerCase().includes(searchQuery)
        )
    );

    return (
        <div className='p-6 bg-gray-100 min-h-screen'>
            <li>
                <Link to="/" className="text-green-800 hover:text-green-600">Home</Link>
            </li>
            <h1 className="show-doctorSchedules-title text-3xl my-4 text-green-800">Doctor's Schedule List</h1>
            <div className='flex flex-col md:flex-row justify-between items-center mb-6'>
                <label htmlFor="search" className="sr-only">Search doctorSchedules</label>
                <input
                    id="search"
                    type="text"
                    placeholder="Search doctorSchedules..."
                    className='text-lg my-4 p-2 border border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
                    onChange={handleSearchChange}
                />
                <div className="flex items-center space-x-4">
                    <Link to='/doctorShedules/create' className="flex items-center">
                        <MdOutlineAddBox className='text-green-800 text-4xl' />
                    </Link>
                </div>
            </div>

            {loading ? (
                <Spinner />
            ) : error ? (
                <div className="text-red-600">{error}</div>
            ) : (
                <table className='w-full border border-green-500 rounded-lg bg-white'>
                    <thead>
                        <tr className='bg-green-100'>
                            <th className='p-4 border border-green-300'>Schedule ID</th>
                            <th className='p-4 border border-green-300'>Doctor ID</th>
                            <th className='p-4 border border-green-300'>Doctor Name</th>
                            <th className='p-4 border border-green-300'>Specialization</th>
                            <th className='p-4 border border-green-300'>Date</th>
                            <th className='p-4 border border-green-300'>Time Slots</th>
                            <th className='p-4 border border-green-300'>Max Appointments</th>
                            <th className='p-4 border border-green-300'>Location</th>
                            <th className='p-4 border border-green-300'>Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtereddoctorSchedules.map((schedule) => (
                            <tr key={schedule._id} className='text-center bg-white even:bg-green-50'>
                                <td className='p-4 border border-green-300'>{schedule.SheduleID}</td>
                                <td className='p-4 border border-green-300'>{schedule.DoctorID}</td>
                                <td className='p-4 border border-green-300'>{schedule.DoctorName}</td>
                                <td className='p-4 border border-green-300'>{schedule.Specialization}</td>
                                <td className='p-4 border border-green-300'>{schedule.Date}</td>
                                <td className='p-4 border border-green-300'>
                                    {schedule.TimeSlots && schedule.TimeSlots.length > 0 ? schedule.TimeSlots.join(', ') : 'No time slots available.'}
                                </td>
                                <td className='p-4 border border-green-300'>{schedule.MaxAppointments}</td>
                                <td className='p-4 border border-green-300'>{schedule.Location}</td>
                                <td className='p-4 border border-green-300'>
                                    <div className='flex justify-center gap-4'>
                                        <Link to={`/doctorShedules/details/${schedule._id}`}>
                                            <BsInfoCircle className='text-2xl text-green-800 hover:text-green-600' />
                                        </Link>
                                        <Link to={`/doctorShedules/edit/${schedule._id}`}>
                                            <AiOutlineEdit className='text-2xl text-yellow-600 hover:text-yellow-500' />
                                        </Link>
                                        <Link to={`/doctorShedules/delete/${schedule._id}`}>
                                            <MdOutlineDelete className='text-2xl text-red-600 hover:text-red-500' />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ShowDoctorSchedule;
