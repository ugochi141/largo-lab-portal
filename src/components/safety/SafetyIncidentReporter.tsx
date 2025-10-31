import React, { useState } from 'react';
import { format } from 'date-fns';
import { useSafetyStore } from '@/store/safetyStore';
import { useStaffStore } from '@/store/staffStore';
import type { SafetyIncident } from '@/types';

const SafetyIncidentReporter: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'NEEDLE_STICK' as SafetyIncident['type'],
    incidentDate: format(new Date(), 'yyyy-MM-dd'),
    incidentTime: format(new Date(), 'HH:mm'),
    location: '',
    description: '',
    severity: 'MEDIUM' as SafetyIncident['severity'],
    involvedStaff: [] as string[],
    witnessStaff: [] as string[],
    actionsTaken: '',
  });

  const { incidents, addIncident, getCriticalIncidents, getOpenIncidents } = useSafetyStore();
  const { staff } = useStaffStore();

  const currentUser = staff[0]; // In production, get from auth context

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const incidentDateTime = new Date(`${formData.incidentDate}T${formData.incidentTime}`);

    const newIncident: SafetyIncident = {
      id: `incident-${Date.now()}`,
      type: formData.type,
      reportedBy: currentUser?.id || 'unknown',
      reportedDate: new Date(),
      incidentDate: incidentDateTime,
      location: formData.location,
      description: formData.description,
      severity: formData.severity,
      status: 'REPORTED',
      actionsTaken: formData.actionsTaken.split('\n').filter((a) => a.trim()),
      followUpRequired: formData.severity === 'HIGH' || formData.severity === 'CRITICAL',
      involvedStaff: formData.involvedStaff,
      witnessStaff: formData.witnessStaff.length > 0 ? formData.witnessStaff : undefined,
    };

    addIncident(newIncident);
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: 'NEEDLE_STICK',
      incidentDate: format(new Date(), 'yyyy-MM-dd'),
      incidentTime: format(new Date(), 'HH:mm'),
      location: '',
      description: '',
      severity: 'MEDIUM',
      involvedStaff: [],
      witnessStaff: [],
      actionsTaken: '',
    });
  };

  const getSeverityColor = (severity: SafetyIncident['severity']) => {
    const colors = {
      LOW: 'bg-neutral-100 text-neutral-700 border-neutral-300',
      MEDIUM: 'bg-warning-100 text-warning-700 border-warning-300',
      HIGH: 'bg-danger-100 text-danger-700 border-danger-300',
      CRITICAL: 'bg-danger-200 text-danger-900 border-danger-500',
    };
    return colors[severity];
  };

  const criticalIncidents = getCriticalIncidents();
  const openIncidents = getOpenIncidents();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Safety Incident Reporter</h2>
          <p className="text-neutral-600 mt-1">
            Report and track safety incidents for regulatory compliance
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-danger flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Report Incident
        </button>
      </div>

      {/* Critical Alerts */}
      {criticalIncidents.length > 0 && (
        <div className="bg-danger-50 border-2 border-danger-500 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-6 h-6 text-danger-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <h3 className="font-bold text-danger-700">
              {criticalIncidents.length} Critical Incident(s) Require Immediate Attention
            </h3>
          </div>
          <p className="text-sm text-danger-600">
            Review and address critical incidents immediately to ensure staff safety and regulatory compliance.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-danger-50 border-danger-200">
          <div className="text-3xl font-bold text-danger-700">{criticalIncidents.length}</div>
          <div className="text-sm text-danger-600 font-semibold">Critical</div>
        </div>
        
        <div className="card bg-warning-50 border-warning-200">
          <div className="text-3xl font-bold text-warning-700">{openIncidents.length}</div>
          <div className="text-sm text-warning-600 font-semibold">Open</div>
        </div>
        
        <div className="card bg-secondary-50 border-secondary-200">
          <div className="text-3xl font-bold text-secondary-700">
            {incidents.filter((i) => i.status === 'INVESTIGATING').length}
          </div>
          <div className="text-sm text-secondary-600 font-semibold">Investigating</div>
        </div>
        
        <div className="card bg-success-50 border-success-200">
          <div className="text-3xl font-bold text-success-700">
            {incidents.filter((i) => i.status === 'RESOLVED').length}
          </div>
          <div className="text-sm text-success-600 font-semibold">Resolved</div>
        </div>
      </div>

      {/* Report Form */}
      {showForm && (
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-neutral-900">Report Safety Incident</h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Incident Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as SafetyIncident['type'] })
                  }
                  className="form-select"
                  required
                >
                  <option value="NEEDLE_STICK">Needle Stick</option>
                  <option value="CHEMICAL_SPILL">Chemical Spill</option>
                  <option value="EQUIPMENT_FAILURE">Equipment Failure</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="form-label">Severity *</label>
                <select
                  value={formData.severity}
                  onChange={(e) =>
                    setFormData({ ...formData, severity: e.target.value as SafetyIncident['severity'] })
                  }
                  className="form-select"
                  required
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div>
                <label className="form-label">Incident Date *</label>
                <input
                  type="date"
                  value={formData.incidentDate}
                  onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Incident Time *</label>
                <input
                  type="time"
                  value={formData.incidentTime}
                  onChange={(e) => setFormData({ ...formData, incidentTime: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="form-label">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="form-input"
                  placeholder="e.g., Lab Room 101, Phlebotomy Station 3"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="form-label">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                  rows={4}
                  placeholder="Detailed description of the incident..."
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="form-label">Actions Taken</label>
                <textarea
                  value={formData.actionsTaken}
                  onChange={(e) => setFormData({ ...formData, actionsTaken: e.target.value })}
                  className="form-textarea"
                  rows={3}
                  placeholder="List actions taken (one per line)..."
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn btn-danger">
                Submit Report
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn bg-neutral-300 hover:bg-neutral-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recent Incidents */}
      <div className="card">
        <h3 className="text-xl font-bold text-neutral-900 mb-4">Recent Incidents</h3>

        {incidents.length === 0 ? (
          <div className="text-center py-12 text-neutral-400">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-semibold mb-2">No Incidents Reported</p>
            <p className="text-sm">Click "Report Incident" to submit a safety incident report</p>
          </div>
        ) : (
          <div className="space-y-4">
            {incidents.slice(0, 10).map((incident) => {
              const reporter = staff.find((s) => s.id === incident.reportedBy);
              
              return (
                <div
                  key={incident.id}
                  className={`p-4 rounded-lg border-2 ${getSeverityColor(incident.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-lg">{incident.type.replace('_', ' ')}</h4>
                        <span className={`text-xs font-semibold px-2 py-1 rounded border ${getSeverityColor(incident.severity)}`}>
                          {incident.severity}
                        </span>
                        <span className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded font-semibold">
                          {incident.status}
                        </span>
                      </div>

                      <p className="text-sm text-neutral-700 mb-3">{incident.description}</p>

                      <div className="flex flex-wrap gap-4 text-xs text-neutral-600">
                        <div>
                          <strong>Date:</strong> {format(new Date(incident.incidentDate), 'MMM dd, yyyy h:mm a')}
                        </div>
                        <div>
                          <strong>Location:</strong> {incident.location}
                        </div>
                        <div>
                          <strong>Reported by:</strong>{' '}
                          {reporter ? `${reporter.firstName} ${reporter.lastName}` : 'Unknown'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SafetyIncidentReporter;
