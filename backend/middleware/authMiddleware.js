import { auth } from '../config/firebaseConfig.js';
import User from '../models/user.js';

// Middleware to verify Firebase ID token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(token);
    
    // Get user from database
    const user = await User.findOne({ firebaseUID: decodedToken.uid });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'User account is disabled' });
    }

    // Add user info to request object
    req.user = {
      firebaseUID: decodedToken.uid,
      email: decodedToken.email,
      userId: user._id,
      role: user.role,
      username: user.username
    };

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    
    if (err.code === 'auth/id-token-expired') {
      return res.status(401).json({ message: 'Token expired' });
    } else if (err.code === 'auth/id-token-revoked') {
      return res.status(401).json({ message: 'Token revoked' });
    } else if (err.code === 'auth/invalid-id-token') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

// Middleware to check if user has required role
export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required roles: ${roles.join(', ')}` 
      });
    }

    next();
  };
};

// Middleware for admin only access
export const adminOnly = authorizeRole('admin');

// Middleware for doctor and admin access
export const doctorOrAdmin = authorizeRole('doctor', 'admin');

// Middleware for staff, doctor, and admin access
export const staffOrHigher = authorizeRole('staff', 'doctor', 'admin');

// Optional authentication - doesn't fail if no token, but populates user if token exists
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    const decodedToken = await auth.verifyIdToken(token);
    const user = await User.findOne({ firebaseUID: decodedToken.uid });

    if (user && user.isActive) {
      req.user = {
        firebaseUID: decodedToken.uid,
        email: decodedToken.email,
        userId: user._id,
        role: user.role,
        username: user.username
      };
    } else {
      req.user = null;
    }

    next();
  } catch (err) {
    // If token verification fails, just set user to null and continue
    req.user = null;
    next();
  }
};