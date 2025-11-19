import React from 'react';
import { Link } from 'react-router-dom';
import { useStaff } from '../hooks/useStaff';

const StaffPage: React.FC = () => {
  const { staff, loading } = useStaff();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-2">Staff Management</h1>
      <p className="text-gray-600 mb-6">Manage laboratory staff and personnel</p>

      {loading ? (
        <div className="text-center py-8">Loading staff data...</div>
      ) : (
        <>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Total Staff</p>
              <p className="text-3xl font-bold text-blue-600">{staff.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">On Duty</p>
              <p className="text-3xl font-bold text-green-600">{staff.filter(s => s.status === 'active').length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Day Shift</p>
              <p className="text-3xl font-bold text-yellow-600">{staff.filter(s => s.shift === 'Day').length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Departments</p>
              <p className="text-3xl font-bold text-purple-600">5</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/staff/directory" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">📇</div>
              <h3 className="text-xl font-bold mb-2">Staff Directory</h3>
              <p className="text-sm text-gray-600">{staff.length} staff members</p>
              <div className="mt-4 text-blue-600 text-sm font-medium">View Directory →</div>
            </Link>

            <Link to="/staff/training" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-2">Training & Competency</h3>
              <p className="text-sm text-gray-600">Track certifications</p>
              <div className="mt-4 text-blue-600 text-sm font-medium">View Training →</div>
            </Link>

            <Link to="/staff/timecard" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">⏰</div>
              <h3 className="text-xl font-bold mb-2">Timecard Management</h3>
              <p className="text-sm text-gray-600">Review timecards</p>
              <div className="mt-4 text-blue-600 text-sm font-medium">Manage Timecards →</div>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default StaffPage;
