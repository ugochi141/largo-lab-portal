import React from 'react';
import { useSchedule } from '../hooks/useSchedule';

const SchedulePage: React.FC = () => {
  const { schedule, loading } = useSchedule();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-2">Daily Schedule</h1>
      <p className="text-gray-600 mb-6">Laboratory staff scheduling and assignments</p>

      {loading ? (
        <div className="text-center py-8">Loading schedule...</div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Staff Scheduled Today</p>
              <p className="text-3xl font-bold text-blue-600">{schedule.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Day Shift</p>
              <p className="text-3xl font-bold text-green-600">{schedule.filter(s => s.shift.includes('Day')).length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Evening Shift</p>
              <p className="text-3xl font-bold text-yellow-600">{schedule.filter(s => s.shift.includes('Evening')).length}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shift</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Station</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {schedule.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{entry.staffName}</td>
                    <td className="px-6 py-4 text-sm">{entry.shift}</td>
                    <td className="px-6 py-4 text-sm">{entry.station}</td>
                    <td className="px-6 py-4 text-sm">{entry.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default SchedulePage;
