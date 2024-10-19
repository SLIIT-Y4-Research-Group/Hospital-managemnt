import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';

const DoctorReport = () => {
  const [specializationData, setSpecializationData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecializationCount = async () => {
      try {
        const response = await axios.get('/api/doctors/specializations');
        setSpecializationData(response.data.data);
      } catch (error) {
        console.error('Error fetching specialization data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecializationCount();
  }, []);

  // Prepare data for the chart
  const categories = specializationData.map(item => item._id); // Specialization names
  const data = specializationData.map(item => item.count); // Count of doctors

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: true, // Make bars horizontal
        distributed: true // Distribute colors per bar
      }
    },
    dataLabels: {
      enabled: true
    },
    xaxis: {
      categories: categories, // Specializations on Y-axis
    },
    yaxis: {
      title: {
        text: 'Specialization'
      }
    },
    title: {
      text: 'Doctor Count by Specialization',
      align: 'center'
    },
    colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A', '#26A69A', '#D10CE8']
  };

  const chartSeries = [
    {
      name: 'Doctor Count',
      data: data // Count of doctors on X-axis
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Doctor Report Page</h1>
      <p className="text-lg text-gray-700 mb-4">
        Here you can view and analyze the reports related to doctors and their associated hospitals.
      </p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Chart options={chartOptions} series={chartSeries} type="bar" height={400} width={700} />
      )}
    </div>
  );
};

export default DoctorReport;
