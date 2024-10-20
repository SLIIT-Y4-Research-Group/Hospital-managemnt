import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from "./Spinner";
import backgroundImage from '../assets/background3.jpg'; // Import your background image
import { Link } from 'react-router-dom'; // Import Link for navigation


const Login = () => {
    const [DoctorID, setDoctorID] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const credentials = { DoctorID, Password: password };

        try {
            const response = await axios.post("http://localhost:5000/doctors/Login", credentials);
            const userData = response.data;

            if (userData) {
                localStorage.setItem('DoctorID', userData._id); // Store Doctor ID in local storage
                navigate(`/docHome/${userData._id}`);
                alert(`Welcome back, ${userData.Name}!`);
            } else {
                setError("Invalid credentials");
            }
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
            setError("Login failed: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen p-6"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.8)', // Slightly darken background
            }}
        >
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <h2 className="text-3xl font-extrabold text-center text-blue-900 mb-6">Doctor Login</h2>

                {loading && <Spinner />}

                {error && <div className="text-red-600 text-center mb-4">{error}</div>}

                <form id="login-form" onSubmit={onLogin}>
                    <div className="mb-6">
                        <label htmlFor="DoctorID" className="block text-gray-700">DoctorID</label>
                        <input
                            type="text"
                            name="DoctorID"
                            id="DoctorID"
                            onChange={(e) => setDoctorID(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                        />
                    </div>
                    <div className="mb-6">
                    <label htmlFor="Password" className="block text-gray-700">Password</label>

                        <input
                            type="password"
                            name="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            type="submit"
                            name="submit"
                            value="Log In"
                            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        />
                    </div>
                </form>
                <div className="text-center text-gray-600">
                    <span>Don't have an account? <a href="/docSignup" className="text-blue-500 hover:underline">Sign up</a></span>
                </div>
                {/* Link to the doctor login page */}
                <div className="mt-4 text-center">
                    <Link to="/login" className="text-blue-600 hover:underline text-sm">
                        Go to Patient Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
