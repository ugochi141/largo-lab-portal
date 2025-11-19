import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const StaffPortalLayout: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🏥</div>
              <div>
                <h1 className="text-2xl font-bold">Largo Laboratory Portal</h1>
                <p className="text-sm text-blue-100">Staff Access - Read Only</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                👁️ VIEW ONLY
              </span>
              <Link
                to="/"
                className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Switch to Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <Link
              to="/staff"
              className={`px-6 py-4 font-medium transition-colors ${
                isActive('/staff')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              🏠 Home
            </Link>
            <Link
              to="/staff/sops"
              className={`px-6 py-4 font-medium transition-colors ${
                isActive('/staff/sops')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              📋 SOPs
            </Link>
            <Link
              to="/staff/schedule"
              className={`px-6 py-4 font-medium transition-colors ${
                isActive('/staff/schedule')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              📅 Daily Schedule
            </Link>
            <Link
              to="/staff/qc"
              className={`px-6 py-4 font-medium transition-colors ${
                isActive('/staff/qc')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              🔬 QC Maintenance
            </Link>
            <Link
              to="/staff/inventory"
              className={`px-6 py-4 font-medium transition-colors ${
                isActive('/staff/inventory')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              📦 Inventory
            </Link>
            <Link
              to="/staff/support"
              className={`px-6 py-4 font-medium transition-colors ${
                isActive('/staff/support')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              🛠️ Tech Support
            </Link>
          </div>
        </div>
      </nav>

      {/* Info Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="text-2xl">ℹ️</div>
          <div>
            <p className="text-blue-900 font-medium">Staff Portal - Read-Only Access</p>
            <p className="text-sm text-blue-700">
              You can view information but cannot make changes. Contact your administrator for edit access.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Largo Laboratory - Kaiser Permanente
          </p>
          <p className="text-xs text-gray-400 mt-1">Staff Portal v1.0 - Read-Only Access</p>
        </div>
      </footer>
    </div>
  );
};

export default StaffPortalLayout;
