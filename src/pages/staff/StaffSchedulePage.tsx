import React from 'react';
import { useSchedule } from '../../hooks/useSchedule';

const StaffSchedulePage: React.FC = () => {
  const { schedule, loading } = useSchedule();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Daily Schedule</h1>
      <p className="text-gray-600 mb-6">Staff assignments for {today}</p>

      {/* Read-Only Notice */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔒</span>
          <p className="text-sm text-yellow-800">
            <strong>Read-Only Access:</strong> You can view the schedule but cannot make changes.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading schedule...</div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Staff Scheduled</p>
              <p className="text-3xl font-bold text-blue-600">{schedule.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Day Shift</p>
              <p className="text-3xl font-bold text-green-600">
                {schedule.filter(s => s.shift.includes('Day')).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Evening Shift</p>
              <p className="text-3xl font-bold text-yellow-600">
                {schedule.filter(s => s.shift.includes('Evening')).length}
              </p>
            </div>
          </div>

          {/* Schedule Cards */}
          <div className="grid gap-4">
            {schedule.map((entry) => (
              <div key={entry.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600">
                      {entry.staffName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{entry.staffName}</h3>
                      <p className="text-sm text-gray-600">{entry.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">{entry.shift}</p>
                    <p className="text-xs text-gray-500">{entry.station}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Schedule Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff Member</th>
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
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {entry.department}
                      </span>
                    </td>
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

export default StaffSchedulePage;
