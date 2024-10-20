import mongoose from "mongoose";

const HospitalSchema = mongoose.Schema(
    {
        HospitalID: {
            type: String,
            unique: true,
        },
        Name: {
            type: String,
            required: true,
        },
        Departments: {
            type: [String],
            required: true,
        },
        ContactNo: {
            type: [String],
            required: true,
        },
        Email: {
            type: String,
            required: true,
            unique: true, // Ensure unique Email
            sparse: true, // Allows multiple documents to have `null` value
        },
        Address: {
            type: String,
            required: true,
        },
        Doctors: {
            type: [String],
            required: true,
        },
       
    }
);

const counterSchema = mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1 },
});

const DHCounterr = mongoose.model('DHCounterr', counterSchema);

HospitalSchema.pre('save', async function (next) {
    try {
        if (this.isNew) {
            const doc = await DHCounterr.findOneAndUpdate(
                { _id: 'HospitalID' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.HospitalID = 'Hospital' + doc.seq; // Assign unique HospitalID
        }
        next();
    } catch (error) {
        next(error);
    }
});

export const DoctorHospital = mongoose.model('DoctorHospital', HospitalSchema);
