import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-full text-black flex flex-col  mr-20 mt-20">
      <nav className="flex flex-col space-y-4">
        <Link
          to="/"
          className="text-lg bg-white hover:text-orange-500 rounded-tr-2xl rounded-br-2xl px-2 py-1 shadow transition-colors duration-300"
        >
          Home
        </Link>

        <Link
          to="/appointments"
          className="text-lg bg-white hover:text-orange-500 rounded-tr-2xl rounded-br-2xl px-2 py-1 shadow transition-colors duration-300"
        >
          Appointments
        </Link>

        <Link
          to="/settings"
          className="text-lg bg-white hover:text-orange-500 rounded-tr-2xl rounded-br-2xl px-2 py-1 shadow transition-colors duration-300"
        >
          Doctors
        </Link>

        <Link
          to="/profile"
          className="text-lg bg-white hover:text-orange-500 rounded-tr-2xl rounded-br-2xl px-2 py-1 shadow transition-colors duration-300"
        >
          Profile
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
