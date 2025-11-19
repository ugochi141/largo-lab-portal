import React from 'react';
import { useInventory } from '../hooks/useInventory';
import { useStaff } from '../hooks/useStaff';
import { useEquipment } from '../hooks/useEquipment';

const DashboardPage: React.FC = () => {
  const { items: inventory } = useInventory();
  const { staff } = useStaff();
  const { equipment } = useEquipment();

  const criticalItems = inventory.filter(item => item.currentStock <= item.reorderPoint).length;
  const activeStaff = staff.filter(s => s.status === 'active').length;
  const operationalEquipment = equipment.filter(e => e.status === 'operational').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-2">Manager Dashboard</h1>
      <p className="text-gray-600 mb-6">Laboratory operations overview</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Inventory</p>
              <p className="text-3xl font-bold text-blue-600">{inventory.length}</p>
              <p className="text-xs text-red-600 mt-1">{criticalItems} critical</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Staff On Duty</p>
              <p className="text-3xl font-bold text-green-600">{activeStaff}</p>
              <p className="text-xs text-gray-600 mt-1">of {staff.length} total</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Equipment Status</p>
              <p className="text-3xl font-bold text-green-600">{operationalEquipment}</p>
              <p className="text-xs text-gray-600 mt-1">operational</p>
            </div>
            <div className="text-4xl">🔧</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Compliance</p>
              <p className="text-3xl font-bold text-green-600">98%</p>
              <p className="text-xs text-gray-600 mt-1">on track</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Critical Alerts</h2>
          {criticalItems > 0 ? (
            <div className="space-y-3">
              {inventory.filter(item => item.currentStock <= item.reorderPoint).slice(0, 5).map(item => (
                <div key={item.id} className="border-l-4 border-red-500 pl-3 py-2">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-600">Stock: {item.currentStock} (Reorder: {item.reorderPoint})</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No critical alerts</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <p>• {inventory.length} inventory items tracked</p>
              <p>• {staff.length} staff members active</p>
              <p>• {equipment.length} equipment monitored</p>
              <p>• All systems operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
