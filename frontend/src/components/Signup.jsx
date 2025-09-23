import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', contactNumber: '', email: '', address: '', password: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/signup', formData);
      alert('Signup Successful! Please check your email for OTP verification.');
      navigate('/verify-otp', { state: { email: formData.email } }); // Navigate to OTP verification with email
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 space-y-4">
        <input 
          type="text" 
          name="username" 
          placeholder="Username" 
          onChange={handleChange} 
          required 
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input 
          type="text" 
          name="contactNumber" 
          placeholder="Contact Number" 
          onChange={handleChange} 
          required 
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          onChange={handleChange} 
          required 
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input 
          type="text" 
          name="address" 
          placeholder="Address" 
          onChange={handleChange} 
          required 
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          onChange={handleChange} 
          required 
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
