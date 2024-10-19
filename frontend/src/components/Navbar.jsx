import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; // Adjust the path as needed

const Navbar = () => {
  const { user } = useContext(UserContext);

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-2xl font-bold">Hospital Management System</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/appointments" className="hover:underline">Appointments</Link>
          <Link to="/doctors" className="hover:underline">Doctors</Link>
          <Link to="/services" className="hover:underline">Services</Link>
          {user ? (
            <Link to="/profile" className="hover:underline">Profile</Link>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/signup" className="hover:underline">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
