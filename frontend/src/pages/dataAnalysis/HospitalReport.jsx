import React, { useEffect, useState } from 'react';
import api from '../../config/api';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import Spinner from "../../components/Spinner";
import logo from './../../assets/logo.jpg'; // Adjust the path according to your structure
import Chart from 'react-apexcharts';

const HospitalReport = () => {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const response = await api.get('/hospitals'); // Adjust API endpoint if needed
                if (response.data && Array.isArray(response.data.data)) {
                    setHospitals(response.data.data); // Access the array of hospitals here
                } else {
                    console.error("Invalid data format:", response.data);
                }
            } catch (error) {
                console.error("Error fetching hospitals:", error);
                setError("Failed to fetch hospitals.");
            } finally {
                setLoading(false);
            }
        };

        fetchHospitals();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredHospitals = hospitals.filter(hospital =>
        Object.values(hospital).some(value =>
            value.toString().toLowerCase().includes(searchQuery)
        )
    );

    // Prepare data for the chart
    const chartData = {
        series: [],
        options: {
            chart: {
                type: 'bar',
                stacked: true,
                stackType: '100%',
                toolbar: {
                    show: false,
                },
            },
            xaxis: {
                categories: filteredHospitals.map(hospital => hospital.Name),
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                },
            },
            fill: {
                opacity: 1,
            },
            legend: {
                position: 'right',
                offsetY: 40,
            },
        },
    };

    // Gather departments and their counts for each hospital
    const departments = {};
    filteredHospitals.forEach(hospital => {
        hospital.Departments.forEach(department => {
            if (!departments[department]) {
                departments[department] = [];
            }
            departments[department].push(hospital.Name);
        });
    });

    // Fill series data for the chart
    Object.keys(departments).forEach(department => {
        const count = new Array(filteredHospitals.length).fill(0);
        filteredHospitals.forEach((hospital, index) => {
            if (departments[department].includes(hospital.Name)) {
                count[index] = 1; // You can change this to the count of specific metrics if needed
            }
        });
        chartData.series.push({
            name: department,
            data: count,
        });
    });

    return (
        <div className="flex">
            {/* Sidebar */}
            <aside className="w-64 h-screen bg-gray-800 text-white">
                <div className="flex items-center justify-center h-16">
                    <img src={logo} alt="Logo" className="h-10" />
                </div>
                <nav className="mt-10">
                    <ul>
                        <li className="hover:bg-gray-700">
                            <Link to="/stockreport" className="block px-4 py-2">Stock Report</Link>
                        </li>
                        <li className="hover:bg-gray-700">
                            <Link to="/doctoreport" className="block px-4 py-2">Doctor Report</Link>
                        </li>
                        <li className="hover:bg-gray-700">
                            <Link to="/doctorShedules/alldoctorShedules" className="block px-4 py-2">All Doctor Shedules</Link>
                        </li>
                        <li className="hover:bg-gray-700">
                            <Link to="/doctors/alldoctors" className="block px-4 py-2">All Doctors</Link>
                        </li>
                        <li className="hover:bg-gray-700">
                            <Link to="/Hospital/allHospital" className="block px-4 py-2">All Hospitals</Link>
                        </li>       
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 bg-light-blue-100 min-h-screen"> {/* Change bg-gray-100 to bg-light-blue-100 */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <h1 className="text-3xl my-4 text-blue-800">Hospital Reports</h1>
                    <input
                        id="search"
                        type="text"
                        placeholder="Search hospitals..."
                        className="text-lg p-2 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleSearchChange}
                    />
                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <Link to='/Hospital/create'>
                            <MdOutlineAddBox className='text-blue-800 text-4xl' />
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <Spinner />
                ) : error ? (
                    <div className="text-red-600">{error}</div>
                ) : (
                    <div className="mb-6">
                        <Chart options={chartData.options} series={chartData.series} type="bar" height={300} width="100%" /> {/* Adjusted height */}
                    </div>
                )}

                <table className="w-full border border-blue-500 rounded-lg bg-white">
                    <thead>
                        <tr className="bg-blue-100">
                            <th className="p-4 border border-blue-300">Hospital ID</th>
                            <th className="p-4 border border-blue-300">Name</th>
                            <th className="p-4 border border-blue-300">Departments</th>
                            <th className="p-4 border border-blue-300">Contact No</th>
                            <th className="p-4 border border-blue-300">Email</th>
                            <th className="p-4 border border-blue-300">Address</th>
                            <th className="p-4 border border-blue-300">Doctors</th>
                            <th className="p-4 border border-blue-300">Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHospitals.map((hospital) => (
                            <tr key={hospital._id} className="text-center bg-white even:bg-blue-50">
                                <td className="p-4 border border-blue-300">{hospital.HospitalID}</td>
                                <td className="p-4 border border-blue-300">{hospital.Name}</td>
                                <td className="p-4 border border-blue-300">{hospital.Departments.join(', ')}</td>
                                <td className="p-4 border border-blue-300">{hospital.ContactNo.join(', ')}</td>
                                <td className="p-4 border border-blue-300">{hospital.Email}</td>
                                <td className="p-4 border border-blue-300">{hospital.Address}</td>
                                <td className="p-4 border border-blue-300">{hospital.Doctors.join(', ')}</td>
                                <td className="p-4 border border-blue-300">
                                    <div className="flex justify-center gap-4">
                                        <Link to={`/Hospital/details/${hospital._id}`}>
                                            <BsInfoCircle className="text-2xl text-blue-800 hover:text-blue-600" />
                                        </Link>
                                        <Link to={`/Hospital/edit/${hospital._id}`}>
                                            <AiOutlineEdit className="text-2xl text-yellow-600 hover:text-yellow-500" />
                                        </Link>
                                        <Link to={`/Hospital/delete/${hospital._id}`}>
                                            <MdOutlineDelete className="text-2xl text-red-600 hover:text-red-500" />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
};

export default HospitalReport;
