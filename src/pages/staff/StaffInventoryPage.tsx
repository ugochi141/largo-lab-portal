import React, { useState } from 'react';
import { useInventory } from '../../hooks/useInventory';

const StaffInventoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const { items, loading, error } = useInventory();

  const categories = ['ALL', 'CHEMISTRY', 'HEMATOLOGY', 'URINALYSIS', 'COAGULATION', 'KITS'];

  const filtered = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.catalogNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (item: typeof items[0]) => {
    if (item.currentStock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (item.currentStock <= item.reorderPoint) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const lowStock = items.filter(i => i.currentStock <= i.reorderPoint).length;
  const outOfStock = items.filter(i => i.currentStock === 0).length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Inventory</h1>
      <p className="text-gray-600 mb-6">Laboratory supplies and stock levels</p>

      {/* Read-Only Notice */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔒</span>
          <p className="text-sm text-yellow-800">
            <strong>Read-Only Access:</strong> You can view inventory but cannot place orders or modify stock levels.
          </p>
        </div>
      </div>

      {loading && <div className="text-center py-8">Loading inventory...</div>}
      {error && <div className="bg-red-50 text-red-700 p-4 rounded">{error}</div>}

      {!loading && !error && (
        <>
          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-3xl font-bold text-blue-600">{items.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">In Stock</p>
              <p className="text-3xl font-bold text-green-600">{items.length - outOfStock}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-3xl font-bold text-yellow-600">{lowStock}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-3xl font-bold text-red-600">{outOfStock}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Search by name or catalog number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catalog #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.map((item) => {
                    const status = getStockStatus(item);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.vendor}</div>
                        </td>
                        <td className="px-6 py-4 text-sm">{item.catalogNumber || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`font-semibold ${
                            item.currentStock === 0 ? 'text-red-600' :
                            item.currentStock <= item.reorderPoint ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {item.currentStock}
                          </span>
                          {' / '}{item.parLevel}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.location}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No items found matching your search.
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 bg-white rounded-lg shadow p-4">
            <h3 className="font-bold mb-3">Stock Status Legend</h3>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">In Stock</span>
                <span className="text-gray-600">Adequate supply</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Low Stock</span>
                <span className="text-gray-600">Below reorder point</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Out of Stock</span>
                <span className="text-gray-600">Needs immediate attention</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StaffInventoryPage;
