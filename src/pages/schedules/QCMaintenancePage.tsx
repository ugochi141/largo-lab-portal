import React from 'react';
import { Link } from 'react-router-dom';

const QCMaintenancePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-blue-600">Home</Link> → 
        <Link to="/schedule" className="text-blue-600"> Schedules</Link> → 
        <span className="font-medium"> QC & Maintenance</span>
      </nav>
      <h1 className="text-3xl font-bold mb-2">QC & Maintenance Schedule</h1>
      <p className="text-gray-600 mb-6">Quality control and equipment maintenance calendar</p>
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-6xl text-center mb-4">✅</div>
        <h2 className="text-2xl font-bold text-center mb-4">QC & Maintenance Tasks</h2>
        <p className="text-gray-600 text-center">Daily QC, weekly maintenance, monthly calibrations</p>
      </div>
    </div>
  );
};

export default QCMaintenancePage;
