import React from 'react';
import { Link } from 'react-router-dom';
import logo from './../../assets/logo.jpg'; // Adjust the path according to your structure

const AdminDash = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 h-screen bg-gray-800 text-white">
        <div className="flex items-center justify-center h-16">
          <img src={logo} alt="Logo" className="h-10" />
        </div>
        <nav className="mt-10">
          <ul>
            <li className="hover:bg-gray-700">
              <Link to="/stockreport" className="block px-4 py-2">Stock Report</Link>
            </li>
            <li className="hover:bg-gray-700">
              <Link to="/doctoreport" className="block px-4 py-2">Doctor Report</Link>
            </li>
            <li className="hover:bg-gray-700">
              <Link to="/doctorShedules/alldoctorShedules" className="block px-4 py-2">All Doctor Shedules</Link>
            </li>
            <li className="hover:bg-gray-700">
              <Link to="/doctors/alldoctors" className="block px-4 py-2">All Doctors</Link>
            </li>
            <li className="hover:bg-gray-700">
              <Link to="/Hospital/allHospital" className="block px-4 py-2">All Hospitals</Link>
            </li>
            
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Doctor Reports Box */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold">Doctor Reports</h2>
            <p className="mt-2">View and manage doctor reports.</p>
            <Link to="/doctoreport" className="text-blue-500 underline">Go to Doctor Reports</Link>
          </div>

          {/* Stock Reports Box */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold">Stock Reports</h2>
            <p className="mt-2">View and manage stock reports.</p>
            <Link to="/stockreport" className="text-blue-500 underline">Go to Stock Reports</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDash;
