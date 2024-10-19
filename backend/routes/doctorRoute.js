import express from 'express';
import Doctor from '../models/doctorModel.js';

const router = express.Router();

// Create a new doctor
router.post('/register', async (req, res) => {
    const { name, specialization, contact, hospitals, fee, email } = req.body;

    try {
        // Validate that each hospital has a time slot
        if (!hospitals || !hospitals.every(h => h.name && h.timeSlot.start && h.timeSlot.end)) {
            return res.status(400).json({ message: 'Each hospital must have a name and a valid time slot.' });
        }

        const newDoctor = new Doctor({ name, specialization, contact, hospitals, fee, email });
        await newDoctor.save();
        res.status(201).json({ message: 'Doctor registered successfully', doctor: newDoctor });
    } catch (error) {
        res.status(500).json({ message: 'Failed to register doctor', error: error.message });
    }
});

// Get all doctors
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve doctors', error: error.message });
    }
});

// Get a doctor by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const doctor = await Doctor.findById(id);

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve doctor', error: error.message });
    }
});


// Get doctors by specialization
router.get('/specialization/:specialization', async (req, res) => {
    const { specialization } = req.params;

    try {
        const doctors = await Doctor.find({ specialization: new RegExp(specialization, 'i') });

        if (doctors.length === 0) {
            return res.status(404).json({ message: 'No doctors found with this specialization' });
        }

        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve doctors', error: error.message });
    }
});

// Get doctors by name
router.get('/name/:name', async (req, res) => {
    const { name } = req.params;

    try {
        // Use a case-insensitive regular expression to search for names
        const doctors = await Doctor.find({ name: new RegExp(name, 'i') });

        if (doctors.length === 0) {
            return res.status(404).json({ message: 'No doctors found with this name' });
        }

        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve doctors', error: error.message });
    }
});



export default router;
