import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import AppointmentsList from './Appointment/AllAppointments';
import defaultProfilePicture from '../assets/user-profile-icon.png';
import Sidebar from './verticalNavBar';
import backgroundImage from '../assets/background.png';

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setProfileData(user.user);
    } else {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setProfileData(storedUser.user);
      }
    }
  }, [user]);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  if (!profileData) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="fixed mt-20">
        <Sidebar />
      </div>

      <div className="flex-1 ml-72 p-8 bg-white bg-opacity-90 rounded-xl shadow-lg mt-10 mr-10">
        <h1 className="text-4xl font-bold text-center text-black mb-8">Profile</h1>
        <div className="flex items-center mb-8 space-x-6">
          <img
            src={profileData.profilePicture || defaultProfilePicture}
            alt="Profile"
            className="w-40 h-40 rounded-full border-4 border-blue-500 shadow-lg"
          />
          <div className="bg-slate-400 p-6 rounded-lg shadow-inner w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-lg font-semibold text-gray-800"><strong>Name:</strong> {profileData.username}</p>
                <p className="text-lg font-semibold text-gray-800"><strong>Email:</strong> {profileData.email}</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800"><strong>Contact Number:</strong> {profileData.contactNumber}</p>
                <p className="text-lg font-semibold text-gray-800"><strong>Address:</strong> {profileData.address}</p>
              </div>
            </div>
          </div>
        </div>

        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300"
          onClick={logout}
        >
          Logout
        </button>

        <div className="mt-12">
          <h2 className="text-3xl font-bold text-blue-600 mb-6">My Appointments</h2>
          <AppointmentsList userId={profileData._id} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
