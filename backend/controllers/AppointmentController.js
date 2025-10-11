import Appointment from "../models/AppointmentModel.js"; // Assuming the model is correctly named


const addAppointment = async (req, res) => {
  try {
    
    const {
      firstName,
      lastName,
      contactNumber,
      email,
      nic,
      hospital,
      gender,
      appointmentDate,
      appointmentTime,
      doctor,
      address,
      reasonForVisit,
      status,
      user_id,
    } = req.body;

    
    if (!firstName || !lastName || !email || !contactNumber) {
      return res.status(400).json({
        message:
          "Required fields missing: firstName, lastName, email, contactNumber",
      });
    }

    
    const existingAppointment = await Appointment.findOne({
      user_id,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      doctor,
    });

    if (existingAppointment) {
      return res.status(409).json({
        message:
          "An appointment already exists for this user at the same date, time, and doctor",
      });
    }

    const newAppointment = new Appointment({
      firstName,
      lastName,
      contactNumber,
      email,
      nic,
      hospital,
      gender,
      appointmentDate,
      appointmentTime,
      doctor,
      address,
      reasonForVisit,
      status,
      user_id,
    });

    const savedAppointment = await newAppointment.save();

    // Include the saved appointment's ID in the response
    res.status(201).json({
      message: "Appointment added successfully",
      appointmentId: savedAppointment._id,
      appointment: {
        id: savedAppointment._id,
        firstName: savedAppointment.firstName,
        lastName: savedAppointment.lastName,
        appointmentDate: savedAppointment.appointmentDate,
        appointmentTime: savedAppointment.appointmentTime,
        doctor: savedAppointment.doctor,
        status: savedAppointment.status || "pending",
      },
    });
  } catch (err) {
    console.error("Appointment creation error:", err);

    // Handle specific MongoDB errors
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Duplicate appointment detected",
        error: "An appointment with similar details already exists",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Database validation failed",
        errors: Object.values(err.errors).map((e) => e.message),
      });
    }

    res.status(500).json({
      message: "Internal server error while creating appointment",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
    });
  }
};

// Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    if (!appointments.length) {
      return res.status(404).json("No appointments found");
    }
    res.json(appointments);
  } catch (err) {
    res.status(400).json("Error: " + err.message);
  }
};

// Get an appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json("Appointment not found");
    }
    res.json(appointment);
  } catch (err) {
    res.status(400).json("Error: " + err.message);
  }
};

// Get appointments by user ID
const getAppointmentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const appointments = await Appointment.find({ user_id: userId });

    if (!appointments.length) {
      return res.status(404).json("No appointments found for this user");
    }

    res.json(appointments);
  } catch (err) {
    res.status(400).json("Error: " + err.message);
  }
};

// Delete an appointment by ID
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return res.status(404).json("Appointment not found");
    }

    res.json("Appointment deleted");
  } catch (err) {
    res.status(400).json("Error: " + err.message);
  }
};

// Update an appointment by ID
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      contactNumber,
      email,
      nic,
      hospital,
      gender,
      appointmentDate,
      appointmentTime,
      doctor,
      address,
      reasonForVisit,
      status,
      user_id,
    } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json("Appointment not found");
    }

    // Update fields if provided
    if (firstName) appointment.firstName = firstName;
    if (lastName) appointment.lastName = lastName;
    if (contactNumber) appointment.contactNumber = contactNumber;
    if (email) appointment.email = email;
    if (nic) appointment.nic = nic;
    if (hospital) appointment.hospital = hospital;
    if (gender) appointment.gender = gender;
    if (appointmentDate) appointment.appointmentDate = appointmentDate;
    if (appointmentTime) appointment.appointmentTime = appointmentTime;
    if (doctor) appointment.doctor = doctor;
    if (address) appointment.address = address;
    if (reasonForVisit) appointment.reasonForVisit = reasonForVisit;
    if (status) appointment.status = status;
    if (user_id) appointment.user_id = user_id; // Update user_id if provided

    await appointment.save();
    res.json("Appointment updated successfully");
  } catch (err) {
    res.status(400).json("Error: " + err.message);
  }
};

export default {
  addAppointment,
  getAllAppointments,
  getAppointmentById,
  getAppointmentsByUserId,
  deleteAppointment,
  updateAppointment,
};
