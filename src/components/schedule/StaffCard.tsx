import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { differenceInDays } from 'date-fns';
import type { Staff } from '@/types';

interface StaffCardProps {
  staff: Staff;
  isDragging?: boolean;
}

const StaffCard: React.FC<StaffCardProps> = ({ staff, isDragging = false }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: staff.id,
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  // Check for expiring certifications (within 30 days)
  const expiringCerts = staff.certifications.filter((cert) => {
    const daysUntilExpiration = differenceInDays(
      new Date(cert.expirationDate),
      new Date()
    );
    return daysUntilExpiration > 0 && daysUntilExpiration <= 30;
  });

  const expiredCerts = staff.certifications.filter(
    (cert) => new Date(cert.expirationDate) < new Date()
  );

  // Get role color
  const getRoleColor = (role: string): string => {
    const roleColors: Record<string, string> = {
      'Lead Phlebotomist': 'bg-purple-500',
      'Senior Phlebotomist': 'bg-blue-500',
      'Phlebotomist': 'bg-green-500',
      'Phlebotomy Technician': 'bg-yellow-500',
      'Float Phlebotomist': 'bg-orange-500',
    };
    return roleColors[role] || 'bg-neutral-500';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white border-2 rounded-lg p-3 cursor-grab active:cursor-grabbing
        transition-all duration-200
        ${isDragging 
          ? 'border-primary-500 shadow-strong opacity-50 scale-95' 
          : 'border-neutral-200 shadow-sm hover:shadow-md hover:border-primary-300'
        }
      `}
      role="button"
      aria-label={`Drag ${staff.firstName} ${staff.lastName} to assign to time slot`}
      tabIndex={0}
    >
      {/* Staff Name */}
      <div className="mb-2">
        <h3 className="font-semibold text-neutral-900 text-sm">
          {staff.firstName} {staff.lastName}
        </h3>
        {staff.nickname && (
          <p className="text-xs text-neutral-500">({staff.nickname})</p>
        )}
      </div>

      {/* Role Badge */}
      <div className="mb-2">
        <span
          className={`
            inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold text-white
            ${getRoleColor(staff.role)}
          `}
        >
          {staff.role}
        </span>
      </div>

      {/* Certification Status */}
      {expiredCerts.length > 0 && (
        <div className="flex items-center gap-1 mb-1">
          <svg className="w-3 h-3 text-danger-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="text-xs text-danger-600 font-semibold">
            {expiredCerts.length} Expired Cert{expiredCerts.length > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {expiringCerts.length > 0 && expiredCerts.length === 0 && (
        <div className="flex items-center gap-1 mb-1">
          <svg className="w-3 h-3 text-warning-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-xs text-warning-600 font-semibold">
            Cert Expiring Soon
          </span>
        </div>
      )}

      {/* Availability Indicator */}
      <div className="flex items-center gap-1 text-xs text-neutral-600">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{staff.availability.length} availability slot{staff.availability.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Contact Info (Hidden but available for screen readers) */}
      <span className="sr-only">
        Email: {staff.email}, Phone: {staff.phone}
      </span>
    </div>
  );
};

export default StaffCard;
