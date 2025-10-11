import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', contactNumber: '', email: '', address: '', password: ''
  });
  const [loading, setLoading] = useState(false);
  // Passkey flow disabled: directly navigate to OTP after signup.

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await api.post('/api/auth/signup', formData);
      alert('Signup Successful! Please check your email for OTP verification.');
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (error) {
      console.log(error?.response?.data || error.message);
      alert('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
      {(
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 space-y-4 relative">
          {loading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
              <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <input 
            type="text" 
            name="username" 
            placeholder="Username" 
            onChange={handleChange} 
            required 
            disabled={loading}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
          />
          <input 
            type="text" 
            name="contactNumber" 
            placeholder="Contact Number" 
            onChange={handleChange} 
            required 
            disabled={loading}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            onChange={handleChange} 
            required 
            disabled={loading}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
          />
          <input 
            type="text" 
            name="address" 
            placeholder="Address" 
            onChange={handleChange} 
            required 
            disabled={loading}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            onChange={handleChange} 
            required 
            disabled={loading}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 disabled:opacity-60"
          >
            {loading ? 'Processing...' : 'Sign Up'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Signup;
