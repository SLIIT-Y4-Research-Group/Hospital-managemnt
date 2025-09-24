import React, { useState } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../../config/firebase";
import Swal from 'sweetalert2';
import backgroundImage from '../../assets/background.png'; 
import DOMPurify from 'dompurify';

const specializations = [
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Pediatrics',
  'Radiology',
  'Surgery',
  'General Practice',
  // Add more specializations as needed
];

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

  const validateInputs = () => {
    if (!name || !specialization || !contactNo || !email || !address || !basicSalary || !description || !Password) {
      Swal.fire('Validation Error', 'All fields are required!', 'error');
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(Password)) {
      Swal.fire('Validation Error', 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.', 'error');
      return false;
    }

    
    return true;
  };

  const handleSaveDoctor = () => {
    if (!validateInputs()) return; 

    const uploadImageAndSubmit = (downloadURL) => {

      // sanitize description and each hospital field before sending to the db
      // Avoided using dangerouslySetInnerHTML or any direct innerHTML rendering of untrusted data.
      // Sanitizing here ensures no malicious scripts are stored or rendered later.

       // Sanitize description
      const cleanDescription = DOMPurify.sanitize(description);

      // Sanitize hospital names and addresses
      const cleanHospitals = workingHospitals.map(hospital => ({
        HospitalName: DOMPurify.sanitize(hospital.HospitalName),
        HospitalAddress: DOMPurify.sanitize(hospital.HospitalAddress)
      }));

      const data = {
        image: downloadURL || null,
        Name: name,
        Specialization: specialization,
        ContactNo: contactNo,
        Email: email,
        Address: address,
        BasicSalary: basicSalary,
        Description: cleanDescription,
        WorkingHospitals: cleanHospitals,
        Password: Password,
      };

      setLoading(true);
      axios
        .post('http://localhost:5000/doctors', data)
        .then(() => {
          setLoading(false);
          navigate('/doctorLogin');
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
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveDoctor(); }}>
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
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            >
              <option value="" disabled>Select Specialization</option>
              {specializations.map((spec, index) => (
                <option key={index} value={spec}>{spec}</option>
              ))}
            </select>
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
              placeholder="Appointment Fee" 
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
