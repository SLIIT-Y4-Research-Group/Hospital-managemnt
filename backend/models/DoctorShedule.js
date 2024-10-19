import mongoose from "mongoose";

const DoctorSheduleSchema = mongoose.Schema(
    {
        SheduleID: {
            type: String,
            unique: true,
        },
        DoctorID : {
            type: String,
        },
        DoctorName : {
            type: String,
            required: true,
        },
        Specialization: {
            type: String,
            required: true,
        },
        Date : {
            type: String,
            required: true,
        },
        TimeSlots: {
            type: [String], // Updated to be an array of strings
            required: true,
        },
        MaxAppointments : {
            type: String,
            required: true,
        },
        Location : {
            type: String,
            required: true,
        },
    }
);

const counterSchema = mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1 },
});

const DSCounterr = mongoose.model('DSCounterr', counterSchema);

DoctorSheduleSchema.pre('save', async function (next) {
    try {
        if (this.isNew) {
            const doc = await DSCounterr.findOneAndUpdate(
                { _id: 'SheduleID' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.SheduleID = 'DShedule' + doc.seq; // Assign unique SheduleID
        }
        next();
    } catch (error) {
        next(error);
    }
});

export const DoctorShedule = mongoose.model('DoctorShedule', DoctorSheduleSchema);
