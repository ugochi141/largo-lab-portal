import React, { useState } from 'react';
import { useStaffStore } from '@/store/staffStore';
import { useTrainingStore } from '@/store/trainingStore';
import { PhlebotomyRole } from '@/types';
import { format, differenceInDays } from 'date-fns';

const StaffPage: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | PhlebotomyRole>('ALL');
  const [search, setSearch] = useState('');
  const { staff } = useStaffStore();
  const { requirements, updateStatus } = useTrainingStore((state) => ({
    requirements: state.requirements,
    updateStatus: state.updateStatus,
  }));

  const filteredStaff = staff.filter((s) => {
    const matchesRole = filter === 'ALL' || s.role === filter;
    const query = `${s.firstName} ${s.lastName}`.toLowerCase();
    const matchesSearch = !search || query.includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getRoleColor = (role: PhlebotomyRole) => {
    const colors: Record<PhlebotomyRole, string> = {
      [PhlebotomyRole.LEAD_PHLEBOTOMIST]: 'bg-purple-100 text-purple-700 border-purple-300',
      [PhlebotomyRole.SENIOR_PHLEBOTOMIST]: 'bg-blue-100 text-blue-700 border-blue-300',
      [PhlebotomyRole.PHLEBOTOMIST]: 'bg-green-100 text-green-700 border-green-300',
      [PhlebotomyRole.PHLEBOTOMY_TECHNICIAN]: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      [PhlebotomyRole.FLOAT_PHLEBOTOMIST]: 'bg-orange-100 text-orange-700 border-orange-300',
    };
    return colors[role];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary-700">Staff Management</h1>
          <p className="text-neutral-600 mt-2">
            Manage staff profiles, certifications, and availability
          </p>
        </div>
        <button
          onClick={() => alert('Add staff form coming soon')}
          className="btn btn-primary flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Staff Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="card bg-primary-50 border-primary-200">
          <div className="text-2xl font-bold text-primary-700">{staff.length}</div>
          <div className="text-sm text-primary-600">Total Staff</div>
        </div>
        
        {Object.values(PhlebotomyRole).map((role) => (
          <div key={role} className="card bg-neutral-50 border-neutral-200">
            <div className="text-2xl font-bold text-neutral-700">
              {staff.filter((s) => s.role === role).length}
            </div>
            <div className="text-xs text-neutral-600">{role.replace('Phlebotomist', 'Phleb.')}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              filter === 'ALL'
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-300'
            }`}
          >
            All Staff
          </button>
          
          {Object.values(PhlebotomyRole).map((role) => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                filter === role
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-300'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <label className="flex-1 lg:max-w-xs">
          <span className="sr-only">Search staff</span>
          <input
            type="search"
            placeholder="Search by name or nickname"
            className="form-input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </div>

      {/* Staff List */}
      {filteredStaff.length === 0 ? (
        <div className="card text-center py-12 text-neutral-400">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="text-lg font-semibold mb-2">No Staff Members</p>
          <p className="text-sm">Click "Add Staff Member" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((staffMember) => {
            // Check for expiring certifications
            const expiringCerts = staffMember.certifications.filter((cert) => {
              const daysUntilExpiration = differenceInDays(
                new Date(cert.expirationDate),
                new Date()
              );
              return daysUntilExpiration > 0 && daysUntilExpiration <= 30;
            });

            const expiredCerts = staffMember.certifications.filter(
              (cert) => new Date(cert.expirationDate) < new Date()
            );

            return (
              <div key={staffMember.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-neutral-900">
                      {staffMember.firstName} {staffMember.lastName}
                    </h3>
                    {staffMember.nickname && (
                      <p className="text-sm text-neutral-500">({staffMember.nickname})</p>
                    )}
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleColor(staffMember.role)}`}>
                    {staffMember.role}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-neutral-600 mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{staffMember.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{staffMember.phone}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Hired: {format(new Date(staffMember.hireDate), 'MMM dd, yyyy')}</span>
                  </div>
                </div>

                {/* Certification Status */}
                <div className="pt-4 border-t border-neutral-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Certifications:</span>
                    <span className="font-semibold text-neutral-900">
                      {staffMember.certifications.length}
                    </span>
                  </div>

                  {expiredCerts.length > 0 && (
                    <div className="mt-2 bg-danger-50 text-danger-700 text-xs px-2 py-1 rounded flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {expiredCerts.length} expired
                    </div>
                  )}

                  {expiringCerts.length > 0 && expiredCerts.length === 0 && (
                    <div className="mt-2 bg-warning-50 text-warning-700 text-xs px-2 py-1 rounded flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {expiringCerts.length} expiring soon
                    </div>
                  )}

                  <div className="mt-2 text-xs text-neutral-600">
                    Availability: {staffMember.availability.length} slot(s)
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex-1 btn btn-sm bg-primary-100 text-primary-700 hover:bg-primary-200">
                    View Profile
                  </button>
                  <button className="btn btn-sm bg-neutral-100 text-neutral-700 hover:bg-neutral-200">
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Training Tracker */}
      <section className="card mt-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Training & Competency Tracker</h2>
            <p className="text-sm text-neutral-500">
              Monitor CLIA, CAP, and safety competencies across the team.
            </p>
          </div>
        </div>

        {requirements.length === 0 ? (
          <div className="text-center py-8 text-neutral-400">
            <p>No training assignments yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-50 text-neutral-600">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Training</th>
                  <th className="px-4 py-3 text-left font-semibold">Assigned To</th>
                  <th className="px-4 py-3 text-left font-semibold">Due Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {requirements.map((req) => {
                  const staffMember = staff.find((s) => s.id === req.assignedTo);
                  const overdue = req.status !== 'COMPLETED' && new Date(req.dueDate) < new Date();
                  return (
                    <tr key={req.id} className="border-t border-neutral-100">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-neutral-900">{req.title}</p>
                        <p className="text-xs text-neutral-500">{req.competencyArea}</p>
                      </td>
                      <td className="px-4 py-3">{staffMember ? `${staffMember.firstName} ${staffMember.lastName}` : '—'}</td>
                      <td className="px-4 py-3">
                        {format(new Date(req.dueDate), 'MMM dd, yyyy')}
                        {overdue && <span className="ml-2 text-xs text-danger-600 font-semibold">Overdue</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            req.status === 'COMPLETED'
                              ? 'bg-success-50 text-success-700 border border-success-200'
                              : req.status === 'IN_PROGRESS'
                              ? 'bg-warning-50 text-warning-800 border border-warning-200'
                              : req.status === 'OVERDUE'
                              ? 'bg-danger-50 text-danger-700 border border-danger-200'
                              : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                          }`}
                        >
                          {req.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {req.status !== 'COMPLETED' ? (
                          <button
                            className="btn btn-sm bg-success-100 text-success-800 hover:bg-success-200"
                            onClick={() => updateStatus(req.id, 'COMPLETED')}
                          >
                            Mark Complete
                          </button>
                        ) : (
                          <span className="text-xs text-neutral-500">
                            Completed {req.lastCompleted ? format(new Date(req.lastCompleted), 'MMM dd') : ''}
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
    </div>
  );
};

export default StaffPage;
