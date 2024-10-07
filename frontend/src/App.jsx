import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './Home.jsx'; // Update the import statement
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import Profile from './components/Profile.jsx';
import CreateAppointment from './pages/CreateAppointment.jsx';

const App = () => {
  const [user, setUser] = useState(null);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage user={user} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/appointments" element={<CreateAppointment />} /> {/* Change here */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
