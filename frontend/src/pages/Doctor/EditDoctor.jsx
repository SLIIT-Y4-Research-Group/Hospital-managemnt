import React, { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditDoctor = () => {
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
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/doctors/${id}`)
      .then((response) => {
        const doctor = response.data;
        setName(doctor.Name || '');  // Default to an empty string if undefined
        setSpecialization(doctor.Specialization || '');
        setContactNo(doctor.ContactNo || '');
        setEmail(doctor.Email || '');
        setAddress(doctor.Address || '');
        setBasicSalary(doctor.BasicSalary || '');
        setDescription(doctor.Description || '');
        setWorkingHospitals(doctor.WorkingHospitals || [{ HospitalName: '', HospitalAddress: '' }]);
        setPassword(doctor.Password || '');
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error fetching doctor:', error);
      });
  }, [id]);

  const handleHospitalChange = (index, field, value) => {
    const newHospitals = [...workingHospitals];
    newHospitals[index][field] = value;
    setWorkingHospitals(newHospitals);
  };

  const handleEditDoctor = () => {
    const data = {
      Name: name,
      Specialization: specialization,
      ContactNo: contactNo, // Make sure this field is included
      Email: email,
      Address: address,
      BasicSalary: basicSalary,
      Description: description,
      WorkingHospitals: workingHospitals,
      Password: Password, 
    };

    setLoading(true);
    axios
      .put(`http://localhost:5000/doctors/${id}`, data)
      .then(() => {
        setLoading(false);
        navigate('/doctors/alldoctors'); // Navigate after successful update
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error updating doctor:', error.response ? error.response.data : error);
      });
  };

  const addHospital = () => {
    setWorkingHospitals([...workingHospitals, { HospitalName: '', HospitalAddress: '' }]);
  };

  const removeHospital = (index) => {
    const newHospitals = workingHospitals.filter((_, i) => i !== index);
    setWorkingHospitals(newHospitals);
  };

  return (
    <div className='p-4'>
      <BackButton destination='/doctors/alldoctors' />
      <h1 className='text-3xl my-4'>Edit Doctor</h1>
      {loading ? <Spinner /> : (
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
            <label className='text-xl mr-4 text-gray-500'>Specialization</label>
            <input
              type='text'
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className='border-2 border-gray-500 px-4 py-2 w-full'
            />
          </div>
          <div className='my-4'>
            <label className='text-xl mr-4 text-gray-500'>Contact Number</label>
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
              type='text'
              value={basicSalary}
              onChange={(e) => setBasicSalary(e.target.value)}
              className='border-2 border-gray-500 px-4 py-2 w-full'
            />
          </div>
          <div className='my-4'>
            <label className='text-xl mr-4 text-gray-500'>Description</label>
            <input
              type='text'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='border-2 border-gray-500 px-4 py-2 w-full'
            />
          </div>
          <div className='my-4'>
            <label className='text-xl mr-4 text-gray-500'>Password</label>
            <input
              type='password'
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              className='border-2 border-gray-500 px-4 py-2 w-full'
            />
          </div>
          <h2 className='text-2xl my-4'>Working Hospitals</h2>
          {workingHospitals.map((hospital, index) => (
            <div key={index} className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Hospital Name</label>
              <input
                type='text'
                value={hospital.HospitalName}
                onChange={(e) => handleHospitalChange(index, 'HospitalName', e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              <label className='text-xl mr-4 text-gray-500'>Hospital Address</label>
              <input
                type='text'
                value={hospital.HospitalAddress}
                onChange={(e) => handleHospitalChange(index, 'HospitalAddress', e.target.value)}
                className='border-2 border-gray-500 px-4 py-2 w-full'
              />
              <button
                className='text-red-500 mt-2'
                onClick={() => removeHospital(index)}
              >
                Remove Hospital
              </button>
            </div>
          ))}
          <button className='text-blue-500' onClick={addHospital}>
            Add Hospital
          </button>

          <button className='p-2 bg-sky-300 m-8' onClick={handleEditDoctor}>
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default EditDoctor;
