// Core type definitions for Largo Lab Portal

export enum PhlebotomyRole {
  LEAD_PHLEBOTOMIST = 'Lead Phlebotomist',
  SENIOR_PHLEBOTOMIST = 'Senior Phlebotomist',
  PHLEBOTOMIST = 'Phlebotomist',
  PHLEBOTOMY_TECHNICIAN = 'Phlebotomy Technician',
  FLOAT_PHLEBOTOMIST = 'Float Phlebotomist',
}

export enum ShiftType {
  MORNING = 'Morning',
  AFTERNOON = 'Afternoon',
  EVENING = 'Evening',
  NIGHT = 'Night',
}

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  role: PhlebotomyRole;
  email: string;
  phone: string;
  certifications: Certification[];
  availability: Availability[];
  active: boolean;
  hireDate: Date;
}

export interface Certification {
  id: string;
  type: string;
  issueDate: Date;
  expirationDate: Date;
  issuingOrganization: string;
  certificateNumber: string;
}

export interface Availability {
  id: string;
  staffId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isRecurring: boolean;
  effectiveDate?: Date;
  endDate?: Date;
}

export interface TimeSlot {
  id: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  date: Date;
}

export interface ScheduleEntry {
  id: string;
  staffId: string;
  timeSlotId: string;
  date: Date;
  role: PhlebotomyRole;
  station?: string;
  notes?: string;
  isBreak?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Schedule {
  id: string;
  date: Date;
  entries: ScheduleEntry[];
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
}

export interface ScheduleConflict {
  type: 'DOUBLE_BOOKING' | 'OVERTIME' | 'BREAK_VIOLATION' | 'CERTIFICATION_EXPIRED';
  staffId: string;
  timeSlotId: string;
  message: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
}

export interface Meeting {
  id: string;
  type: 'ONE_ON_ONE' | 'STAFF' | 'SAFETY' | 'TRAINING';
  title: string;
  description?: string;
  scheduledDate: Date;
  duration: number; // minutes
  participants: string[]; // staff IDs
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  location?: string;
  notes?: string;
  actionItems: ActionItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ActionItem {
  id: string;
  meetingId: string;
  description: string;
  assignedTo: string; // staff ID
  dueDate: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  completedAt?: Date;
  notes?: string;
}

export interface SafetyIncident {
  id: string;
  type: 'NEEDLE_STICK' | 'CHEMICAL_SPILL' | 'EQUIPMENT_FAILURE' | 'OTHER';
  reportedBy: string; // staff ID
  reportedDate: Date;
  incidentDate: Date;
  location: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'REPORTED' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
  actionsTaken: string[];
  followUpRequired: boolean;
  followUpDate?: Date;
  involvedStaff: string[]; // staff IDs
  witnessStaff?: string[]; // staff IDs
  attachments?: string[];
  closedAt?: Date;
  closedBy?: string;
}

export interface ComplianceItem {
  id: string;
  category: 'CLIA' | 'CAP' | 'OSHA' | 'HIPAA' | 'INTERNAL';
  title: string;
  description: string;
  dueDate: Date;
  assignedTo: string; // staff ID
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  completedAt?: Date;
  verifiedBy?: string;
  verifiedAt?: Date;
  documents?: string[];
  notes?: string;
}

export interface StaffRounding {
  id: string;
  staffId: string;
  roundedBy: string; // manager staff ID
  date: Date;
  location: string;
  topics: string[];
  concerns?: string[];
  actionItems: ActionItem[];
  overallRating?: number; // 1-5
  notes?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
}

export interface PerformanceMetric {
  id: string;
  staffId: string;
  metricType: 'PRODUCTIVITY' | 'QUALITY' | 'SAFETY' | 'ATTENDANCE';
  value: number;
  unit: string;
  date: Date;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  notes?: string;
}

export interface ExportOptions {
  format: 'PDF' | 'EXCEL' | 'CSV';
  dateRange?: {
    start: Date;
    end: Date;
  };
  includeNotes?: boolean;
  includeMetrics?: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  inApp: boolean;
  meetingReminders: boolean;
  scheduleChanges: boolean;
  safetyAlerts: boolean;
  complianceDeadlines: boolean;
}

export interface UserSettings {
  id: string;
  staffId: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationPreferences;
  defaultView: 'schedule' | 'dashboard' | 'safety';
  timezone: string;
  language: string;
}

export interface DashboardStats {
  staffOnDuty: number;
  pendingOrders: number;
  qcTasksDue: number;
  complianceRate: number;
}

export interface SchedulePreviewEntry {
  time: string;
  staff: string;
  role: string;
  station: string;
}

export type InventoryStatus = 'OK' | 'WARNING' | 'CRITICAL';

export interface InventoryLevel {
  category: string;
  percentage: number;
  status: InventoryStatus;
  message: string;
}

export interface AlertMessage {
  id: string;
  title: string;
  description: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface DashboardPayload {
  stats: DashboardStats;
  schedulePreview: SchedulePreviewEntry[];
  inventory: InventoryLevel[];
  alerts: AlertMessage[];
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  location: string;
  currentStock: number;
  parLevel: number;
  unit: string;
  status: InventoryStatus;
  vendor?: string;
  catalogNumber?: string;
  lotNumber?: string;
  expirationDate?: string;
  unitPrice?: number;
}

export interface InventoryDataset {
  items: InventoryItem[];
  categories: string[];
  locations: string[];
  updatedAt: string;
}

export interface TrainingRequirement {
  id: string;
  title: string;
  assignedTo: string; // staff ID
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  dueDate: Date;
  competencyArea: string;
  lastCompleted?: Date;
}

// Utility types
export type StaffWithSchedule = Staff & {
  schedule: ScheduleEntry[];
  conflicts: ScheduleConflict[];
};

export type MeetingWithParticipants = Meeting & {
  participantDetails: Staff[];
};

export type SafetyIncidentWithStaff = SafetyIncident & {
  reporterDetails: Staff;
  involvedStaffDetails: Staff[];
};

// Production Schedule Data Types (from Daily Schedule.html)
export interface ProductionPhlebStaff {
  name: string;
  nickname: string;
  role?: string;
  assignment?: string;
  shift: string;
  breaks: string;
  startTime: number;
  notes?: string;
}

export interface ProductionLabStaff {
  name: string;
  nickname: string;
  dept?: string;
  role?: string;
  assignment: string;
  shift: string;
  breaks: string;
  startTime: number;
  notes?: string;
}

export interface ProductionDaySchedule {
  phleb: ProductionPhlebStaff[];
  lab: ProductionLabStaff[];
}

export interface ProductionScheduleData {
  [date: string]: ProductionDaySchedule;
}
