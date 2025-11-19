import React from 'react';
import { Link } from 'react-router-dom';
import { useInventory } from '../../hooks/useInventory';

const OrderManagementPage: React.FC = () => {
  const { items, loading } = useInventory();
  
  const lowStockItems = items.filter(item => 
    item.currentStock <= item.reorderPoint
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-blue-600">Home</Link> → 
        <span className="font-medium"> Order Management</span>
      </nav>
      <h1 className="text-3xl font-bold mb-2">Order Management System</h1>
      <p className="text-gray-600 mb-6">Create, track, and manage supply orders</p>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</p>
          <p className="text-sm text-gray-600">Items Need Reorder</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-blue-600">{items.length}</p>
          <p className="text-sm text-gray-600">Total Items</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-green-600">0</p>
          <p className="text-sm text-gray-600">Orders Pending</p>
        </div>
      </div>

      {!loading && lowStockItems.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Items Needing Reorder</h2>
          <div className="space-y-3">
            {lowStockItems.map(item => (
              <div key={item.id} className="border-l-4 border-red-500 pl-4 py-2">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">
                  Current: {item.currentStock} | Reorder: {item.reorderPoint} | Vendor: {item.vendor}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagementPage;
