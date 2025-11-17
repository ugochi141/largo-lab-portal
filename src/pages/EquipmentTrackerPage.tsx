import React, { useState, useMemo } from 'react';
import { equipment, waterChangeDates, criticalValues } from '@/data/equipmentData';
import type { Equipment } from '@/data/equipmentData';

const EquipmentTrackerPage: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'equipment' | 'critical'>('equipment');

  const filteredEquipment = useMemo(() => {
    return equipment.filter((eq) => {
      if (categoryFilter && eq.category !== categoryFilter) return false;
      if (locationFilter && eq.location !== locationFilter) return false;
      if (statusFilter && eq.status !== statusFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          eq.name.toLowerCase().includes(query) ||
          eq.model.toLowerCase().includes(query) ||
          eq.serialNumber.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [categoryFilter, locationFilter, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = equipment.length;
    const operational = equipment.filter((eq) => eq.status === 'Operational').length;
    const maintenance = equipment.filter((eq) => eq.status === 'Maintenance').length;
    const offline = equipment.filter((eq) => eq.status === 'Offline').length;
    return { total, operational, maintenance, offline };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary-700">Equipment Tracker</h1>
        <p className="text-neutral-600 mt-2">
          Kaiser Permanente Largo Laboratory - Equipment Management & Support
        </p>
      </div>

      {/* Water Change Alert */}
      <div className="card bg-info-50 border-info-200 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💧</span>
          <div>
            <div className="font-semibold text-info-900 mb-1">Upcoming Water Changes:</div>
            {waterChangeDates.map((date, idx) => (
              <div key={idx} className="text-info-700">
                {date.start} to {date.end}
              </div>
            ))}
            <div className="text-sm text-info-600 mt-2">
              Remember to call all labs to verify everything is operational
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card bg-primary-50 border-primary-200">
          <div className="text-sm text-primary-600 font-semibold mb-1">Total Equipment</div>
          <div className="text-3xl font-bold text-primary-700">{stats.total}</div>
        </div>
        <div className="card bg-success-50 border-success-200">
          <div className="text-sm text-success-600 font-semibold mb-1">Operational</div>
          <div className="text-3xl font-bold text-success-700">{stats.operational}</div>
        </div>
        <div className="card bg-warning-50 border-warning-200">
          <div className="text-sm text-warning-600 font-semibold mb-1">Maintenance</div>
          <div className="text-3xl font-bold text-warning-700">{stats.maintenance}</div>
        </div>
        <div className="card bg-danger-50 border-danger-200">
          <div className="text-sm text-danger-600 font-semibold mb-1">Offline</div>
          <div className="text-3xl font-bold text-danger-700">{stats.offline}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 mb-6">
        <nav className="flex gap-4" aria-label="Equipment tabs">
          <button
            onClick={() => setActiveTab('equipment')}
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-all ${
              activeTab === 'equipment'
                ? 'border-primary-500 text-primary-700'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Equipment List
          </button>
          <button
            onClick={() => setActiveTab('critical')}
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-all ${
              activeTab === 'critical'
                ? 'border-primary-500 text-primary-700'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Critical Values
          </button>
        </nav>
      </div>

      {/* Equipment Tab */}
      {activeTab === 'equipment' && (
        <>
          {/* Filters */}
          <div className="card mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="categoryFilter" className="block text-sm font-semibold text-neutral-700 mb-1">
                  Category
                </label>
                <select
                  id="categoryFilter"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Categories</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Hematology">Hematology</option>
                  <option value="Urinalysis">Urinalysis</option>
                  <option value="Coagulation">Coagulation</option>
                  <option value="Molecular">Molecular</option>
                </select>
              </div>
              <div>
                <label htmlFor="locationFilter" className="block text-sm font-semibold text-neutral-700 mb-1">
                  Location
                </label>
                <select
                  id="locationFilter"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Locations</option>
                  <option value="MOB">MOB</option>
                  <option value="AUC">AUC</option>
                </select>
              </div>
              <div>
                <label htmlFor="statusFilter" className="block text-sm font-semibold text-neutral-700 mb-1">
                  Status
                </label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Status</option>
                  <option value="Operational">Operational</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
              <div>
                <label htmlFor="searchInput" className="block text-sm font-semibold text-neutral-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  id="searchInput"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Model, Serial #, etc."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Equipment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEquipment.map((eq: Equipment) => (
              <div key={eq.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="font-bold text-lg text-primary-700">{eq.name}</div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      eq.status === 'Operational'
                        ? 'bg-success-100 text-success-700'
                        : eq.status === 'Maintenance'
                        ? 'bg-warning-100 text-warning-700'
                        : 'bg-danger-100 text-danger-700'
                    }`}
                  >
                    {eq.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600 font-semibold">Location:</span>
                    <span className="text-neutral-900">{eq.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600 font-semibold">Model:</span>
                    <span className="text-neutral-900">{eq.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600 font-semibold">Serial #:</span>
                    <span className="text-neutral-900 font-mono text-xs">{eq.serialNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600 font-semibold">Category:</span>
                    <span className="text-neutral-900">{eq.category}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <div className="text-xs text-neutral-600 font-semibold mb-1">Support Contact:</div>
                  <div className="text-sm text-neutral-900">{eq.vendor}</div>
                  <div className="text-sm text-primary-600 font-mono">{eq.supportPhone}</div>
                </div>
                {eq.notes && (
                  <div className="mt-3 p-2 bg-info-50 rounded text-xs text-info-700">{eq.notes}</div>
                )}
              </div>
            ))}
          </div>

          {filteredEquipment.length === 0 && (
            <div className="card text-center py-12">
              <div className="text-neutral-400 mb-2">No equipment found</div>
              <div className="text-sm text-neutral-600">Try adjusting your filters</div>
            </div>
          )}
        </>
      )}

      {/* Critical Values Tab */}
      {activeTab === 'critical' && (
        <div className="card">
          <h3 className="text-xl font-bold text-danger-700 mb-4">Critical Values Reference</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-danger-200 bg-danger-50">
                  <th className="text-left py-3 px-4 font-semibold text-danger-900">Test</th>
                  <th className="text-left py-3 px-4 font-semibold text-danger-900">Critical Range</th>
                  <th className="text-left py-3 px-4 font-semibold text-danger-900">Action Required</th>
                </tr>
              </thead>
              <tbody>
                {criticalValues.map((cv, idx) => (
                  <tr key={idx} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-3 px-4 font-semibold text-neutral-900">{cv.test}</td>
                    <td className="py-3 px-4 text-danger-700 font-mono text-sm">{cv.critical}</td>
                    <td className="py-3 px-4 text-neutral-700">{cv.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentTrackerPage;
