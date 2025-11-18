import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SOPPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const sops = [
    { id: 'SOP-001', title: 'Chemistry Procedures', category: 'Chemistry', updated: '2025-10-15' },
    { id: 'SOP-002', title: 'Hematology Procedures', category: 'Hematology', updated: '2025-10-20' },
    { id: 'SOP-003', title: 'Urinalysis Procedures', category: 'Urinalysis', updated: '2025-09-30' },
    { id: 'SOP-004', title: 'Coagulation Procedures', category: 'Coagulation', updated: '2025-10-10' },
    { id: 'SOP-005', title: 'Phlebotomy Procedures', category: 'Phlebotomy', updated: '2025-11-01' },
    { id: 'SOP-006', title: 'Safety Procedures', category: 'Safety', updated: '2025-08-15' },
    { id: 'SOP-007', title: 'Specimen Processing', category: 'Processing', updated: '2025-10-25' },
    { id: 'SOP-008', title: 'Quality Control', category: 'QC', updated: '2025-10-05' },
  ];

  const filtered = sops.filter(sop =>
    sop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sop.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-blue-600">Home</Link> → 
        <span className="font-medium"> SOPs</span>
      </nav>
      <h1 className="text-3xl font-bold mb-2">Standard Operating Procedures</h1>
      <p className="text-gray-600 mb-6">Laboratory SOPs and protocols</p>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <input
          type="text"
          placeholder="Search SOPs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(sop => (
          <div key={sop.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{sop.title}</h3>
                <p className="text-sm text-gray-600 mb-1">{sop.id}</p>
                <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                  {sop.category}
                </span>
              </div>
              <div className="text-3xl">📄</div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Updated: {sop.updated}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SOPPage;
