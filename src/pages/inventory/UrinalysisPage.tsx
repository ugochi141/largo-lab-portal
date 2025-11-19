import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInventory } from '../../hooks/useInventory';

const UrinalysisPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { items, loading, error } = useInventory('URINALYSIS');

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-blue-600">Home</Link> → 
        <Link to="/inventory" className="text-blue-600"> Inventory</Link> → 
        <span className="font-medium"> Urinalysis</span>
      </nav>
      <h1 className="text-3xl font-bold mb-2">Urinalysis Inventory</h1>
      <p className="text-gray-600 mb-6">Sysmex UC-3500 reagents and test strips</p>

      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-sm text-red-700">Error: {error}</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="grid gap-4">
            {filtered.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.vendor}</p>
                <div className="mt-2">
                  <span className="text-sm">Stock: {item.currentStock}</span>
                  {item.unitPrice && <span className="text-sm ml-4">${item.unitPrice}</span>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UrinalysisPage;
