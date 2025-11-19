import React from 'react';
import { useEquipment } from '../hooks/useEquipment';

const EquipmentTrackerPage: React.FC = () => {
  const { equipment, loading } = useEquipment();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-2">Equipment Tracker</h1>
      <p className="text-gray-600 mb-6">Laboratory equipment maintenance and status</p>

      {loading ? (
        <div className="text-center py-8">Loading equipment...</div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-700">Operational</p>
              <p className="text-3xl font-bold text-green-600">
                {equipment.filter(e => e.status === 'operational').length}
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-yellow-700">In Maintenance</p>
              <p className="text-3xl font-bold text-yellow-600">
                {equipment.filter(e => e.status === 'maintenance').length}
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-red-700">Down</p>
              <p className="text-3xl font-bold text-red-600">
                {equipment.filter(e => e.status === 'down').length}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {equipment.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.manufacturer} {item.model}</p>
                    <p className="text-xs text-gray-500">SN: {item.serialNumber}</p>
                    <p className="text-sm text-gray-600 mt-2">📍 {item.location}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    item.status === 'operational' ? 'bg-green-100 text-green-800' :
                    item.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.status.toUpperCase()}
                  </span>
                </div>
                <div className="mt-4 flex gap-4 text-sm text-gray-600">
                  <span>Last Maintenance: {item.lastMaintenance}</span>
                  <span>Next: {item.nextMaintenance}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EquipmentTrackerPage;
