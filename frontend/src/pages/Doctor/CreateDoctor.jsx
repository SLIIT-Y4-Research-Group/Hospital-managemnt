import React, { useState } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../../config/firebase";
import Swal from 'sweetalert2';

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
    uploadImageAndSubmit(null); // No image uploaded
  }
  }

  return (
    <div className='p-4'>
      <BackButton destination='/doctors/alldoctors' />
      <h1 className='text-3xl my-4'>Create Doctor</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Name</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>specialization</label>
          <input
            type='text'
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Contact No</label>
          <input
            type='text'
            value={contactNo}
            onChange={(e) => setContactNo(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Email</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Address</label>
          <input
            type='text'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Basic Salary</label>
          <input
            type='number'
            value={basicSalary}
            onChange={(e) => setBasicSalary(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a detailed description here..."
            rows={6}
            className='border-2 border-gray-500 px-4 py-2 w-full rounded-md focus:outline-none focus:border-green-500 transition duration-200'
          />
        </div>

        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Password</label>
          <input
            type='number'
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        
        <h3 className='text-xl text-gray-500 mb-4'>Working Hospitals</h3>
        {workingHospitals.map((hospital, index) => (
          <div key={index} className='my-4'>
            <div>
              <label className='text-l mr-4 text-gray-500'>Hospital Name</label>
              <input
                type='text'
                value={hospital.HospitalName}
                onChange={(e) => handleHospitalChange(index, 'HospitalName', e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
            </div>
            <div className='my-4'>
              <label className='text-l mr-4 text-gray-500'>Hospital Address</label>
              <input
                type='text'
                value={hospital.HospitalAddress}
                onChange={(e) => handleHospitalChange(index, 'HospitalAddress', e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
            </div>
            <button
              onClick={() => handleRemoveHospital(index)}
              className='p-2 bg-red-300 w-full mt-2'
            >
              Remove
            </button>
          </div>
        ))}

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3 mb-6">
            <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="image">
              Upload Image
            </label>
            <input className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="image" type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
        </div>

        <button
          onClick={handleAddHospital}
          className='p-2 bg-green-300 w-full mt-2'
        >
          Add Another Hospital
        </button>
        <button className='p-2 bg-sky-300 m-8' onClick={handleSaveDoctor}>
          Create Doctor
        </button>
      </div>
    </div>
  );
};

export default CreateDoctor;
