import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="text-5xl">🏥</div>
            <div>
              <h1 className="text-4xl font-bold">Largo Laboratory Portal</h1>
              <p className="text-blue-100">Kaiser Permanente - Largo Medical Center</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose Your Portal</h2>
          <p className="text-lg text-gray-600">Select the appropriate access level for your role</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Admin Portal */}
          <Link
            to="/admin"
            className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className="bg-gradient-to-br from-red-500 to-red-700 p-8 text-white">
              <div className="text-6xl mb-4">🔐</div>
              <h3 className="text-3xl font-bold mb-2">Admin Portal</h3>
              <p className="text-red-100">Full management access</p>
            </div>
            <div className="p-8">
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Full dashboard access</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Inventory management</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Staff & schedule management</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Edit & modify all data</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Reports & analytics</span>
                </div>
              </div>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-sm text-red-800">
                  <strong>🔒 Restricted Access:</strong> Administrator only
                </p>
              </div>
              <div className="mt-6 text-center">
                <span className="inline-block bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-3 rounded-lg font-semibold group-hover:scale-105 transition-transform">
                  Enter Admin Portal →
                </span>
              </div>
            </div>
          </Link>

          {/* Staff Portal */}
          <Link
            to="/staff"
            className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-8 text-white">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-3xl font-bold mb-2">Staff Portal</h3>
              <p className="text-blue-100">Read-only access</p>
            </div>
            <div className="p-8">
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">View SOPs & protocols</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Check daily schedule</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">View QC maintenance</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Check inventory levels</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Access tech support</span>
                </div>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-800">
                  <strong>👁️ View Only:</strong> Information access for staff
                </p>
              </div>
              <div className="mt-6 text-center">
                <span className="inline-block bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold group-hover:scale-105 transition-transform">
                  Enter Staff Portal →
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Info Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-4 text-center">Need Help?</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl mb-2">📞</div>
                <p className="font-semibold">Lab Director</p>
                <p className="text-sm text-gray-600">(301) 555-0101</p>
              </div>
              <div>
                <div className="text-4xl mb-2">💻</div>
                <p className="font-semibold">IT Support</p>
                <p className="text-sm text-gray-600">(301) 555-4357</p>
              </div>
              <div>
                <div className="text-4xl mb-2">📧</div>
                <p className="font-semibold">Email</p>
                <p className="text-sm text-gray-600">admin@largo-lab.kp.org</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">© {new Date().getFullYear()} Largo Laboratory - Kaiser Permanente</p>
          <p className="text-xs text-gray-400 mt-1">Portal v4.2.0 - Admin & Staff Access</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
