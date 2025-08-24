import React from 'react';

const WeeklyTimetableView = ({ schedule, userType }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlotHeaders = [
    '09:15-10:10', '10:10-11:05', '11:05-12:00', '12:00-12:40',
    '12:40-13:35', '13:35-14:30', '14:30-15:20', '15:20-16:10', '16:10-17:00'
  ];

  const getEntry = (day, startTime) => {
    return schedule.find(entry => entry.dayOfWeek === day && entry.startTime === `${startTime}:00`);
  };

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border-collapse border border-gray-400">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2 text-sm font-semibold">Day/Time</th>
            {timeSlotHeaders.map(header => (
              <th key={header} className={`border border-gray-300 p-2 text-sm font-semibold ${header.startsWith('12:00') ? 'bg-gray-200' : ''}`}>
                {header.startsWith('12:00') ? 'LUNCH' : header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map(day => (
            <tr key={day}>
              <td className="border border-gray-300 p-2 font-bold bg-gray-50">{day}</td>
              {timeSlotHeaders.map(header => {
                if (header.startsWith('12:00')) {
                  return <td key={header} className="border border-gray-300 p-2 text-center bg-gray-200"></td>;
                }
                const startTime = header.split('-')[0];
                const entry = getEntry(day, startTime);
                return (
                  <td key={header} className="border border-gray-300 p-2 text-center align-top h-24">
                    {/* --- THIS IS THE FIX --- */}
                    {/* It now checks if the entry and its properties exist before trying to display them */}
                    {entry ? (
                      entry.Subject && entry.Faculty ? (
                        <div>
                          <p className="font-bold text-sm">{entry.Subject.subjectCode}</p>
                          {userType === 'student' && <p className="text-xs">{entry.Faculty.initials}</p>}
                          {userType === 'faculty' && <p className="text-xs">{entry.section}</p>}
                          <p className="text-xs text-gray-500 mt-1">Rm: {entry.Classroom?.roomNumber || 'N/A'}</p>
                        </div>
                      ) : (
                        <div className="font-semibold text-gray-600">LIBRARY</div>
                      )
                    ) : null}
                    {/* --- END OF FIX --- */}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyTimetableView;