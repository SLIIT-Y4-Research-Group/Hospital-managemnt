import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './Home.jsx'; // Update the import statement
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import Profile from './components/Profile.jsx';
import CreateAppointment from './pages/Appointment/CreateAppointment.jsx';
import Payment from './pages/Appointment/payment.jsx';
import DoctorRegister from './pages/Appointment/doctor.jsx';
import DoctorDetails from './pages/Appointment/doctordetails.jsx';
import AllAppointments from './pages/Appointment/AllApointments.jsx';
import Navbar from './components/Navbar.jsx';

import StockReport from './pages/dataAnalysis/stockreport.jsx';
import AddStocks from './pages/dataAnalysis/AddStocks.jsx';
import DoctorsReport from './pages/dataAnalysis/DoctorsReport.jsx'; // Only keep this one
import AdminDash from './pages/dataAnalysis/AdminDash.jsx';
import AdminDashboard from './pages/AdminDashBoard.jsx';

import ShowAllDoctors from './pages/Doctor/ShowAllDoctors';
import ReadOneDoctor from './pages/Doctor/ReadOneDoctor';
import CreateDoctor from './pages/Doctor/CreateDoctor';
import EditDoctor from './pages/Doctor/EditDoctor';
import DeleteDoctor from './pages/Doctor/DeleteDoctor';
import DoctorLogin from './components/DoctorLogin';


const App = () => {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Navbar user={user} />
      <Routes>
        <Route path='/' element={<HomePage user={user} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/stockreport" element={<StockReport />} />
        <Route path="/addstock" element={<AddStocks />} />
        <Route path="/doctoreport" element={<DoctorsReport />} />
        <Route path="/admindash" element={<AdminDash />} />

        {/* Doctor Routes */}
        <Route path='/doctors/alldoctors' element={<ShowAllDoctors />} />
        <Route path='/doctors/details/:id' element={<ReadOneDoctor />} />
        <Route path='/doctors/create' element={<CreateDoctor />} />
        <Route path='/doctors/edit/:id' element={<EditDoctor />} />
        <Route path='/doctors/delete/:id' element={<DeleteDoctor />} />
        <Route path='/doctorlogin' element={<DoctorLogin />} />

        <Route path="/appointments" element={<CreateAppointment />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/register" element={<DoctorRegister />} />
        <Route path="/doctors" element={<DoctorDetails />} />
        <Route path="/all" element={<AllAppointments />} />
        <Route path="/admin" element={<AdminDashboard />} />
       
      </Routes>
    </BrowserRouter>
  );
};

export default App;
