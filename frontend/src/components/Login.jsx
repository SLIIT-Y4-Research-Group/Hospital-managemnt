import { useState, useContext } from 'react';
import { auth, googleProvider, facebookProvider } from '../config/firebaseAuth';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
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

    // Google login handler
    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            setUser({ user });
            navigate('/'); // Redirect after login
        } catch (err) {
            setError('Google login failed.');
        } finally {
            setLoading(false);
        }
    };

    // Facebook login handler
    const handleFacebookLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            const user = result.user;
            setUser({ user });
            navigate('/'); // Redirect after login
        } catch (err) {
            setError('Facebook login failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/api/auth/login', { email, password });
            
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

                    {/* Google Login Button */}
                    <div className="mb-6">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" className="mr-2"><path fill="#4285F4" d="M24 9.5c3.54 0 6.73 1.22 9.24 3.22l6.93-6.93C36.16 2.34 30.4 0 24 0 14.61 0 6.4 5.48 2.44 13.44l8.06 6.27C12.98 13.09 17.13 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.54-.14-3.03-.39-4.47H24v8.47h12.44c-.54 2.91-2.18 5.38-4.64 7.04l7.19 5.59C43.98 37.09 46.1 31.23 46.1 24.5z"/><path fill="#FBBC05" d="M10.5 28.73c-1.13-3.36-1.13-6.97 0-10.33l-8.06-6.27C.81 16.09 0 19.94 0 24c0 4.06.81 7.91 2.44 11.87l8.06-6.27z"/><path fill="#EA4335" d="M24 48c6.4 0 12.16-2.11 16.68-5.77l-7.19-5.59c-2.01 1.35-4.59 2.16-7.49 2.16-6.87 0-11.02-3.59-13.5-7.17l-8.06 6.27C6.4 42.52 14.61 48 24 48z"/></svg>
                            Continue with Google
                        </button>
                    </div>

                    {/* Facebook Login Button */}
                    <div className="mb-6">
                        <button
                            type="button"
                            onClick={handleFacebookLogin}
                            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" className="mr-2"><path fill="#1877F3" d="M24 1C11.85 1 2 10.85 2 23c0 10.45 7.95 19.05 18.25 20.75V31.1h-5.5v-6.1h5.5v-4.65c0-5.45 3.3-8.45 8.2-8.45 2.35 0 4.8.4 4.8.4v5.3h-2.7c-2.65 0-3.45 1.65-3.45 3.35v4.05h5.85l-.95 6.1h-4.9v12.65C38.05 42.05 46 33.45 46 23c0-12.15-9.85-22-22-22z"/></svg>
                            Continue with Facebook
                        </button>
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
