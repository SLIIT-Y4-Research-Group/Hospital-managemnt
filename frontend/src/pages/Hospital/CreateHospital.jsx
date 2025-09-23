import React, { useState, useEffect } from 'react';
import Spinner from '../../components/Spinner';
import api from '../../config/api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import backgroundImage from '../../assets/background.png'; // Import your background image

const CreateHospital = () => {
  const [hospitalName, setHospitalName] = useState('');
  const [departments, setDepartments] = useState(['']);
  const [contactNo, setContactNo] = useState(['']);
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const handleDepartmentChange = (index, value) => {
    const updatedDepartments = [...departments];
    updatedDepartments[index] = value;
    setDepartments(updatedDepartments);
  };

  const handleContactChange = (index, value) => {
    const updatedContact = [...contactNo];
    updatedContact[index] = value;
    setContactNo(updatedContact);
  };

  const handleAddDepartment = () => {
    setDepartments([...departments, '']);
  };

  const handleRemoveDepartment = (index) => {
    const updatedDepartments = departments.filter((_, i) => i !== index);
    setDepartments(updatedDepartments);
  };

  const handleAddContact = () => {
    setContactNo([...contactNo, '']);
  };

  const handleRemoveContact = (index) => {
    const updatedContacts = contactNo.filter((_, i) => i !== index);
    setContactNo(updatedContacts);
  };

  const handleDoctorSelectChange = (event) => {
    const selected = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedDoctors(selected);
  };

  const handleSaveHospital = () => {
    // Validation
    if (!hospitalName.trim()) {
      Swal.fire('Validation Error', 'Hospital name is required.', 'error');
      return;
    }
    
    if (departments.filter(dept => dept.trim() !== '').length === 0) {
      Swal.fire('Validation Error', 'At least one department is required.', 'error');
      return;
    }

    if (contactNo.filter(contact => contact.trim() !== '').length === 0) {
      Swal.fire('Validation Error', 'At least one contact number is required.', 'error');
      return;
    }

    if (!email.trim()) {
      Swal.fire('Validation Error', 'Email is required.', 'error');
      return;
    }

    if (!address.trim()) {
      Swal.fire('Validation Error', 'Address is required.', 'error');
      return;
    }

    if (selectedDoctors.length === 0) {
      Swal.fire('Validation Error', 'At least one doctor must be selected.', 'error');
      return;
    }

    const data = {
      Name: hospitalName,
      Departments: departments.filter(department => department.trim() !== ''),
      ContactNo: contactNo.filter(contact => contact.trim() !== ''),
      Email: email,
      Address: address,
      Doctors: selectedDoctors,
    };

    setLoading(true);
    api
      .post('hospitals', data)
      .then(() => {
        setLoading(false);
        navigate('/Hospital/allHospital'); // Adjust this path based on your routes
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        Swal.fire('Error', 'Failed to create hospital. Please try again.', 'error');
      });
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="bg-white bg-opacity-90 shadow-md rounded-lg p-8 w-11/12 mt-5 mb-6 md:w-1/2">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Create Hospital</h1>
        {loading && <Spinner />}
        <div className="flex flex-col">
          <div className="my-4">
            <label className="text-xl mr-4 text-gray-500">Hospital Name</label>
            <input
              type='text'
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              required
            />
          </div>

          <h3 className="text-xl text-gray-500 mb-4">Departments</h3>
          {departments.map((dept, index) => (
            <div key={index} className="my-4 flex">
              <input
                type='text'
                value={dept}
                onChange={(e) => handleDepartmentChange(index, e.target.value)}
                className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                placeholder="Department Name"
              />
              <button
                onClick={() => handleRemoveDepartment(index)}
                className="p-2 bg-red-300 ml-2 rounded-md hover:bg-red-400 transition"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={handleAddDepartment}
            className="p-2 bg-green-300 w-full mt-2 rounded-md hover:bg-green-400 transition"
          >
            Add Another Department
          </button>

          <h3 className="text-xl text-gray-500 mb-4">Contact Numbers</h3>
          {contactNo.map((contact, index) => (
            <div key={index} className="my-4 flex">
              <input
                type='text'
                value={contact}
                onChange={(e) => handleContactChange(index, e.target.value)}
                className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                placeholder="Contact Number"
              />
              <button
                onClick={() => handleRemoveContact(index)}
                className="p-2 bg-red-300 ml-2 rounded-md hover:bg-red-400 transition"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={handleAddContact}
            className="p-2 bg-green-300 w-full mt-2 rounded-md hover:bg-green-400 transition"
          >
            Add Another Contact Number
          </button>

          <div className="my-4">
            <label className="text-xl mr-4 text-gray-500">Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              required
            />
          </div>

          <div className="my-4">
            <label className="text-xl mr-4 text-gray-500">Address</label>
            <input
              type='text'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              required
            />
          </div>

          <div className="my-4">
            <label className="text-xl mr-4 text-gray-500">Select Doctors</label>
            <select
              multiple
              value={selectedDoctors}
              onChange={handleDoctorSelectChange}
              className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            >
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

          <button className="p-2 bg-sky-300 w-full mt-4 rounded-md hover:bg-sky-400 transition" onClick={handleSaveHospital}>
            Create Hospital
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateHospital;
