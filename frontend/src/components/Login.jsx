import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { UserContext } from '../context/UserContext';
import Spinner from "./Spinner";
import backgroundImage from '../assets/background3.jpg'; // Import your background image

const Login = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            
            // Handle successful login - navigate based on role
            console.log(response.data);
            
            if (response.data && response.data.user) {
                // Store user data in context
                setUser(response.data);
                
                // Navigate based on user role
                const userRole = response.data.user.role;
                
                switch (userRole) {
                    case 'admin':
                        navigate('/admin');
                        break;
                    case 'doctor':
                        navigate(`/docHome/${response.data.user.id}`);
                        break;
                    case 'patient':
                    default:
                        navigate('/');
                        break;
                }
            }
        } catch (error) {
            console.error("Login failed:", error);
            setError("Invalid email or password.");
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
                <h1 className="text-3xl font-extrabold text-center text-blue-900 mb-6">Login</h1>

                {loading && <Spinner />}

                {error && <div className="text-red-600 text-center mb-4">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                
                <div className="text-center text-gray-600">
                    <span>Don&apos;t have an account? <a href="/docSignup" className="text-blue-500 hover:underline">Sign up</a></span>
                </div>
                </form>

                {/* Link to the doctor login page */}
                <div className="mt-4 text-center">
                    <Link to="/doctorLogin" className="text-blue-600 hover:underline text-sm">
                        Go to Doctor Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
