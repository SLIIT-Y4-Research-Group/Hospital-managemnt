import Appointment from '../models/AppointmentModel.js'; // Assuming the model is correctly named

// Add a new appointment
const addAppointment = async (req, res) => {
    try {
        const {
            firstName, lastName, contactNumber, email, nic, dob, gender,
            appointmentDate, appointmentTime, doctor, address, reasonForVisit, status, user_id
        } = req.body;

        const newAppointment = new Appointment({
            firstName,
            lastName,
            contactNumber,
            email,
            nic,
            dob,
            gender,
            appointmentDate,
            appointmentTime,
            doctor,
            address,
            reasonForVisit,
            status,
            user_id // Added user_id
        });

        await newAppointment.save();
        res.json('Appointment added successfully');
    } catch (err) {
        res.status(400).json('Error: ' + err.message);
    }
};

// Get all appointments
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        if (!appointments.length) {
            return res.status(404).json('No appointments found');
        }
        res.json(appointments);
    } catch (err) {
        res.status(400).json('Error: ' + err.message);
    }
};

// Get an appointment by ID
const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json('Appointment not found');
        }
        res.json(appointment);
    } catch (err) {
        res.status(400).json('Error: ' + err.message);
    }
};

// Delete an appointment by ID
const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAppointment = await Appointment.findByIdAndDelete(id);

        if (!deletedAppointment) {
            return res.status(404).json('Appointment not found');
        }

        res.json('Appointment deleted');
    } catch (err) {
        res.status(400).json('Error: ' + err.message);
    }
};

// Update an appointment by ID
const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            firstName, lastName, contactNumber, email, nic, dob, gender,
            appointmentDate, appointmentTime, doctor, address, reasonForVisit, status, user_id
        } = req.body;

        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json('Appointment not found');
        }

        // Update fields if provided
        if (firstName) appointment.firstName = firstName;
        if (lastName) appointment.lastName = lastName;
        if (contactNumber) appointment.contactNumber = contactNumber;
        if (email) appointment.email = email;
        if (nic) appointment.nic = nic;
        if (dob) appointment.dob = dob;
        if (gender) appointment.gender = gender;
        if (appointmentDate) appointment.appointmentDate = appointmentDate;
        if (appointmentTime) appointment.appointmentTime = appointmentTime;
        if (doctor) appointment.doctor = doctor;
        if (address) appointment.address = address;
        if (reasonForVisit) appointment.reasonForVisit = reasonForVisit;
        if (status) appointment.status = status;
        if (user_id) appointment.user_id = user_id; // Update user_id if provided

        await appointment.save();
        res.json('Appointment updated successfully');
    } catch (err) {
        res.status(400).json('Error: ' + err.message);
    }
};

export default {
    addAppointment,
    getAllAppointments,
    getAppointmentById,
    deleteAppointment,
    updateAppointment
};
