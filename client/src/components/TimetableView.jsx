// File: client/src/components/TimetableView.jsx

import React, { useState, useEffect } from 'react';
import { getTimetable } from '../api/timetableApi';
import { updateTimetableEntry } from '../api/manualEditApi';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const TimetableView = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [editMode, setEditMode] = useState(false);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const response = await getTimetable();
      const data = response.data;
      setTimetable(data);

      const uniqueSections = [...new Set(data.map(entry => entry.section))].sort();
      setSections(uniqueSections);
      if (uniqueSections.length > 0) {
        // If a section is already selected, keep it, otherwise default to the first one
        setSelectedSection(current => uniqueSections.includes(current) ? current : uniqueSections[0]);
      }
    } catch (err) {
      setError('Failed to fetch timetable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination || (source.droppableId === destination.droppableId)) {
      return; // Dropped outside a valid area or in the same spot
    }

    const entryToMove = timetable.find(e => e.id === draggableId);
    const [newDay, newStartTimeWithColon] = destination.droppableId.split('-');
    const newStartTime = `${newStartTimeWithColon}:00`;

    // A simple way to get the end time based on the next slot
    const timeSlotDefinitions = [
        {start: '09:15:00', end: '10:10:00'}, {start: '10:10:00', end: '11:05:00'},
        {start: '11:05:00', end: '12:00:00'}, {start: '12:40:00', end: '13:35:00'},
        {start: '13:35:00', end: '14:30:00'}, {start: '14:30:00', end: '15:20:00'},
        {start: '15:20:00', end: '16:10:00'}, {start: '16:10:00', end: '17:00:00'}
    ];
    const newEndTime = timeSlotDefinitions.find(t => t.start === newStartTime)?.end || '17:00:00';

    try {
      await updateTimetableEntry(entryToMove.id, {
        newDay,
        newStartTime,
        newEndTime,
      });
      fetchTimetable(); // Refresh the timetable from the server
      alert('Class moved successfully!');
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || 'Could not move class.'}`);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlotHeaders = [
    '09:15-10:10', '10:10-11:05', '11:05-12:00', '12:00-12:40',
    '12:40-13:35', '13:35-14:30', '14:30-15:20', '15:20-16:10', '16:10-17:00'
  ];

  const getEntry = (day, startTime) => {
    return timetable.find(entry =>
      entry.section === selectedSection &&
      entry.dayOfWeek === day &&
      entry.startTime === `${startTime}:00`
    );
  };

  if (loading) return <p className="text-center p-4">Loading Timetable...</p>;
  if (error) return <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">View Timetable</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="mr-2 text-sm font-medium text-gray-700">Edit Mode</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={editMode} onChange={() => setEditMode(!editMode)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div>
              <label htmlFor="section-select" className="block text-sm font-medium text-gray-700">Select Section:</label>
              <select id="section-select" value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md">
                {sections.map(section => <option key={section} value={section}>{section}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
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
                    const droppableId = `${day}-${startTime}`;

                    return (
                      <Droppable key={droppableId} droppableId={droppableId} isDropDisabled={!editMode}>
                        {(provided, snapshot) => (
                          <td
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`border border-gray-300 p-1 text-center align-top h-24 w-32 ${snapshot.isDraggingOver ? 'bg-blue-100' : ''} ${!editMode ? '' : 'hover:bg-gray-50'}`}
                          >
                            {entry && (
                              <Draggable draggableId={entry.id} index={0} isDragDisabled={!editMode}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`p-1 rounded h-full flex flex-col justify-center ${snapshot.isDragging ? 'bg-blue-200 shadow-lg' : 'bg-blue-50'} ${!editMode ? '' : 'cursor-grab'}`}
                                  >
                                    {entry.Subject ? (
                                      <div>
                                        <p className="font-bold text-sm">{entry.Subject.subjectCode}</p>
                                        <p className="text-xs">{entry.Faculty.initials}</p>
                                        <p className="text-xs text-gray-500 mt-1">Room: {entry.Classroom.roomNumber}</p>
                                      </div>
                                    ) : (
                                      <div className="font-semibold text-gray-600">LIBRARY</div>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            )}
                            {provided.placeholder}
                          </td>
                        )}
                      </Droppable>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DragDropContext>
  );
};

export default TimetableView;