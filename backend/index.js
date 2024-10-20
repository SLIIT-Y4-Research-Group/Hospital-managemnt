// index.js
import express from 'express';
import { PORT, mongoDBURL } from "./config.js";
import mongoose from 'mongoose';
import cors from 'cors';
import AppointmentRoute from './routes/AppointmentRoute.js';
import authRoutes from './routes/authRoutes.js';
import StockRoute from './routes/StockRoute.js';
import Doctor_Route from './routes/Doctor_Route.js';
import paymentRoutes from './routes/PaymentRoute.js';
import doctorRoutes from './routes/doctorRoute.js';

import Email from './routes/AppointmentEmail.js';

import DoctorShedule_Route from './routes/DoctorShedule_Route.js';
import Hospital_Route from './routes/Hospital_Route.js';


import Email from './routes/AppointmentEmail.js';
// Create an instance of the Express application
const app = express();

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS POLICY
app.use(cors());

// Simple welcome route
// app.get('/', (req, res) => {
//   console.log(req);
//   return res.status(234).send("Welcome");
// });


// Connecting to the MongoDB database
mongoose.connect(mongoDBURL)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

  app.use('/api/auth', authRoutes);
  app.use('/appointments', AppointmentRoute);
  app.use('/', Email);
  app.use('/stocks', StockRoute);
  app.use('/doctors', Doctor_Route);
  app.use('/doctorShedules', DoctorShedule_Route);
  app.use('/hospitals', Hospital_Route);

  app.use('/payments', paymentRoutes);
  app.use('/api/doctors', doctorRoutes);


