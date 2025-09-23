import React, { useState, useEffect } from 'react';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../../config/firebase";
import Swal from 'sweetalert2'; // Import SweetAlert2
import backgroundImage from '../../assets/background.png'; // Import your background image

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

const EditDoctor = () => {
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [basicSalary, setBasicSalary] = useState('');
  const [description, setDescription] = useState('');
  const [workingHospitals, setWorkingHospitals] = useState([{ HospitalName: '', HospitalAddress: '' }]);
  //const [Password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const storage = getStorage(app);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/doctors/${id}`)
      .then((response) => {
        const doctor = response.data;
        setImageURL(doctor.image);
        setName(doctor.Name || '');
        setSpecialization(doctor.Specialization || '');
        setContactNo(doctor.ContactNo || '');
        setEmail(doctor.Email || '');
        setAddress(doctor.Address || '');
        setBasicSalary(doctor.BasicSalary || '');
        setDescription(doctor.Description || '');
        setWorkingHospitals(doctor.WorkingHospitals || [{ HospitalName: '', HospitalAddress: '' }]);
        //setPassword(doctor.Password || '');
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

  const validateForm = () => {
    if (!name || !specialization || !contactNo || !email || !address || !basicSalary || !description) {
      Swal.fire('Validation Error', 'Please fill in all the required fields.', 'error');
      return false;
    }
    // Add more specific validations as needed, e.g. email format, contact number format, etc.
    return true;
  };

  const handleEditDoctor = () => {
    if (!validateForm()) return; // Validate before proceeding

    const uploadImageAndSubmit = (downloadURL) => {
      const data = {
        image: downloadURL || imageURL,
        Name: name,
        Specialization: specialization,
        ContactNo: contactNo,
        Email: email,
        Address: address,
        BasicSalary: basicSalary,
        Description: description,
        WorkingHospitals: workingHospitals,
        //Password: Password,
      };

      console.log('Data to be sent:', data); // Log the data being sent

      setLoading(true);
      axios
        .put(`http://localhost:5000/doctors/${id}`, data)
        .then(() => {
          setLoading(false);
          Swal.fire('Success', 'Doctor details updated successfully!', 'success'); // Success alert
          navigate(`/docHome/${id}`); // Navigate after successful update
        })
        .catch((error) => {
          setLoading(false);
          console.error('Error updating doctor:', error.response ? error.response.data : error);
          Swal.fire('Error', 'Failed to update doctor details. Please try again.', 'error'); // Error alert
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
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className='bg-white bg-opacity-90 shadow-md rounded-lg p-8 w-11/12 mt-5 mb-6 md:w-1/2'>
        <h1 className='text-3xl font-bold text-center my-4 text-blue-600'>Edit Doctor</h1>
        {loading ? <Spinner /> : (
          <div className='flex flex-col'>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Current Image</label>
              {imageURL && <img src={imageURL} alt="Doctor" className="w-32 h-32 object-cover mb-4" />}
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3 mb-6">
                <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="image">
                  Upload Image
                </label>
                <input className="appearance-none block w-full bg-gray-200 text-black border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="image" type="file" onChange={(e) => setImage(e.target.files[0])} />
              </div>
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Name</label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Specialization</label>
              <select
                type='text'
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className='border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400'
              >
                <option value="" disabled>Select Specialization</option>
              {specializations.map((spec, index) => (
                <option key={index} value={spec}>{spec}</option>
              ))}
              </select>
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Contact Number</label>
              <input
                type='text'
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
                className='border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Email</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Address</label>
              <input
                type='text'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className='border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Basic Salary</label>
              <input
                type='number'
                value={basicSalary}
                onChange={(e) => setBasicSalary(e.target.value)}
                className='border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
            </div>
            <div className='my-4'>
              <label className='text-xl mr-4 text-gray-500'>Working Hospitals</label>
              {workingHospitals.map((hospital, index) => (
                <div key={index} className="flex mb-4">
                  <input
                    type="text"
                    value={hospital.HospitalName}
                    onChange={(e) => handleHospitalChange(index, 'HospitalName', e.target.value)}
                    placeholder="Hospital Name"
                    className='border border-gray-300 rounded-md p-2 mr-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400'
                  />
                  <input
                    type="text"
                    value={hospital.HospitalAddress}
                    onChange={(e) => handleHospitalChange(index, 'HospitalAddress', e.target.value)}
                    placeholder="Hospital Address"
                    className='border border-gray-300 rounded-md p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400'
                  />
                  <button type="button" onClick={() => removeHospital(index)} className="text-red-600 ml-2">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addHospital} className="text-blue-600">Add Hospital</button>
            </div>
            {/* <div className='my-4' hidden>
              <label className='text-xl mr-4 text-gray-500'>Password</label>
              <input
                type='password'
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                className='border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
            </div> */}
            <button onClick={handleEditDoctor} className='bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-blue-500'>
              Update Doctor
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditDoctor;
