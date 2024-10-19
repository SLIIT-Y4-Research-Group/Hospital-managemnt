import React, { useState } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateDoctor = () => {
  const [name, setName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [basicSalary, setBasicSalary] = useState('');
  const [description, setDescription] = useState('');
  const [workingHospitals, setWorkingHospitals] = useState([{ HospitalName: '', HospitalAddress: '' }]);
  const [Password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleHospitalChange = (index, field, value) => {
    const updatedHospitals = [...workingHospitals];
    updatedHospitals[index][field] = value;
    setWorkingHospitals(updatedHospitals);
  };

  const handleAddHospital = () => {
    setWorkingHospitals([...workingHospitals, { HospitalName: '', HospitalAddress: '' }]);
  };

  const handleSaveDoctor = () => {
    const data = {
      Name: name,
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
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
          <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Password</label>
          <input
            type='number'
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
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
          </div>
          
          
          
        ))}
        <button
          onClick={handleAddHospital}
          className='p-2 bg-green-300 w-full mt-2'
        >
          Add Another Hospital
        </button>
        <button className='p-2 bg-sky-300 m-8' onClick={handleSaveDoctor}>
          Save
        </button>
      </div>
    </div>
  );
};

export default CreateDoctor;
