/**
 * Advanced Reporting System
 * PDF, Excel, CSV Export Capabilities
 */

class ReportGenerator {
  constructor() {
    this.reportTemplates = new Map();
    this.init();
  }

  init() {
    this.registerDefaultTemplates();
  }

  registerDefaultTemplates() {
    // Daily Operations Report
    this.reportTemplates.set('daily-operations', {
      name: 'Daily Operations Report',
      description: 'Comprehensive daily metrics and activities',
      sections: [
        'staffing',
        'test-volume',
        'turnaround-times',
        'qc-tasks',
        'equipment-status',
        'compliance'
      ]
    });

    // QC Summary Report
    this.reportTemplates.set('qc-summary', {
      name: 'Quality Control Summary',
      description: 'QC tasks, results, and compliance metrics',
      sections: ['qc-tasks-completed', 'qc-pending', 'qc-failures', 'corrective-actions']
    });

    // Staff Schedule Report
    this.reportTemplates.set('staff-schedule', {
      name: 'Staff Schedule Report',
      description: 'Weekly staff assignments and coverage',
      sections: ['staff-roster', 'shift-assignments', 'break-schedules', 'on-call']
    });

    // Equipment Maintenance Report
    this.reportTemplates.set('equipment-maintenance', {
      name: 'Equipment Maintenance Report',
      description: 'Maintenance tasks, schedules, and compliance',
      sections: [
        'maintenance-completed',
        'maintenance-due',
        'equipment-downtime',
        'maintenance-costs'
      ]
    });
  }

  async generateReport(templateId, format = 'pdf', options = {}) {
    const template = this.reportTemplates.get(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    const reportData = await this.gatherReportData(template);

    switch (format.toLowerCase()) {
      case 'pdf':
        return this.exportToPDF(reportData, template, options);
      case 'excel':
      case 'xlsx':
        return this.exportToExcel(reportData, template, options);
      case 'csv':
        return this.exportToCSV(reportData, template, options);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  async gatherReportData(template) {
    // Gather data for each section
    const data = {
      metadata: {
        generatedAt: new Date().toISOString(),
        generatedBy: 'Largo Lab Portal',
        reportName: template.name,
        reportPeriod: this.getReportPeriod()
      },
      sections: {}
    };

    for (const section of template.sections) {
      data.sections[section] = await this.getSection Data(section);
    }

    return data;
  }

  async getSectionData(sectionName) {
    // Mock data - replace with actual API calls
    const mockData = {
      staffing: {
        totalStaff: 22,
        onDuty: 18,
        onLeave: 2,
        onCall: 2,
        departments: {
          'Phlebotomy': 8,
          'Chemistry': 5,
          'Hematology': 4,
          'Microbiology': 3,
          'POCT': 2
        }
      },
      'test-volume': {
        total: 624,
        byDepartment: {
          Chemistry: 245,
          Hematology: 189,
          Microbiology: 67,
          POCT: 123
        },
        byShift: {
          Day: 398,
          Evening: 156,
          Night: 70
        }
      },
      'turnaround-times': {
        average: '45 minutes',
        byDepartment: {
          Chemistry: '38 minutes',
          Hematology: '42 minutes',
          Microbiology: '65 minutes',
          POCT: '18 minutes'
        },
        target: '60 minutes',
        percentWithinTarget: '94%'
      },
      'qc-tasks': {
        completed: 42,
        pending: 8,
        overdue: 0,
        complianceRate: '100%'
      },
      'equipment-status': {
        operational: 42,
        maintenanceDue: 5,
        down: 1,
        totalEquipment: 48
      },
      compliance: {
        overall: '100%',
        clia: '100%',
        cap: '100%',
        osha: '100%',
        hipaa: '100%'
      }
    };

    return mockData[sectionName] || {};
  }

  getReportPeriod() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return dateStr;
  }

  exportToPDF(reportData, template, options) {
    // Simple HTML-based PDF export using print functionality
    // For production, use jsPDF library
    const htmlContent = this.generateHTMLReport(reportData, template, options);

    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 250);

    return {
      success: true,
      message: 'PDF export initiated. Please use your browser print dialog.',
      format: 'pdf'
    };
  }

  generateHTMLReport(reportData, template, options) {
    const { metadata, sections } = reportData;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${template.name} - ${metadata.reportPeriod}</title>
    <style>
        @page {
            size: letter;
            margin: 0.75in;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 10pt;
            line-height: 1.5;
            color: #333;
            max-width: 8.5in;
            margin: 0 auto;
        }
        .report-header {
            text-align: center;
            border-bottom: 3px solid #0066cc;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .report-header h1 {
            color: #0066cc;
            font-size: 24pt;
            margin-bottom: 10px;
        }
        .report-header .metadata {
            font-size: 10pt;
            color: #666;
        }
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        .section-title {
            color: #0066cc;
            font-size: 16pt;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .data-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        .data-item {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #0066cc;
        }
        .data-label {
            font-size: 9pt;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .data-value {
            font-size: 20pt;
            font-weight: bold;
            color: #0066cc;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #e0e0e0;
        }
        th {
            background: #0066cc;
            color: white;
            font-weight: bold;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            text-align: center;
            font-size: 9pt;
            color: #666;
        }
        @media print {
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="report-header">
        <h1>${template.name}</h1>
        <div class="metadata">
            <p>Kaiser Permanente Largo Laboratory</p>
            <p>Generated: ${new Date(metadata.generatedAt).toLocaleString()}</p>
            <p>Period: ${metadata.reportPeriod}</p>
        </div>
    </div>

    ${this.renderReportSections(sections)}

    <div class="footer">
        <p>Kaiser Permanente Largo Laboratory Operations Portal</p>
        <p>Confidential - For Internal Use Only</p>
        <p>Generated by Largo Lab Portal • ${metadata.generatedAt}</p>
    </div>

    <script>
        // Auto-trigger print dialog on load
        window.onload = function() {
            window.print();
        };
    </script>
</body>
</html>
    `;
  }

  renderReportSections(sections) {
    return Object.entries(sections)
      .map(([sectionName, sectionData]) => {
        const title = this.formatSectionTitle(sectionName);

        return `
            <div class="section">
                <h2 class="section-title">${title}</h2>
                ${this.renderSectionContent(sectionName, sectionData)}
            </div>
        `;
      })
      .join('');
  }

  renderSectionContent(sectionName, data) {
    // Render based on data structure
    if (typeof data === 'object' && !Array.isArray(data)) {
      return `
                <div class="data-grid">
                    ${Object.entries(data)
                      .map(
                        ([key, value]) => `
                        <div class="data-item">
                            <div class="data-label">${this.formatLabel(key)}</div>
                            <div class="data-value">${value}</div>
                        </div>
                    `
                      )
                      .join('')}
                </div>
            `;
    }

    return '<p>No data available</p>';
  }

  formatSectionTitle(sectionName) {
    return sectionName
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  formatLabel(key) {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  exportToExcel(reportData, template, options) {
    // Simple CSV export (for full Excel support, use SheetJS/xlsx library)
    const csvContent = this.convertToCSV(reportData, template);

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const filename = `${template.name.replace(/\s+/g, '_')}_${Date.now()}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return {
      success: true,
      message: `Report exported as ${filename}`,
      format: 'excel'
    };
  }

  exportToCSV(reportData, template, options) {
    return this.exportToExcel(reportData, template, options); // Same implementation for now
  }

  convertToCSV(reportData, template) {
    const { metadata, sections } = reportData;
    let csvContent = '';

    // Header
    csvContent += `"${template.name}"\n`;
    csvContent += `"Generated: ${new Date(metadata.generatedAt).toLocaleString()}"\n`;
    csvContent += `"Period: ${metadata.reportPeriod}"\n\n`;

    // Sections
    Object.entries(sections).forEach(([sectionName, sectionData]) => {
      csvContent += `"${this.formatSectionTitle(sectionName)}"\n`;

      if (typeof sectionData === 'object' && !Array.isArray(sectionData)) {
        csvContent += '"Metric","Value"\n';
        Object.entries(sectionData).forEach(([key, value]) => {
          // Handle nested objects
          if (typeof value === 'object') {
            csvContent += `"${this.formatLabel(key)}",""\n`;
            Object.entries(value).forEach(([subKey, subValue]) => {
              csvContent += `"  ${this.formatLabel(subKey)}","${subValue}"\n`;
            });
          } else {
            csvContent += `"${this.formatLabel(key)}","${value}"\n`;
          }
        });
      }

      csvContent += '\n';
    });

    return csvContent;
  }

  // Quick report generation methods
  async generateDailyReport(format = 'pdf') {
    return this.generateReport('daily-operations', format);
  }

  async generateQCReport(format = 'pdf') {
    return this.generateReport('qc-summary', format);
  }

  async generateStaffReport(format = 'pdf') {
    return this.generateReport('staff-schedule', format);
  }

  async generateEquipmentReport(format = 'pdf') {
    return this.generateReport('equipment-maintenance', format);
  }
}

// Initialize and expose globally
window.ReportGenerator = ReportGenerator;
window.reportGenerator = new ReportGenerator();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ReportGenerator;
}
