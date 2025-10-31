import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import type { Schedule, Staff, ExportOptions } from '@/types';

/**
 * Export schedule to PDF format
 */
export const exportScheduleToPDF = (
  schedule: Schedule,
  staff: Staff[],
  _options: ExportOptions = { format: 'PDF' }
): void => {
  const doc = new jsPDF();

  // Add header
  doc.setFontSize(18);
  doc.setTextColor(0, 102, 204); // Primary brand color
  doc.text('Daily Staff Schedule', 14, 22);

  // Add date
  doc.setFontSize(12);
  doc.setTextColor(102, 102, 102);
  doc.text(`Date: ${format(schedule.date, 'MMMM dd, yyyy')}`, 14, 32);

  // Prepare table data
  const tableData = schedule.entries.map((entry) => {
    const staffMember = staff.find((s) => s.id === entry.staffId);
    return [
      `${staffMember?.firstName || ''} ${staffMember?.lastName || ''}`,
      entry.role,
      entry.station || '-',
      entry.isBreak ? 'Break' : 'Active',
      entry.notes || '-',
    ];
  });

  // Add table
  autoTable(doc, {
    head: [['Staff Name', 'Role', 'Station', 'Status', 'Notes']],
    body: tableData,
    startY: 40,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 102, 204],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [230, 242, 255],
    },
    margin: { top: 40, right: 14, bottom: 20, left: 14 },
  });

  // Add footer
  const pageCount = doc.internal.pages.length - 1;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
    doc.text(
      `Generated: ${format(new Date(), 'MM/dd/yyyy HH:mm')}`,
      14,
      doc.internal.pageSize.height - 10
    );
  }

  // Save the PDF
  doc.save(`schedule_${format(schedule.date, 'yyyy-MM-dd')}.pdf`);
};

/**
 * Export schedule to Excel format
 */
export const exportScheduleToExcel = (
  schedule: Schedule,
  staff: Staff[],
  _options: ExportOptions = { format: 'EXCEL' }
): void => {
  // Prepare worksheet data
  const worksheetData = [
    ['Daily Staff Schedule'],
    [`Date: ${format(schedule.date, 'MMMM dd, yyyy')}`],
    [],
    ['Staff Name', 'Role', 'Station', 'Status', 'Notes'],
    ...schedule.entries.map((entry) => {
      const staffMember = staff.find((s) => s.id === entry.staffId);
      return [
        `${staffMember?.firstName || ''} ${staffMember?.lastName || ''}`,
        entry.role,
        entry.station || '-',
        entry.isBreak ? 'Break' : 'Active',
        entry.notes || '-',
      ];
    }),
  ];

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths
  ws['!cols'] = [
    { wch: 20 }, // Staff Name
    { wch: 25 }, // Role
    { wch: 15 }, // Station
    { wch: 10 }, // Status
    { wch: 30 }, // Notes
  ];

  // Style the header
  ws['A1'].s = {
    font: { bold: true, sz: 14, color: { rgb: '0066cc' } },
  };

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Schedule');

  // Write file
  XLSX.writeFile(wb, `schedule_${format(schedule.date, 'yyyy-MM-dd')}.xlsx`);
};

/**
 * Export schedule to CSV format
 */
export const exportScheduleToCSV = (
  schedule: Schedule,
  staff: Staff[]
): void => {
  // Prepare CSV data
  const csvData = [
    ['Daily Staff Schedule'],
    [`Date: ${format(schedule.date, 'MMMM dd, yyyy')}`],
    [],
    ['Staff Name', 'Role', 'Station', 'Status', 'Notes'],
    ...schedule.entries.map((entry) => {
      const staffMember = staff.find((s) => s.id === entry.staffId);
      return [
        `${staffMember?.firstName || ''} ${staffMember?.lastName || ''}`,
        entry.role,
        entry.station || '-',
        entry.isBreak ? 'Break' : 'Active',
        entry.notes || '-',
      ];
    }),
  ];

  // Convert to CSV string
  const csvString = csvData.map((row) => row.join(',')).join('\n');

  // Create blob and download
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `schedule_${format(schedule.date, 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Main export function that routes to appropriate format
 */
export const exportSchedule = (
  schedule: Schedule,
  staff: Staff[],
  options: ExportOptions
): void => {
  try {
    switch (options.format) {
      case 'PDF':
        exportScheduleToPDF(schedule, staff, options);
        break;
      case 'EXCEL':
        exportScheduleToExcel(schedule, staff, options);
        break;
      case 'CSV':
        exportScheduleToCSV(schedule, staff);
        break;
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error(`Failed to export schedule: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
