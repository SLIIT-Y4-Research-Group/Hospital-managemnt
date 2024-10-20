import React, { useState, useEffect } from 'react';
// import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
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
  const [appointmentFee, setAppointmentFee] = useState(''); // New state for appointment fee
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/doctors');
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

  const handleSaveSchedule = () => {
    const data = {
      DoctorID: doctorID,
      DoctorName: doctorName,
      Specialization: specialization,
      Date: date,
      TimeSlots: timeSlots,
      AppointmentFee: appointmentFee, // Include the appointment fee
      MaxAppointments: maxAppointments,
      Location: location,
    };

    setLoading(true);
    axios
      .post('http://localhost:5000/doctorShedules', data)
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

  console.log("Doctors state:", doctors); // Log doctors state before rendering

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="bg-white bg-opacity-90 shadow-md rounded-lg p-8 w-11/12 mt-5 mb-6 md:w-1/2">
        {/* <BackButton destination='/doctorShedules/alldoctorShedules' /> */}
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
              type='text'
              value={appointmentFee}
              onChange={(e) => setAppointmentFee(e.target.value)} // Update appointment fee state
              className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              placeholder="Enter Appointment Fee"
            />
          </div>

          <button
            onClick={handleSaveSchedule}
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDoctorSchedule;
