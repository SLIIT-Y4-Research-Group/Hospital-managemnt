const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const doctorRoutes = require('../routes/Doctor_Route.js'); // Update this path
const { Doctor } = require('../models/Doctor.js'); // Update this path

const app = express();
app.use(express.json());
app.use('/doctors', doctorRoutes);

// Mock mongoose methods
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    Types: {
      ...actualMongoose.Types,
      ObjectId: {
        isValid: jest.fn(),
      },
    },
  };
});

beforeAll(async () => {
  // Connect to your test database
  await mongoose.connect('mongodb://localhost:27017/test_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Cleanup and disconnect from the database
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Doctor Routes', () => {
  // Test case for creating a new doctor
  it('should create a new doctor', async () => {
    const newDoctor = {
      image: 'doctor_image.jpg',
      Name: 'John Doe',
      Specialization: 'Cardiology',
      ContactNo: '1234567890',
      Email: 'john.doe@example.com',
      Address: '123 Main St',
      BasicSalary: 50000,
      Description: 'Experienced cardiologist',
      WorkingHospitals: ['Hospital A', 'Hospital B'],
      Password: 'password123',
    };

    const response = await request(app).post('/doctors').send(newDoctor);
    expect(response.status).toBe(201);
    expect(response.body.Name).toBe(newDoctor.Name);
  });

  // Test case for getting all doctors
  it('should get all doctors', async () => {
    const response = await request(app).get('/doctors');
    expect(response.status).toBe(200);
    expect(response.body.count).toBeGreaterThanOrEqual(0);
  });

  // Test case for getting a doctor by ID
  it('should get a doctor by ID', async () => {
    const doctor = await Doctor.create({
      image: 'doctor_image.jpg',
      Name: 'Jane Doe',
      Specialization: 'Pediatrics',
      ContactNo: '0987654321',
      Email: 'jane.doe@example.com',
      Address: '456 Main St',
      BasicSalary: 60000,
      Description: 'Pediatrician with 10 years of experience',
      WorkingHospitals: ['Hospital C'],
      Password: 'password123',
    });

    const response = await request(app).get(`/doctors/${doctor._id}`);
    expect(response.status).toBe(200);
    expect(response.body.Name).toBe(doctor.Name);
  });

  // Test case for updating a doctor
  it('should update a doctor', async () => {
    const doctor = await Doctor.create({
      image: 'doctor_image.jpg',
      Name: 'Alice Smith',
      Specialization: 'Neurology',
      ContactNo: '1112223333',
      Email: 'alice.smith@example.com',
      Address: '789 Main St',
      BasicSalary: 70000,
      Description: 'Neurologist with expertise in epilepsy',
      WorkingHospitals: ['Hospital D'],
      Password: 'password123',
    });

    const updatedData = { Name: 'Alice Johnson' };
    const response = await request(app).put(`/doctors/${doctor._id}`).send(updatedData);
    expect(response.status).toBe(200);
    expect(response.body.Name).toBe(updatedData.Name);
  });

  // Test case for deleting a doctor
  it('should delete a doctor', async () => {
    const doctor = await Doctor.create({
      image: 'doctor_image.jpg',
      Name: 'Mark Johnson',
      Specialization: 'Orthopedics',
      ContactNo: '2223334444',
      Email: 'mark.johnson@example.com',
      Address: '101 Main St',
      BasicSalary: 80000,
      Description: 'Orthopedic surgeon with 15 years of experience',
      WorkingHospitals: ['Hospital E'],
      Password: 'password123',
    });

    const response = await request(app).delete(`/doctors/${doctor._id}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Doctor deleted successfully');
  });

  // Test case for doctor login
  it('should login a doctor', async () => {
    const doctor = await Doctor.create({
      image: 'doctor_image.jpg',
      Name: 'Tom Brown',
      Specialization: 'Dermatology',
      ContactNo: '3334445555',
      Email: 'tom.brown@example.com',
      Address: '202 Main St',
      BasicSalary: 90000,
      Description: 'Dermatologist with a focus on skin cancer',
      WorkingHospitals: ['Hospital F'],
      Password: 'password123',
    });

    const response = await request(app).post('/doctors/login').send({
      DoctorID: doctor._id,
      Password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body.Email).toBe(doctor.Email);
  });
});
