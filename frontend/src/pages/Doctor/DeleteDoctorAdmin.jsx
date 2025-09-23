import React, { useState } from 'react';
// import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import api from '../../config/api';
import { useNavigate, useParams } from 'react-router-dom';
import backgroundImage from '../../assets/background.png'; // Import your background image


const DeleteDoctor = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDeleteDoctor = () => {
    setLoading(true);
    api
      .delete(`/doctors/${id}`)
      .then(() => {
        setLoading(false);
        navigate('/doctors/alldoctors');
      })
      .catch((error) => {
        setLoading(false);
        // alert('An error happened. Please Chack console');
        console.log(error);
      });
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
        {/* <BackButton destination='/doctors/alldoctors' /> */}
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto'>
      <h1 className='text-3xl my-4'>Delete Doctor</h1>

        <h3 className='text-2xl'>Are You Sure You want to delete this Doctor?</h3>

        <button
          className='p-4 bg-red-600 text-white m-8 w-full'
          onClick={handleDeleteDoctor}
        >
          Yes, Delete it
        </button>
      </div>
    </div>
  )
}

export default DeleteDoctor;