import React, { useState } from 'react';

interface SOP {
  id: string;
  title: string;
  category: string;
  version: string;
  lastUpdated: string;
  description: string;
}

const StaffSOPsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const sops: SOP[] = [
    { id: 'SOP001', title: 'Phlebotomy Procedures', category: 'Phlebotomy', version: '3.2', lastUpdated: '2025-10-15', description: 'Standard venipuncture and capillary blood collection procedures' },
    { id: 'SOP002', title: 'Chemistry Analyzer Operation', category: 'Chemistry', version: '2.1', lastUpdated: '2025-09-20', description: 'Roche Cobas operation and maintenance procedures' },
    { id: 'SOP003', title: 'Hematology QC Procedures', category: 'Hematology', version: '4.0', lastUpdated: '2025-11-01', description: 'Daily quality control for Sysmex XN-2000' },
    { id: 'SOP004', title: 'Urinalysis Testing', category: 'Urinalysis', version: '2.5', lastUpdated: '2025-08-30', description: 'Manual and automated urinalysis procedures' },
    { id: 'SOP005', title: 'Blood Bank Procedures', category: 'Blood Bank', version: '5.1', lastUpdated: '2025-10-10', description: 'Type and screen, crossmatch procedures' },
    { id: 'SOP006', title: 'Specimen Processing', category: 'Processing', version: '3.0', lastUpdated: '2025-09-15', description: 'Specimen receipt, handling, and processing' },
    { id: 'SOP007', title: 'Safety & Infection Control', category: 'Safety', version: '6.2', lastUpdated: '2025-11-05', description: 'Biosafety and infection control protocols' },
    { id: 'SOP008', title: 'Equipment Maintenance', category: 'Maintenance', version: '2.8', lastUpdated: '2025-10-25', description: 'Preventive maintenance schedules' },
  ];

  const filtered = sops.filter(sop =>
    sop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sop.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Standard Operating Procedures</h1>
      <p className="text-gray-600 mb-6">Laboratory protocols and procedures</p>

      {/* Read-Only Notice */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔒</span>
          <p className="text-sm text-yellow-800">
            <strong>Read-Only Access:</strong> You can view SOPs but cannot download or modify them. 
            Contact your administrator for full access.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <input
          type="text"
          placeholder="Search SOPs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total SOPs</p>
          <p className="text-2xl font-bold text-blue-600">{sops.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Categories</p>
          <p className="text-2xl font-bold text-green-600">8</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Recently Updated</p>
          <p className="text-2xl font-bold text-purple-600">3</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Current Version</p>
          <p className="text-2xl font-bold text-indigo-600">v{sops[0].version}</p>
        </div>
      </div>

      {/* SOPs List */}
      <div className="grid gap-4">
        {filtered.map((sop) => (
          <div key={sop.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold">{sop.title}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {sop.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{sop.description}</p>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>📄 ID: {sop.id}</span>
                  <span>🔢 Version: {sop.version}</span>
                  <span>📅 Updated: {sop.lastUpdated}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  className="bg-gray-100 text-gray-500 px-4 py-2 rounded text-sm cursor-not-allowed"
                  disabled
                  title="View-only access"
                >
                  👁️ View Only
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No SOPs found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default StaffSOPsPage;
