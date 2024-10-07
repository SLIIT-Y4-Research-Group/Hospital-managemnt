import React from 'react';

const Profile = ({ user }) => {
  if (!user) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <img
          src={user.profilePicture || 'default_profile_picture.png'} // Fallback image
          alt="Profile"
          className="w-16 h-16 rounded-full border-2 border-gray-300"
        />
        <h1 className="text-xl font-semibold ml-4">{user.username}</h1>
      </div>
      <div className="text-gray-700">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Contact Number:</strong> {user.contactNumber}</p>
        <p><strong>Address:</strong> {user.address}</p>
        {/* Add other user details here */}
      </div>
    </div>
  );
};

export default Profile;
