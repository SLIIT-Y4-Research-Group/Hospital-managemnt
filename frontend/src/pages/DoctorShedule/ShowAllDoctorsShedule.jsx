import React, { useEffect, useState } from 'react';
import api from '../../config/api';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import Spinner from "../../components/Spinner";
import logo from './../../assets/logo.jpg'; // Adjust the path according to your structure

const ShowDoctorSchedule = () => {
    const [doctorSchedules, setDoctorSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchDoctorSchedules = async () => {
            try {
                const response = await api.get('/doctorShedules'); // Adjust API endpoint if needed
                if (response.data && Array.isArray(response.data.data)) {
                    setDoctorSchedules(response.data.data); // Access the array of doctorSchedules here
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

    const filteredDoctorSchedules = doctorSchedules.filter(schedule =>
        Object.values(schedule).some(value =>
            value.toString().toLowerCase().includes(searchQuery)
        )
    );

    return (
        <div className="flex">
            {/* Sidebar */}
            <aside className="w-64 h-screen bg-gray-800 text-white">
                <div className="flex items-center justify-center h-16">
                    <img src={logo} alt="Logo" className="h-10" />
                </div>
                <nav className="mt-10">
                    <ul>
                        <li className="hover:bg-gray-700">
                            <Link to="/stockreport" className="block px-4 py-2">Stock Report</Link>
                        </li>
                        <li className="hover:bg-gray-700">
                            <Link to="/doctoreport" className="block px-4 py-2">Doctor Report</Link>
                        </li>
                        <li className="hover:bg-gray-700">
                            <Link to="/doctorShedules/alldoctorShedules" className="block px-4 py-2">All Doctor Shedules</Link>
                        </li>
                        <li className="hover:bg-gray-700">
                            <Link to="/doctors/alldoctors" className="block px-4 py-2">All Doctors</Link>
                        </li>
                        <li className="hover:bg-gray-700">
                            <Link to="/Hospital/allHospital" className="block px-4 py-2">All Hospitals</Link>
                        </li>  
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 bg-gray-100 min-h-screen">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <h1 className="text-3xl my-4 text-blue-800">Doctor's Schedule List</h1>
                    <input
                        id="search"
                        type="text"
                        placeholder="Search doctorSchedules..."
                        className="text-lg p-2 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleSearchChange}
                    />
                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <Link to='/doctorShedules/create'>
                            <MdOutlineAddBox className='text-blue-800 text-4xl' />
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <Spinner />
                ) : error ? (
                    <div className="text-red-600">{error}</div>
                ) : (
                    <table className="w-full border border-blue-500 rounded-lg bg-white">
                        <thead>
                            <tr className="bg-blue-100">
                                <th className="p-4 border border-blue-300">Schedule ID</th>
                                <th className="p-4 border border-blue-300">Doctor ID</th>
                                <th className="p-4 border border-blue-300">Doctor Name</th>
                                <th className="p-4 border border-blue-300">Specialization</th>
                                <th className="p-4 border border-blue-300">Date</th>
                                <th className="p-4 border border-blue-300">Time Slots</th>
                                <th className="p-4 border border-blue-300">Max Appointments</th>
                                <th className="p-4 border border-blue-300">Location</th>
                                <th className="p-4 border border-blue-300">Fee</th>
                                <th className="p-4 border border-blue-300">Operations</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDoctorSchedules.map((schedule) => (
                                <tr key={schedule._id} className="text-center bg-white even:bg-blue-50">
                                    <td className="p-4 border border-blue-300">{schedule.SheduleID}</td>
                                    <td className="p-4 border border-blue-300">{schedule.DoctorID}</td>
                                    <td className="p-4 border border-blue-300">{schedule.DoctorName}</td>
                                    <td className="p-4 border border-blue-300">{schedule.Specialization}</td>
                                    <td className="p-4 border border-blue-300">{schedule.Date}</td>
                                    <td className="p-4 border border-blue-300">
                                        {schedule.TimeSlots && schedule.TimeSlots.length > 0 ? schedule.TimeSlots.join(', ') : 'No time slots available.'}
                                    </td>
                                    <td className="p-4 border border-blue-300">{schedule.MaxAppointments}</td>
                                    <td className="p-4 border border-blue-300">{schedule.Location}</td>
                                    <td className="p-4 border border-blue-300">{schedule.AppointmentFee}</td>
                                    <td className="p-4 border border-blue-300">
                                        <div className="flex justify-center gap-4">
                                            <Link to={`/doctorShedules/details/${schedule._id}`}>
                                                <BsInfoCircle className="text-2xl text-blue-800 hover:text-blue-600" />
                                            </Link>
                                            <Link to={`/doctorShedules/edit/${schedule._id}`}>
                                                <AiOutlineEdit className="text-2xl text-yellow-600 hover:text-yellow-500" />
                                            </Link>
                                            <Link to={`/doctorShedules/delete/${schedule._id}`}>
                                                <MdOutlineDelete className="text-2xl text-red-600 hover:text-red-500" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
        </div>
    );
};

export default ShowDoctorSchedule;
