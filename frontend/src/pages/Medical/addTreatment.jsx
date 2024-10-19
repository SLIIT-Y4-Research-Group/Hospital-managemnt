import { useEffect, useState, } from "react";
import axios from "axios";
import "./add service.css";
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from "react-hot-toast";
import { useLocation } from 'react-router-dom';

function AddTreatment() {
    const [cropName, setCropName] = useState("");
    const [growthStage, setGrowthStage] = useState("");
    const [soilType, setSoilType] = useState("");
    const [rainFall, setRainFall] = useState("");
    const [temperature, setTemperature] = useState("");
    const [soilpHLevel, setSoilpHLevel] = useState("");
    const [cropArea, setCropArea] = useState("");
    const [irrigationType, setIrrigationType] = useState("");
    const [scientificName, setScientificName] = useState("");

    const { id } = useParams();
    const navigate = useNavigate();

    const handlesubmit = async (e) => {

        e.preventDefault();
        try {
            const crop = await axios.post("http://localhost:5000/addTreatment/" + id, {
                id,
                cropName,
                growthStage,
                soilType,
                rainFall,
                temperature,
                soilpHLevel,
                cropArea,
                irrigationType,
                scientificName,
            });
            if (crop.error) {
                toast.error("Something Went Wrong" + error);
            } else {
                toast.success("Crop Added Successfully");
                navigate('/users');
            }
        }
        catch (error) {
            console.log(error);
        }
    };


    // const calculateTotal = (e) => {
    //   cateringMenu.map((menu) => {
    //     if(menu.MenuID == e.target.id) {
    //       setTotal(headcount * menu.TotalPrice)
    //     }
    //   })
    // }

    // calculateTotal()

    return (
        <>
            <div className="bg-[url('/bg.jpg')] bg-cover h-screen">
                <div className="pt-12">
                    <div className="flex justify-center bg-primary w-2/5 m-auto pt-8 pb-8 rounded-lg opacity-95">
                        <form className="w-full max-w-lg" onSubmit={handlesubmit}>
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="grid-first-name">
                                        Crop Name
                                    </label>
                                    <input className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Crop Name" onChange={(e) => setCropName(e.target.value)} required />
                                </div>
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="grid-first-name">
                                        Sciencetific Name
                                    </label>
                                    <input className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Sciencetific Name" onChange={(e) => setScientificName(e.target.value)} />
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="grid-city">
                                        Soil pH Level
                                    </label>
                                    <input className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" placeholder="Soil pH Level" onChange={(e) => setSoilpHLevel(e.target.value)} />
                                </div>
                                <div className="w-full md:w-2/3 px-3">
                                    <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="grid-password">
                                        Soil Type
                                    </label>
                                    <input className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="text" placeholder="Soil Type" onChange={(e) => setSoilType(e.target.value)} required />
                                    <p className="text-stone-300 text-xs italic">Make it as long and as crazy as you'd like</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="w-full px-3">
                                    <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="grid-password">
                                        Crop Area
                                    </label>
                                    <input className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="text" placeholder="Crop Area" onChange={(e) => setCropArea(e.target.value)} required />
                                    <p className="text-stone-300 text-xs italic">Make it as long and as crazy as you'd like</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="grid-city">
                                        Rain Fall
                                    </label>
                                    <input className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" placeholder="Rain Fall" onChange={(e) => setRainFall(e.target.value)} required />
                                </div>
                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="grid-zip">
                                        Temperature
                                    </label>
                                    <input className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" type="text" placeholder="Temperature" onChange={(e) => setTemperature(e.target.value)} required />
                                </div>
                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="grid-zip">
                                        Irrigation Type
                                    </label>
                                    <input className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" type="text" placeholder="Irrigation Type" onChange={(e) => setIrrigationType(e.target.value)} required />
                                </div>
                            </div>
                            <button className="w-full bg-secondary hover:bg-lime-500 text-grey-300 font-bold py-2 px-4 border-b-4 border-lime-800 hover:border-lime-900 rounded" type="submit">
                                Add Crop
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
export default AddTreatment;
