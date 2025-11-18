import React from 'react';
import { Link } from 'react-router-dom';

const TimecardPage: React.FC = () => {
  const timecards = [
    { name: 'Netta Johnson', week: 'Week of Nov 11-17', hours: 40, status: 'Pending Approval', overtime: 0 },
    { name: 'Tracy Williams', week: 'Week of Nov 11-17', hours: 42, status: 'Pending Approval', overtime: 2 },
    { name: 'Booker Smith', week: 'Week of Nov 11-17', hours: 38, status: 'Approved', overtime: 0 },
    { name: 'Boyet Rodriguez', week: 'Week of Nov 11-17', hours: 40, status: 'Approved', overtime: 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-blue-600">Home</Link>
        <span className="mx-2">→</span>
        <Link to="/staff" className="text-blue-600">Staff</Link>
        <span className="mx-2">→</span>
        <span className="font-medium">Timecard Management</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">Timecard Management</h1>
      <p className="text-gray-600 mb-6">Review and approve employee timecards</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">2</p>
          <p className="text-sm text-gray-600">Pending Approval</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-600">2</p>
          <p className="text-sm text-gray-600">Approved</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">160</p>
          <p className="text-sm text-gray-600">Total Hours</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-red-600">2</p>
          <p className="text-sm text-gray-600">OT Hours</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Regular Hours</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">OT Hours</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {timecards.map((timecard, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{timecard.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{timecard.week}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{timecard.hours - timecard.overtime}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{timecard.overtime}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    timecard.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {timecard.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {timecard.status === 'Pending Approval' && (
                    <button className="text-blue-600 hover:text-blue-800 font-medium mr-3">Approve</button>
                  )}
                  <button className="text-gray-600 hover:text-gray-800">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimecardPage;
