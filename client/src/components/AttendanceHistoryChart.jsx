import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AttendanceHistoryChart = ({ summary }) => {
  const chartData = {
    labels: summary.map(item => item.subjectCode),
    datasets: [
      {
        label: 'Attendance Percentage',
        data: summary.map(item => item.percentage),
        backgroundColor: summary.map(item => item.percentage < 75 ? 'rgba(239, 68, 68, 0.6)' : 'rgba(59, 130, 246, 0.6)'),
        borderColor: summary.map(item => item.percentage < 75 ? 'rgb(239, 68, 68)' : 'rgb(59, 130, 246)'),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y', // To make the bar chart horizontal
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Overall Attendance by Subject',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          },
        },
      },
    },
  };

  return (
    <div className="h-96 relative">
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default AttendanceHistoryChart;