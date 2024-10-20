import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserMd, FaCalendarCheck, FaHeadset, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import 'tailwindcss/tailwind.css'; // Ensure Tailwind CSS is set up

// Images for the slider
import doctorImage from './assets/medical-team.png';
import talk from './assets/conversation.png';
import appointment from './assets/appointment.png';
import hospital1 from './assets/hospital1.jpg';
import hospital2 from './assets/hospital2.jpg';
import hospital3 from './assets/hospital3.jpg';

const HomePage = ({ user }) => {
  const images = [hospital1, hospital2, hospital3];
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slide navigation
  const nextSlide = () => setCurrentSlide((currentSlide + 1) % images.length);
  const prevSlide = () => setCurrentSlide((currentSlide - 1 + images.length) % images.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Image Slider */}
      <div className="relative">
        <img src={images[currentSlide]} alt="Hospital" className="w-full object-cover" style={{ height: 500 }} />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-center text-white">
          <div>
            <h2 className="text-5xl font-extrabold mb-4">Welcome to Our Hospital</h2>
            <p className="text-xl mb-8">We provide the best medical services to ensure your health and well-being.</p>
            <Link
              to="/appointments"
              className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-200"
            >
              Book an Appointment
            </Link>
          </div>
        </div>
        {/* Slider Arrows */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 cursor-pointer text-white" onClick={prevSlide}>
          <FaChevronLeft size={30} />
        </div>
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-white" onClick={nextSlide}>
          <FaChevronRight size={30} />
        </div>
      </div>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-bold mb-12">Why Choose Us?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <FaUserMd className="text-blue-500 w-16 h-16 mx-auto mb-4" />
              <h4 className="text-2xl font-semibold mb-2">Expert Staff</h4>
              <p>We have a team of highly skilled professionals in various fields of medicine.</p>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <FaCalendarCheck className="text-blue-500 w-16 h-16 mx-auto mb-4" />
              <h4 className="text-2xl font-semibold mb-2">Advanced Technology</h4>
              <p>Our hospital is equipped with state-of-the-art medical equipment.</p>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <FaHeadset className="text-blue-500 w-16 h-16 mx-auto mb-4" />
              <h4 className="text-2xl font-semibold mb-2">Patient-Centered Care</h4>
              <p>We ensure that every patient receives personalized and compassionate care.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <h3 className="text-4xl font-bold text-center mb-12">Our Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:bg-blue-50 transition-colors duration-300">
              <img src={doctorImage} alt="Doctors" className="w-24 h-24 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Expert Doctors</h4>
              <p>Our doctors are highly trained and experienced in various medical fields.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:bg-blue-50 transition-colors duration-300">
              <img src={appointment} alt="Appointments" className="w-24 h-24 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Easy Appointments</h4>
              <p>Book appointments with ease using our online system anytime, anywhere.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:bg-blue-50 transition-colors duration-300">
              <img src={talk} alt="Consultation" className="w-24 h-24 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">24/7 Consultation</h4>
              <p>We offer 24/7 consultation services to ensure you get the care you need.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-bold mb-12">What Our Patients Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
              <p className="italic mb-4">"The doctors here saved my life. I can't thank them enough!"</p>
              <p className="font-semibold">- John Doe</p>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
              <p className="italic mb-4">"Best hospital experience I've ever had. The staff was so caring."</p>
              <p className="font-semibold">- Jane Smith</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-16 bg-blue-500 text-white">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-bold mb-12">Contact Us</h3>
          <p>Address: 1234 Health Ave, Wellness City</p>
          <p>Phone: (123) 456-7890</p>
          <p>Email: contact@hospital.com</p>
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
