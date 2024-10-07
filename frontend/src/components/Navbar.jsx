import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = ({ user }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
    }
  }, [user]);

  return (
    <nav>
      <h1>Hospital Management</h1>
      <ul>
        {isLoggedIn ? (
          <>
            <li>
              <img src="/profile-icon.png" alt="Profile" width="30" height="30" />
              <Link to="/profile">Profile</Link>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
