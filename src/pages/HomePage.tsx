import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
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
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl shadow-strong p-8 md:p-12 mb-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to Largo Laboratory Portal
          </h1>
          <p className="text-xl md:text-2xl opacity-95 mb-6">
            Production-ready healthcare laboratory management system for phlebotomy staff scheduling and operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/schedule"
              className="btn bg-white text-primary-700 hover:bg-neutral-100 font-bold text-lg px-8 py-3"
            >
              Create Schedule
            </Link>
            <Link
              to="/dashboard"
              className="btn bg-primary-600 text-white hover:bg-primary-800 font-bold text-lg px-8 py-3 border-2 border-white"
            >
              Manager Dashboard
            </Link>
          </div>
        </div>
      </div>

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
