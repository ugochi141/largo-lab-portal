// Equipment tracking data migrated from equipment-tracker.html
export interface Equipment {
  id: string;
  name: string;
  category: 'Chemistry' | 'Hematology' | 'Urinalysis' | 'Coagulation' | 'Molecular';
  location: 'MOB' | 'AUC';
  model: string;
  serialNumber: string;
  status: 'Operational' | 'Maintenance' | 'Offline';
  vendor: string;
  supportPhone: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  notes?: string;
}

export const equipment: Equipment[] = [
  // Chemistry
  {
    id: 'eq-001',
    name: 'Roche Pure 1',
    category: 'Chemistry',
    location: 'MOB',
    model: 'Cobas Pure',
    serialNumber: 'RC-MOB-001',
    status: 'Operational',
    vendor: 'Roche Diagnostics',
    supportPhone: '1-800-428-2336',
    lastMaintenance: '2025-10-15',
    nextMaintenance: '2025-11-15',
  },
  {
    id: 'eq-002',
    name: 'Roche Pure 2',
    category: 'Chemistry',
    location: 'AUC',
    model: 'Cobas Pure',
    serialNumber: 'RC-AUC-002',
    status: 'Operational',
    vendor: 'Roche Diagnostics',
    supportPhone: '1-800-428-2336',
    lastMaintenance: '2025-10-01',
    nextMaintenance: '2025-12-01',
    notes: 'QC @ 3am daily',
  },
  // Hematology
  {
    id: 'eq-003',
    name: 'Sysmex XN-1000',
    category: 'Hematology',
    location: 'MOB',
    model: 'XN-1000',
    serialNumber: 'SX-MOB-003',
    status: 'Operational',
    vendor: 'Sysmex America',
    supportPhone: '1-800-741-7042',
    lastMaintenance: '2025-10-10',
    nextMaintenance: '2025-11-10',
    notes: 'Daily startup/QC required',
  },
  {
    id: 'eq-004',
    name: 'Sysmex XN-550',
    category: 'Hematology',
    location: 'AUC',
    model: 'XN-550',
    serialNumber: 'SX-AUC-004',
    status: 'Operational',
    vendor: 'Sysmex America',
    supportPhone: '1-800-741-7042',
    lastMaintenance: '2025-10-12',
    nextMaintenance: '2025-11-12',
  },
  {
    id: 'eq-005',
    name: 'Hematek Slide Stainer',
    category: 'Hematology',
    location: 'MOB',
    model: 'Hematek 3000',
    serialNumber: 'HT-MOB-005',
    status: 'Operational',
    vendor: 'Siemens Healthcare',
    supportPhone: '1-888-777-0072',
    lastMaintenance: '2025-09-28',
    nextMaintenance: '2025-11-28',
    notes: 'Weekly QC required',
  },
  // Urinalysis
  {
    id: 'eq-006',
    name: 'MiniSed',
    category: 'Urinalysis',
    location: 'AUC',
    model: 'MiniSed 2000',
    serialNumber: 'MS-AUC-006',
    status: 'Operational',
    vendor: 'Sysmex America',
    supportPhone: '1-800-741-7042',
    lastMaintenance: '2025-10-05',
    nextMaintenance: '2025-11-05',
    notes: 'Daily QC required',
  },
  {
    id: 'eq-007',
    name: 'SQA Vision',
    category: 'Urinalysis',
    location: 'MOB',
    model: 'SQA Vision Pro',
    serialNumber: 'SQA-MOB-007',
    status: 'Operational',
    vendor: 'Iris Diagnostics',
    supportPhone: '1-800-432-4474',
    lastMaintenance: '2025-10-08',
    nextMaintenance: '2025-11-08',
    notes: 'Daily QC required',
  },
  // Coagulation
  {
    id: 'eq-008',
    name: 'STA Compact Max',
    category: 'Coagulation',
    location: 'MOB',
    model: 'STA Compact Max',
    serialNumber: 'ST-MOB-008',
    status: 'Operational',
    vendor: 'Stago',
    supportPhone: '1-800-222-0322',
    lastMaintenance: '2025-10-01',
    nextMaintenance: '2025-12-01',
    notes: 'Daily maintenance required',
  },
  // Molecular
  {
    id: 'eq-009',
    name: 'GeneXpert',
    category: 'Molecular',
    location: 'AUC',
    model: 'GeneXpert IV',
    serialNumber: 'GX-AUC-009',
    status: 'Operational',
    vendor: 'Cepheid',
    supportPhone: '1-888-838-3222',
    lastMaintenance: '2025-10-15',
    nextMaintenance: '2025-11-15',
    notes: 'Daily QC required',
  },
];

export const waterChangeDates = [
  { start: '2025-11-08', end: '2025-11-09' },
  { start: '2025-12-20', end: '2025-12-21' },
];

export const criticalValues = [
  { test: 'Glucose', critical: '< 50 or > 400 mg/dL', action: 'Notify provider immediately' },
  { test: 'Potassium', critical: '< 2.5 or > 6.0 mEq/L', action: 'Notify provider immediately' },
  { test: 'Sodium', critical: '< 120 or > 160 mEq/L', action: 'Notify provider immediately' },
  { test: 'WBC', critical: '< 2.0 or > 30.0 K/uL', action: 'Notify provider immediately' },
  { test: 'Platelets', critical: '< 50 K/uL', action: 'Notify provider immediately' },
  { test: 'INR', critical: '> 5.0', action: 'Notify provider immediately' },
];
