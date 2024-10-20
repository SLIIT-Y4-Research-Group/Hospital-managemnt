import React, { useState } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../../config/firebase";
import Swal from 'sweetalert2';
import backgroundImage from '../../assets/background.png'; // Import your background image


const CreateDoctor = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [basicSalary, setBasicSalary] = useState('');
  const [description, setDescription] = useState('');
  const [workingHospitals, setWorkingHospitals] = useState([{ HospitalName: '', HospitalAddress: '' }]);
  const [Password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const storage = getStorage(app);

  const handleHospitalChange = (index, field, value) => {
    const updatedHospitals = [...workingHospitals];
    updatedHospitals[index][field] = value;
    setWorkingHospitals(updatedHospitals);
  };

  const handleAddHospital = () => {
    setWorkingHospitals([...workingHospitals, { HospitalName: '', HospitalAddress: '' }]);
  };

  const handleRemoveHospital = (index) => {
    const updatedHospitals = workingHospitals.filter((_, i) => i !== index);
    setWorkingHospitals(updatedHospitals);
  };

  const handleSaveDoctor = () => {
    const uploadImageAndSubmit = (downloadURL) => {

    const data = {
      image: downloadURL || null, // Set image to null if no image is uploaded
      Name: name,
      Specialization: specialization,
      ContactNo: contactNo,
      Email: email,
      Address: address,
      BasicSalary: basicSalary,
      Description: description,
      WorkingHospitals: workingHospitals,
      Password: Password, 
    };

    setLoading(true);
    axios
      .post('http://localhost:5000/doctors', data)
      .then(() => {
        setLoading(false);
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  if (image) {
    const storageRef = ref(storage, `doctor_images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => { },
      (error) => {
        console.error(error);
        setLoading(false);
        Swal.fire('Error', 'Failed to upload image. Please try again.', 'error');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(uploadImageAndSubmit);
      }
    );
  } else {
    uploadImageAndSubmit(null);
  }
};

  return (
    <div
            className="flex items-center justify-center min-h-screen"
            style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
      <div className="bg-white bg-opacity-90 shadow-md rounded-lg p-8 w-11/12 mt-5 mb-6 md:w-1/2">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Create Doctor</h1>
        {loading ? <Spinner /> : (
          <form className="space-y-4" onSubmit={handleSaveDoctor}>
            <input 
              type="file" 
              onChange={(e) => setImage(e.target.files[0])} 
              className="border border-gray-300 rounded-md p-2 w-full"
            />
            <input 
              type="text" 
              placeholder="Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            />
            <input 
              type="text" 
              placeholder="Specialization" 
              value={specialization} 
              onChange={(e) => setSpecialization(e.target.value)} 
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            />
            <input 
              type="text" 
              placeholder="Contact No" 
              value={contactNo} 
              onChange={(e) => setContactNo(e.target.value)} 
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            />
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            />
            <input 
              type="text" 
              placeholder="Address" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            />
            <input 
              type="text" 
              placeholder="Basic Salary" 
              value={basicSalary} 
              onChange={(e) => setBasicSalary(e.target.value)} 
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            />
            <textarea 
              placeholder="Description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="border border-gray-300 rounded-md p-2 w-full h-32 resize-none"
              required
            />
            {workingHospitals.map((hospital, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Hospital Name" 
                  value={hospital.HospitalName} 
                  onChange={(e) => handleHospitalChange(index, 'HospitalName', e.target.value)} 
                  className="border border-gray-300 rounded-md p-2"
                  required
                />
                <input 
                  type="text" 
                  placeholder="Hospital Address" 
                  value={hospital.HospitalAddress} 
                  onChange={(e) => handleHospitalChange(index, 'HospitalAddress', e.target.value)} 
                  className="border border-gray-300 rounded-md p-2"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => handleRemoveHospital(index)} 
                  className="bg-red-500 text-white rounded-md p-2 mt-1"
                >
                  Remove Hospital
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={handleAddHospital} 
              className="bg-green-500 text-white rounded-md p-2"
            >
              Add Hospital
            </button>
            <input 
              type="password" 
              placeholder="Password" 
              value={Password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            />
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
            >
              Save Doctor
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateDoctor;
