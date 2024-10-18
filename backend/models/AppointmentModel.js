import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    contactNumber: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /\d{10}/.test(v); // Ensure it is a valid 10-digit number
            },
            message: props => `${props.value} is not a valid contact number!`
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v); // Validate email format
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    nic: {
        type: String,
        required: true,
        trim: true
    },
    hospital: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    appointmentTime: {
        type: String,
        required: true,
        trim: true
    },
    doctor: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    reasonForVisit: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
        default: 'Pending'
    },
    user_id: {
        type: String,
        required: true
    }
}, { timestamps: true }); // Added timestamps here

const Appointment = mongoose.model('Appointment', AppointmentSchema);

export default Appointment;
