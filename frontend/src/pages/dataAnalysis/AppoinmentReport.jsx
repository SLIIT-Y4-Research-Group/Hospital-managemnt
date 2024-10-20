import React from 'react';

const AppointmentReport = ({ appointments }) => {
    if (!appointments || appointments.length === 0) {
        return <div>No appointments available for report.</div>;
    }

    // Example report logic: counting appointments by status
    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(appointment => appointment.status === 'Completed').length;
    const pendingAppointments = appointments.filter(appointment => appointment.status === 'Pending').length;
    const canceledAppointments = appointments.filter(appointment => appointment.status === 'Canceled').length;

    return (
        <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Appointment Report</h2>
            <div className="bg-gray-100 p-4 rounded-md shadow-md">
                <p><strong>Total Appointments:</strong> {totalAppointments}</p>
                <p><strong>Completed Appointments:</strong> {completedAppointments}</p>
                <p><strong>Pending Appointments:</strong> {pendingAppointments}</p>
                <p><strong>Canceled Appointments:</strong> {canceledAppointments}</p>
            </div>
        </div>
    );
};

export default AppointmentReport;
