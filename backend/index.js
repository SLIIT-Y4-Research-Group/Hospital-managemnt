// backend/index.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';

// Import configurations
import { PORT, FRONTEND_URL, CSRF_COOKIE_OPTIONS, XSRF_MIRROR_COOKIE_OPTIONS } from './config.js';

// Initialize Firebase Admin (side-effect import)
import './config/firebaseConfig.js';

// DB singleton (connects on import)
import db from './db.js';

// Routes
import AppointmentRoute from './routes/AppointmentRoute.js';
import authRoutes from './routes/authRoutes.js';
import StockRoute from './routes/StockRoute.js';
import Doctor_Route from './routes/Doctor_Route.js';
import paymentRoutes from './routes/PaymentRoute.js';
import doctorRoutes from './routes/doctorRoute.js';
import Email from './routes/AppointmentEmail.js';
import DoctorShedule_Route from './routes/DoctorShedule_Route.js';
import Hospital_Route from './routes/Hospital_Route.js';
import cropRoutesF from './routes/cropRoute.js';
import reportRoutes from './routes/reportRoute.js';
import treatmentRoutes from './routes/treatmentRoute.js';
import userRoute from './routes/userRoute.js';

const app = express();

/* ---------------- Security & parsers ---------------- */
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

/* ---------------- CORS ---------------- */
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'CSRF-Token'],
  })
);

/* ---------------- CSRF (cookie-based secret) ---------------- */
const csrfProtection = csurf({
  cookie: CSRF_COOKIE_OPTIONS,
});

// CSRF token bootstrap route (GET only)
app.get('/csrf-token', csrfProtection, (req, res) => {
  const token = req.csrfToken();
  res.cookie('XSRF-TOKEN', token, XSRF_MIRROR_COOKIE_OPTIONS);
  console.log('CSRF token generated:', token);
  res.status(200).json({ csrfToken: token });
});

// Apply CSRF protection to all unsafe HTTP methods
app.use(csrfProtection);

// Middleware to check if CSRF token header is present
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    console.log('Incoming CSRF token header:', req.headers['csrf-token']);
  }
  next();
});

/* ---------------- Health / welcome ---------------- */
app.get('/', (req, res) => {
  return res.status(234).send('Welcome');
});

/* ---------------- Routes ---------------- */
// Auth
app.use('/api/auth', authRoutes);

// Appointments & emails
app.use('/appointments', AppointmentRoute);
app.use('/', Email);

// Stocks
app.use('/stocks', StockRoute);

// Doctors (two route groups in your project)
app.use('/doctors', Doctor_Route);
app.use('/api/doctors', doctorRoutes);

// Doctor schedules
app.use('/doctorShedules', DoctorShedule_Route);
app.use('/api', DoctorShedule_Route); // if you truly need both prefixes

// Hospitals
app.use('/hospitals', Hospital_Route);

// Other modules
app.use('/', cropRoutesF);
app.use('/', reportRoutes);
app.use('/', treatmentRoutes);
app.use('/', userRoute);

// Payments
app.use('/payments', paymentRoutes);

/* ---------------- CSRF error handler ---------------- */
app.use((err, req, res, next) => {
  if (err?.code === 'EBADCSRFTOKEN') {
    console.error('CSRF Error: Invalid or missing CSRF token');
    return res.status(403).json({ message: 'Invalid or missing CSRF token' });
  }
  return next(err);
});

/* ---------------- Server listen ---------------- */
app.listen(PORT, () => {
  console.log(`App is listening on port: ${PORT}`);
});