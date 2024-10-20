import express from 'express';
import { DoctorHospital } from '../models/Hospital.js'; // Import your Hospital model

const router = express.Router();

// Route to save a new Hospital
router.post('/', async (request, response) => {
    try {
        console.log('Request Body:', request.body); // Log the incoming request body

        // Check if all required fields are present
        if (
            !request.body.Name ||
            !request.body.Departments ||
            !request.body.ContactNo ||
            !request.body.Email ||
            !request.body.Address ||
            !request.body.Doctors
        ) {
            return response.status(400).send({
                message: 'Send all required fields: Name, Departments, ContactNo, Email, Address, Doctors',
            });
        }

        const newHospital = {
            Name: request.body.Name,
            Departments: request.body.Departments,
            ContactNo: request.body.ContactNo,
            Email: request.body.Email,
            Address: request.body.Address,
            Doctors: request.body.Doctors,
        };

        const createdHospital = await DoctorHospital.create(newHospital);
        return response.status(201).send(createdHospital);
    } catch (error) {
        console.log('Error:', error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for Get All Hospitals from database
router.get('/', async (request, response) => {
    try {
        const hospitals = await DoctorHospital.find({});
        return response.status(200).json({
            count: hospitals.length,
            data: hospitals,
        });
    } catch (error) {
        console.log('Error:', error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for Get One Hospital from database by id
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const hospital = await DoctorHospital.findById(id);

        if (!hospital) {
            return response.status(404).json({ message: 'Hospital not found' });
        }

        return response.status(200).json(hospital);
    } catch (error) {
        console.log('Error:', error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for Update a Hospital
router.put('/:id', async (request, response) => {
    try {
        const { Name, Departments, ContactNo, Email, Address, Doctors } = request.body;

        // Check for required fields
        if (
            !Name ||
            !Departments ||
            !ContactNo ||
            !Email ||
            !Address ||
            !Doctors
        ) {
            return response.status(400).send({
                message: 'Send all required fields: Name, Departments, ContactNo, Email, Address, Doctors',
            });
        }

        const updatedHospital = await DoctorHospital.findByIdAndUpdate(request.params.id, request.body, { new: true });
        if (!updatedHospital) {
            return response.status(404).send({ message: 'Hospital not found' });
        }
        
        response.status(200).send(updatedHospital);
    } catch (error) {
        console.error('Error updating hospital:', error);
        response.status(500).send({ message: 'Server error' });
    }
});

// Route for Delete a Hospital
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await DoctorHospital.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: 'Hospital not found' });
        }

        return response.status(200).send({ message: 'Hospital deleted successfully' });
    } catch (error) {
        console.log('Error:', error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;
