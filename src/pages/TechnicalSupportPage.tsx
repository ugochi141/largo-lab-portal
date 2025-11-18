import React from 'react';
import { Link } from 'react-router-dom';

const TechnicalSupportPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-blue-600">Home</Link> → 
        <span className="font-medium"> Technical Support</span>
      </nav>
      <h1 className="text-3xl font-bold mb-2">Technical Support</h1>
      <p className="text-gray-600 mb-6">Equipment troubleshooting and vendor contacts</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">🔧 Equipment Support</h3>
          <div className="space-y-3">
            <div>
              <p className="font-bold text-gray-900">Roche cobas 8000</p>
              <p className="text-sm text-gray-600">Chemistry Analyzer</p>
              <p className="text-blue-600">1-800-428-2336</p>
            </div>
            <div>
              <p className="font-bold text-gray-900">Sysmex XN-2000</p>
              <p className="text-sm text-gray-600">Hematology Analyzer</p>
              <p className="text-blue-600">1-888-879-7639</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">💻 IT Support</h3>
          <div className="space-y-3">
            <div>
              <p className="font-bold text-gray-900">Helpdesk</p>
              <p className="text-blue-600">(301) 555-HELP</p>
            </div>
            <div>
              <p className="font-bold text-gray-900">LIS Support</p>
              <p className="text-blue-600">(301) 555-0199</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalSupportPage;
