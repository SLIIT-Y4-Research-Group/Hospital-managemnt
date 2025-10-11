import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// In-memory token blacklist (in production, use Redis)
const blacklistedTokens = new Set();

/**
 * Generate JWT access token
 * @param {Object} user - User object from database
 * @returns {string} JWT access token
 */
export const generateAccessToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    username: user.username,
    type: 'access'
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '30m',
    issuer: 'hospital-management-system',
    audience: 'hospital-api'
  });
};

/**
 * Generate JWT refresh token
 * @param {Object} user - User object from database
 * @returns {string} JWT refresh token
 */
export const generateRefreshToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    type: 'refresh',
    tokenId: crypto.randomBytes(16).toString('hex') // Unique identifier for this token
  };

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: 'hospital-management-system',
    audience: 'hospital-api'
  });
};

/**
 * Verify JWT access token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'hospital-management-system',
      audience: 'hospital-api'
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Verify JWT refresh token
 * @param {string} token - JWT refresh token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
      issuer: 'hospital-management-system',
      audience: 'hospital-api'
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Decode JWT token without verification
 * @param {string} token - JWT token to decode
 * @returns {Object} Decoded token payload
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};

/**
 * Add token to blacklist
 * @param {string} token - Token to blacklist
 */
export const blacklistToken = (token) => {
  blacklistedTokens.add(token);
  
  // Auto-remove expired tokens from blacklist after their expiration
  const decoded = decodeToken(token);
  if (decoded && decoded.exp) {
    const expirationTime = decoded.exp * 1000 - Date.now();
    if (expirationTime > 0) {
      setTimeout(() => {
        blacklistedTokens.delete(token);
      }, expirationTime);
    }
  }
};

/**
 * Check if token is blacklisted
 * @param {string} token - Token to check
 * @returns {boolean} True if token is blacklisted
 */
export const isTokenBlacklisted = (token) => {
  return blacklistedTokens.has(token);
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Extracted token or null
 */
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};

/**
 * Generate token pair (access + refresh)
 * @param {Object} user - User object from database
 * @returns {Object} Object containing access and refresh tokens
 */
export const generateTokenPair = (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  
  return {
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    expiresIn: parseInt(process.env.JWT_ACCESS_EXPIRES_IN?.replace(/\D/g, '') || '30') * 60 // Convert to seconds
  };
};

/**
 * Validate token format and structure
 * @param {string} token - Token to validate
 * @returns {Object} Validation result
 */
export const validateTokenFormat = (token) => {
  if (!token) {
    return { valid: false, error: 'Token is required' };
  }
  
  if (typeof token !== 'string') {
    return { valid: false, error: 'Token must be a string' };
  }
  
  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, error: 'Invalid token format' };
  }
  
  return { valid: true };
};