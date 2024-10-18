import express from 'express';
import { Doctor } from '../models/Doctor.js';

const router = express.Router();

// Route to save a new Doctor
router.post('/', async (request, response) => {
  try {
    if (
      !request.body.Name ||
      !request.body.Specialization |
      !request.body.ContactNo ||
      !request.body.Email ||
      !request.body.Address ||
      !request.body.BasicSalary ||
      !request.body.Description ||
      !request.body.WorkingHospitals
    ) {
      return response.status(400).send({
        message: 'Send all required fields: Name, ContactNo, Email, Address, BasicSalary, Description, WorkingHospitals',
      });
    }

    const newDoctor = {
      Name: request.body.Name,
      Specialization: request.body.Specialization,
      ContactNo: request.body.ContactNo,
      Email: request.body.Email,
      Address: request.body.Address,
      BasicSalary: request.body.BasicSalary,
      Description: request.body.Description,
      WorkingHospitals: request.body.WorkingHospitals,
    };

    const createdDoctor = await Doctor.create(newDoctor); // Renamed to 'createdDoctor'

    return response.status(201).send(createdDoctor);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});


// Route for Get All Doctors from database
router.get('/', async (request, response) => {
  try {
    const Doctors = await Doctor.find({});

    return response.status(200).json({
      count: Doctors.length,
      data: Doctors,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get One Doctor from database by id
router.get('/:id', async (request, response) => {
    try {
      const { id } = request.params;
  
      const doctor = await Doctor.findById(id); // Use lowercase for the variable
  
      if (!doctor) {
        return response.status(404).json({ message: 'Doctor not found' });
      }
  
      return response.status(200).json(doctor);
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });
  

// Route for Update an Doctor
router.put('/:id', async (request, response) => {
  try {
    if (
      
      !request.body.Name ||
      !request.body.Specialization ||
      !request.body.ContactNo ||
      !request.body.Email ||
      !request.body.Address ||
      !request.body.BasicSalary ||
      !request.body.Description ||
      !request.body.WorkingHospitals
    ) {
      return response.status(400).send({
        message: 'Send all required fields: DoctorID, Name, ContactNo, Email, Address, BasicSalary, Salary',
      });
    }

    const { id } = request.params;

    const result = await Doctor.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: 'Doctor not found' });
    }

    return response.status(200).send({ message: 'Doctor updated successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Delete an Doctor
router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Doctor.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: 'Doctor not found' });
    }

    return response.status(200).send({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});




export default router;