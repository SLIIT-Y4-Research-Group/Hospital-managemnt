import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UpdateAppointment from './UpdateAppointment'; // Import the UpdateAppointment component

const AppointmentsList = ({ userId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/appointments/user/${userId}`);
        setAppointments(response.data); // Assuming the data is an array of appointments
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAppointments();
    }
  }, [userId]);
  


  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axios.delete(`http://localhost:5000/appointments/${id}`);
        setAppointments(appointments.filter((appointment) => appointment._id !== id));
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const handleUpdate = (appointment) => {
    setCurrentAppointment(appointment);
    setIsUpdating(true);
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading appointments...</p>;
  }

  if (appointments.length === 0) {
    return <p className="text-center text-gray-500">No appointments found.</p>;
  }

  return (
    <div className="mt-6">
     
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.map((appointment) => (
          <li key={appointment._id} className="border rounded-lg p-4 shadow-lg bg-white">
            <p className="text-gray-800 font-medium">
              <strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}
            </p>
            <p className="text-gray-800 font-medium">
              <strong>Time:</strong> {appointment.appointmentTime}
            </p>
            <p className="text-gray-800 font-medium">
              <strong>Doctor:</strong> {appointment.doctor}
            </p>
            <p className="text-gray-800 font-medium">
              <strong>Hospital:</strong> {appointment.hospital}
            </p>
            <p className="text-gray-800 font-medium">
              <strong>Reason:</strong> {appointment.reasonForVisit}
            </p>
            <p className={`text-sm font-semibold ${appointment.status === 'Pending' ? 'text-yellow-500' : 'text-green-500'}`}>
              <strong>Status:</strong> {appointment.status}
            </p>
            <div className="flex justify-end mt-4 space-x-4">
              <button
                className="text-red-500 hover:text-red-600 font-medium"
                onClick={() => handleDelete(appointment._id)}
              >
                Delete
              </button>
              <button
                className="text-blue-500 hover:text-blue-600 font-medium"
                onClick={() => handleUpdate(appointment)}
              >
                Update
              </button>
            </div>
          </li>
        ))}
      </ul>
      {isUpdating && (
        <UpdateAppointment
          appointment={currentAppointment}
          onClose={() => setIsUpdating(false)}
          onUpdate={(updatedAppointment) => {
            setAppointments((prev) =>
              prev.map((appointment) =>
                appointment._id === updatedAppointment._id ? updatedAppointment : appointment
              )
            );
            setIsUpdating(false);
          }}
        />
      )}
    </div>
  );
};

export default AppointmentsList;
