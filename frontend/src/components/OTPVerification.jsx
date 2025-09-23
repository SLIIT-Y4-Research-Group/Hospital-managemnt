import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Spinner from "./Spinner";
import backgroundImage from '../assets/background3.jpg';

const OTPVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const inputRefs = useRef([]);

    // Get email from previous page state
    const email = location.state?.email || '';

    useEffect(() => {
        // Focus on first input when component mounts
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Handle backspace
        if (e.key === "Backspace") {
            if (otp[index] === "" && index > 0) {
                // If current input is empty, focus previous input
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text');
        const pasteArray = paste.slice(0, 6).split('');
        
        if (pasteArray.every(char => !isNaN(char))) {
            setOtp([...pasteArray, ...new Array(6 - pasteArray.length).fill("")]);
            // Focus the next empty input or last input
            const nextIndex = Math.min(pasteArray.length, 5);
            if (inputRefs.current[nextIndex]) {
                inputRefs.current[nextIndex].focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join("");
        
        if (otpValue.length !== 6) {
            setError("Please enter all 6 digits");
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axios.post('http://localhost:5000/api/auth/verify-otp', {
                email: email,
                otp: otpValue
            });

            setSuccess('Account verified successfully!');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error("OTP verification failed:", error);
            setError(error.response?.data?.message || "Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const resendOTP = async () => {
        if (!email) {
            setError("Email not found. Please sign up again.");
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axios.post('http://localhost:5000/api/auth/resend-otp', { email });
            setSuccess('OTP resent successfully! Check your email.');
        } catch (error) {
            console.error("Resend OTP failed:", error);
            setError(error.response?.data?.message || "Failed to resend OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Auto-submit when all 6 digits are entered
    useEffect(() => {
        const otpValue = otp.join("");
        if (otpValue.length === 6 && !loading) {
            // Small delay to allow user to see the complete OTP
            const timer = setTimeout(async () => {
                setLoading(true);
                setError('');
                setSuccess('');

                try {
                    await axios.post('http://localhost:5000/api/auth/verify-otp', {
                        email: email,
                        otp: otpValue
                    });

                    setSuccess('Account verified successfully!');
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                } catch (error) {
                    console.error("OTP verification failed:", error);
                    setError(error.response?.data?.message || "Invalid OTP. Please try again.");
                } finally {
                    setLoading(false);
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [otp, loading, email, navigate]);

    if (!email) {
        return (
            <div className="flex items-center justify-center min-h-screen p-6">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Access</h1>
                    <p className="mb-4">Please complete the signup process first.</p>
                    <button 
                        onClick={() => navigate('/signup')}
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Go to Sign Up
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="flex items-center justify-center min-h-screen p-6"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.8)',
            }}
        >
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Verify Your Account</h1>
                    <p className="text-gray-600">
                        Enter the 6-digit code sent to<br />
                        <span className="font-semibold">{email}</span>
                    </p>
                </div>

                {loading && <Spinner />}

                {error && (
                    <div className="text-red-600 text-center mb-4 p-3 bg-red-50 rounded-md">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="text-green-600 text-center mb-4 p-3 bg-green-50 rounded-md">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center space-x-2 mb-6">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                name="otp"
                                maxLength="1"
                                value={data}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onPaste={handlePaste}
                                ref={(el) => inputRefs.current[index] = el}
                                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                disabled={loading}
                            />
                        ))}
                    </div>

                    <div className="text-center mb-4">
                        <p className="text-sm text-gray-600 mb-2">
                            The OTP will be submitted automatically when all digits are entered
                        </p>
                        <button
                            type="submit"
                            disabled={loading || otp.join("").length !== 6}
                            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Didn&apos;t receive the code?</p>
                    <button
                        type="button"
                        onClick={resendOTP}
                        disabled={loading}
                        className="text-blue-600 hover:underline text-sm font-semibold disabled:opacity-50"
                    >
                        Resend OTP
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OTPVerification;