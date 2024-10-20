import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import backgroundImage from '../../assets/background.png'; // Import your background image

const ShowHospital = () => {
  const [hospital, setHospital] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/hospitals/${id}`) // Updated API endpoint
      .then((response) => {
        setHospital(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching hospital:', error);
        setLoading(false);
      });
  }, [id]);

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
        <h1 className='text-3xl my-4 text-center'>Hospital Details</h1>
        {loading ? (
          <Spinner />
        ) : (
          <div className='flex flex-col border-2 border-sky-400 rounded-xl p-4 mx-auto'>
            <div className='my-4'>
              <span className='text-xl mr-4 text-gray-500'>Hospital ID</span>
              <span>{hospital.HospitalID || 'N/A'}</span>
            </div>
            <div className='my-4'>
              <span className='text-xl mr-4 text-gray-500'>Name</span>
              <span>{hospital.Name || 'N/A'}</span>
            </div>
            <div className='my-4'>
              <span className='text-xl mr-4 text-gray-500'>Departments</span>
              <span>{hospital.Departments && hospital.Departments.length > 0 ? hospital.Departments.join(', ') : 'No departments available.'}</span>
            </div>
            <div className='my-4'>
              <span className='text-xl mr-4 text-gray-500'>Contact No</span>
              <span>{hospital.ContactNo && hospital.ContactNo.length > 0 ? hospital.ContactNo.join(', ') : 'No contact numbers available.'}</span>
            </div>
            <div className='my-4'>
              <span className='text-xl mr-4 text-gray-500'>Email</span>
              <span>{hospital.Email || 'N/A'}</span>
            </div>
            <div className='my-4'>
              <span className='text-xl mr-4 text-gray-500'>Address</span>
              <span>{hospital.Address || 'N/A'}</span>
            </div>
            <div className='my-4'>
              <span className='text-xl mr-4 text-gray-500'>Doctors</span>
              <span>{hospital.Doctors && hospital.Doctors.length > 0 ? hospital.Doctors.join(', ') : 'No doctors available.'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowHospital;
