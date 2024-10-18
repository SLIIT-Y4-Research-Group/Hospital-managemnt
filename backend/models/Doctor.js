import mongoose from "mongoose";

const DoctorSchema = mongoose.Schema(
    {
    DoctorID: {
        type: String,
        unique: true
    },
    Name: {
        type: String,
        required: true,
    },
    Specialization: {
        type: String,
        required: true,
    },
    
    ContactNo: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },
    Address: {
        type: String,
        required: true,
    },
    BasicSalary: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    WorkingHospitals: [
        {
          HospitalName: {
            type: String,
            required: true,
          },
          HospitalAddress: {
            type: String,
            required: true,
          },
        },
      ],

    }
);

const counterSchema = mongoose.Schema({
    _id: { type: String, required: true},
    seq: { type: Number, default: 1 }
});

const ECounterr = mongoose.model('ECounterr', counterSchema);

DoctorSchema.pre('save', async function (next) {
    try{
        if (this.isNew) {
            const doc = await ECounterr.findOneAndUpdate({ _id: 'DoctorID' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
            this.DoctorID = 'DOC' + doc.seq; // Modified to 'DoctorID'
        }
        next();
    } catch (error) {
        next(error);
    }
});

export const Doctor = mongoose.model('Doctor' ,DoctorSchema);