// AppointmentReport.jsx
import React from 'react';

const AppointmentReport = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.welcome}>Welcome to the Appointment Report!</h1>
            <p style={styles.description}>
                Here you can view all your appointments and their details.
            </p>
            {/* You can add more components or details below */}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
        padding: '20px',
    },
    welcome: {
        fontSize: '2rem',
        color: '#333',
    },
    description: {
        fontSize: '1.2rem',
        color: '#555',
        textAlign: 'center',
        margin: '10px 0',
    },
};

export default AppointmentReport;
