import React from 'react';
import { Link } from 'react-router-dom';

const OrderManagementPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-blue-600">Home</Link>
        <span className="mx-2">→</span>
        <Link to="/inventory" className="text-blue-600">Inventory</Link>
        <span className="mx-2">→</span>
        <span className="font-medium">Order Management</span>
      </nav>
      <h1 className="text-3xl font-bold mb-2">Order Management System</h1>
      <p className="text-gray-600 mb-6">Create, track, and manage supply orders</p>
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-6xl text-center mb-4">📋</div>
        <h2 className="text-2xl font-bold text-center mb-4">Purchase Orders</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-600">8</p>
            <p className="text-sm text-gray-600">Pending Orders</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-600">3</p>
            <p className="text-sm text-gray-600">In Transit</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">15</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagementPage;
