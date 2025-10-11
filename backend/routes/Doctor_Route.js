import express from "express";
import mongoose from "mongoose";
import { Doctor } from "../models/Doctor.js";
import {
  authenticateToken,
  requireAdmin,
  requireDoctorOrAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/", authenticateToken, async (request, response) => {
  try {
    console.log("Request Body:", request.body); 

   
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
      !request.body.Email.trim() 
    ) {
      return response.status(400).send({
        message:
          "Send all required fields: Name, Specialization, ContactNo, Email, Address, BasicSalary, Description, WorkingHospitals, Password",
      });
    }

    const newDoctor = {
      image: request.body.image,
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
    console.log("Error:", error.message);
    response.status(500).send({ message: error.message });
  }
});

router.get("/", authenticateToken, async (request, response) => {
  try {
    const Doctors = await Doctor.find({});
    return response.status(200).json({
      count: Doctors.length,
      data: Doctors,
    });
  } catch (error) {
    console.log("Error:", error.message);
    response.status(500).send({ message: error.message });
  }
});


router.get("/:id", authenticateToken, async (request, response) => {
  try {
    const { id } = request.params;
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return response.status(404).json({ message: "Doctor not found" });
    }

    return response.status(200).json(doctor);
  } catch (error) {
    console.log("Error:", error.message);
    response.status(500).send({ message: error.message });
  }
});


router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const {
      image,
      Name,
      Specialization,
      ContactNo,
      Email,
      Address,
      BasicSalary,
      Description,
      WorkingHospitals,
      Password,
    } = req.body;

 
    if (
      !image ||
      !Name ||
      !Specialization ||
      !ContactNo ||
      !Email ||
      !Address ||
      !BasicSalary ||
      !Description ||
      !WorkingHospitals ||
      !Password
    ) {
      return res.status(400).send({
        message:
          "Send all required fields: Name, Specialization, ContactNo, Email, Address, BasicSalary, Description, WorkingHospitals, Password",
      });
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedDoctor) {
      return res.status(404).send({ message: "Doctor not found" });
    }

    res.status(200).send(updatedDoctor);
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).send({ message: "Server error" });
  }
});


router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (request, response) => {
    try {
      const { id } = request.params;
      const result = await Doctor.findByIdAndDelete(id);

      if (!result) {
        return response.status(404).json({ message: "Doctor not found" });
      }

      return response
        .status(200)
        .send({ message: "Doctor deleted successfully" });
    } catch (error) {
      console.log("Error:", error.message);
      response.status(500).send({ message: error.message });
    }
  }
);


router.post("/login", async (req, res) => {
  try {
    const { DoctorID, Password } = req.body;
    if (!DoctorID || !Password) {
      return res
        .status(400)
        .json({ message: "DoctorID and Password are required" });
    }
    const doctor = await Doctor.findOne({ DoctorID });
    if (!doctor) {
      return res.status(404).json({ message: "User not found" });
    }
    if (Password !== doctor.Password) {
      return res.status(401).json({ message: "Incorrect Password" });
    }
    res.status(200).json(doctor);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.put("/:identifier", authenticateToken, async (req, res) => {
  try {
    const { identifier } = req.params;

   
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      const doctor = await Doctor.findByIdAndUpdate(identifier, req.body, {
        new: true,
      });
      if (!doctor) return res.status(404).send("Doctor not found");
      return res.status(200).send(doctor);
    }

    
    const doctorByDoctorID = await Doctor.findOneAndUpdate(
      { DoctorID: identifier },
      req.body,
      { new: true }
    );
    if (!doctorByDoctorID) return res.status(404).send("Doctor not found");
    return res.status(200).send(doctorByDoctorID);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(400)
      .send({ message: "Error updating doctor: " + error.message });
  }
});
router.get("/:doctorId", async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ DoctorID: req.params.doctorId });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(doctor);
  } catch (error) {
    console.error("Error fetching doctor details:", error); 
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
