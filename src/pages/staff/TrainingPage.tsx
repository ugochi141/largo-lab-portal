import React from 'react';
import { Link } from 'react-router-dom';

const TrainingPage: React.FC = () => {
  const trainings = [
    { name: 'Annual Safety Training', dueDate: '2025-12-31', status: 'Current', completion: 100 },
    { name: 'Chemistry Competency', dueDate: '2025-06-30', status: 'Current', completion: 100 },
    { name: 'Phlebotomy Certification', dueDate: '2025-11-15', status: 'Due Soon', completion: 80 },
    { name: 'Quality Control Review', dueDate: '2025-12-15', status: 'Current', completion: 100 },
    { name: 'HIPAA Compliance', dueDate: '2025-10-31', status: 'Overdue', completion: 60 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-blue-600">Home</Link>
        <span className="mx-2">→</span>
        <Link to="/staff" className="text-blue-600">Staff</Link>
        <span className="mx-2">→</span>
        <span className="font-medium">Training & Competency</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">Training & Competency Tracker</h1>
      <p className="text-gray-600 mb-6">Track certifications, training, and competency assessments</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-600">18</p>
          <p className="text-sm text-gray-600">Current</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">4</p>
          <p className="text-sm text-gray-600">Due Soon</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-red-600">2</p>
          <p className="text-sm text-gray-600">Overdue</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">24</p>
          <p className="text-sm text-gray-600">Total Staff</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Training</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {trainings.map((training, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{training.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{training.dueDate}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    training.status === 'Current' ? 'bg-green-100 text-green-800' :
                    training.status === 'Due Soon' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {training.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${
                        training.completion === 100 ? 'bg-green-500' :
                        training.completion >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} style={{ width: `${training.completion}%` }} />
                    </div>
                    <span className="text-sm text-gray-600">{training.completion}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrainingPage;
