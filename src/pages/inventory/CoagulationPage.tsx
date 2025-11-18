import React from 'react';
import { Link } from 'react-router-dom';

const CoagulationPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-blue-600">Home</Link>
        <span className="mx-2">→</span>
        <Link to="/inventory" className="text-blue-600">Inventory</Link>
        <span className="mx-2">→</span>
        <span className="font-medium">Coagulation</span>
      </nav>
      <h1 className="text-3xl font-bold mb-2">Coagulation Inventory</h1>
      <p className="text-gray-600 mb-6">Stago reagents and coagulation supplies</p>
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-6xl text-center mb-4">💉</div>
        <h2 className="text-2xl font-bold text-center mb-4">Coagulation Testing</h2>
        <p className="text-gray-600 text-center">PT/INR, PTT, Fibrinogen reagents</p>
      </div>
    </div>
  );
};

export default CoagulationPage;
