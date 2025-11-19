import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStaff } from '../../hooks/useStaff';

const StaffDirectoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { staff, loading, error } = useStaff();

  const filtered = staff.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-blue-600">Home</Link> → 
        <Link to="/staff" className="text-blue-600"> Staff</Link> → 
        <span className="font-medium"> Directory</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">Staff Directory</h1>
      <p className="text-gray-600 mb-6">Contact information for laboratory staff</p>

      {loading && <div className="text-center py-8">Loading...</div>}
      {error && <div className="bg-red-50 p-4 rounded">Error: {error}</div>}

      {!loading && !error && (
        <>
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((person) => (
              <div key={person.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{person.name}</h3>
                    <p className="text-sm text-gray-600">{person.role}</p>
                    <p className="text-sm text-gray-600">{person.department}</p>
                    <div className="mt-3 space-y-1">
                      <p className="text-sm">📞 {person.phone}</p>
                      <p className="text-sm text-blue-600">{person.email}</p>
                      <p className="text-sm text-gray-600">Shift: {person.shift}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StaffDirectoryPage;
