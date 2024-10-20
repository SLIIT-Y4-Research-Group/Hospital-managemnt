import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail', // or your email service
    auth: {
        user: 'dhanukanavodya97@gmail.com', // Your email
        pass: 'dhaNUka2002', // Your email password
    },
});

// Email sending route
router.post('/send-email', async (req, res) => {
    const { email, appointmentId, firstName, lastName, appointmentDate, appointmentTime, doctor, hospital } = req.body;

    const mailOptions = {
        from: 'your-email@gmail.com', // Sender email
        to: email, // Recipient email
        subject: `Appointment Confirmation - ${appointmentId}`,
        text: `Hello ${firstName} ${lastName},\n\nYour appointment has been created successfully.\n\nHere are the details:\n\n- Appointment ID: ${appointmentId}\n- Doctor: ${doctor}\n- Hospital: ${hospital}\n- Appointment Date: ${appointmentDate}\n- Appointment Time: ${appointmentTime}\n\nThank you!`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send email', error });
    }
});

export default router;
