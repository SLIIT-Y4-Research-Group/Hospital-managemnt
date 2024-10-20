import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from "../../components/Spinner";
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import Chart from 'react-apexcharts';
import DoctorPdf from './DoctorPdf';

const DoctorReport = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [specializationData, setSpecializationData] = useState([]);
    const [heatmapData, setHeatmapData] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://localhost:5000/doctors');
                if (response.data && Array.isArray(response.data.data)) {
                    setDoctors(response.data.data);
                    countSpecializations(response.data.data);
                    generateHeatmapData(response.data.data);
                } else {
                    console.error("Invalid data format:", response.data);
                }
            } catch (error) {
                console.error("Error fetching doctors:", error);
                setError("Failed to fetch doctors.");
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    const countSpecializations = (doctors) => {
        const specializationCount = doctors.reduce((acc, doctor) => {
            acc[doctor.Specialization] = (acc[doctor.Specialization] || 0) + 1;
            return acc;
        }, {});

        const data = Object.keys(specializationCount).map((spec) => ({
            x: spec,
            y: specializationCount[spec]
        }));

        setSpecializationData(data);
    };

    const generateHeatmapData = (doctors) => {
        const data = doctors.map(doctor => ({
            name: doctor.Name,
            data: [{
                x: doctor.Specialization,
                y: doctor.BasicSalary
            }]
        }));

        setHeatmapData(data);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredDoctors = doctors.filter(doctor =>
        Object.values(doctor).some(value =>
            value.toString().toLowerCase().includes(searchQuery)
        )
    );

    // ApexCharts options for the bar chart
    const chartOptions = {
        chart: {
            type: 'bar',
            height: 250
        },
        plotOptions: {
            bar: {
                horizontal: true
            }
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '12px'
            }
        },
        xaxis: {
            categories: specializationData.map(data => data.x)
        }
    };

    const chartSeries = [{
        name: 'Doctor Count',
        data: specializationData.map(data => data.y)
    }];

    // ApexCharts options for the heatmap
    const heatmapOptions = {
        chart: {
            type: 'heatmap',
            height: 250
        },
        plotOptions: {
            heatmap: {
                colorScale: {
                    ranges: [
                        {
                            from: -30,
                            to: 5,
                            color: '#00A100',
                            name: 'low',
                        },
                        {
                            from: 6,
                            to: 20,
                            color: '#128FD9',
                            name: 'medium',
                        },
                        {
                            from: 21,
                            to: 45,
                            color: '#FFB200',
                            name: 'high',
                        }
                    ]
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: doctors.map(doc => doc.Specialization)
        }
    };

    return (
        <div className='p-4 bg-blue-100 min-h-screen' style={{ backgroundImage: "url('/assets/blue_bg.jpg')", backgroundSize: 'cover' }}>
            
            <li>
                <Link to="/" className="text-blue-800 hover:text-blue-600">Home</Link>
            </li>
            
            <h1 className="show-Doctors-title text-4xl my-4 text-blue-800">Doctor's Report</h1>
            <DoctorPdf/>


            {/* Flex container for charts */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
                {/* Card for Horizontal bar chart for Specializations vs Doctor Count */}
                <div className="p-4 bg-white rounded-lg shadow-md" style={{ width: '50%' }}>
                    <h3 className='text-blue-800'>Horizontal Bar chart for count of doctors to relative specialization</h3>
                    <Chart
                        options={chartOptions}
                        series={chartSeries}
                        type="bar"
                        height={250}
                    />
                </div>

                {/* Card for Heatmap chart */}
                <div className="p-4 bg-white rounded-lg shadow-md" style={{ width: '50%' }}>
                    <h3 >Heat map for the Appoinment fee according to the specialization</h3>
                    <Chart
                        options={heatmapOptions}
                        series={heatmapData}
                        type="heatmap"
                        height={250}
                    />
                </div>
            </div>

            <div className='flex flex-col md:flex-row justify-between items-center mb-4'>
                <label htmlFor="search" className="sr-only">Search doctors</label>
                <input
                    id="search"
                    type="text"
                    placeholder="Search doctors..."
                    className='text-lg my-4 p-2 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    onChange={handleSearchChange}
                />
                <div className="flex items-center space-x-4">
                    <Link to='/doctors/create' className="flex items-center">
                        <MdOutlineAddBox className='text-blue-800 text-3xl' />
                    </Link>
                </div>
            </div>

            {loading ? (
                <Spinner />
            ) : error ? (
                <div className="text-red-600">{error}</div>
            ) : (
                <table className='w-full border border-blue-500 rounded-lg bg-white'>
                    <thead>
                        <tr className='bg-blue-100'>
                            <th className='p-2 border border-blue-300 text-sm'>Doctor ID</th>
                            <th className='p-2 border border-blue-300 text-sm'>Profile Pic</th>
                            <th className='p-2 border border-blue-300 text-sm'>Doctor Name</th>
                            <th className='p-2 border border-blue-300 text-sm'>Specialization</th>
                            <th className='p-2 border border-blue-300 text-sm'>Contact No</th>
                            <th className='p-2 border border-blue-300 text-sm'>Email</th>
                            <th className='p-2 border border-blue-300 text-sm'>Address</th>
                            <th className='p-2 border border-blue-300 text-sm'>Basic Salary</th>
                            <th className='p-2 border border-blue-300 text-sm'>Description</th>
                            <th className='p-2 border border-blue-300 text-sm'>Password</th>
                            <th className='p-2 border border-blue-300 text-sm'>Working Hospitals</th>
                            <th className='p-2 border border-blue-300 text-sm'>Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDoctors.map((doctor) => (
                            <tr key={doctor._id} className='text-center bg-white even:bg-blue-50'>
                                <td className='p-2 border border-blue-300 text-sm'>{doctor.DoctorID}</td>
                                <td className='p-2 border border-blue-300'>
                                    <img src={doctor.image} alt="Profile Pic" className="w-12 h-12 object-cover rounded-full" />
                                </td>
                                <td className='p-2 border border-blue-300 text-sm'>{doctor.Name}</td>
                                <td className='p-2 border border-blue-300 text-sm'>{doctor.Specialization}</td>
                                <td className='p-2 border border-blue-300 text-sm'>{doctor.ContactNo}</td>
                                <td className='p-2 border border-blue-300 text-sm'>{doctor.Email}</td>
                                <td className='p-2 border border-blue-300 text-sm'>{doctor.Address}</td>
                                <td className='p-2 border border-blue-300 text-sm'>{doctor.BasicSalary}</td>
                                <td className='p-2 border border-blue-300 text-sm'>{doctor.Description}</td>
                                <td className='p-2 border border-blue-300 text-sm'>{doctor.Password}</td>
                                <td className='p-2 border border-blue-300 text-sm'>
                                    {doctor.WorkingHospitals.map(hospital => 
                                        `${hospital.HospitalName}, `
                                    )}
                                </td>
                                <td className='p-2 border border-blue-300 text-sm'>
                                    <div className="flex justify-center space-x-2">
                                        <Link to={`/doctors/edit/${doctor._id}`} className='text-blue-500 hover:text-blue-700'>
                                            <AiOutlineEdit />
                                        </Link>
                                        <Link to={`/doctors/view/${doctor._id}`} className='text-blue-500 hover:text-blue-700'>
                                            <BsInfoCircle />
                                        </Link>
                                        <button className='text-red-500 hover:text-red-700'>
                                            <MdOutlineDelete />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DoctorReport;
