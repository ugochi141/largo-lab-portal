import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const StaffDirectoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const staff = [
    { name: 'Dr. Alex Morgan', role: 'Lab Director', phone: '(301) 555-0101', email: 'alex.morgan@kp.org', dept: 'Administration' },
    { name: 'Netta Johnson', role: 'Lead Phlebotomist', phone: '(301) 555-0102', email: 'netta.johnson@kp.org', dept: 'Phlebotomy' },
    { name: 'Tracy Williams', role: 'Medical Technologist', phone: '(301) 555-0103', email: 'tracy.williams@kp.org', dept: 'Chemistry' },
    { name: 'Booker Smith', role: 'Lab Technician', phone: '(301) 555-0104', email: 'booker.smith@kp.org', dept: 'Hematology' },
    { name: 'Boyet Rodriguez', role: 'Specimen Processor', phone: '(301) 555-0105', email: 'boyet.rodriguez@kp.org', dept: 'Processing' },
  ];

  const filteredStaff = staff.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-blue-600">Home</Link>
        <span className="mx-2">→</span>
        <Link to="/staff" className="text-blue-600">Staff</Link>
        <span className="mx-2">→</span>
        <span className="font-medium">Directory</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">Staff Directory</h1>
      <p className="text-gray-600 mb-6">Contact information for Largo Laboratory staff</p>

      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <input
          type="text"
          placeholder="Search by name, role, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStaff.map((person, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                {person.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{person.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{person.role}</p>
                <p className="text-sm text-gray-600">{person.dept}</p>
                <div className="mt-3 space-y-1">
                  <p className="text-sm text-gray-600">📞 {person.phone}</p>
                  <p className="text-sm text-blue-600">{person.email}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffDirectoryPage;
