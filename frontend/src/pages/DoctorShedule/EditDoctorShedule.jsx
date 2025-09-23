import React, { useState, useEffect } from 'react';
import Spinner from '../../components/Spinner';
import api from '../../config/api';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import backgroundImage from '../../assets/background.png'; // Import your background image

const timeOptions = [
    "09:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "12:00-01:00",
    "01:00-02:00",
    "02:00-03:00",
    "03:00-04:00",
    "04:00-05:00",
    "05:00-06:00",
    "06:00-07:00",
];

const EditDoctorSchedule = () => {
    const [doctorID, setDoctorID] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [date, setDate] = useState('');
    const [timeSlots, setTimeSlots] = useState(['']);
    const [maxAppointments, setMaxAppointments] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        api.get(`/doctorShedules/${id}`)
            .then((response) => {
                const schedule = response.data;
                setDoctorID(schedule.DoctorID || '');
                setDoctorName(schedule.DoctorName || '');
                setSpecialization(schedule.Specialization || '');
                setDate(schedule.Date || '');
                setTimeSlots(schedule.TimeSlots || ['']);
                setMaxAppointments(schedule.MaxAppointments || '');
                setLocation(schedule.Location || '');
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.error('Error fetching schedule:', error);
            });
    }, [id]);

    const validateForm = () => {
        if (!doctorID || !doctorName || !specialization || !date || !maxAppointments || !location || timeSlots.some(slot => !slot)) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fill out all fields correctly!',
            });
            return false;
        }
        return true;
    };

    const handleEditSchedule = () => {
        if (!validateForm()) return; // If validation fails, stop here

        const data = {
            DoctorID: doctorID,
            DoctorName: doctorName,
            Specialization: specialization,
            Date: date,
            TimeSlots: timeSlots,
            MaxAppointments: maxAppointments,
            Location: location,
        };

        setLoading(true);
        api.put(`/doctorShedules/${id}`, data)
            .then(() => {
                setLoading(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Schedule updated successfully!',
                });
                navigate('/doctorShedules/alldoctorShedules');
            })
            .catch((error) => {
                setLoading(false);
                console.error('Error updating schedule:', error.response ? error.response.data : error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to update schedule!',
                });
            });
    };

    const addTimeSlot = () => {
        setTimeSlots([...timeSlots, '']);
    };

    const removeTimeSlot = (index) => {
        const newTimeSlots = timeSlots.filter((_, i) => i !== index);
        setTimeSlots(newTimeSlots);
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="bg-white bg-opacity-90 shadow-md rounded-lg p-8 w-11/12 mt-5 mb-6 md:w-1/2">
                <h1 className='text-3xl text-center my-4 text-blue-600'>Edit Doctor Schedule</h1>
                {loading ? <Spinner /> : (
                    <div className='flex flex-col'>
                        <div className='my-4'>
                            <label className='text-xl mr-4 text-gray-500'>Doctor ID</label>
                            <input
                                type='text'
                                value={doctorID}
                                onChange={(e) => setDoctorID(e.target.value)}
                                className='border-2 border-gray-500 px-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
                            />
                        </div>
                        <div className='my-4'>
                            <label className='text-xl mr-4 text-gray-500'>Doctor Name</label>
                            <input
                                type='text'
                                value={doctorName}
                                onChange={(e) => setDoctorName(e.target.value)}
                                className='border-2 border-gray-500 px-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
                            />
                        </div>
                        <div className='my-4'>
                            <label className='text-xl mr-4 text-gray-500'>Specialization</label>
                            <input
                                type='text'
                                value={specialization}
                                onChange={(e) => setSpecialization(e.target.value)}
                                className='border-2 border-gray-500 px-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
                            />
                        </div>
                        <div className='my-4'>
                            <label className='text-xl mr-4 text-gray-500'>Date</label>
                            <input
                                type='date'
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className='border-2 border-gray-500 px-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
                            />
                        </div>
                        <h2 className='text-xl text-gray-500'>Time Slots</h2>
                        {timeSlots.map((slot, index) => (
                            <div key={index} className='my-4'>
                                <select
                                    value={slot}
                                    onChange={(e) => handleTimeSlotChange(index, e.target.value)}
                                    className='border-2 border-gray-500 px-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
                                >
                                    <option value="">Select a Time Slot</option>
                                    {timeOptions.map((time, i) => (
                                        <option key={i} value={time}>{time}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => removeTimeSlot(index)}
                                    className='ml-2 bg-red-500 text-white px-4 py-2 rounded mt-2'
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={addTimeSlot}
                            className='bg-green-500 text-white px-4 py-2 rounded my-4'
                        >
                            Add Time Slot
                        </button>
                        <div className='my-4'>
                            <label className='text-xl mr-4 text-gray-500'>Max Appointments</label>
                            <input
                                type='number'
                                value={maxAppointments}
                                onChange={(e) => setMaxAppointments(e.target.value)}
                                className='border-2 border-gray-500 px-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
                            />
                        </div>
                        <div className='my-4'>
                            <label className='text-xl mr-4 text-gray-500'>Location</label>
                            <input
                                type='text'
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className='border-2 border-gray-500 px-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
                            />
                        </div>

                        <button onClick={handleEditSchedule} className='p-2 bg-sky-300 text-white rounded-md mt-4'>
                            Save Schedule
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditDoctorSchedule;
