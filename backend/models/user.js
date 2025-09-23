import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firebaseUID: { type: String, required: true, unique: true }, // Firebase User ID
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String },
    address: { type: String },
    profilePhoto: { type: String },  // Field for storing the profile photo filename
    role: { 
        type: String, 
        required: true,
        enum: ['admin', 'doctor', 'patient', 'staff'],
        default: 'patient'
    },
    isActive: { type: Boolean, default: false }, // Changed to false by default - requires email verification
    isEmailVerified: { type: Boolean, default: false },
    
    // OTP fields for email verification
    otp: { type: String },
    otpExpires: { type: Date },
    otpAttempts: { type: Number, default: 0 },
    lastOtpSent: { type: Date },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Index for OTP cleanup
userSchema.index({ otpExpires: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('User', userSchema);
