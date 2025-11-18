import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  parLevel: number;
  reorderPoint: number;
  location: string;
  status: 'good' | 'warning' | 'critical';
  lastUpdated: string;
}

const ChemistryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const chemistryItems: InventoryItem[] = [
    {
      id: 'CHEM-001',
      name: 'Chemistry Reagent Pack - Roche cobas 8000',
      currentStock: 45,
      parLevel: 60,
      reorderPoint: 20,
      location: 'Chemistry Storage - Shelf A1',
      status: 'warning',
      lastUpdated: '2 hours ago',
    },
    {
      id: 'CHEM-002',
      name: 'Calibration Solution Set',
      currentStock: 12,
      parLevel: 15,
      reorderPoint: 5,
      location: 'Chemistry Storage - Shelf A2',
      status: 'good',
      lastUpdated: '1 day ago',
    },
    {
      id: 'CHEM-003',
      name: 'QC Material Level 1',
      currentStock: 3,
      parLevel: 20,
      reorderPoint: 8,
      location: 'Chemistry Storage - Refrigerator',
      status: 'critical',
      lastUpdated: '3 hours ago',
    },
    {
      id: 'CHEM-004',
      name: 'QC Material Level 2',
      currentStock: 5,
      parLevel: 20,
      reorderPoint: 8,
      location: 'Chemistry Storage - Refrigerator',
      status: 'critical',
      lastUpdated: '3 hours ago',
    },
    {
      id: 'CHEM-005',
      name: 'ISE Cleaning Solution',
      currentStock: 8,
      parLevel: 12,
      reorderPoint: 4,
      location: 'Chemistry Storage - Shelf B1',
      status: 'warning',
      lastUpdated: '1 day ago',
    },
  ];

  const filteredItems = chemistryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const criticalCount = chemistryItems.filter(item => item.status === 'critical').length;
  const warningCount = chemistryItems.filter(item => item.status === 'warning').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link>
        <span className="mx-2 text-gray-400">→</span>
        <Link to="/inventory" className="text-blue-600 hover:text-blue-800">Inventory</Link>
        <span className="mx-2 text-gray-400">→</span>
        <span className="text-gray-700 font-medium">Chemistry</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chemistry Inventory</h1>
        <p className="text-gray-600">Manage chemistry reagents, calibrators, and QC materials</p>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{chemistryItems.length}</p>
            </div>
            <div className="text-3xl">🧪</div>
          </div>
        </div>
        
        <div className="bg-red-50 rounded-lg shadow p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700">Critical Items</p>
              <p className="text-2xl font-bold text-red-900">{criticalCount}</p>
            </div>
            <div className="text-3xl">🚨</div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg shadow p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-900">{warningCount}</p>
            </div>
            <div className="text-3xl">⚠️</div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Order Supplies
          </button>
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
            Export CSV
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => {
                const percentage = (item.currentStock / item.parLevel) * 100;
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.currentStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            item.status === 'good' ? 'bg-green-500' :
                            item.status === 'warning' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        PAR: {item.parLevel} | Reorder: {item.reorderPoint}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'good' ? 'bg-green-100 text-green-800' :
                        item.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status === 'good' ? 'In Stock' :
                         item.status === 'warning' ? 'Low Stock' :
                         'Critical'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        Update
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Vendor:</strong> Roche Diagnostics - 1-800-428-2336 | 
              <strong> Auto-reorder:</strong> Mondays at 9:00 AM | 
              <strong> Last updated:</strong> {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChemistryPage;
