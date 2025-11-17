import * as XLSX from 'xlsx';
import type { ProductionDaySchedule, ProductionPhlebStaff, ProductionLabStaff } from '../types';

interface ParseResult {
  success: boolean;
  schedule?: ProductionDaySchedule;
  errors?: string[];
  warnings?: string[];
}

/**
 * Validate required fields
 */
function validatePhlebStaff(row: any, rowNum: number): string[] {
  const errors: string[] = [];

  if (!row['Full Name*']) {
    errors.push(`Row ${rowNum}: Full Name is required`);
  }
  if (!row['Nickname*']) {
    errors.push(`Row ${rowNum}: Nickname is required`);
  }
  if (!row['Assignment*']) {
    errors.push(`Row ${rowNum}: Assignment is required`);
  }
  if (!row['Shift Time*']) {
    errors.push(`Row ${rowNum}: Shift Time is required`);
  }
  if (!row['Breaks*']) {
    errors.push(`Row ${rowNum}: Breaks are required`);
  }

  return errors;
}

function validateLabStaff(row: any, rowNum: number): string[] {
  const errors: string[] = [];

  if (!row['Full Name*']) {
    errors.push(`Row ${rowNum}: Full Name is required`);
  }
  if (!row['Nickname*']) {
    errors.push(`Row ${rowNum}: Nickname is required`);
  }
  if (!row['Department*']) {
    errors.push(`Row ${rowNum}: Department is required`);
  } else if (!['MLS', 'MLT', 'MLA'].includes(row['Department*'])) {
    errors.push(`Row ${rowNum}: Department must be MLS, MLT, or MLA (not ${row['Department*']})`);
  }
  if (!row['Assignment*']) {
    errors.push(`Row ${rowNum}: Assignment is required`);
  }
  if (!row['Shift Time*']) {
    errors.push(`Row ${rowNum}: Shift Time is required`);
  }
  if (!row['Breaks*']) {
    errors.push(`Row ${rowNum}: Breaks are required`);
  }

  return errors;
}

/**
 * Calculate startTime from shift string
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
 * Check for common naming mistakes
 */
function checkNicknameWarnings(name: string, nickname: string): string[] {
  const warnings: string[] = [];

  const commonMistakes: Record<string, string> = {
    'Johnette': 'Netta',
    'Emmanuella': 'Emma',
    'Jacqueline': 'Jackie',
    'Ogheneochuko': 'Tracy',
    'Emmanuel': 'Boyet'
  };

  for (const [fullName, correctNickname] of Object.entries(commonMistakes)) {
    if (name.includes(fullName) && nickname !== correctNickname) {
      warnings.push(`${name} should use nickname "${correctNickname}" not "${nickname}"`);
    }
  }

  return warnings;
}

/**
 * Parse uploaded Excel file
 */
export async function parseScheduleTemplate(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          resolve({
            success: false,
            errors: ['Failed to read file']
          });
          return;
        }

        const workbook = XLSX.read(data, { type: 'binary' });

        // Check for required sheets
        if (!workbook.SheetNames.includes('Phlebotomists')) {
          resolve({
            success: false,
            errors: ['Missing "Phlebotomists" sheet in template']
          });
          return;
        }

        if (!workbook.SheetNames.includes('Lab Staff')) {
          resolve({
            success: false,
            errors: ['Missing "Lab Staff" sheet in template']
          });
          return;
        }

        const errors: string[] = [];
        const warnings: string[] = [];

        // Parse Phlebotomists sheet
        const phlebSheet = workbook.Sheets['Phlebotomists'];
        const phlebData = XLSX.utils.sheet_to_json(phlebSheet);

        const phlebStaff: ProductionPhlebStaff[] = [];
        phlebData.forEach((row: any, index: number) => {
          const rowNum = index + 2; // +2 for header row and 0-indexing

          const validationErrors = validatePhlebStaff(row, rowNum);
          errors.push(...validationErrors);

          if (validationErrors.length === 0) {
            const name = row['Full Name*'].trim();
            const nickname = row['Nickname*'].trim();

            // Check for nickname warnings
            warnings.push(...checkNicknameWarnings(name, nickname));

            const shift = row['Shift Time*'].trim();
            const startTime = row['startTime (auto)'] || calculateStartTime(shift);

            phlebStaff.push({
              name,
              nickname,
              assignment: row['Assignment*'].trim(),
              shift,
              breaks: row['Breaks*'].trim(),
              startTime,
              ...(row['Notes'] && { notes: row['Notes'].trim() })
            });
          }
        });

        // Parse Lab Staff sheet
        const labSheet = workbook.Sheets['Lab Staff'];
        const labData = XLSX.utils.sheet_to_json(labSheet);

        const labStaff: ProductionLabStaff[] = [];
        labData.forEach((row: any, index: number) => {
          const rowNum = index + 2;

          const validationErrors = validateLabStaff(row, rowNum);
          errors.push(...validationErrors);

          if (validationErrors.length === 0) {
            const name = row['Full Name*'].trim();
            const nickname = row['Nickname*'].trim();
            const dept = row['Department*'].trim();

            // Check for nickname warnings
            warnings.push(...checkNicknameWarnings(name, nickname));

            // Check for MT instead of MLS
            if (dept === 'MT') {
              errors.push(`Row ${rowNum}: Use "MLS" not "MT"`);
              return;
            }

            // Check MLA restrictions
            if (dept === 'MLA') {
              const assignment = row['Assignment*'];
              const allowedTasks = ['Assist with QC/Maint', 'Inventory', 'SQA Daily', 'Urines', 'Kits QC'];
              const hasAllowedTask = allowedTasks.some(task => assignment.includes(task));

              if (!hasAllowedTask) {
                warnings.push(`Row ${rowNum}: MLA staff should only perform: ${allowedTasks.join(', ')}`);
              }
            }

            const shift = row['Shift Time*'].trim();
            const startTime = row['startTime (auto)'] || calculateStartTime(shift);

            labStaff.push({
              name,
              nickname,
              dept,
              shift,
              assignment: row['Assignment*'].trim(),
              breaks: row['Breaks*'].trim(),
              startTime,
              ...(row['Notes'] && { notes: row['Notes'].trim() })
            });
          }
        });

        // Sort by startTime
        phlebStaff.sort((a, b) => a.startTime - b.startTime);
        labStaff.sort((a, b) => a.startTime - b.startTime);

        if (errors.length > 0) {
          resolve({
            success: false,
            errors,
            warnings: warnings.length > 0 ? warnings : undefined
          });
          return;
        }

        resolve({
          success: true,
          schedule: {
            phleb: phlebStaff,
            lab: labStaff
          },
          warnings: warnings.length > 0 ? warnings : undefined
        });

      } catch (error) {
        resolve({
          success: false,
          errors: [`Error parsing file: ${error instanceof Error ? error.message : 'Unknown error'}`]
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        errors: ['Error reading file']
      });
    };

    reader.readAsBinaryString(file);
  });
}
