import React from 'react';
import { Link } from 'react-router-dom';
import { useInventory } from '../../hooks/useInventory';

const StaffHomePage: React.FC = () => {
  const { items } = useInventory();
  const lowStock = items.filter(item => item.currentStock <= item.reorderPoint).length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Welcome to Staff Portal</h1>
      <p className="text-gray-600 mb-8">Quick access to laboratory resources and information</p>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-2">📋</div>
          <p className="text-sm text-gray-600">SOPs Available</p>
          <p className="text-3xl font-bold text-blue-600">8</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-2">📅</div>
          <p className="text-sm text-gray-600">Staff Scheduled</p>
          <p className="text-3xl font-bold text-green-600">5</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-2">📦</div>
          <p className="text-sm text-gray-600">Inventory Items</p>
          <p className="text-3xl font-bold text-purple-600">{items.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-2">⚠️</div>
          <p className="text-sm text-gray-600">Low Stock Alerts</p>
          <p className="text-3xl font-bold text-red-600">{lowStock}</p>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/staff/sops" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-xl font-bold mb-2">Standard Operating Procedures</h3>
          <p className="text-sm text-gray-600 mb-3">View laboratory SOPs and protocols</p>
          <div className="text-blue-600 text-sm font-medium">View SOPs →</div>
        </Link>

        <Link to="/staff/schedule" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="text-xl font-bold mb-2">Daily Schedule</h3>
          <p className="text-sm text-gray-600 mb-3">Check staff assignments and shifts</p>
          <div className="text-blue-600 text-sm font-medium">View Schedule →</div>
        </Link>

        <Link to="/staff/qc" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="text-5xl mb-4">🔬</div>
          <h3 className="text-xl font-bold mb-2">QC Maintenance</h3>
          <p className="text-sm text-gray-600 mb-3">View quality control schedule</p>
          <div className="text-blue-600 text-sm font-medium">View QC Schedule →</div>
        </Link>

        <Link to="/staff/inventory" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-xl font-bold mb-2">Inventory</h3>
          <p className="text-sm text-gray-600 mb-3">Check stock levels and supplies</p>
          <div className="text-blue-600 text-sm font-medium">View Inventory →</div>
        </Link>

        <Link to="/staff/support" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="text-5xl mb-4">🛠️</div>
          <h3 className="text-xl font-bold mb-2">Technical Support</h3>
          <p className="text-sm text-gray-600 mb-3">Access technical resources</p>
          <div className="text-blue-600 text-sm font-medium">Get Support →</div>
        </Link>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6 border-2 border-blue-200">
          <div className="text-5xl mb-4">📢</div>
          <h3 className="text-xl font-bold mb-2 text-blue-900">Need Help?</h3>
          <p className="text-sm text-blue-700 mb-3">Contact your administrator for assistance</p>
          <p className="text-xs text-blue-600">📧 admin@largo-lab.kp.org</p>
        </div>
      </div>

      {/* Alerts Section */}
      {lowStock > 0 && (
        <div className="mt-8 bg-red-50 border-l-4 border-red-600 p-6 rounded-r-lg">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="font-bold text-red-900 mb-2">Low Stock Alert</h3>
              <p className="text-sm text-red-700">
                {lowStock} item{lowStock !== 1 ? 's are' : ' is'} running low on stock. 
                View the <Link to="/staff/inventory" className="underline font-medium">inventory page</Link> for details.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffHomePage;
