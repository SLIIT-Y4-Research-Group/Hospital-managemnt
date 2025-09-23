import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // You can change this to your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Generate a 6-digit OTP
export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Send OTP email
export const sendOTPEmail = async (email, otp, username) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Hospital Management System - Email Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c5aa0;">Hospital Management System</h1>
            <h2 style="color: #333;">Email Verification Required</h2>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 16px;">Hello <strong>${username}</strong>,</p>
            <p style="margin: 10px 0;">Thank you for registering with our Hospital Management System. To complete your registration, please verify your email address using the OTP below:</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #2c5aa0; color: white; padding: 15px 30px; border-radius: 5px; display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
              ${otp}
            </div>
          </div>
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
            <p style="margin: 0; color: #856404;"><strong>Important:</strong></p>
            <ul style="margin: 10px 0; color: #856404;">
              <li>This OTP is valid for <strong>10 minutes</strong> only</li>
              <li>Do not share this OTP with anyone</li>
              <li>If you didn't request this verification, please ignore this email</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              If you have any questions, please contact our support team.<br>
              © 2025 Hospital Management System. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email after successful verification
export const sendWelcomeEmail = async (email, username) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Welcome to Hospital Management System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c5aa0;">Hospital Management System</h1>
            <h2 style="color: #28a745;">Welcome! Account Verified Successfully</h2>
          </div>
          
          <div style="background-color: #d4edda; padding: 20px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #28a745;">
            <p style="margin: 0; font-size: 16px;">Hello <strong>${username}</strong>,</p>
            <p style="margin: 10px 0;">Congratulations! Your email has been successfully verified and your account is now active.</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #2c5aa0; margin-top: 0;">What you can do now:</h3>
            <ul style="margin: 10px 0;">
              <li>📅 Book appointments with our doctors</li>
              <li>📋 View your medical records</li>
              <li>💊 Track your prescriptions</li>
              <li>📞 Contact our support team</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" 
               style="background-color: #2c5aa0; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; display: inline-block; font-weight: bold;">
              Login to Your Account
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              If you have any questions, please contact our support team.<br>
              © 2025 Hospital Management System. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};