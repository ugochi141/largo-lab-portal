import React from 'react';
import { Link } from 'react-router-dom';

const CompliancePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-blue-600">Home</Link> → 
        <span className="font-medium"> Compliance</span>
      </nav>
      <h1 className="text-3xl font-bold mb-2">Compliance Documentation</h1>
      <p className="text-gray-600 mb-6">CLIA, CAP, HIPAA, and OSHA compliance tracking</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">✅</div>
            <h3 className="text-xl font-bold">CLIA Compliance</h3>
          </div>
          <p className="text-gray-600 mb-4">Clinical Laboratory Improvement Amendments</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm">Quality Control Current</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm">Proficiency Testing Up-to-Date</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">🏆</div>
            <h3 className="text-xl font-bold">CAP Accreditation</h3>
          </div>
          <p className="text-gray-600 mb-4">College of American Pathologists</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm">Annual Inspection Passed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm">Checklists Completed</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">🔒</div>
            <h3 className="text-xl font-bold">HIPAA Compliance</h3>
          </div>
          <p className="text-gray-600 mb-4">Health Insurance Portability and Accountability Act</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm">Staff Training Current</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm">Privacy Policies Updated</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">🛡️</div>
            <h3 className="text-xl font-bold">OSHA Safety</h3>
          </div>
          <p className="text-gray-600 mb-4">Occupational Safety and Health Administration</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm">Safety Training Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm">Incident Reports Filed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompliancePage;
