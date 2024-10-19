import express from 'express';
import { Doctor } from '../models/Doctor.js';

const router = express.Router();

// Route to save a new Doctor
// Route to save a new Doctor
router.post('/', async (request, response) => {
  try {
      console.log('Request Body:', request.body); // Log the incoming request body

      // Check if Email is present and valid
      if (

          !request.body.image ||
          !request.body.Name ||
          !request.body.Specialization ||
          !request.body.ContactNo ||
          !request.body.Email ||
          !request.body.Address ||
          !request.body.BasicSalary ||
          !request.body.Description ||
          !request.body.WorkingHospitals ||
          !request.body.Password ||
          !request.body.Email.trim() // Check if Email is not just whitespace
      ) {
          return response.status(400).send({
              message: 'Send all required fields: Name, Specialization, ContactNo, Email, Address, BasicSalary, Description, WorkingHospitals, Password',
          });
      }

      const newDoctor = {
        image : request.body.image,
          Name: request.body.Name,
          Specialization: request.body.Specialization,
          ContactNo: request.body.ContactNo,
          Email: request.body.Email,
          Address: request.body.Address,
          BasicSalary: request.body.BasicSalary,
          Description: request.body.Description,
          WorkingHospitals: request.body.WorkingHospitals,
          Password: request.body.Password,
      };

      const createdDoctor = await Doctor.create(newDoctor);
      return response.status(201).send(createdDoctor);
  } catch (error) {
      console.log('Error:', error.message);
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
        console.log('Error:', error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for Get One Doctor from database by id
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const doctor = await Doctor.findById(id);

        if (!doctor) {
            return response.status(404).json({ message: 'Doctor not found' });
        }

        return response.status(200).json(doctor);
    } catch (error) {
        console.log('Error:', error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for Update a Doctor
router.put('/:id', async (request, response) => {
    try {
        if (
           !request.body.DoctorID ||  // Check if DoctorID is present and valid
            !request.body.Name ||
            !request.body.Specialization ||
            !request.body.ContactNo ||
            !request.body.Email ||
            !request.body.Address ||
            !request.body.BasicSalary ||
            !request.body.Description ||
            !request.body.WorkingHospitals ||
            !request.body.Password
        ) {
            return response.status(400).send({
                message: 'Send all required fields: Name, Specialization, ContactNo, Email, Address, BasicSalary, Description, WorkingHospitals, Password',
            });
        }

        const { id } = request.params;
        const result = await Doctor.findByIdAndUpdate(id, request.body, { new: true });

        if (!result) {
            return response.status(404).json({ message: 'Doctor not found' });
        }

        return response.status(200).send({ message: 'Doctor updated successfully' });
    } catch (error) {
        console.log('Error:', error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for Delete a Doctor
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Doctor.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: 'Doctor not found' });
        }

        return response.status(200).send({ message: 'Doctor deleted successfully' });
    } catch (error) {
        console.log('Error:', error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for doctor login
router.post('/login', async (req, res) => {
    try {
        const { DoctorID, Password } = req.body;
        if (!DoctorID || !Password) {
            return res.status(400).json({ message: 'DoctorID and Password are required' });
        }
        const doctor = await Doctor.findOne({ DoctorID });
        if (!doctor) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (Password !== doctor.Password) {
            return res.status(401).json({ message: 'Incorrect Password' });
        }
        res.status(200).json(doctor);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Route for updating a doctor by ID or DoctorID using PUT
router.put('/:identifier', async (req, res) => {
    try {
        const { identifier } = req.params;

        // Check if the identifier is a valid MongoDB ObjectId
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            const doctor = await Doctor.findByIdAndUpdate(identifier, req.body, { new: true });
            if (!doctor) return res.status(404).send('Doctor not found');
            return res.status(200).send(doctor);
        }

        // If not a valid ObjectId, try searching by DoctorID
        const doctorByDoctorID = await Doctor.findOneAndUpdate({ DoctorID: identifier }, req.body, { new: true });
        if (!doctorByDoctorID) return res.status(404).send('Doctor not found');
        return res.status(200).send(doctorByDoctorID);
        
    } catch (error) {
        console.error('Error:', error);
        res.status(400).send({ message: 'Error updating doctor: ' + error.message });
    }
});

export default router;
