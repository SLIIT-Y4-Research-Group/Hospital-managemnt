import React, { useEffect, useState } from 'react';
import api from '../../config/api';

const UpdateAppointment = ({ appointment, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    email: '',
    nic: '',
    hospital: '',
    gender: '',
    appointmentDate: '',
    appointmentTime: '',
    doctor: '',
    address: '',
    reasonForVisit: '',
    status: ''
  });
  const [alert, setAlert] = useState({ visible: false, message: '' });

  useEffect(() => {
    if (appointment) {
      setFormData({ ...appointment }); // Set initial form data from the appointment
    }
  }, [appointment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/appointments/${appointment._id}`, formData);
      onUpdate(response.data); // Update the appointment in the parent component
      setAlert({ visible: true, message: 'Appointment updated successfully!' });
      setTimeout(() => {
        setAlert({ visible: false, message: '' });
        onClose(); // Close the update form
      }, 2000); // Hide the alert after 2 seconds
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center overflow-y-auto">
      <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Update Appointment</h2>
        {alert.visible && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
            {alert.message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            name="firstName" 
            value={formData.firstName} 
            onChange={handleChange} 
            placeholder="First Name" 
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input 
            type="text" 
            name="lastName" 
            value={formData.lastName} 
            onChange={handleChange} 
            placeholder="Last Name" 
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input 
            type="text" 
            name="contactNumber" 
            value={formData.contactNumber} 
            onChange={handleChange} 
            placeholder="Contact Number" 
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="Email" 
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input 
            type="text" 
            name="nic" 
            value={formData.nic} 
            onChange={handleChange} 
            placeholder="NIC" 
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input 
            type="text" 
            name="hospital" 
            value={formData.hospital} 
            onChange={handleChange} 
            placeholder="Hospital" 
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input 
            type="text" 
            name="gender" 
            value={formData.gender} 
            onChange={handleChange} 
            placeholder="Gender" 
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input 
            type="date" 
            name="appointmentDate" 
            value={formData.appointmentDate} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input 
            type="time" 
            name="appointmentTime" 
            value={formData.appointmentTime} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input 
            type="text" 
            name="doctor" 
            value={formData.doctor} 
            onChange={handleChange} 
            placeholder="Doctor" 
            className="w-full p-2 border border-gray-300 rounded"
          />
          <textarea 
            name="reasonForVisit" 
            value={formData.reasonForVisit} 
            onChange={handleChange} 
            placeholder="Reason for Visit" 
            className="w-full p-2 border border-gray-300 rounded"
          ></textarea>
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
          </select>
          <div className="flex justify-end space-x-4">
            <button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Update Appointment
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAppointment;
