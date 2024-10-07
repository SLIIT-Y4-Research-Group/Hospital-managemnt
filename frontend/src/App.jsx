import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home.jsx'
import Navbar from './components/Navbar.jsx';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import Profile from './components/Profile.jsx';

const App = () => {
  const [user, setUser] = useState(null);
  return (
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/profile" element={<Profile user={user} />} />
    </Routes>
  )
}

export default App