import React, { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../../config/firebase";

const EditDoctor = () => {
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(''); // State for holding the image URL

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
  const storage = getStorage(app);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/doctors/${id}`)
      .then((response) => {
        const doctor = response.data;
        setImageURL(doctor.image);  // Set the initial image URL
        setName(doctor.Name || '');
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
    const uploadImageAndSubmit = (downloadURL) => {
        const data = {
            image: downloadURL || imageURL, // Use existing image URL if no new image uploaded
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

        console.log('Data to be sent:', data); // Log the data being sent

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

    if (image) {
        const storageRef = ref(storage, `doctor_images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {},
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
        uploadImageAndSubmit(null); // No new image uploaded
    }
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
            <label className='text-xl mr-4 text-gray-500'>Current Image</label>
            {imageURL && <img src={imageURL} alt="Doctor" className="w-32 h-32 object-cover mb-4" />} {/* Display the image */}
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3 mb-6">
                  <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="image">
                    Upload Image
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="image" type="file" onChange={(e) => setImage(e.target.files[0])} />
                </div>
              </div>
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
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a detailed description here..."
              rows={6}
              className='border-2 border-gray-500 px-4 py-2 w-full rounded-md focus:outline-none focus:border-green-500 transition duration-200'
            />
          </div>
          <h2 className='text-xl text-gray-500'>Working Hospitals</h2>
          {workingHospitals.map((hospital, index) => (
            <div key={index} className='flex mb-2'>
              <input
                type='text'
                value={hospital.HospitalName}
                onChange={(e) => handleHospitalChange(index, 'HospitalName', e.target.value)}
                placeholder='Hospital Name'
                className='border-2 border-gray-500 px-4 py-2 w-1/2 mr-2'
              />
              <input
                type='text'
                value={hospital.HospitalAddress}
                onChange={(e) => handleHospitalChange(index, 'HospitalAddress', e.target.value)}
                placeholder='Hospital Address'
                className='border-2 border-gray-500 px-4 py-2 w-1/2'
              />
              <button
                onClick={() => removeHospital(index)}
                className='ml-2 bg-red-500 text-white px-4 py-2 rounded'
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={addHospital}
            className='bg-green-500 text-white px-4 py-2 rounded my-4'
          >
            Add Hospital
          </button>
          <button
            onClick={handleEditDoctor}
            className='bg-blue-500 text-white px-4 py-2 rounded'
          >
            Update Doctor
          </button>
        </div>
      )}
    </div>
  );
};

export default EditDoctor;
