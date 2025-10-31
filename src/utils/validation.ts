import type {
  ScheduleEntry,
  ScheduleConflict,
  Staff,
  TimeSlot,
} from '@/types';

/**
 * Validate if a time string is in HH:mm format
 */
export const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(time);
};

/**
 * Parse time string to minutes since midnight
 */
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Convert minutes since midnight to time string
 */
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/**
 * Check if two time slots overlap
 */
export const doTimeSlotsOverlap = (
  slot1: { startTime: string; endTime: string },
  slot2: { startTime: string; endTime: string }
): boolean => {
  const start1 = timeToMinutes(slot1.startTime);
  const end1 = timeToMinutes(slot1.endTime);
  const start2 = timeToMinutes(slot2.startTime);
  const end2 = timeToMinutes(slot2.endTime);

  return start1 < end2 && start2 < end1;
};

/**
 * Validate schedule entry for conflicts
 */
export const validateScheduleEntry = (
  entry: ScheduleEntry,
  allEntries: ScheduleEntry[],
  staff: Staff[],
  timeSlots: TimeSlot[]
): ScheduleConflict[] => {
  const conflicts: ScheduleConflict[] = [];
  const staffMember = staff.find((s) => s.id === entry.staffId);
  const timeSlot = timeSlots.find((t) => t.id === entry.timeSlotId);

  if (!staffMember) {
    conflicts.push({
      type: 'DOUBLE_BOOKING',
      staffId: entry.staffId,
      timeSlotId: entry.timeSlotId,
      message: 'Staff member not found',
      severity: 'ERROR',
    });
    return conflicts;
  }

  if (!timeSlot) {
    conflicts.push({
      type: 'DOUBLE_BOOKING',
      staffId: entry.staffId,
      timeSlotId: entry.timeSlotId,
      message: 'Time slot not found',
      severity: 'ERROR',
    });
    return conflicts;
  }

  // Check for double booking
  const overlappingEntries = allEntries.filter(
    (e) =>
      e.id !== entry.id &&
      e.staffId === entry.staffId &&
      e.date.getTime() === entry.date.getTime()
  );

  for (const otherEntry of overlappingEntries) {
    const otherTimeSlot = timeSlots.find((t) => t.id === otherEntry.timeSlotId);
    if (
      otherTimeSlot &&
      doTimeSlotsOverlap(
        { startTime: timeSlot.startTime, endTime: timeSlot.endTime },
        { startTime: otherTimeSlot.startTime, endTime: otherTimeSlot.endTime }
      )
    ) {
      conflicts.push({
        type: 'DOUBLE_BOOKING',
        staffId: entry.staffId,
        timeSlotId: entry.timeSlotId,
        message: `${staffMember.firstName} ${staffMember.lastName} is already scheduled during this time`,
        severity: 'ERROR',
      });
    }
  }

  // Check for certification expiration
  const expiredCerts = staffMember.certifications.filter(
    (cert) => new Date(cert.expirationDate) < new Date()
  );
  if (expiredCerts.length > 0) {
    conflicts.push({
      type: 'CERTIFICATION_EXPIRED',
      staffId: entry.staffId,
      timeSlotId: entry.timeSlotId,
      message: `${staffMember.firstName} ${staffMember.lastName} has ${expiredCerts.length} expired certification(s)`,
      severity: 'WARNING',
    });
  }

  // Check for overtime (more than 8 hours in a day)
  const dayEntries = allEntries.filter(
    (e) =>
      e.staffId === entry.staffId &&
      e.date.getTime() === entry.date.getTime() &&
      !e.isBreak
  );

  const totalMinutes = dayEntries.reduce((sum, e) => {
    const slot = timeSlots.find((t) => t.id === e.timeSlotId);
    if (!slot) return sum;
    const duration =
      timeToMinutes(slot.endTime) - timeToMinutes(slot.startTime);
    return sum + duration;
  }, 0);

  if (totalMinutes > 480) {
    // 8 hours = 480 minutes
    conflicts.push({
      type: 'OVERTIME',
      staffId: entry.staffId,
      timeSlotId: entry.timeSlotId,
      message: `${staffMember.firstName} ${staffMember.lastName} is scheduled for ${Math.round(totalMinutes / 60)} hours (overtime)`,
      severity: 'WARNING',
    });
  }

  // Check for break violations (no break after 4+ hours)
  const hasBreak = dayEntries.some((e) => e.isBreak);
  if (totalMinutes >= 240 && !hasBreak) {
    // 4 hours = 240 minutes
    conflicts.push({
      type: 'BREAK_VIOLATION',
      staffId: entry.staffId,
      timeSlotId: entry.timeSlotId,
      message: `${staffMember.firstName} ${staffMember.lastName} needs a break (scheduled for ${Math.round(totalMinutes / 60)}+ hours)`,
      severity: 'WARNING',
    });
  }

  return conflicts;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate date is not in the past
 */
export const isValidFutureDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

/**
 * Check if staff member is available at given time
 */
export const isStaffAvailable = (
  staff: Staff,
  date: Date,
  timeSlot: TimeSlot
): boolean => {
  const dayOfWeek = date.getDay();
  const availability = staff.availability.find(
    (a) => a.dayOfWeek === dayOfWeek
  );

  if (!availability) return false;

  const slotStart = timeToMinutes(timeSlot.startTime);
  const slotEnd = timeToMinutes(timeSlot.endTime);
  const availStart = timeToMinutes(availability.startTime);
  const availEnd = timeToMinutes(availability.endTime);

  return slotStart >= availStart && slotEnd <= availEnd;
};
