import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext'; // Adjust the path as necessary
import AppointmentsList from './AllAppointments'; // Import the AppointmentsList component
import defaultProfilePicture from '../assets/user-profile-icon.png'; // Adjust the path as needed
import Sidebar from './verticalNavBar'; // Import the Sidebar component
import backgroundImage from '../assets/background.png'; // Import your background image (adjust the path as necessary)

const Profile = () => {
  const { user } = useContext(UserContext);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Check if user is logged in and set profile data
    if (user) {
      setProfileData(user.user); // Assuming user contains the user object
    } else {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setProfileData(storedUser.user); // Assuming user contains the user object
      }
    }
  }, [user]);

  if (!profileData) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Fixed Sidebar */}
      <div className="fixed mt-20">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64 p-6 bg-white bg-opacity-90 rounded-xl shadow-md mt-10 mr-10">
        <h1 className="text-3xl font-bold text-center text-black-600 mb-6">Profile</h1>
        <div className="flex items-center mb-6 space-x-4">
          <img
            src={profileData.profilePicture || defaultProfilePicture} // Fallback to local image
            alt="Profile"
            className="w-40 h-40 rounded-full border-4 border-blue-600 shadow-lg" // Increased size
          />
          <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
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
        <div className="mt-8 m-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">My Appointments</h2>
          {/* AppointmentsList component */}
          <AppointmentsList userId={profileData._id} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
