import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
    start: { type: String, required: true },
    end: { type: String, required: true },
});

const hospitalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    timeSlot: { type: timeSlotSchema, required: true },
});

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    contact: { type: String, required: true },
    hospitals: [hospitalSchema],
    fee: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
});

const Doctor = mongoose.model('DoctorAppointment', doctorSchema);
export default Doctor;
