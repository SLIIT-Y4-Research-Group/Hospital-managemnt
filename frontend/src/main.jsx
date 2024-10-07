import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { UserProvider } from './context/UserContext'; // Import UserProvider
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserProvider> {/* Wrap App with UserProvider */}
    <App />
  </UserProvider>
);
