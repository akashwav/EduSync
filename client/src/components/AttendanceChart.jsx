import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getAttendanceTrends } from '../api/adminDashboardApi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AttendanceChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAttendanceTrends();
        const data = response.data;

        setChartData({
          labels: data.map(item => item.department),
          datasets: [
            {
              label: 'Attendance %',
              data: data.map(item => item.percentage),
              backgroundColor: 'rgba(59, 130, 246, 0.6)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
        y: {
            beginAtZero: true,
            max: 100,
            ticks: {
                callback: function(value) {
                    return value + '%'
                }
            }
        }
    }
  };

  if (loading) return <div className="h-64 flex items-center justify-center"><p>Loading chart data...</p></div>;
  if (!chartData || chartData.labels.length === 0) return <div className="h-64 flex items-center justify-center"><p>No attendance data available to display.</p></div>;

  return (
    <div className="h-64 relative">
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default AttendanceChart;