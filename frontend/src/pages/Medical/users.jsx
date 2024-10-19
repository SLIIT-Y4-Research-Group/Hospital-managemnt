import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Users = () => {
    const [crops, setCrops] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5000/users').then((response) => {
            const crops = response.data;
            setCrops(crops);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    const addTreatment = async (id) => {
        navigate(`/addTreatment/${id}`);
    };

    const addReport = async (id) => {
        navigate(`/addReport/${id}`);
    };

    return (
        <div className="bg-gray-50 min-h-screen p-10">
            <h1 className="text-3xl font-bold text-center mb-6">User List</h1>
            <div className="overflow-x-auto rounded-lg shadow-lg">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-teal-500 text-white text-left text-sm leading-4 uppercase">
                            <th className="px-6 py-3 border-b-2 border-gray-300">ID</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300">Name</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300">Email</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300">Number</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300">Joined Date</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {crops.map((crop) => (
                            <tr key={crop.id} className="hover:bg-gray-100 transition duration-200">
                                <td className="px-6 py-4 border-b border-gray-300">{crop._id}</td>
                                <td className="px-6 py-4 border-b border-gray-300">{crop.username}</td>
                                <td className="px-6 py-4 border-b border-gray-300">{crop.email}</td>
                                <td className="px-6 py-4 border-b border-gray-300">{crop.contactNumber}</td>
                                <td className="px-6 py-4 border-b border-gray-300">{new Date(crop.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 border-b border-gray-300">
                                    <div className="flex space-x-2">
                                        <button
                                            className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition duration-300"
                                            onClick={() => addReport(crop._id)}>
                                            Add Report
                                        </button>
                                        <button
                                            className="bg-sky-700 text-white px-4 py-2 rounded hover:bg-sky-900 transition duration-300"
                                            onClick={() => addTreatment(crop._id)}>
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
