import React from 'react';
import { Link } from 'react-router-dom';
import logo from './../../assets/logo.jpg'; // Adjust the path according to your structure
import blue_bg from './../../assets/blue_bg.jpg'; // Adjust the path according to your structure

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
              <Link to="/stockreport" className="block px-4 py-2">Stock Reports</Link>
            </li>
            <li className="hover:bg-gray-700">
              <Link to="/AppointmentsTable" className="block px-4 py-2">Appointment Reports</Link>
            </li>
            <li className="hover:bg-gray-700">
              <Link to="/hospitalreport" className="block px-4 py-2">Hospital Reports</Link>
            </li>
            
            <li className="hover:bg-gray-700">
              <Link to="/doctoreport" className="block px-4 py-2">Doctor Reports</Link>
            </li>
            <li className="hover:bg-gray-700">
              <Link to="/doctorShedules/alldoctorShedules" className="block px-4 py-2">All Doctor Schedules</Link>
            </li>
            <li className="hover:bg-gray-700">
              <Link to="/doctors/alldoctors" className="block px-4 py-2">All Doctors</Link>
            </li>
            <li className="hover:bg-gray-700">
              <Link to="/Hospital/allHospital" className="block px-4 py-2">All Hospitals</Link>
            </li>
            <li className="hover:bg-gray-700">
              <Link to="/users" className="block px-4 py-2">All Patients</Link>
            </li>

          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8" style={{ backgroundImage: `url(${blue_bg})`, backgroundSize: 'cover' }}>
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-2 gap-4">
          {/* Doctor Reports Box */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold">Doctor Reports</h2>
            <p className="mt-2">
              View and manage comprehensive reports about doctor performance, including patient interactions, treatment outcomes, and scheduled appointments.
              <br />
              <strong>Key Features:</strong>
              <ul className="list-disc list-inside mt-1">
                <li>Track patient treatment histories</li>
                <li>Analyze appointment trends</li>
                <li>Generate performance metrics</li>
              </ul>
            </p>
            <Link to="/doctoreport" className="text-blue-500 underline">Go to Doctor Reports</Link>
          </div>

          {/* Appointment Reports Description Box */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold">Appointment Reports</h2>
            <p className="mt-2">
              Access and analyze detailed reports regarding patient appointments, including status updates, patient demographics, and scheduling trends.
              <br />
              <strong>Key Features:</strong>
              <ul className="list-disc list-inside mt-1">
                <li>Monitor appointment statuses (confirmed, pending)</li>
                <li>View patient demographics</li>
                <li>Generate scheduling reports</li>
              </ul>
            </p>
            <Link to="/AppointmentsTable" className="text-blue-500 underline">Go to Appointment Reports</Link>
          </div>

          {/* Stock Reports Box */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold">Stock Reports</h2>
            <p className="mt-2">
              View and manage detailed reports on the inventory of medical supplies, including stock levels, usage rates, and reordering schedules.
              <br />
              <strong>Key Features:</strong>
              <ul className="list-disc list-inside mt-1">
                <li>Monitor stock levels in real time</li>
                <li>Identify low-stock items</li>
                <li>Generate reorder recommendations</li>
              </ul>
            </p>
            <Link to="/stockreport" className="text-blue-500 underline">Go to Stock Reports</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDash;
