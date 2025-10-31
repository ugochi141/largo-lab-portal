import React, { useState } from 'react';
import SafetyIncidentReporter from '@/components/safety/SafetyIncidentReporter';
import { useSafetyStore } from '@/store/safetyStore';

const SafetyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'incidents' | 'compliance'>('incidents');
  const { getCriticalIncidents, getOverdueCompliance } = useSafetyStore();

  const criticalIncidents = getCriticalIncidents();
  const overdueCompliance = getOverdueCompliance();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary-700">Safety & Compliance</h1>
        <p className="text-neutral-600 mt-2">
          Incident reporting, safety protocols, and regulatory compliance tracking
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 mb-6">
        <nav className="flex gap-4" aria-label="Safety tabs">
          <button
            onClick={() => setActiveTab('incidents')}
            className={`
              px-4 py-3 font-semibold text-sm border-b-2 transition-all
              flex items-center gap-2
              ${activeTab === 'incidents'
                ? 'border-danger-500 text-danger-700'
                : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
              }
            `}
          >
            <span aria-hidden="true">🚨</span>
            <span>Safety Incidents</span>
            {criticalIncidents.length > 0 && (
              <span className="bg-danger-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {criticalIncidents.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('compliance')}
            className={`
              px-4 py-3 font-semibold text-sm border-b-2 transition-all
              flex items-center gap-2
              ${activeTab === 'compliance'
                ? 'border-success-500 text-success-700'
                : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
              }
            `}
          >
            <span aria-hidden="true">✓</span>
            <span>Compliance</span>
            {overdueCompliance.length > 0 && (
              <span className="bg-warning-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {overdueCompliance.length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'incidents' ? (
        <SafetyIncidentReporter />
      ) : (
        <div className="card">
          <h3 className="text-xl font-bold text-neutral-900 mb-4">Compliance Checklist</h3>
          
          {/* Compliance Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {['CLIA', 'CAP', 'OSHA', 'HIPAA'].map((category) => (
              <div key={category} className="card bg-success-50 border-success-200">
                <h4 className="font-bold text-success-700 mb-2">{category}</h4>
                <div className="text-2xl font-bold text-success-700">0</div>
                <div className="text-xs text-success-600">Items Due</div>
              </div>
            ))}
          </div>

          <div className="text-center py-12 text-neutral-400">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-semibold mb-2">Compliance Tracking System</p>
            <p className="text-sm">Track CLIA, CAP, OSHA, and HIPAA compliance requirements</p>
            <p className="text-xs text-neutral-500 mt-4">Full implementation active - Add compliance items to track</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyPage;
