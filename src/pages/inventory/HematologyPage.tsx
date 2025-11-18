import React from 'react';
import { Link } from 'react-router-dom';

const HematologyPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link>
        <span className="mx-2 text-gray-400">→</span>
        <Link to="/inventory" className="text-blue-600 hover:text-blue-800">Inventory</Link>
        <span className="mx-2 text-gray-400">→</span>
        <span className="text-gray-700 font-medium">Hematology</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hematology Inventory</h1>
        <p className="text-gray-600">Sysmex XN-2000 reagents, controls, and supplies</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <div className="text-center">
          <div className="text-6xl mb-4">🔬</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hematology Inventory Management</h2>
          <p className="text-gray-600 mb-6">
            Track Sysmex reagents, calibrators, controls, and consumables
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">24</p>
              <p className="text-sm text-gray-600">Total Items</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-red-600">3</p>
              <p className="text-sm text-gray-600">Critical Items</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">5</p>
              <p className="text-sm text-gray-600">Low Stock</p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-left">
            <p className="text-sm text-blue-700">
              <strong>Vendor:</strong> Sysmex America - 1-888-879-7639 | 
              <strong> Auto-reorder:</strong> Tuesdays at 10:00 AM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HematologyPage;
