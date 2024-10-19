import express from 'express';
import { DoctorShedule } from '../models/DoctorShedule.js'; // Assuming the model is in this path

const router = express.Router();

// Route to create a new Doctor Schedule
router.post('/', async (req, res) => {
  try {
    const { DoctorID, DoctorName, Specialization, Date, TimeSlots, MaxAppointments, Location } = req.body;

    // Validate required fields
    if (
      !DoctorID || 
      !DoctorName || 
      !Specialization || 
      !Date || 
      !TimeSlots || 
      !MaxAppointments || 
      !Location
    ) {
      return res.status(400).send({ message: 'Send all required fields: DoctorID, DoctorName, Specialization, Date, TimeSlots, MaxAppointments, Location' });
    }

    const newShedule = {
      DoctorID,
      DoctorName,
      Specialization,
      Date,
      TimeSlots,
      MaxAppointments,
      Location,
    };

    const createdShedule = await DoctorShedule.create(newShedule);
    return res.status(201).send(createdShedule);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route to get all Doctor Schedules
router.get('/', async (req, res) => {
  try {
    const schedules = await DoctorShedule.find({});
    return res.status(200).json({
      count: schedules.length,
      data: schedules,
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route to get a Doctor Schedule by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await DoctorShedule.findById(id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    return res.status(200).json(schedule);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route to update a Doctor Schedule by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSchedule = await DoctorShedule.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedSchedule) {
      return res.status(404).send({ message: 'Schedule not found' });
    }

    res.status(200).send(updatedSchedule);
  } catch (error) {
    console.error('Error updating schedule:', error.message);
    res.status(500).send({ message: 'Server error' });
  }
});

// Route to delete a Doctor Schedule by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await DoctorShedule.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    return res.status(200).send({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send({ message: error.message });
  }
});

export default router;
