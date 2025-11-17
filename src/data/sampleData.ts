// Sample data for demonstration and testing
import { PhlebotomyRole } from '@/types';
import type { Staff, Meeting, SafetyIncident, ComplianceItem, TrainingRequirement } from '@/types';

export const sampleStaff: Staff[] = [
  {
    id: 'staff-1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    nickname: 'SJ',
    role: PhlebotomyRole.LEAD_PHLEBOTOMIST,
    email: 'sarah.johnson@example.com',
    phone: '(555) 123-4567',
    certifications: [
      {
        id: 'cert-1',
        type: 'Phlebotomy Technician (CPT)',
        issueDate: new Date('2020-01-15'),
        expirationDate: new Date('2025-01-15'),
        issuingOrganization: 'American Society for Clinical Pathology',
        certificateNumber: 'CPT-12345',
      },
      {
        id: 'cert-2',
        type: 'Basic Life Support (BLS)',
        issueDate: new Date('2023-06-01'),
        expirationDate: new Date('2025-06-01'),
        issuingOrganization: 'American Heart Association',
        certificateNumber: 'BLS-67890',
      },
    ],
    availability: [
      {
        id: 'avail-1',
        staffId: 'staff-1',
        dayOfWeek: 1, // Monday
        startTime: '07:00',
        endTime: '15:30',
        isRecurring: true,
      },
      {
        id: 'avail-2',
        staffId: 'staff-1',
        dayOfWeek: 2, // Tuesday
        startTime: '07:00',
        endTime: '15:30',
        isRecurring: true,
      },
      {
        id: 'avail-3',
        staffId: 'staff-1',
        dayOfWeek: 3, // Wednesday
        startTime: '07:00',
        endTime: '15:30',
        isRecurring: true,
      },
    ],
    active: true,
    hireDate: new Date('2018-03-15'),
  },
  {
    id: 'staff-2',
    firstName: 'Michael',
    lastName: 'Chen',
    role: PhlebotomyRole.SENIOR_PHLEBOTOMIST,
    email: 'michael.chen@example.com',
    phone: '(555) 234-5678',
    certifications: [
      {
        id: 'cert-3',
        type: 'Phlebotomy Technician (CPT)',
        issueDate: new Date('2019-08-20'),
        expirationDate: new Date('2025-08-20'),
        issuingOrganization: 'American Society for Clinical Pathology',
        certificateNumber: 'CPT-23456',
      },
    ],
    availability: [
      {
        id: 'avail-4',
        staffId: 'staff-2',
        dayOfWeek: 1,
        startTime: '08:00',
        endTime: '16:30',
        isRecurring: true,
      },
    ],
    active: true,
    hireDate: new Date('2019-07-01'),
  },
  {
    id: 'staff-3',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    nickname: 'Em',
    role: PhlebotomyRole.PHLEBOTOMIST,
    email: 'emily.rodriguez@example.com',
    phone: '(555) 345-6789',
    certifications: [
      {
        id: 'cert-4',
        type: 'Phlebotomy Technician (CPT)',
        issueDate: new Date('2021-02-10'),
        expirationDate: new Date('2026-02-10'),
        issuingOrganization: 'American Society for Clinical Pathology',
        certificateNumber: 'CPT-34567',
      },
    ],
    availability: [
      {
        id: 'avail-5',
        staffId: 'staff-3',
        dayOfWeek: 2,
        startTime: '09:00',
        endTime: '17:30',
        isRecurring: true,
      },
    ],
    active: true,
    hireDate: new Date('2021-01-15'),
  },
  {
    id: 'staff-4',
    firstName: 'David',
    lastName: 'Thompson',
    role: PhlebotomyRole.PHLEBOTOMY_TECHNICIAN,
    email: 'david.thompson@example.com',
    phone: '(555) 456-7890',
    certifications: [
      {
        id: 'cert-5',
        type: 'Phlebotomy Technician (CPT)',
        issueDate: new Date('2022-05-15'),
        expirationDate: new Date('2024-12-31'), // Expiring soon!
        issuingOrganization: 'American Society for Clinical Pathology',
        certificateNumber: 'CPT-45678',
      },
    ],
    availability: [],
    active: true,
    hireDate: new Date('2022-04-01'),
  },
  {
    id: 'staff-5',
    firstName: 'Lisa',
    lastName: 'Martinez',
    role: PhlebotomyRole.FLOAT_PHLEBOTOMIST,
    email: 'lisa.martinez@example.com',
    phone: '(555) 567-8901',
    certifications: [
      {
        id: 'cert-6',
        type: 'Phlebotomy Technician (CPT)',
        issueDate: new Date('2020-09-01'),
        expirationDate: new Date('2025-09-01'),
        issuingOrganization: 'American Society for Clinical Pathology',
        certificateNumber: 'CPT-56789',
      },
    ],
    availability: [],
    active: true,
    hireDate: new Date('2020-08-15'),
  },
];

export const sampleMeetings: Meeting[] = [
  {
    id: 'meeting-1',
    type: 'ONE_ON_ONE',
    title: 'Q1 Performance Review - Sarah Johnson',
    description: 'Quarterly performance review and goal setting',
    scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    duration: 30,
    participants: ['staff-1'],
    status: 'SCHEDULED',
    location: 'Manager Office',
    actionItems: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'meeting-2',
    type: 'STAFF',
    title: 'Monthly Staff Meeting',
    description: 'Review monthly metrics and discuss upcoming initiatives',
    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    duration: 60,
    participants: ['staff-1', 'staff-2', 'staff-3', 'staff-4', 'staff-5'],
    status: 'SCHEDULED',
    location: 'Conference Room A',
    actionItems: [
      {
        id: 'action-1',
        meetingId: 'meeting-2',
        description: 'Review new phlebotomy protocols',
        assignedTo: 'staff-1',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'PENDING',
        priority: 'HIGH',
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'meeting-3',
    type: 'SAFETY',
    title: 'Safety Training - Needle Stick Prevention',
    description: 'Annual mandatory safety training session',
    scheduledDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    duration: 90,
    participants: ['staff-1', 'staff-2', 'staff-3', 'staff-4', 'staff-5'],
    status: 'SCHEDULED',
    location: 'Training Room',
    actionItems: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const sampleIncidents: SafetyIncident[] = [
  {
    id: 'incident-1',
    type: 'NEEDLE_STICK',
    reportedBy: 'staff-3',
    reportedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    incidentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    location: 'Phlebotomy Station 2',
    description: 'Accidental needle stick during specimen collection. Safety protocol followed immediately.',
    severity: 'MEDIUM',
    status: 'INVESTIGATING',
    actionsTaken: [
      'Immediate washing with soap and water',
      'Incident reported to supervisor',
      'Employee health contacted',
      'Post-exposure prophylaxis initiated',
    ],
    followUpRequired: true,
    followUpDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    involvedStaff: ['staff-3'],
    witnessStaff: ['staff-2'],
  },
  {
    id: 'incident-2',
    type: 'EQUIPMENT_FAILURE',
    reportedBy: 'staff-1',
    reportedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    incidentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    location: 'Lab Room 101',
    description: 'Centrifuge malfunction - unusual noise and vibration. Unit immediately shut down.',
    severity: 'LOW',
    status: 'RESOLVED',
    actionsTaken: [
      'Equipment shut down immediately',
      'Biomedical engineering contacted',
      'Backup centrifuge utilized',
      'Equipment repaired and tested',
    ],
    followUpRequired: false,
    involvedStaff: ['staff-1'],
    closedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    closedBy: 'staff-1',
  },
];

export const sampleComplianceItems: ComplianceItem[] = [
  {
    id: 'comp-1',
    category: 'CLIA',
    title: 'Annual CLIA Validation',
    description: 'Complete annual CLIA competency review and documentation.',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    assignedTo: 'staff-1',
    status: 'IN_PROGRESS',
    documents: ['CLIA-2024.pdf'],
  },
  {
    id: 'comp-2',
    category: 'CAP',
    title: 'CAP Instrument Calibration',
    description: 'Document calibration evidence for Sysmex XN-2000.',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    assignedTo: 'staff-2',
    status: 'OVERDUE',
  },
  {
    id: 'comp-3',
    category: 'OSHA',
    title: 'Needle Stick Training Roster',
    description: 'Verify OSHA training attendance for all staff.',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    assignedTo: 'staff-3',
    status: 'PENDING',
  },
];

export const sampleTrainingRequirements: TrainingRequirement[] = [
  {
    id: 'train-1',
    title: 'Annual Competency - Venipuncture',
    assignedTo: 'staff-4',
    status: 'OVERDUE',
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    competencyArea: 'CLIA',
  },
  {
    id: 'train-2',
    title: 'Specimen Processing Refresher',
    assignedTo: 'staff-5',
    status: 'PENDING',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    competencyArea: 'Quality',
  },
  {
    id: 'train-3',
    title: 'Chemical Spill Drill',
    assignedTo: 'staff-2',
    status: 'IN_PROGRESS',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    competencyArea: 'Safety',
  },
];

// Function to load sample data into stores
export const loadSampleData = () => {
  // This can be imported and called from main.tsx or a demo mode toggle
  console.log('Sample data available:', {
    staff: sampleStaff.length,
    meetings: sampleMeetings.length,
    incidents: sampleIncidents.length,
    compliance: sampleComplianceItems.length,
    training: sampleTrainingRequirements.length,
  });
  
  return {
    sampleStaff,
    sampleMeetings,
    sampleIncidents,
    sampleComplianceItems,
    sampleTrainingRequirements,
  };
};
