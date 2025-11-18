import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const todayStats = [
    { label: 'Staff On Duty', value: '22', status: 'normal' },
    { label: 'Pending Orders', value: '5', status: 'warning' },
    { label: 'QC Tasks Due', value: '8', status: 'info' },
    { label: 'Compliance', value: '100%', status: 'success' },
  ];

  const criticalAlerts = [
    { type: 'critical', title: 'Low Stock Alert', message: 'Chemistry reagents below PAR level' },
    { type: 'warning', title: 'Maintenance Due', message: 'Sysmex XN-2000 weekly maintenance' },
    { type: 'info', title: 'Schedule Update', message: 'Staff rotation updated for next week' },
  ];

  const quickActions = [
    { icon: '📅', label: 'View Schedule', link: '/schedule' },
    { icon: '📦', label: 'Order Supplies', link: '/inventory' },
    { icon: '✅', label: 'Complete QC', link: '/schedule' },
    { icon: '⏰', label: 'Approve Timecards', link: '/staff' },
    { icon: '📊', label: 'View Reports', link: '/dashboard' },
    { icon: '🔧', label: 'Tech Support', link: '/dashboard' },
  ];

  const inventoryStatus = [
    { category: 'Chemistry', percentage: 75, status: 'good' },
    { category: 'Hematology', percentage: 45, status: 'warning' },
    { category: 'Urinalysis', percentage: 90, status: 'good' },
    { category: 'Kits', percentage: 30, status: 'critical' },
  ];

  const complianceItems = [
    { label: 'Daily Temperature Logs', completed: true },
    { label: 'QC Review Completed', completed: true },
    { label: 'Weekly Maintenance Due', completed: false },
    { label: 'Safety Inspection', completed: true },
    { label: 'Staff Training Current', completed: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Kaiser Permanente Header */}
      <div className="bg-gradient-to-r from-[#0066cc] to-[#004c99] rounded-xl shadow-lg p-6 md:p-8 mb-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <span className="text-2xl text-[#0066cc]">🏥</span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Largo Laboratory Portal</h1>
            <p className="text-blue-100">Kaiser Permanente - Laboratory Operations Dashboard</p>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Today's Overview */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Today's Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            {todayStats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className={`text-3xl font-bold mb-1 ${
                  stat.status === 'success' ? 'text-green-600' :
                  stat.status === 'warning' ? 'text-yellow-600' :
                  stat.status === 'info' ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Critical Alerts</h3>
          <div className="space-y-3">
            {criticalAlerts.map((alert, idx) => (
              <div key={idx} className={`p-3 rounded-lg ${
                alert.type === 'critical' ? 'bg-red-50 border border-red-200' :
                alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-blue-50 border border-blue-200'
              }`}>
                <div className={`font-bold text-sm mb-1 ${
                  alert.type === 'critical' ? 'text-red-800' :
                  alert.type === 'warning' ? 'text-yellow-800' :
                  'text-blue-800'
                }`}>
                  {alert.title}
                </div>
                <div className="text-xs text-gray-700">{alert.message}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, idx) => (
              <Link
                key={idx}
                to={action.link}
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200"
              >
                <span className="text-2xl mb-2">{action.icon}</span>
                <span className="text-xs font-medium text-gray-700 text-center">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Status & Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Inventory Status */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Inventory Status</h3>
          <div className="space-y-4">
            {inventoryStatus.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  <span className={`text-sm font-bold ${
                    item.status === 'good' ? 'text-green-600' :
                    item.status === 'warning' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {item.percentage}% Stocked
                    {item.status === 'warning' && ' - Order Soon'}
                    {item.status === 'critical' && ' - Critical Low'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      item.status === 'good' ? 'bg-green-500' :
                      item.status === 'warning' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <Link to="/inventory" className="mt-4 block text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
            Manage Inventory →
          </Link>
        </div>

        {/* Compliance Tracker */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Compliance Status</h3>
          <div className="space-y-3">
            {complianceItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  item.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {item.completed ? '✓' : '○'}
                </span>
                <span className={`text-sm ${item.completed ? 'text-gray-900' : 'text-gray-600'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <Link to="/safety" className="mt-4 block text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
            View Compliance Details →
          </Link>
        </div>
      </div>

      {/* External Systems */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">External Systems</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Oracle Fusion', icon: '🔗' },
            { name: 'Smart Square', icon: '📊' },
            { name: 'Insight', icon: '📈' },
            { name: 'TempTrak', icon: '🌡️' },
            { name: 'SafetyNet', icon: '🛡️' },
            { name: 'Power BI', icon: '📉' },
          ].map((system, idx) => (
            <a
              key={idx}
              href="#"
              className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <span className="text-2xl mb-2">{system.icon}</span>
              <span className="text-xs font-medium text-gray-700 text-center">{system.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Department Information */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Department Information</h4>
            <p className="text-sm text-gray-700">
              Largo Laboratory<br />
              Kaiser Permanente<br />
              GL Code: 1808-18801-5693<br />
              Account: 55042619
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Support Contacts</h4>
            <p className="text-sm text-gray-700">
              Roche: 1-800-428-2336<br />
              Sysmex: 1-888-879-7639<br />
              Cepheid: 1-888-838-3222<br />
              Stago: 1-800-725-0607
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Compliance</h4>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">HIPAA Compliant</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">CAP Accredited</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">CLIA Certified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
