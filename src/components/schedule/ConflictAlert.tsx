import React from 'react';
import type { ScheduleConflict, Staff } from '@/types';

interface ConflictAlertProps {
  conflicts: ScheduleConflict[];
  staff: Staff[];
  onDismiss?: () => void;
}

const ConflictAlert: React.FC<ConflictAlertProps> = ({
  conflicts,
  staff,
  onDismiss,
}) => {
  if (conflicts.length === 0) return null;

  const getConflictIcon = (severity: 'ERROR' | 'WARNING' | 'INFO') => {
    switch (severity) {
      case 'ERROR':
        return (
          <svg className="w-5 h-5 text-danger-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'WARNING':
        return (
          <svg className="w-5 h-5 text-warning-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'INFO':
        return (
          <svg className="w-5 h-5 text-secondary-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getAlertStyle = (severity: 'ERROR' | 'WARNING' | 'INFO') => {
    switch (severity) {
      case 'ERROR':
        return 'bg-danger-50 border-danger-500';
      case 'WARNING':
        return 'bg-warning-50 border-warning-500';
      case 'INFO':
        return 'bg-secondary-50 border-secondary-500';
    }
  };

  // Group conflicts by severity
  const errors = conflicts.filter((c) => c.severity === 'ERROR');
  const warnings = conflicts.filter((c) => c.severity === 'WARNING');
  const infos = conflicts.filter((c) => c.severity === 'INFO');

  return (
    <div className="space-y-4" role="alert" aria-live="assertive">
      {/* Errors */}
      {errors.length > 0 && (
        <div className={`border-l-4 rounded-lg p-4 ${getAlertStyle('ERROR')}`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {getConflictIcon('ERROR')}
              <h3 className="font-bold text-danger-700">
                {errors.length} Critical Error{errors.length > 1 ? 's' : ''} Found
              </h3>
            </div>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-danger-700 hover:text-danger-900"
                aria-label="Dismiss errors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <ul className="space-y-2 text-sm text-danger-700">
            {errors.map((conflict, index) => {
              const staffMember = staff.find((s) => s.id === conflict.staffId);
              return (
                <li key={index} className="flex items-start gap-2">
                  <span className="font-semibold mt-0.5">•</span>
                  <div>
                    <span className="font-semibold">
                      {staffMember ? `${staffMember.firstName} ${staffMember.lastName}` : 'Unknown Staff'}:
                    </span>
                    {' '}{conflict.message}
                    <div className="text-xs mt-1 text-danger-600">
                      <strong>Action Required:</strong> Remove or reschedule this assignment
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className={`border-l-4 rounded-lg p-4 ${getAlertStyle('WARNING')}`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {getConflictIcon('WARNING')}
              <h3 className="font-bold text-warning-700">
                {warnings.length} Warning{warnings.length > 1 ? 's' : ''}
              </h3>
            </div>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-warning-700 hover:text-warning-900"
                aria-label="Dismiss warnings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <ul className="space-y-2 text-sm text-warning-700">
            {warnings.map((conflict, index) => {
              const staffMember = staff.find((s) => s.id === conflict.staffId);
              return (
                <li key={index} className="flex items-start gap-2">
                  <span className="font-semibold mt-0.5">•</span>
                  <div>
                    <span className="font-semibold">
                      {staffMember ? `${staffMember.firstName} ${staffMember.lastName}` : 'Unknown Staff'}:
                    </span>
                    {' '}{conflict.message}
                    <div className="text-xs mt-1 text-warning-600">
                      <strong>Recommendation:</strong> Review and address this issue when possible
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Info */}
      {infos.length > 0 && (
        <div className={`border-l-4 rounded-lg p-4 ${getAlertStyle('INFO')}`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {getConflictIcon('INFO')}
              <h3 className="font-bold text-secondary-700">
                {infos.length} Information Notice{infos.length > 1 ? 's' : ''}
              </h3>
            </div>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-secondary-700 hover:text-secondary-900"
                aria-label="Dismiss info"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <ul className="space-y-2 text-sm text-secondary-700">
            {infos.map((conflict, index) => {
              const staffMember = staff.find((s) => s.id === conflict.staffId);
              return (
                <li key={index} className="flex items-start gap-2">
                  <span className="font-semibold mt-0.5">•</span>
                  <div>
                    <span className="font-semibold">
                      {staffMember ? `${staffMember.firstName} ${staffMember.lastName}` : 'Unknown Staff'}:
                    </span>
                    {' '}{conflict.message}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Summary */}
      <div className="text-xs text-neutral-600 bg-neutral-100 p-3 rounded-lg">
        <strong>Conflict Summary:</strong> {errors.length} error(s), {warnings.length} warning(s), {infos.length} info
      </div>
    </div>
  );
};

export default ConflictAlert;
