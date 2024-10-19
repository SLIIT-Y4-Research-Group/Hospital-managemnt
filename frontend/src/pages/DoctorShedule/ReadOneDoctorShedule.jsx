import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';

const ShowDoctorSchedule = () => {
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/doctorShedules/${id}`)
      .then((response) => {
        setSchedule(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching schedule:', error);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className='p-4'>
      <BackButton destination='/doctorShedules/alldoctorShedules' />
      <h1 className='text-3xl my-4'>Doctor Schedule Details</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Schedule ID</span>
            <span>{schedule.SheduleID || 'N/A'}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Doctor ID</span>
            <span>{schedule.DoctorID || 'N/A'}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Doctor Name</span>
            <span>{schedule.DoctorName || 'N/A'}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Specialization</span>
            <span>{schedule.Specialization || 'N/A'}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Date</span>
            <span>{schedule.Date || 'N/A'}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Time Slots</span>
            <span>{schedule.TimeSlots && schedule.TimeSlots.length > 0 ? schedule.TimeSlots.join(', ') : 'No time slots available.'}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Max Appointments</span>
            <span>{schedule.MaxAppointments || 'N/A'}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Location</span>
            <span>{schedule.Location || 'N/A'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowDoctorSchedule;
