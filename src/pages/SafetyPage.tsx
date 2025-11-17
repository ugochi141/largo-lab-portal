import React, { useMemo, useState } from 'react';
import SafetyIncidentReporter from '@/components/safety/SafetyIncidentReporter';
import { useSafetyStore } from '@/store/safetyStore';
import { format } from 'date-fns';

const SafetyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'incidents' | 'compliance'>('incidents');
  const { getCriticalIncidents, getOverdueCompliance } = useSafetyStore();
  const complianceItems = useSafetyStore((state) => state.complianceItems);
  const completeComplianceItem = useSafetyStore((state) => state.completeComplianceItem);

  const criticalIncidents = getCriticalIncidents();
  const overdueCompliance = getOverdueCompliance();
  const complianceStats = useMemo(() => {
    const categories: Array<'CLIA' | 'CAP' | 'OSHA' | 'HIPAA'> = ['CLIA', 'CAP', 'OSHA', 'HIPAA'];
    return categories.map((category) => {
      const items = complianceItems.filter((item) => item.category === category);
      const open = items.filter((item) => item.status !== 'COMPLETED');
      return { category, total: items.length, open: open.length };
    });
  }, [complianceItems]);

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
        <section className="card">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-neutral-900">Compliance Checklist</h3>
              <p className="text-sm text-neutral-500">
                Monitor CLIA, CAP, OSHA, and HIPAA requirements with due-date tracking.
              </p>
            </div>
          </div>
          
          {/* Compliance Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {complianceStats.map((stat) => (
              <div key={stat.category} className="border rounded-xl p-4 bg-success-50 border-success-100">
                <p className="text-xs uppercase tracking-widest text-success-600 font-semibold">{stat.category}</p>
                <p className="text-3xl font-bold text-success-800">{stat.open}</p>
                <p className="text-xs text-success-600">Open of {stat.total} tracked items</p>
              </div>
            ))}
          </div>

          {complianceItems.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <p>No compliance tasks assigned.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-neutral-50 text-neutral-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Item</th>
                    <th className="px-4 py-3 text-left font-semibold">Category</th>
                    <th className="px-4 py-3 text-left font-semibold">Due Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complianceItems
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .map((item) => {
                      const overdue = item.status !== 'COMPLETED' && new Date(item.dueDate) < new Date();
                      return (
                        <tr key={item.id} className="border-t border-neutral-100">
                          <td className="px-4 py-3">
                            <p className="font-semibold text-neutral-900">{item.title}</p>
                            <p className="text-xs text-neutral-500">{item.description}</p>
                          </td>
                          <td className="px-4 py-3">{item.category}</td>
                          <td className="px-4 py-3">
                            {format(new Date(item.dueDate), 'MMM dd, yyyy')}
                            {overdue && <span className="ml-2 text-xs text-danger-600 font-semibold">Overdue</span>}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                item.status === 'COMPLETED'
                                  ? 'bg-success-50 text-success-700 border border-success-200'
                                  : item.status === 'IN_PROGRESS'
                                  ? 'bg-warning-50 text-warning-800 border border-warning-200'
                                  : item.status === 'OVERDUE'
                                  ? 'bg-danger-50 text-danger-700 border border-danger-200'
                                  : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                              }`}
                            >
                              {item.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {item.status !== 'COMPLETED' ? (
                              <button
                                className="btn btn-sm bg-success-100 text-success-800 hover:bg-success-200"
                                onClick={() => completeComplianceItem(item.id, 'Manager')}
                              >
                                Mark Complete
                              </button>
                            ) : (
                              <span className="text-xs text-neutral-500">
                                Verified {item.verifiedAt ? format(new Date(item.verifiedAt), 'MMM dd') : ''}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default SafetyPage;
