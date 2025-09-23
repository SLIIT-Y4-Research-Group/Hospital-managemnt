import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';

const Users = () => {
    const [crops, setCrops] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/users')
            .then((response) => {
                setCrops(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const addTreatment = (id) => {
        navigate(`/addTreatment/${id}`);
    };

    const addReport = (id) => {
        navigate(`/addReport/${id}`);
    };

    return (
        <div className="bg-gradient-to-r from-teal-100 via-blue-100 to-purple-100 min-h-screen p-10">
            <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-8">User List</h1>
            <div className="overflow-x-auto rounded-xl shadow-xl bg-white p-6">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gradient-to-r from-teal-500 to-blue-500 text-white text-left text-sm font-semibold">
                            <th className="px-6 py-4 border-b border-gray-200">ID</th>
                            <th className="px-6 py-4 border-b border-gray-200">Name</th>
                            <th className="px-6 py-4 border-b border-gray-200">Email</th>
                            <th className="px-6 py-4 border-b border-gray-200">Number</th>
                            <th className="px-6 py-4 border-b border-gray-200">Joined Date</th>
                            <th className="px-6 py-4 border-b border-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {crops.map((crop) => (
                            <tr key={crop._id} className="bg-white hover:bg-gray-100 transition-colors duration-200">
                                <td className="px-6 py-4 border-b border-gray-300 text-gray-700">{crop._id}</td>
                                <td className="px-6 py-4 border-b border-gray-300 text-gray-700">{crop.username}</td>
                                <td className="px-6 py-4 border-b border-gray-300 text-gray-700">{crop.email}</td>
                                <td className="px-6 py-4 border-b border-gray-300 text-gray-700">{crop.contactNumber}</td>
                                <td className="px-6 py-4 border-b border-gray-300 text-gray-700">
                                    {new Date(crop.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 border-b border-gray-300">
                                    <div className="flex space-x-3">
                                        <button
                                            className="bg-teal-500 text-white font-semibold px-4 py-2 rounded-md shadow hover:bg-teal-600 transition duration-300"
                                            onClick={() => addReport(crop._id)}
                                        >
                                            Add Report
                                        </button>
                                        <button
                                            className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md shadow hover:bg-blue-700 transition duration-300"
                                            onClick={() => addTreatment(crop._id)}
                                        >
                                            Add Treatment
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
