import React from 'react';
import { Link } from 'react-router-dom';
import { useInventory } from '../../hooks/useInventory';

const CoagulationPage: React.FC = () => {
  const { items, loading, error } = useInventory('COAGULATION');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-blue-600">Home</Link> → 
        <span className="font-medium"> Coagulation</span>
      </nav>
      <h1 className="text-3xl font-bold mb-2">Coagulation Inventory</h1>
      <p className="text-gray-600 mb-6">Stago reagents and coagulation supplies</p>

      {loading && <div className="text-center py-8">Loading...</div>}
      {error && <div className="bg-red-50 p-4 rounded">Error: {error}</div>}
      
      {!loading && !error && (
        <div className="grid gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.vendor} - Stock: {item.currentStock}</p>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-500">No coagulation items found</p>}
        </div>
      )}
    </div>
  );
};

export default CoagulationPage;
