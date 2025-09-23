import User from '../models/user.js';
import { auth } from '../config/firebaseConfig.js';
import { generateOTP, sendOTPEmail, sendWelcomeEmail } from '../services/emailService.js';

export const signup = async (req, res) => {
  const { username, contactNumber, email, address, password, role } = req.body;

  try {
    // Validate role if provided
    const validRoles = ['admin', 'doctor', 'patient', 'staff'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be one of: admin, doctor, patient, staff' });
    }

    // Check if user already exists in MongoDB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isEmailVerified) {
        return res.status(400).json({ message: 'User already exists and is verified' });
      } else {
        // User exists but not verified, regenerate OTP and send email
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        existingUser.otp = otp;
        existingUser.otpExpires = otpExpires;
        existingUser.lastOtpSent = new Date();
        existingUser.updatedAt = new Date();
        
        await existingUser.save();

        // Send OTP email
        const emailResult = await sendOTPEmail(email, otp, username);
        if (!emailResult.success) {
          return res.status(500).json({ message: 'Failed to send verification email' });
        }

        return res.status(200).json({
          message: 'User already exists but not verified. New OTP sent to email.',
          requiresVerification: true,
          user: {
            id: existingUser._id,
            email: existingUser.email,
            username: existingUser.username
          }
        });
      }
    }

    let firebaseUser;
    try {
      // Try to get existing Firebase user first
      firebaseUser = await auth.getUserByEmail(email);
      console.log("Firebase user already exists:", firebaseUser.uid);
    } catch (firebaseError) {
      if (firebaseError.code === 'auth/user-not-found') {
        // Create user in Firebase Authentication if doesn't exist
        try {
          firebaseUser = await auth.createUser({
            email: email,
            password: password,
            displayName: username,
            disabled: true, // Disable until email verification
          });
          console.log("Firebase User Created:", firebaseUser.uid);
        } catch (createError) {
          console.error("Firebase user creation error:", createError);
          return res.status(400).json({ 
            message: createError.message || 'Failed to create Firebase user' 
          });
        }
      } else {
        console.error("Firebase error:", firebaseError);
        return res.status(500).json({ message: firebaseError.message });
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user record in MongoDB (inactive by default)
    const newUser = new User({
      firebaseUID: firebaseUser.uid,
      username,
      email,
      contactNumber,
      address,
      role: role || 'patient',
      isActive: false, // Inactive until email verification
      isEmailVerified: false,
      otp: otp,
      otpExpires: otpExpires,
      lastOtpSent: new Date()
    });

    await newUser.save();

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, username);
    if (!emailResult.success) {
      // If email fails, clean up created records
      await User.findByIdAndDelete(newUser._id);
      try {
        await auth.deleteUser(firebaseUser.uid);
      } catch (cleanupError) {
        console.error('Error cleaning up Firebase user:', cleanupError);
      }
      return res.status(500).json({ message: 'Failed to send verification email' });
    }

    res.status(201).json({
      message: 'User registered successfully. Please check your email for verification OTP.',
      requiresVerification: true,
      user: {
        id: newUser._id,
        firebaseUID: firebaseUser.uid,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        isActive: false,
        isEmailVerified: false
      }
    });

  } catch (err) {
    console.error('Signup error:', err);
    
    // Handle specific Firebase errors
    if (err.code === 'auth/email-already-exists') {
      return res.status(400).json({ message: 'User with this email already exists in Firebase' });
    } else if (err.code === 'auth/invalid-email') {
      return res.status(400).json({ message: 'Invalid email address' });
    } else if (err.code === 'auth/weak-password') {
      return res.status(400).json({ message: 'Password is too weak' });
    } else if (err.code === 11000) {
      // MongoDB duplicate key error
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  const { idToken, email, password } = req.body; // Support both Firebase ID token and email/password

  try {
    let firebaseUID;
    let firebaseUser;

    // Method 1: Firebase ID token (preferred for production)
    if (idToken) {
      if (typeof idToken !== 'string' || idToken.trim() === '') {
        return res.status(400).json({ message: 'Invalid ID token format' });
      }

      try {
        // Verify the Firebase ID token
        const decodedToken = await auth.verifyIdToken(idToken);
        firebaseUID = decodedToken.uid;
        console.log("Firebase UID from token:", firebaseUID);
      } catch (tokenError) {
        console.error('Token verification error:', tokenError);
        return res.status(401).json({ message: 'Invalid or expired ID token' });
      }
    } 
    // Method 2: Email/Password (for testing and development)
    else if (email && password) {
      try {
        // Get Firebase user by email
        firebaseUser = await auth.getUserByEmail(email);
        firebaseUID = firebaseUser.uid;
        console.log("Firebase UID from email lookup:", firebaseUID);
        
        // Note: In production, you should validate password through Firebase Client SDK
        // This is a simplified approach for testing
      } catch (emailError) {
        console.error('Email lookup error:', emailError);
        return res.status(401).json({ message: 'User not found in Firebase' });
      }
    } else {
      return res.status(400).json({ 
        message: 'Please provide either idToken or email/password for login' 
      });
    }

    // Find user in MongoDB using Firebase UID
    const user = await User.findOne({ firebaseUID });
    
    if (!user) {
      return res.status(404).json({ message: 'User profile not found. Please complete registration.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'User account is disabled' });
    }

    // Update last login time
    user.updatedAt = new Date();
    await user.save();

    // Create custom token with user data
    const customToken = await auth.createCustomToken(firebaseUID, {
      role: user.role,
      userId: user._id.toString()
    });

    res.status(200).json({
      message: 'Login successful',
      customToken,
      user: {
        id: user._id,
        firebaseUID: user.firebaseUID,
        username: user.username,
        email: user.email,
        role: user.role,
        contactNumber: user.contactNumber,
        address: user.address
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    
    // Handle specific Firebase errors
    if (err.code === 'auth/id-token-expired') {
      return res.status(401).json({ message: 'ID token has expired' });
    } else if (err.code === 'auth/id-token-revoked') {
      return res.status(401).json({ message: 'ID token has been revoked' });
    } else if (err.code === 'auth/invalid-id-token') {
      return res.status(401).json({ message: 'Invalid ID token' });
    } else if (err.code === 'auth/argument-error') {
      return res.status(400).json({ message: 'Invalid token format provided' });
    }
    
    res.status(500).json({ message: err.message });
  }
};

// Logout function (revoke refresh tokens)
export const logout = async (req, res) => {
  const { firebaseUID } = req.body;

  try {
    // Revoke all refresh tokens for the user
    await auth.revokeRefreshTokens(firebaseUID);
    
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const { firebaseUID } = req.user; // From middleware
    
    const user = await User.findOne({ firebaseUID }).select('-__v');
    
    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { firebaseUID } = req.user; // From middleware
    const { username, contactNumber, address, profilePhoto } = req.body;

    const user = await User.findOne({ firebaseUID });
    
    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Update fields
    if (username) user.username = username;
    if (contactNumber) user.contactNumber = contactNumber;
    if (address) user.address = address;
    if (profilePhoto) user.profilePhoto = profilePhoto;
    
    user.updatedAt = new Date();
    
    await user.save();

    res.status(200).json({ 
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        firebaseUID: user.firebaseUID,
        username: user.username,
        email: user.email,
        role: user.role,
        contactNumber: user.contactNumber,
        address: user.address
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Verify OTP and activate user account
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Check if OTP has expired
    if (!user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Check OTP attempts (prevent brute force)
    if (user.otpAttempts >= 5) {
      return res.status(429).json({ message: 'Too many failed attempts. Please request a new OTP.' });
    }

    // Verify OTP
    if (user.otp !== otp.toString()) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(400).json({ 
        message: 'Invalid OTP', 
        attemptsRemaining: 5 - user.otpAttempts 
      });
    }

    // OTP is valid, activate user
    user.isActive = true;
    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpAttempts = 0;
    user.updatedAt = new Date();

    await user.save();

    // Enable Firebase user
    try {
      await auth.updateUser(user.firebaseUID, { disabled: false });
    } catch (firebaseError) {
      console.error('Error enabling Firebase user:', firebaseError);
      // Continue even if Firebase update fails
    }

    // Send welcome email
    const welcomeEmailResult = await sendWelcomeEmail(email, user.username);
    if (!welcomeEmailResult.success) {
      console.error('Failed to send welcome email:', welcomeEmailResult.error);
    }

    // Create custom token for immediate login
    const customToken = await auth.createCustomToken(user.firebaseUID, {
      role: user.role,
      userId: user._id.toString()
    });

    res.status(200).json({
      message: 'Email verified successfully! Account activated.',
      customToken,
      user: {
        id: user._id,
        firebaseUID: user.firebaseUID,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: true,
        isEmailVerified: true
      }
    });

  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Check rate limiting (prevent spam)
    if (user.lastOtpSent && new Date() - user.lastOtpSent < 60000) { // 1 minute
      return res.status(429).json({ message: 'Please wait before requesting a new OTP' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    user.otpAttempts = 0; // Reset attempts
    user.lastOtpSent = new Date();
    user.updatedAt = new Date();

    await user.save();

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, user.username);
    if (!emailResult.success) {
      return res.status(500).json({ message: 'Failed to send verification email' });
    }

    res.status(200).json({
      message: 'OTP sent successfully to your email',
      email: email
    });

  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ message: err.message });
  }
};
