import React from 'react';
import { Link } from 'react-router-dom';
import { useInventory } from '../hooks/useInventory';

const InventoryPage: React.FC = () => {
  const { items, loading, error } = useInventory();

  const categories = [
    { name: 'Chemistry', route: '/inventory/chemistry', icon: '🧪', color: 'blue' },
    { name: 'Hematology', route: '/inventory/hematology', icon: '🔬', color: 'red' },
    { name: 'Urinalysis', route: '/inventory/urinalysis', icon: '🧪', color: 'yellow' },
    { name: 'Coagulation', route: '/inventory/coagulation', icon: '💉', color: 'purple' },
    { name: 'Kits', route: '/inventory/kits', icon: '📦', color: 'green' },
    { name: 'Order Management', route: '/inventory/order-management', icon: '📋', color: 'gray' },
  ];

  const getCategoryCount = (cat: string) => {
    return items.filter(item => item.category?.toUpperCase() === cat.toUpperCase()).length;
  };

  const criticalItems = items.filter(item => item.currentStock <= item.reorderPoint).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
      <p className="text-gray-600 mb-6">Laboratory supplies, reagents, and equipment</p>

      {!loading && !error && (
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Items</p>
            <p className="text-3xl font-bold text-blue-600">{items.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Critical/Low Stock</p>
            <p className="text-3xl font-bold text-red-600">{criticalItems}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Categories</p>
            <p className="text-3xl font-bold text-green-600">{categories.length}</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.route}
            to={cat.route}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="text-5xl mb-4">{cat.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.name}</h3>
            {!loading && (
              <p className="text-sm text-gray-600">{getCategoryCount(cat.name)} items</p>
            )}
            <div className="mt-4 text-blue-600 text-sm font-medium">View Inventory →</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default InventoryPage;
