import express from 'express';
import mongoose from 'mongoose';
import sanitize from 'mongo-sanitize';
import { body, param, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { Doctor } from '../models/Doctor.js'; // keep your model import

const router = express.Router();

/**
 * Middleware: sanitize incoming payloads (body, query, params)
 * This removes keys starting with '$' and dots that could be used in NoSQL injection.
 */
router.use((req, res, next) => {
  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);
  next();
});

/**
 * Helper: centralize validation result handling
 */
function handleValidationErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return null;
}

/**
 * Create Doctor
 * - Validate required fields
 * - Whitelist fields used for create
 * - Hash password before saving
 */
router.post(
  '/',
  [
    body('image').optional().isString(),
    body('Name').isString().trim().notEmpty(),
    body('Specialization').isString().trim().notEmpty(),
    body('ContactNo').isString().trim().notEmpty(),
    body('Email').isEmail().normalizeEmail(),
    body('Address').isString().trim().notEmpty(),
    body('BasicSalary').isNumeric(),
    body('Description').isString().optional({ nullable: true }),
    body('WorkingHospitals').isArray().optional(),
    body('Password').isString().isLength({ min: 6 })
  ],
  async (req, res) => {
    // validation
    const err = handleValidationErrors(req, res);
    if (err) return;

    try {
      // Whitelist fields from req.body
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
        Password
      } = req.body;

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(Password, salt);

      const newDoctor = {
        image,
        Name,
        Specialization,
        ContactNo,
        Email,
        Address,
        BasicSalary,
        Description,
        WorkingHospitals,
        Password: hashedPassword
      };

      const createdDoctor = await Doctor.create(newDoctor);
      return res.status(201).json(createdDoctor);
    } catch (error) {
      console.error('Create doctor error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * Get all doctors
 */
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    return res.status(200).json({ count: doctors.length, data: doctors });
  } catch (error) {
    console.error('Get doctors error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Get Doctor by Mongo ObjectId
 * path: /id/:id
 */
router.get(
  '/:id',
  [param('id').custom((v) => mongoose.Types.ObjectId.isValid(v))],
  async (req, res) => {
    const err = handleValidationErrors(req, res);
    if (err) return;

    try {
      const doc = await Doctor.findById(req.params.id);
      if (!doc) return res.status(404).json({ message: 'Doctor not found' });
      return res.status(200).json(doc);
    } catch (error) {
      console.error('Get doctor by id error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * Update Doctor by Mongo ObjectId
 * path: /id/:id (PUT)
 */
router.put(
  '/:id',
  [
    param('id').custom((v) => mongoose.Types.ObjectId.isValid(v)),
    // optional validations for updateable fields:
    body('Name').optional().isString().trim(),
    body('Specialization').optional().isString().trim(),
    body('ContactNo').optional().isString().trim(),
    body('Email').optional().isEmail().normalizeEmail(),
    body('Address').optional().isString().trim(),
    body('BasicSalary').optional().isNumeric(),
    body('Description').optional().isString(),
    body('WorkingHospitals').optional().isArray(),
    //body('Password').optional().isString().isLength({ min: 6 })
  ],
  async (req, res) => {
    const err = handleValidationErrors(req, res);
    if (err) return;

    try {
      const fields = {};
      const allowed = [
        'image',
        'Name',
        'Specialization',
        'ContactNo',
        'Email',
        'Address',
        'BasicSalary',
        'Description',
        'WorkingHospitals'
      ];

      // Only pick whitelisted fields
      for (const key of allowed) {
        if (req.body[key] !== undefined) fields[key] = req.body[key];
      }

      // If password is provided, hash it
    //   if (req.body.Password) {
    //     const salt = await bcrypt.genSalt(10);
    //     fields.Password = await bcrypt.hash(req.body.Password, salt);
    //   }

      const updated = await Doctor.findByIdAndUpdate(req.params.id, { $set: fields }, { new: true });
      if (!updated) return res.status(404).json({ message: 'Doctor not found' });
      return res.status(200).json(updated);
    } catch (error) {
      console.error('Update doctor by id error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * Delete doctor by ObjectId
 * path: /id/:id (DELETE)
 */
router.delete(
  '/:id',
  [param('id').custom((v) => mongoose.Types.ObjectId.isValid(v))],
  async (req, res) => {
    const err = handleValidationErrors(req, res);
    if (err) return;

    try {
      const result = await Doctor.findByIdAndDelete(req.params.id);
      if (!result) return res.status(404).json({ message: 'Doctor not found' });
      return res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (error) {
      console.error('Delete doctor error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * Login (by DoctorID)
 * path: /login
 */
router.post(
  '/login',
  [
    body('DoctorID').isString().trim().notEmpty(),
    body('Password').isString().notEmpty()
  ],
  async (req, res) => {
    const err = handleValidationErrors(req, res);
    if (err) return;

    try {
      const { DoctorID, Password } = req.body;

      // Build safe query object (whitelist)
      const doctor = await Doctor.findOne({ DoctorID: DoctorID });
      if (!doctor) return res.status(404).json({ message: 'User not found' });

      // Compare hashed password
      const isMatch = await bcrypt.compare(Password, doctor.Password || '');
      if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

      // Optionally remove sensitive fields before returning
      const doctorObj = doctor.toObject();
      delete doctorObj.Password;

      return res.status(200).json(doctorObj);
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

// Change password
router.post('/change-password', async (req, res) => {
  try {
    const { doctorId, oldPassword, newPassword } = req.body;

    if (!doctorId || !oldPassword || !newPassword) {
      return res.status(400).send({ message: 'All fields are required' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).send({ message: 'Doctor not found' });

    // compare with stored hash
    const ok = await bcrypt.compare(oldPassword, doctor.Password);
    if (!ok) return res.status(401).send({ message: 'Incorrect current password' });

    // hash new password
    const salt = await bcrypt.genSalt(10);
    doctor.Password = await bcrypt.hash(newPassword, salt);

    await doctor.save();
    res.send({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});


export default router;
