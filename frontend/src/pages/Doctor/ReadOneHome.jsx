import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { BsInfoCircle } from 'react-icons/bs';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineDelete } from 'react-icons/md';
import { FaLock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import DOMPurify from 'dompurify';


const DoctorProfile = () => {
  const [doctor, setDoctor] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/doctors/${id}`)
      .then((response) => {
        setDoctor(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  const handleChangePassword = async () => {
  if (newPassword !== confirmPassword) {
    Swal.fire({
      icon: 'error',
      title: 'Passwords do not match',
      text: 'Please re-enter your new password.',
    });
    return;
  }

  try {
    const response = await axios.post('http://localhost:5000/doctors/change-password', {
      doctorId: doctor._id,
      oldPassword,
      newPassword,
    });
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: response.data.message,
    });
    setShowPasswordPopup(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.response?.data?.message || 'Error updating password',
    });
  }
};

  return (
    <div className="doctor-profile-container">
      <div className="sidebar">
        <h2>Sidebar</h2>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/doctors/cards">Doctor cards</Link></li>
          <li><Link to={`/myAppointments/${id}`}>My Appointments</Link></li>
          <li><Link to={`/myShedule/${doctor.DoctorID}`}>My Shedule</Link></li> 
          <li><Link to="/SpecializationCard">SpecializationCard</Link></li>
          
        </ul>
      </div>

      <div className="profile-content">
        {loading ? (
          <div className="spinner">Loading...</div>
        ) : (
          <div className="profile-card">
            <div className="profile-header">
              <div className="doctor-info">
                <h1>{doctor.Name}</h1>
                <h1>{doctor.DoctorID}</h1>
                <div className="flex justify-center gap-4 action-links">
                  <Link to={`/doctors/details/${doctor._id}`}>
                    <BsInfoCircle className='text-2xl text-green-800 hover:text-green-600' />
                  </Link>
                  <Link to={`/doctors/edit/${doctor._id}`}>
                    <AiOutlineEdit className='text-2xl text-yellow-600 hover:text-yellow-500' />
                  </Link>
                  <Link to={`/doctors/delete/${doctor._id}`}>
                    <MdOutlineDelete className='text-2xl text-red-600 hover:text-red-500' />
                  </Link>
                  <button onClick={() => setShowPasswordPopup(true)}>
                    <FaLock className="text-2xl text-blue-600 hover:text-blue-500" />
                  </button>
                </div>
                <h2>Specialist {doctor.Specialization}</h2>
                <p className="rating">⭐⭐⭐⭐⭐</p>
              </div>
              
              <div className="doctor-image">
                <img
                  src={doctor.image || '/default-doctor-image.png'}
                  alt={doctor.Name}
                />
              </div>
            </div>

            <div className="profile-details">
              <h3>About Doctor</h3>
              {/* <p>{doctor.Description}</p> */}
              <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(doctor.Description || '') }} />

              <div className="contact-info">
                <p><strong>Email:</strong> {doctor.Email}</p>
                <p><strong>Phone:</strong> {doctor.ContactNo}</p>
                <p><strong>Address:</strong> {doctor.Address}</p>
              </div>

              <div className="salary">
                <h3>Appointment Fee</h3>
                <p>{doctor.BasicSalary}</p>
              </div>

              <div className="working-hospitals">
                <h3>Working Hospitals</h3>
                <ul>
                  {doctor.WorkingHospitals?.length > 0 ? (
                    doctor.WorkingHospitals.map((hospital, index) => (
                      <li key={index}>
                        {/* <strong>{hospital.HospitalName}</strong> - {hospital.HospitalAddress} */}
                        <strong>{DOMPurify.sanitize(hospital.HospitalName || '')}</strong> - {DOMPurify.sanitize(hospital.HospitalAddress || '')}
                      </li>
                    ))
                  ) : (
                    <p>No working hospitals listed.</p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      {showPasswordPopup && (
  <div className="popup-overlay">
    <div className="popup">
      <h2>Change Password</h2>
      <input
        type="password"
        placeholder="Current Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <div className="popup-buttons">
        <button onClick={handleChangePassword} className="save-btn">Save</button>
        <button onClick={() => setShowPasswordPopup(false)} className="cancel-btn">Cancel</button>
      </div>
    </div>
  </div>
)}

      {/* Inline CSS */}
      <style jsx>{`
      .popup-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .popup {
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          width: 350px;
          text-align: center;
        }
        .popup input {
          display: block;
          width: 100%;
          margin: 10px 0;
          padding: 8px;
          border-radius: 6px;
          border: 1px solid #ccc;
        }
        .popup-buttons {
          display: flex;
          justify-content: space-between;
      }
        .doctor-profile-container {
          display: flex;
          justify-content: flex-start;
          min-height: 100vh;
          background-color: #eaf0f7;
        }

        .sidebar {
          width: 200px;
          background-color: #3498db;
          color: white;
          padding: 20px;
          margin-right: 20px;
        }

        .sidebar h2 {
          margin-bottom: 20px;
          font-size: 1.5rem;
        }

        .sidebar ul {
          list-style: none;
          padding: 0;
        }

        .sidebar ul li {
          margin: 10px 0;
        }

        .sidebar ul li a {
          color: white;
          text-decoration: none;
        }

        .profile-content {
          flex: 1;
        }

        .profile-card {
          background-color: #ffffff;
          border-radius: 20px;
          padding: 30px;
          width: 100%;
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
          font-family: 'Arial', sans-serif;
          margin-top: 10px;
          margin-right: 10px;
        }

        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #dcdcdc;
          padding-bottom: 20px;
        }

        .doctor-info h1 {
          margin: 0;
          font-size: 2rem;
          color: #333333;
        }

        .doctor-info h2 {
          margin-top: 10px;
          font-size: 1.2rem;
          color: #3498db;
        }

        .rating {
          color: gold;
          font-size: 1.2rem;
          margin-top: 10px;
        }

        .doctor-image img {
          border-radius: 50%;
          width: 150px;
          height: 150px;
          object-fit: cover;
          border: 4px solid #3498db;
        }

        .profile-details {
          margin-top: 30px;
        }

        .profile-details h3 {
          font-size: 1.4rem;
          color: #3498db;
        }

        .profile-details p,
        .contact-info p {
          font-size: 1rem;
          color: #333;
          margin: 10px 0;
        }

        .contact-info p strong {
          color: #3498db;
        }

        .salary {
          margin-top: 20px;
        }

        .salary h3 {
          margin-bottom: 10px;
        }

        .working-hospitals ul {
          list-style-type: none;
          padding: 0;
        }

        .working-hospitals li {
          background-color: #f4f8fb;
          padding: 10px;
          border-radius: 8px;
          margin-top: 10px;
          color: #333;
        }

        .action-links {
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default DoctorProfile;
