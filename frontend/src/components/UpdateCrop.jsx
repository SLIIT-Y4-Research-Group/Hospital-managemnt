import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from './verticalNavBar'; // Import the Sidebar component
import backgroundImage from '../assets/background.png';

const EditItems = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [cropData, setCropData] = useState({
        CropName: "",
        Img: "",
        GrowthStage: "",
        SoilType: "",
        RainFall: "",
        Temperature: "",
        SoilpHLevel: "",
        CropArea: "",
        IrrigationType: "",
        ScientificName: "",
        Location: ""
    });

    useEffect(() => {
        axios.get('http://localhost:5000/myCrop/' + id).then((response) => {
            const crops = response.data;
            setCropData(crops);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setCropData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('http://localhost:5000/crop/update/' + id, cropData)
            if (response.data.success) {
                navigate('/allCrops');
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error updating item:', error);
            alert('Error updating item. Please try again.');
        }
    };

    return (
        <>
            <div
                className="flex min-h-screen"
                style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                {/* Fixed Sidebar */}
                <div className="fixed mt-20">
                    <Sidebar />
                </div>
                <div className="flex-1 ml-72 p-6 bg-white bg-opacity-90 rounded-xl shadow-md mt-10 mr-10">
                    <div className='pt-4'>
                        <div className="flex justify-center bg-slate-300 w-2/5 m-auto p-8 rounded-lg opacity-95">
                            <form className="w-full max-w-lg" onSubmit={handleUpdate}>
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                        <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="grid-first-name">
                                            Height (cm)
                                        </label>
                                        <input className="appearance-none block w-full bg-gray-200 text-black border border-slate-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" name="CropName" type="text" onChange={handleOnChange} value={cropData.CropName} required />
                                    </div>
                                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                        <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="grid-first-name">
                                            Weight (kg)
                                        </label>
                                        <input className="appearance-none block w-full bg-gray-200 text-black border border-slate-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" name="ScientificName" type="text" onChange={handleOnChange} value={cropData.ScientificName} required />
                                    </div>
                                </div>
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                        <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="blood-type">
                                            Blood Type
                                        </label>
                                        <select className="appearance-none block w-full bg-gray-200 text-black border border-slate-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            name="IrrigationType" id="blood-type" onChange={handleOnChange} value={cropData.IrrigationType} required>
                                            <option value="">Select Blood Type</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                    </div>

                                    <div className="w-full md:w-2/3 px-3">
                                        <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="grid-password">
                                            Medications
                                        </label>
                                        <input className="appearance-none block w-full bg-gray-200 text-black border border-slate-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" name="SoilType" type="text" onChange={handleOnChange} value={cropData.SoilType} required />
                                    </div>
                                </div>
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="w-full px-3">
                                        <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="crop-area">
                                            Medical Conditions
                                        </label>
                                        <textarea className="appearance-none block w-full bg-gray-200 text-black border border-slate-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            id="crop-area" name="CropArea" rows="4" onChange={handleOnChange} value={cropData.CropArea} required>
                                        </textarea>
                                    </div>
                                </div>

                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="w-full px-3 mb-6 md:mb-0">
                                        <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="grid-city">
                                            Allergies
                                        </label>
                                        <textarea className="appearance-none block w-full bg-gray-200 text-black border border-slate-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" name="RainFall" rows="3" onChange={handleOnChange} value={cropData.RainFall} required />
                                    </div>
                                </div>
                                <button className="w-full bg-teal-600 hover:bg-teal-300 text-grey-300 font-bold py-2 px-4 border-b-4 border-teal-800 hover:border-lime-900 rounded" type="submit">
                                    Save
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditItems