import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInventory } from '../../hooks/useInventory';

const HematologyPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { items: hematologyItems, loading, error } = useInventory('HEMATOLOGY');

  const getStatus = (currentStock: number, reorderPoint: number, parLevel: number) => {
    if (currentStock === 0) return 'critical';
    if (currentStock <= reorderPoint) return 'critical';
    if (currentStock < parLevel * 0.5) return 'warning';
    return 'good';
  };

  const itemsWithStatus = hematologyItems.map(item => ({
    ...item,
    status: getStatus(item.currentStock, item.reorderPoint, item.parLevel),
  }));

  const filteredItems = itemsWithStatus.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.catalogNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const criticalCount = itemsWithStatus.filter(item => item.status === 'critical').length;
  const warningCount = itemsWithStatus.filter(item => item.status === 'warning').length;

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

      {loading && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hematology inventory...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
          <p className="text-sm text-red-700"><strong>Error:</strong> {error}</p>
          <p className="text-xs text-red-600 mt-1">Make sure backend is running on port 3000</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{itemsWithStatus.length}</p>
            </div>
            <div className="bg-red-50 rounded-lg shadow p-4 border border-red-200">
              <p className="text-sm text-red-700">Critical Items</p>
              <p className="text-2xl font-bold text-red-900">{criticalCount}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg shadow p-4 border border-yellow-200">
              <p className="text-sm text-yellow-700">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-900">{warningCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-200">
            <input
              type="text"
              placeholder="Search hematology supplies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      {item.catalogNumber && <div className="text-xs text-gray-500">Cat# {item.catalogNumber}</div>}
                      {item.vendor && <div className="text-xs text-gray-500">{item.vendor}</div>}
                    </td>
                    <td className="px-6 py-4 text-sm">{item.currentStock}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.location || 'Not specified'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'good' ? 'bg-green-100 text-green-800' :
                        item.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status === 'good' ? 'In Stock' : item.status === 'warning' ? 'Low Stock' : 'Critical'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">No items found</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HematologyPage;
