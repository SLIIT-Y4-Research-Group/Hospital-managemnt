import { auth } from '../config/firebaseConfig.js';
import User from '../models/User.js';
import { 
  verifyAccessToken, 
  isTokenBlacklisted, 
  extractTokenFromHeader,
  validateTokenFormat 
} from '../utils/jwt.js';

// Middleware to verify JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    // Validate token format
    const formatValidation = validateTokenFormat(token);
    if (!formatValidation.valid) {
      return res.status(401).json({ message: formatValidation.error });
    }

    // Check if token is blacklisted
    if (isTokenBlacklisted(token)) {
      return res.status(401).json({ message: 'Token has been revoked' });
    }

    // Verify the JWT token
    const decodedToken = verifyAccessToken(token);
    
    // Ensure it's an access token
    if (decodedToken.type !== 'access') {
      return res.status(401).json({ message: 'Invalid token type' });
    }

    // Get user from database
    const user = await User.findById(decodedToken.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'User account is disabled' });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: 'Email not verified' });
    }

    // Add user info to request object
    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role,
      username: user.username,
      firebaseUID: user.firebaseUID
    };

    // Add token to request for potential blacklisting
    req.token = token;

    next();
  } catch (err) {
    console.error('JWT Auth middleware error:', err);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired',
        error: 'TOKEN_EXPIRED' 
      });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token',
        error: 'INVALID_TOKEN' 
      });
    } else if (err.name === 'NotBeforeError') {
      return res.status(401).json({ 
        message: 'Token not active',
        error: 'TOKEN_NOT_ACTIVE' 
      });
    }
    
    return res.status(401).json({ 
      message: 'Authentication failed',
      error: 'AUTH_FAILED' 
    });
  }
};

// Role-based authorization middleware
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Insufficient privileges',
        required: allowedRoles,
        current: req.user.role
      });
    }

    next();
  };
};

// Legacy role authorization (for backward compatibility)
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

// Admin only middleware
export const requireAdmin = requireRole('admin');
export const adminOnly = authorizeRole('admin');

// Doctor or Admin middleware
export const requireDoctorOrAdmin = requireRole('doctor', 'admin');
export const doctorOrAdmin = authorizeRole('doctor', 'admin');

// Staff or Admin middleware  
export const requireStaffOrAdmin = requireRole('staff', 'admin');
export const staffOrHigher = authorizeRole('staff', 'doctor', 'admin');

// Patient, Doctor or Admin middleware
export const requirePatientDoctorOrAdmin = requireRole('patient', 'doctor', 'admin');

// Updated optional authentication middleware with JWT support
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      // No token provided, continue without authentication
      req.user = null;
      return next();
    }

    // Check if token is blacklisted
    if (isTokenBlacklisted(token)) {
      req.user = null;
      return next();
    }

    // Try JWT verification first
    try {
      const decodedToken = verifyAccessToken(token);
      
      if (decodedToken.type === 'access') {
        const user = await User.findById(decodedToken.userId);
        
        if (user && user.isActive && user.isEmailVerified) {
          req.user = {
            userId: user._id,
            email: user.email,
            role: user.role,
            username: user.username,
            firebaseUID: user.firebaseUID
          };
          req.token = token;
          return next();
        }
      }
    } catch (jwtError) {
      // JWT verification failed, try Firebase as fallback
      try {
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
          return next();
        }
      } catch (firebaseError) {
        // Both JWT and Firebase failed
        req.user = null;
      }
    }

    req.user = null;
    next();
  } catch (err) {
    // On any error, continue without authentication
    req.user = null;
    next();
  }
};

// Resource owner or admin middleware
export const requireOwnerOrAdmin = (userIdField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const resourceUserId = req.params[userIdField] || req.body[userIdField];
    
    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // User can only access their own resources
    if (req.user.userId.toString() === resourceUserId) {
      return next();
    }

    return res.status(403).json({ 
      message: 'Access denied. You can only access your own resources.' 
    });
  };
};

// Legacy Firebase authentication middleware (for backward compatibility)
export const authenticateFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

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
    console.error('Firebase Auth middleware error:', err);
    
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