import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import AppointmentsList from './Appointment/AllAppointments';
import defaultProfilePicture from '../assets/user-profile-icon.png';
import Sidebar from './verticalNavBar';
import backgroundImage from '../assets/background.png';

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate(); // Updated to useNavigate

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
    navigate('/login'); // Redirect using navigate
  };

  if (!profileData) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="fixed mt-20">
        <Sidebar />
      </div>

      <div className="flex-1 ml-72 p-6 bg-white bg-opacity-90 rounded-xl shadow-md mt-10 mr-10">
        <h1 className="text-3xl font-bold text-center text-black-600 mb-6 text-black">Profile</h1>
        <div className="flex items-center mb-6 space-x-4">
          <img
            src={profileData.profilePicture || defaultProfilePicture}
            alt="Profile"
            className="w-40 h-40 rounded-full border-4 border-blue-600 shadow-lg"
          />
          <div className="bg-slate-300 p-4 rounded-lg shadow-inner">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-lg font-medium text-gray-800"><strong>Name:</strong> {profileData.username}</p>
                <p className="text-lg font-medium text-gray-800"><strong>Email:</strong> {profileData.email}</p>
                <p className="text-lg font-medium text-gray-800"><strong>Contact Number:</strong> {profileData.contactNumber}</p>
                <p className="text-lg font-medium text-gray-800"><strong>Address:</strong> {profileData.address}</p>
              </div>
            </div>
          </div>
        </div>

        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow-md mt-4"
          onClick={logout}
        >
          Logout
        </button>

        <div className="mt-8 m-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">My Appointments</h2>
          <AppointmentsList userId={profileData._id} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
