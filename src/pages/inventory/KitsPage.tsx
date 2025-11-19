import React from 'react';
import { Link } from 'react-router-dom';
import { useInventory } from '../../hooks/useInventory';

const KitsPage: React.FC = () => {
  const { items, loading, error } = useInventory('KITS');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-blue-600">Home</Link> → 
        <span className="font-medium"> Test Kits</span>
      </nav>
      <h1 className="text-3xl font-bold mb-2">Test Kits Inventory</h1>
      <p className="text-gray-600 mb-6">Rapid tests, POCT devices, specialty kits</p>

      {loading && <div className="text-center py-8">Loading...</div>}
      {error && <div className="bg-red-50 p-4 rounded">Error: {error}</div>}
      
      {!loading && !error && (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl mb-2">📦</div>
              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-600 mt-2">{item.vendor}</p>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-sm">Stock: <strong>{item.currentStock}</strong></span>
                {item.unitPrice && <span className="text-sm text-gray-600">${item.unitPrice}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KitsPage;
