import * as XLSX from 'xlsx';

interface TemplateOptions {
  date: string; // YYYY-MM-DD format
  includeExamples?: boolean;
}

// Note: These are reserved for future dropdown/validation features in Excel
// const DEPT_OPTIONS = ['MLS', 'MLT', 'MLA'];
// const COMMON_SHIFTS_PHLEB = ['6:00a-2:30p', '7:00a-3:30p', '8:00a-4:30p', '2:00p-10:30p', '5:00p-9:00p'];
// const COMMON_SHIFTS_LAB = ['7:30a-4:00p', '8:00a-4:30p', '3:30p-12:00a', '9:30p-6:00a', '11:30p-8:00a'];
// const ASSIGNMENT_OPTIONS_PHLEB = ['Draw Patients', 'Processor', 'Draw Patients/Opener', 'Draw Patients/Closer', 'Draw Patients/Runner', 'Draw Patients/Hot Seat', 'Draw Patients (Backup Processor)'];

/**
 * Calculate startTime from shift string
 * @param shift - Shift string like "7:30a-4:00p"
 * @returns Number representing start hour (e.g., 7.5 for 7:30am)
 */
function calculateStartTime(shift: string): number {
  if (!shift) return 0;

  const startPart = shift.split('-')[0].trim().toLowerCase();
  const timeMatch = startPart.match(/(\d+):(\d+)([ap])/);

  if (!timeMatch) return 0;

  let hours = parseInt(timeMatch[1]);
  const minutes = parseInt(timeMatch[2]);
  const period = timeMatch[3];

  if (period === 'p' && hours !== 12) {
    hours += 12;
  } else if (period === 'a' && hours === 12) {
    hours = 0;
  }

  return hours + (minutes / 60);
}

/**
 * Generate Excel schedule template
 */
export function generateScheduleTemplate(options: TemplateOptions): void {
  const { date, includeExamples = true } = options;

  const workbook = XLSX.utils.book_new();

  // INSTRUCTIONS SHEET
  const instructionsData = [
    ['Largo Laboratory - Daily Schedule Template'],
    ['Date: ' + date],
    [''],
    ['INSTRUCTIONS'],
    [''],
    ['1. Fill in staff information in the Phlebotomists and Lab Staff sheets'],
    ['2. Required fields are marked with * in the header'],
    ['3. Use the dropdown menus where provided'],
    ['4. The startTime column will auto-calculate from your shift time'],
    ['5. Save this file when complete'],
    ['6. Upload to the Schedule Manager to import'],
    [''],
    ['IMPORTANT RULES'],
    [''],
    ['- Nicknames: Always use correct nicknames (e.g., Netta not Johnette, Emma not Emmanuella)'],
    ['- Departments: Use MLS, MLT, or MLA only (NOT MT)'],
    ['- Netta\'s breaks are FIXED: Break 1: 9:00a-9:15a | Lunch: 11:00a-11:30a | Break 2: 1:00p-1:15p'],
    ['- Break format: Break 1: 9:00a-9:15a | Lunch: 11:00a-11:30a | Break 2: 2:00p-2:15p'],
    ['- MLA staff can only: Assist with QC/Maint, Inventory, SQA Daily, Urines, Kits QC'],
    [''],
    ['EXAMPLE SHIFTS'],
    ['Phlebotomists: 6:00a-2:30p, 7:00a-3:30p, 8:00a-4:30p, 2:00p-10:30p'],
    ['Lab Staff: 7:30a-4:00p, 3:30p-12:00a, 9:30p-6:00a, 11:30p-8:00a'],
    [''],
    ['For questions, contact the Lab Manager']
  ];
  const instructionsSheet = XLSX.utils.aoa_to_sheet(instructionsData);
  instructionsSheet['!cols'] = [{ wch: 80 }];
  XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Instructions');

  // PHLEBOTOMISTS SHEET
  const phlebHeaders = [
    'Full Name*',
    'Nickname*',
    'Assignment*',
    'Shift Time*',
    'Breaks*',
    'startTime (auto)',
    'Notes'
  ];

  const phlebExamples = includeExamples ? [
    [
      'Christina Bolden-Davis',
      'Christina',
      'Draw Patients/Opener',
      '6:00a-2:30p',
      'Break 1: 8:00a-8:15a | Lunch: 10:30a-11:00a | Break 2: 1:45p-2:00p',
      calculateStartTime('6:00a-2:30p'),
      ''
    ],
    [
      'Emmanuella Theodore',
      'Emma',
      'Processor',
      '7:00a-3:30p',
      'Break 1: 8:15a-8:30a | Lunch: 11:30a-12:00p | Break 2: 1:15p-1:30p',
      calculateStartTime('7:00a-3:30p'),
      ''
    ],
    [
      'Johnette Brooks',
      'Netta',
      'Draw Patients',
      '7:00a-3:30p',
      'Break 1: 9:00a-9:15a | Lunch: 11:00a-11:30a | Break 2: 1:00p-1:15p',
      calculateStartTime('7:00a-3:30p'),
      'FIXED breaks - DO NOT CHANGE'
    ]
  ] : [];

  const phlebData = [phlebHeaders, ...phlebExamples];
  const phlebSheet = XLSX.utils.aoa_to_sheet(phlebData);

  // Set column widths
  phlebSheet['!cols'] = [
    { wch: 25 }, // Name
    { wch: 15 }, // Nickname
    { wch: 30 }, // Assignment
    { wch: 15 }, // Shift
    { wch: 60 }, // Breaks
    { wch: 12 }, // startTime
    { wch: 30 }  // Notes
  ];

  XLSX.utils.book_append_sheet(workbook, phlebSheet, 'Phlebotomists');

  // LAB STAFF SHEET
  const labHeaders = [
    'Full Name*',
    'Nickname*',
    'Department*',
    'Assignment*',
    'Shift Time*',
    'Breaks*',
    'startTime (auto)',
    'Notes'
  ];

  const labExamples = includeExamples ? [
    [
      'Francis Azih Ngene',
      'Francis',
      'MLS',
      'AUC Back - Hematology, Chemistry, Molecular',
      '7:30a-4:00p',
      'Break 1: 9:30a-9:45a | Lunch: 12:00p-12:30p | Break 2: 2:30p-2:45p',
      calculateStartTime('7:30a-4:00p'),
      ''
    ],
    [
      'Emily Creekmore',
      'Emily',
      'MLT',
      'MOB - Urines, Kits, Coag',
      '7:30a-4:00p',
      'Break 1: 9:45a-10:00a | Lunch: 12:30p-1:00p | Break 2: 2:45p-3:00p',
      calculateStartTime('7:30a-4:00p'),
      ''
    ],
    [
      'Ogheneochuko Eshofa',
      'Tracy',
      'MLT',
      'AUC Evening - Urines, Kits, Stago',
      '3:30p-12:00a',
      'Break 1: 5:30p-5:45p | Lunch: 7:30p-8:00p | Break 2: 10:00p-10:15p',
      calculateStartTime('3:30p-12:00a'),
      ''
    ],
    [
      'Emmanuel Lejano',
      'Boyet',
      'MLT',
      'AUC Night Coverage',
      '9:30p-6:00a',
      'Break 1: 11:30p-11:45p | Lunch: 2:00a-2:30a | Break 2: 4:30a-4:45a',
      calculateStartTime('9:30p-6:00a'),
      ''
    ]
  ] : [];

  const labData = [labHeaders, ...labExamples];
  const labSheet = XLSX.utils.aoa_to_sheet(labData);

  // Set column widths
  labSheet['!cols'] = [
    { wch: 25 }, // Name
    { wch: 15 }, // Nickname
    { wch: 12 }, // Department
    { wch: 40 }, // Assignment
    { wch: 15 }, // Shift
    { wch: 60 }, // Breaks
    { wch: 12 }, // startTime
    { wch: 30 }  // Notes
  ];

  XLSX.utils.book_append_sheet(workbook, labSheet, 'Lab Staff');

  // Generate and download the file
  const fileName = `schedule_template_${date}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

/**
 * Generate a blank template for a specific date
 */
export function downloadBlankTemplate(date: string): void {
  generateScheduleTemplate({ date, includeExamples: false });
}

/**
 * Generate a template with examples for a specific date
 */
export function downloadTemplateWithExamples(date: string): void {
  generateScheduleTemplate({ date, includeExamples: true });
}
