// Home.jsx (HomePage Component)
import React from 'react';

import { Link } from 'react-router-dom';
import 'tailwindcss/tailwind.css'; // Ensure Tailwind CSS is set up

const HomePage = ({ user }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Use the Navbar component */}

      {/* Hero Section */}
      <header className="bg-blue-500 text-white py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to Our Hospital</h2>
          <p className="text-lg mb-8">
            We provide the best medical services to ensure your health and well-being.
          </p>
          <Link
            to="/appointments"
            className="bg-white text-blue-500 px-6 py-3 rounded-full font-semibold hover:bg-gray-200"
          >
            Book an Appointment
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Our Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <img
                src="/images/doctor.png"
                alt="Doctors"
                className="w-24 h-24 mx-auto mb-4"
              />
              <h4 className="text-xl font-semibold mb-2">Expert Doctors</h4>
              <p>Our doctors are highly trained and experienced in various medical fields.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <img
                src="/images/appointment.png"
                alt="Appointments"
                className="w-24 h-24 mx-auto mb-4"
              />
              <h4 className="text-xl font-semibold mb-2">Easy Appointments</h4>
              <p>Book appointments with ease using our online system anytime, anywhere.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <img
                src="/images/consultation.png"
                alt="Consultation"
                className="w-24 h-24 mx-auto mb-4"
              />
              <h4 className="text-xl font-semibold mb-2">24/7 Consultation</h4>
              <p>We offer 24/7 consultation services to ensure you get the care you need.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-6">
        <div className="container mx-auto text-center">
          <p>© 2024 Hospital Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;