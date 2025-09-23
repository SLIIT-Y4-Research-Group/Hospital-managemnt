import React, { useState, useEffect } from 'react';
import Spinner from '../../components/Spinner';
import api from '../../config/api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import backgroundImage from '../../assets/background.png'; // Import your background image

const timeOptions = [
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-01:00",
  "01:00-02:00",
  "02:00-03:00",
  "03:00-04:00",
  "04:00-05:00",
  "05:00-06:00",
  "06:00-07:00",
];

const CreateDoctorSchedule = () => {
  const [doctorID, setDoctorID] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [date, setDate] = useState('');
  const [timeSlots, setTimeSlots] = useState(['']);
  const [maxAppointments, setMaxAppointments] = useState('');
  const [location, setLocation] = useState('');
  const [appointmentFee, setAppointmentFee] = useState('');
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/doctors');
        console.log("Doctors response:", response.data);
        setDoctors(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        Swal.fire('Error', 'Failed to fetch doctors. Please try again later.', 'error');
      }
    };

    fetchDoctors();
  }, []);

  const handleDoctorChange = (event) => {
    const selectedDoctorID = event.target.value;
    const selectedDoctor = doctors.find(doc => doc.DoctorID === selectedDoctorID);

    if (selectedDoctor) {
      setDoctorName(selectedDoctor.Name);
      setSpecialization(selectedDoctor.Specialization);
    } else {
      setDoctorName('');
      setSpecialization('');
    }

    setDoctorID(selectedDoctorID);
  };

  const handleTimeSlotChange = (index, value) => {
    const updatedSlots = [...timeSlots];
    updatedSlots[index] = value;
    setTimeSlots(updatedSlots);
  };

  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, '']);
  };

  const handleRemoveTimeSlot = (index) => {
    const updatedSlots = timeSlots.filter((_, i) => i !== index);
    setTimeSlots(updatedSlots);
  };

  const validateForm = () => {
    if (!doctorID) {
      Swal.fire('Validation Error', 'Please select a doctor.', 'error');
      return false;
    }
    if (!date) {
      Swal.fire('Validation Error', 'Please select a date.', 'error');
      return false;
    }
    if (!timeSlots.every(slot => slot)) {
      Swal.fire('Validation Error', 'Please select all time slots.', 'error');
      return false;
    }
    if (!maxAppointments) {
      Swal.fire('Validation Error', 'Please enter the maximum number of appointments.', 'error');
      return false;
    }
    if (!location) {
      Swal.fire('Validation Error', 'Please enter the location.', 'error');
      return false;
    }
    if (!appointmentFee) {
      Swal.fire('Validation Error', 'Please enter the appointment fee.', 'error');
      return false;
    }
    return true;
  };

  const handleSaveSchedule = () => {
    if (!validateForm()) return; // Stop if validation fails

    const data = {
      DoctorID: doctorID,
      DoctorName: doctorName,
      Specialization: specialization,
      Date: date,
      TimeSlots: timeSlots,
      AppointmentFee: appointmentFee,
      MaxAppointments: maxAppointments,
      Location: location,
    };

    setLoading(true);
    api
      .post('doctorShedules', data)
      .then(() => {
        setLoading(false);
        navigate('/schedules'); // Adjust this path based on your routes
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        Swal.fire('Error', 'Failed to create schedule. Please try again.', 'error');
      });
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="bg-white bg-opacity-90 shadow-md rounded-lg p-8 w-11/12 mt-5 mb-6 md:w-1/2">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Create Doctor Schedule</h1>
        {loading && <Spinner />}
        <div className="flex flex-col">
          <div className="my-4">
            <label className="text-xl mr-4 text-gray-500">Select Doctor</label>
            <select
              value={doctorID}
              onChange={handleDoctorChange}
              className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select a Doctor</option>
              {doctors.length === 0 ? (
                <option value="">No Doctors Available</option>
              ) : (
                doctors.map((doctor) => (
                  <option key={doctor.DoctorID} value={doctor.DoctorID}>
                    {doctor.Name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="my-4">
            <label className="text-xl mr-4 text-gray-500">Doctor Name</label>
            <input
              type='text'
              value={doctorName}
              readOnly
              className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>
          <div className="my-4">
            <label className="text-xl mr-4 text-gray-500">Specialization</label>
            <input
              type='text'
              value={specialization}
              readOnly
              className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>
          <div className="my-4">
            <label className="text-xl mr-4 text-gray-500">Date</label>
            <input
              type='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>
          <h3 className="text-xl text-gray-500 mb-4">Time Slots</h3>
          {timeSlots.map((slot, index) => (
            <div key={index} className="my-4">
              <select
                value={slot}
                onChange={(e) => handleTimeSlotChange(index, e.target.value)}
                className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              >
                <option value="">Select a Time Slot</option>
                {timeOptions.map((time, i) => (
                  <option key={i} value={time}>{time}</option>
                ))}
              </select>
              <button
                onClick={() => handleRemoveTimeSlot(index)}
                className="p-2 bg-red-300 w-full mt-2 rounded-md hover:bg-red-400 transition"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={handleAddTimeSlot}
            className="p-2 bg-green-300 w-full mt-2 rounded-md hover:bg-green-400 transition"
          >
            Add Another Time Slot
          </button>

          <div className="my-4">
            <label className="text-xl mr-4 text-gray-500">Max Appointments</label>
            <input
              type='number'
              value={maxAppointments}
              onChange={(e) => setMaxAppointments(e.target.value)}
              className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>

          <div className="my-4">
            <label className="text-xl mr-4 text-gray-500">Location</label>
            <input
              type='text'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>

          <div className="my-4">
            <label className="text-xl mr-4 text-gray-500">Appointment Fee</label>
            <input
              type='number'
              value={appointmentFee}
              onChange={(e) => setAppointmentFee(e.target.value)}
              className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>

          <button
            onClick={handleSaveSchedule}
            className="bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition"
          >
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDoctorSchedule;
