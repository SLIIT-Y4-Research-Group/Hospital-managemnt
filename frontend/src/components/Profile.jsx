import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext'; // Adjust the path as necessary

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
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">User Profile</h1>
      <div className="flex items-center mb-4">
        <img
          src={profileData.profilePicture || 'default_profile_picture.png'} // Fallback image
          alt="Profile"
          className="w-16 h-16 rounded-full border-2 border-gray-300"
        />
        <h1 className="text-xl font-semibold ml-4">{profileData.username}</h1>
      </div>
      <div className="text-gray-700">
        <p><strong>Email:</strong> {profileData.email}</p>
        <p><strong>Contact Number:</strong> {profileData.contactNumber}</p>
        <p><strong>Address:</strong> {profileData.address}</p>
        {/* Add other user details here */}
      </div>
    </div>
  );
};

export default Profile;
