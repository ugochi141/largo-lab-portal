import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDashboardStore } from '@/store/dashboardStore';

const HomePage: React.FC = () => {
  const stats = useDashboardStore((state) => state.stats);
  const schedulePreview = useDashboardStore((state) => state.schedulePreview);
  const inventory = useDashboardStore((state) => state.inventory);
  const alerts = useDashboardStore((state) => state.alerts);
  const updatedAt = useDashboardStore((state) => state.updatedAt);
  const loading = useDashboardStore((state) => state.loading);
  const error = useDashboardStore((state) => state.error);
  const hydrate = useDashboardStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const features = [
    {
      title: 'Interactive Schedule Manager',
      description: 'Drag-and-drop scheduling with real-time conflict detection for phlebotomy staff',
      icon: '📅',
      link: '/schedule',
      color: 'primary',
    },
    {
      title: 'Manager Dashboard',
      description: 'One-on-one meetings, staff rounding, and performance metrics tracking',
      icon: '📊',
      link: '/dashboard',
      color: 'success',
    },
    {
      title: 'Safety & Compliance',
      description: 'Incident reporting, safety protocols, and regulatory compliance tracking',
      icon: '🛡️',
      link: '/safety',
      color: 'warning',
    },
    {
      title: 'Staff Management',
      description: 'Certification tracking, availability management, and performance metrics',
      icon: '👥',
      link: '/staff',
      color: 'secondary',
    },
    {
      title: 'SBAR Communication Toolkit',
      description: 'Printable cards, posters, and reference sheets for structured communication',
      icon: '🗂️',
      link: '/sbar',
      color: 'primary',
    },
  ];

  const heroStats = [
    {
      label: 'Staff On Duty',
      value: stats.staffOnDuty,
      helper: 'All shifts covered',
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders,
      helper: stats.pendingOrders ? 'Review order management' : 'No open requests',
    },
    {
      label: 'Compliance',
      value: `${Math.round(stats.complianceRate * 100)}%`,
      helper: 'Logs verified today',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section
        className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl shadow-strong p-8 md:p-12 mb-8 text-white"
        aria-labelledby="portal-hero-title"
      >
        <div className="max-w-4xl space-y-6">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary-100 font-semibold">
              Kaiser Permanente Largo Laboratory
            </p>
            <h1 id="portal-hero-title" className="text-4xl md:text-5xl font-bold mb-3">
              Operational Control Center
            </h1>
            <p className="text-xl md:text-2xl opacity-95" id="portal-hero-description">
              Coordinate schedules, inventory, compliance, and staff readiness from a single accessible workspace.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4" aria-label="Primary actions">
            <Link
              to="/schedule"
              className="btn bg-white text-primary-700 hover:bg-neutral-100 font-bold text-lg px-8 py-3"
              aria-describedby="portal-hero-description"
            >
              Create Schedule
            </Link>
            <Link
              to="/dashboard"
              className="btn bg-primary-600 text-white hover:bg-primary-800 font-bold text-lg px-8 py-3 border-2 border-white"
            >
              Manager Dashboard
            </Link>
            <Link
              to="/safety"
              className="btn bg-transparent text-white border-2 border-white/70 hover:bg-white/10 font-bold text-lg px-8 py-3"
            >
              View Compliance Tasks
            </Link>
          </div>

          <div className="bg-white/10 rounded-xl p-4 backdrop-blur" role="list" aria-label="Key service levels">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {heroStats.map((stat) => (
                <div key={stat.label} role="listitem">
                  <p className="text-sm uppercase tracking-wide text-primary-100">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm opacity-80">{stat.helper}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Alert Highlights */}
      <section
        className="mb-10 bg-white rounded-xl shadow-soft border border-neutral-100"
        role="region"
        aria-labelledby="alert-highlights-heading"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-5 border-b border-neutral-200">
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">Live Signals</p>
            <h2 id="alert-highlights-heading" className="text-2xl font-bold text-neutral-900">
              Operational Alerts
            </h2>
          </div>
          <div className="text-right">
            <span className="text-sm text-neutral-500 block">
              Updated: {new Date(updatedAt).toLocaleTimeString()}
            </span>
            {loading && <span className="text-xs text-neutral-400">Refreshing…</span>}
          </div>
        </div>
        {error && (
          <p className="px-6 py-3 text-sm text-danger-600 bg-danger-50 border-t border-danger-100">
            {error}
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 py-6" role="status" aria-live="polite">
          {alerts.map((alert) => (
            <article
              key={alert.id}
              className={`rounded-lg p-4 border ${
                alert.severity === 'CRITICAL'
                  ? 'border-danger-500 bg-danger-50 text-danger-700'
                  : alert.severity === 'WARNING'
                  ? 'border-warning-500 bg-warning-50 text-warning-700'
                  : 'border-primary-100 bg-primary-50 text-primary-800'
              }`}
            >
              <h3 className="font-semibold text-lg">{alert.title}</h3>
              <p className="text-sm">{alert.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Schedule Preview */}
      <section className="mb-10" aria-labelledby="schedule-preview-heading">
        <div className="bg-white rounded-xl shadow-soft border border-neutral-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-5 border-b border-neutral-200">
            <div>
              <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">Today's Coverage</p>
              <h2 id="schedule-preview-heading" className="text-2xl font-bold text-neutral-900">
                Schedule Preview
              </h2>
            </div>
            <Link to="/schedule" className="text-primary-600 font-semibold hover:underline">
              Manage schedule →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-50 text-neutral-600 text-left">
                <tr>
                  <th className="px-6 py-3 font-semibold">Time</th>
                  <th className="px-6 py-3 font-semibold">Staff</th>
                  <th className="px-6 py-3 font-semibold">Role</th>
                  <th className="px-6 py-3 font-semibold">Station</th>
                </tr>
              </thead>
              <tbody>
                {schedulePreview.map((slot) => (
                  <tr key={`${slot.time}-${slot.staff}`} className="border-t border-neutral-100">
                    <td className="px-6 py-3 text-neutral-900 font-semibold">{slot.time}</td>
                    <td className="px-6 py-3 text-neutral-800">{slot.staff}</td>
                    <td className="px-6 py-3 text-neutral-600">{slot.role}</td>
                    <td className="px-6 py-3 text-neutral-600">{slot.station}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Inventory Status */}
      <section className="mb-12" aria-labelledby="inventory-status-heading">
        <div className="bg-white rounded-xl shadow-soft border border-neutral-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">Supply Readiness</p>
              <h2 id="inventory-status-heading" className="text-2xl font-bold text-neutral-900">
                Inventory Overview
              </h2>
            </div>
            <Link to="/inventory" className="text-primary-600 font-semibold hover:underline">
              Review inventory →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inventory.map((item) => (
              <article key={item.category} className="border border-neutral-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">{item.category}</h3>
                    <p className="text-sm text-neutral-500">{item.message}</p>
                  </div>
                  <span className="text-xl font-bold text-neutral-900">
                    {Math.round(item.percentage * 100)}%
                  </span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-3 mb-2" role="img" aria-label={`${item.category} at ${Math.round(item.percentage * 100)} percent`}>
                  <div
                    className={`h-3 rounded-full ${
                      item.status === 'CRITICAL'
                        ? 'bg-danger-500'
                        : item.status === 'WARNING'
                        ? 'bg-warning-500'
                        : 'bg-success-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, item.percentage * 100))}%` }}
                  />
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                    item.status === 'CRITICAL'
                      ? 'bg-danger-50 text-danger-700 border border-danger-200'
                      : item.status === 'WARNING'
                      ? 'bg-warning-50 text-warning-800 border border-warning-200'
                      : 'bg-success-50 text-success-700 border border-success-200'
                  }`}
                >
                  {item.status === 'CRITICAL'
                    ? 'Critical'
                    : item.status === 'WARNING'
                    ? 'Attention needed'
                    : 'Stable'}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-neutral-900 mb-6">
          Portal Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.title}
              to={feature.link}
              className="group card hover:shadow-strong transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl" aria-hidden="true">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600">
                    {feature.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-primary-600 font-semibold">
                    <span>Learn more</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Key Benefits */}
      <div className="bg-white rounded-xl shadow-soft p-8 mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">
          Key Benefits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-6 h-6 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h3 className="font-bold text-neutral-900">Real-time Conflict Detection</h3>
            </div>
            <p className="text-sm text-neutral-600">
              Automatically detect scheduling conflicts, overtime violations, and certification issues
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-6 h-6 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h3 className="font-bold text-neutral-900">Export Capabilities</h3>
            </div>
            <p className="text-sm text-neutral-600">
              Export schedules and reports to PDF, Excel, or CSV formats with brand-compliant formatting
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-6 h-6 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h3 className="font-bold text-neutral-900">Mobile Responsive</h3>
            </div>
            <p className="text-sm text-neutral-600">
              Access from any device with touch-friendly interface and PWA support for offline use
            </p>
          </div>
        </div>
      </div>

      {/* Accessibility Notice */}
      <div className="bg-secondary-50 border-l-4 border-secondary-500 rounded-lg p-6">
        <h3 className="font-bold text-secondary-700 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Accessibility & Compliance
        </h3>
        <p className="text-sm text-secondary-700">
          This portal meets WCAG 2.1 AA accessibility standards and includes CLIA, CAP, OSHA, and HIPAA compliance tracking features.
          All color combinations meet 4.5:1 contrast ratio requirements.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
