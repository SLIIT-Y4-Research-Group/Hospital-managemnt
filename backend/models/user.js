import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactNumber: { type: String },
    address: { type: String },
    profilePhoto: { type: String }  // Field for storing the profile photo filename
});

export default mongoose.model('User', userSchema);
