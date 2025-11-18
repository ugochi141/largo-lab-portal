import React from 'react';
import { Link } from 'react-router-dom';

const UrinalysisPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-blue-600">Home</Link>
        <span className="mx-2">→</span>
        <Link to="/inventory" className="text-blue-600">Inventory</Link>
        <span className="mx-2">→</span>
        <span className="font-medium">Urinalysis</span>
      </nav>
      <h1 className="text-3xl font-bold mb-2">Urinalysis Inventory</h1>
      <p className="text-gray-600 mb-6">Sysmex UC-3500 reagents and test strips</p>
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-6xl text-center mb-4">🧪</div>
        <h2 className="text-2xl font-bold text-center mb-4">Urinalysis Supplies</h2>
        <p className="text-gray-600 text-center">Reagents, test strips, and QC materials</p>
      </div>
    </div>
  );
};

export default UrinalysisPage;
