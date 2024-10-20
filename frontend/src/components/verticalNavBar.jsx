import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-gray-800 text-white flex flex-col p-5 shadow-lg fixed top-16 left-0">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <nav className="flex flex-col space-y-4">
        <Link
          to="/"
          className="text-lg hover:bg-teal-600 hover:text-white rounded-lg px-3 py-2 transition-colors duration-300"
        >
          Home
        </Link>

        <Link
          to="/appointments"
          className="text-lg hover:bg-teal-600 hover:text-white rounded-lg px-3 py-2 transition-colors duration-300"
        >
          Appointments
        </Link>

        <Link
          to="/settings"
          className="text-lg hover:bg-teal-600 hover:text-white rounded-lg px-3 py-2 transition-colors duration-300"
        >
          Doctors
        </Link>

        <Link
          to="/profile"
          className="text-lg hover:bg-teal-600 hover:text-white rounded-lg px-3 py-2 transition-colors duration-300"
        >
          Profile
        </Link>

        <Link
          to="/updateCrop/6713c19db41562a5732582c4"
          className="text-lg hover:bg-teal-600 hover:text-white rounded-lg px-3 py-2 transition-colors duration-300"
        >
          Medical Info
        </Link>

        <Link
          to="/allCrops"
          className="text-lg hover:bg-teal-600 hover:text-white rounded-lg px-3 py-2 transition-colors duration-300"
        >
          Medical Report
        </Link>

        <Link
          to="/treatment"
          className="text-lg hover:bg-teal-600 hover:text-white rounded-lg px-3 py-2 transition-colors duration-300"
        >
          Treatments
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
