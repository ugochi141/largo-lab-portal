// ==========================================
// LARGO LAB SCHEDULE MANAGER SYSTEM
// Never have missing schedule data again!
// ==========================================

class ScheduleManager {
    constructor() {
        this.scheduleData = {};
        this.loadFromStorage();
        this.initializeAutoGeneration();
    }

    // ==========================================
    // DATABASE INTEGRATION (Using localStorage)
    // ==========================================

    loadFromStorage() {
        try {
            // Load existing schedule data from localStorage
            const stored = localStorage.getItem('largoScheduleDatabase');
            if (stored) {
                this.scheduleData = JSON.parse(stored);
                console.log(`✅ Loaded ${Object.keys(this.scheduleData).length} schedule dates from database`);
            }

            // Also check for dailyScheduleData (legacy)
            const dailyData = localStorage.getItem('dailyScheduleData');
            if (dailyData) {
                const daily = JSON.parse(dailyData);
                Object.assign(this.scheduleData, daily);
            }
        } catch (e) {
            console.error('Error loading schedule data:', e);
            this.scheduleData = {};
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('largoScheduleDatabase', JSON.stringify(this.scheduleData));
            localStorage.setItem('dailyScheduleData', JSON.stringify(this.scheduleData));
            console.log('✅ Schedule database saved successfully');
            return true;
        } catch (e) {
            console.error('Error saving schedule data:', e);
            return false;
        }
    }

    // ==========================================
    // TEMPLATE SYSTEM - Auto-generate schedules
    // ==========================================

    generateScheduleFromTemplate(date, templateType = 'standard') {
        const templates = {
            standard: {
                phleb: [
                    // Day shift phlebotomy (6am-5:30pm coverage)
                    {name: 'Christina Bolden-Davis', nickname: 'Christina', assignment: 'Draw Patients/Opener', shift: '6:00a-2:30p', breaks: 'Break 1: 8:15a-8:30a | Lunch: 10:30a-11:00a | Break 2: 1:00p-1:15p', startTime: 6},
                    {name: 'Youlana Miah', nickname: 'Youlana', assignment: 'Processor', shift: '6:00a-2:30p', breaks: 'Break 1: 8:30a-8:45a | Lunch: 11:00a-11:30a | Break 2: 1:15p-1:30p', startTime: 6},
                    {name: 'Johnette Brooks', nickname: 'Netta', assignment: 'Draw Patients/Runner', shift: '7:00a-3:30p', breaks: 'Break 1: 9:00a-9:15a | Lunch: 11:00a-11:30a | Break 2: 1:00p-1:15p', startTime: 7},
                    {name: 'Cheryl Gray', nickname: 'Cheryl', assignment: 'Draw Patients/Runner', shift: '8:00a-4:30p', breaks: 'Break 1: 10:15a-10:30a | Lunch: 12:30p-1:00p | Break 2: 2:45p-3:00p', startTime: 8},
                    {name: 'Anne Saint Phirin', nickname: 'Anne', assignment: 'Draw Patients (Backup Processor)', shift: '8:00a-4:30p', breaks: 'Break 1: 10:30a-10:45a | Lunch: 1:00p-1:30p | Break 2: 3:00p-3:15p', startTime: 8},
                    {name: 'Raquel Grayson', nickname: 'Raquel', assignment: 'Draw Patients/Runner', shift: '9:00a-5:30p', breaks: 'Break 1: 11:15a-11:30a | Lunch: 1:00p-1:30p | Break 2: 3:45p-4:00p', startTime: 9},
                    {name: 'Emmanuella Theodore', nickname: 'Emma', assignment: 'Draw Patients', shift: '9:00a-5:30p', breaks: 'Break 1: 11:30a-11:45a | Lunch: 1:30p-2:00p | Break 2: 4:00p-4:15p', startTime: 9},
                    // Evening shift phlebotomy (2pm-10:30pm)
                    {name: 'Stephanie Dodson', nickname: 'Stephanie', assignment: 'Draw Patients/Hot Seat', shift: '2:00p-10:30p', breaks: 'Break 1: 4:00p-4:15p | Lunch: 6:00p-6:30p | Break 2: 8:30p-8:45p', startTime: 14},
                    {name: 'Nichole Fauntleroy', nickname: 'Nichole', assignment: 'Draw Patients/Closer', shift: '2:00p-10:30p', breaks: 'Break 1: 4:15p-4:30p | Lunch: 6:30p-7:00p | Break 2: 8:45p-9:00p', startTime: 14},
                    {name: 'Danalisa Hayes', nickname: 'Danalisa', assignment: 'Processor', shift: '2:00p-10:30p', breaks: 'Break 1: 4:30p-4:45p | Lunch: 6:45p-7:15p | Break 2: 9:00p-9:15p', startTime: 14}
                ],
                lab: [
                    // Day shift lab
                    {name: 'Francis Azih Ngene', nickname: 'Francis', dept: 'MLS', assignment: 'AUC Back - Hematology, Chemistry, Molecular', shift: '7:30a-4:00p', breaks: 'Break 1: 9:45a-10:00a | Lunch: 12:00p-12:30p | Break 2: 2:30p-2:45p', startTime: 7.5},
                    {name: 'Dat Chu', nickname: 'Dat', dept: 'MLS', assignment: 'AUC Front - Processing/Urines', shift: '7:00a-2:30p', breaks: 'Break 1: 9:15a-9:30a | Lunch: 11:30a-12:00p', startTime: 7},
                    // Lorraine Blackwell - REMOVED (No longer active staff)
                    {name: 'Steeven Brussot', nickname: 'Steeven', dept: 'MLT', assignment: 'MOB - QC and Maintenance', shift: '8:00a-4:30p', breaks: 'Break 1: 10:15a-10:30a | Lunch: 1:00p-1:30p | Break 2: 3:00p-3:15p', startTime: 8},
                    // Evening shift lab
                    {name: 'Ogheneochuko Eshofa', nickname: 'Tracy', dept: 'MLT', assignment: 'AUC Evening - Urines, Kits, Stago', shift: '3:30p-12:00a', breaks: 'Break 1: 5:45p-6:00p | Lunch: 7:30p-8:00p | Break 2: 10:00p-10:15p', startTime: 15.5},
                    {name: 'Albert Che', nickname: 'Albert', dept: 'MLS', assignment: 'AUC Evening - Hematology, Chemistry', shift: '3:30p-12:00a', breaks: 'Break 1: 6:00p-6:15p | Lunch: 8:00p-8:30p | Break 2: 10:15p-10:30p', startTime: 15.5},
                    // Samuel Lawson - REMOVED (No longer active staff)
                    // Night shift lab
                    {name: 'Emmanuel Lejano', nickname: 'Boyet', dept: 'MLT', assignment: 'AUC Night Coverage', shift: '9:30p-6:00a', breaks: 'Break 1: 11:30p-11:45p | Lunch: 1:30a-2:00a | Break 2: 4:00a-4:15a', startTime: 21.5},
                    {name: 'George Etape', nickname: 'George', dept: 'MLS', assignment: 'AUC Night Coverage', shift: '11:30p-8:00a', breaks: 'Break 1: 1:00a-1:15a | Lunch: 3:00a-3:30a | Break 2: 5:30a-5:45a', startTime: 23.5}
                ]
            },
            partTime: {
                // Add part-time staff template
                phleb: [
                    {name: 'Micaela Scarborough', nickname: 'Micaela', assignment: 'Draw Patients', shift: '8:00a-12:00p', breaks: 'Break 1: 10:00a-10:15a', startTime: 8},
                    {name: 'Taric White', nickname: 'Taric', assignment: 'Draw Patients', shift: '9:00a-1:00p + 5:00p-9:00p', breaks: 'AM: Break 1: 10:45a-11:00a | PM: Break 1: 6:45p-7:00p', startTime: 9}
                ]
            }
        };

        // Get the template
        let schedule = JSON.parse(JSON.stringify(templates[templateType])); // Deep clone

        // Add QC assignments based on day of week
        const dayOfWeek = new Date(date).getDay();
        schedule = this.addDailyQCAssignments(schedule, date, dayOfWeek);

        return schedule;
    }

    addDailyQCAssignments(schedule, date, dayOfWeek) {
        const dateObj = new Date(date);
        const dayOfMonth = dateObj.getDate();
        const weekOfMonth = Math.ceil(dayOfMonth / 7);

        // Daily QC assignments
        const dailyQC = {
            MOB: 'Pure 1 QC @7:30am [DAILY], Kits QC [DAILY], Sysmex Startup/QC [DAILY], Hematek Startup/QC [DAILY], Previ Gram Stain [DAILY], Stago Maint, Beads Maint, Log QC',
            AUC_Back: 'MedTox QC [DAILY], Sysmex Startup/QC [DAILY], Hematek Startup/QC [DAILY], Stago Maint, Log QC',
            AUC_Evening: 'ESR 10% Check QC [DAILY], Stago Maint, Log QC',
            Night: 'MiniSed QC [DAILY], GeneXpert QC [DAILY], Pure 2 QC @3am [DAILY], Log QC'
        };

        // Weekly QC assignments (by day of week)
        const weeklyQC = {
            2: { // Tuesday
                MOB: 'Previ Gram Stain [WEEKLY-Tue]',
                Night: 'Novus [WEEKLY-Tue after 3am]'
            },
            3: { // Wednesday
                MOB: 'Novus [WEEKLY-Wed MOB]',
                Evening: 'Stago [WEEKLY-Wed Both]'
            },
            4: { // Thursday
                Night: 'GeneXpert [WEEKLY-Thu Both]'
            },
            6: { // Saturday
                Evening: 'Sysmex XN Shutdown 9pm [WEEKLY-Sat]',
                MOB_Evening: 'Sysmex XN Shutdown 10pm [WEEKLY-Sat]',
                Day: 'Hematek [WEEKLY-Sat]'
            }
        };

        // Monthly QC assignments
        const monthlyQC = {
            '2nd_Wednesday': {
                Day: 'Hematek [MONTHLY-2nd Wed], GeneXpert [MONTHLY-2nd Wed]'
            },
            '2nd_Thursday': {
                Evening: 'Stago 9pm [MONTHLY-2nd Thu]'
            },
            '3rd_Tuesday': {
                MOB: 'Previ Gram Stain [MONTHLY-3rd Tue]'
            },
            '3rd_Wednesday': {
                AUC: 'MedTox [MONTHLY-3rd Wed]'
            },
            '3rd_Thursday': {
                MOB: 'Novus [MONTHLY-3rd Thu]'
            },
            '3rd_Saturday': {
                Night: 'Pure Analyzers 3am [MONTHLY-3rd Sat]'
            }
        };

        // Apply QC assignments to staff
        schedule.lab.forEach(tech => {
            // Add daily QC based on assignment
            if (tech.assignment.includes('MOB')) {
                tech.assignment += ', ' + dailyQC.MOB;
            }
            if (tech.assignment.includes('AUC Back')) {
                tech.assignment += ', ' + dailyQC.AUC_Back;
            }
            if (tech.assignment.includes('Evening')) {
                tech.assignment += ', ' + dailyQC.AUC_Evening;
            }
            if (tech.assignment.includes('Night')) {
                tech.assignment += ', ' + dailyQC.Night;
            }

            // Add weekly QC if applicable
            if (weeklyQC[dayOfWeek]) {
                Object.keys(weeklyQC[dayOfWeek]).forEach(location => {
                    if (tech.assignment.includes(location)) {
                        tech.assignment += ', ' + weeklyQC[dayOfWeek][location];
                    }
                });
            }

            // Add universal tasks
            tech.assignment += ', Wipe Benches, Clean Microscopes';
        });

        return schedule;
    }

    // ==========================================
    // CSV/EXCEL UPLOAD FEATURE
    // ==========================================

    parseCSV(csvContent) {
        const lines = csvContent.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const scheduleByDate = {};

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length < headers.length) continue;

            const row = {};
            headers.forEach((header, index) => {
                row[header.toLowerCase().replace(/\s+/g, '_')] = values[index];
            });

            // Parse the row into schedule format
            const date = row.date || row.schedule_date;
            if (!date) continue;

            if (!scheduleByDate[date]) {
                scheduleByDate[date] = { phleb: [], lab: [] };
            }

            const employee = {
                name: row.employee_name || row.name,
                nickname: row.nickname || row.employee_name?.split(' ')[0],
                shift: row.shift_time || row.shift,
                breaks: row.breaks || this.generateBreaks(row.shift_time || row.shift),
                startTime: this.parseStartTime(row.shift_time || row.shift)
            };

            if (row.position === 'PHLEB') {
                employee.assignment = row.assignment || 'Draw Patients';
                scheduleByDate[date].phleb.push(employee);
            } else {
                employee.dept = row.position || 'MLS';
                employee.assignment = row.assignment || 'General Coverage';
                scheduleByDate[date].lab.push(employee);
            }
        }

        return scheduleByDate;
    }

    uploadFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    let scheduleData = {};

                    if (file.name.endsWith('.csv')) {
                        scheduleData = this.parseCSV(e.target.result);
                    } else if (file.name.endsWith('.json')) {
                        scheduleData = JSON.parse(e.target.result);
                    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                        // Would need a library like SheetJS for Excel parsing
                        reject(new Error('Excel files require additional library. Please use CSV or JSON format.'));
                        return;
                    }

                    // Merge with existing data
                    Object.assign(this.scheduleData, scheduleData);
                    this.saveToStorage();

                    resolve({
                        success: true,
                        message: `Successfully imported ${Object.keys(scheduleData).length} schedule dates`,
                        data: scheduleData
                    });
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(new Error('Error reading file'));

            if (file.name.endsWith('.json') || file.name.endsWith('.csv')) {
                reader.readAsText(file);
            } else {
                reject(new Error('Unsupported file format'));
            }
        });
    }

    // ==========================================
    // AUTO-GENERATION & FILLING
    // ==========================================

    initializeAutoGeneration() {
        // Check for missing dates and auto-generate
        this.fillMissingDates();

        // Set up periodic check (every page load)
        if (typeof window !== 'undefined') {
            window.addEventListener('load', () => this.fillMissingDates());
        }
    }

    fillMissingDates(startDate = null, endDate = null) {
        const today = new Date();
        const start = startDate ? new Date(startDate) : today;
        const end = endDate ? new Date(endDate) : new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days ahead

        let filled = 0;
        const currentDate = new Date(start);

        while (currentDate <= end) {
            const dateStr = this.formatDate(currentDate);

            if (!this.scheduleData[dateStr]) {
                // Generate schedule for missing date
                this.scheduleData[dateStr] = this.generateScheduleFromTemplate(dateStr, 'standard');
                filled++;
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        if (filled > 0) {
            this.saveToStorage();
            console.log(`✅ Auto-generated ${filled} missing schedule dates`);
        }

        return filled;
    }

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================

    formatDate(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    parseStartTime(shift) {
        const match = shift.match(/(\d+):?(\d+)?(a|p)/i);
        if (match) {
            let hour = parseInt(match[1]);
            const minutes = parseInt(match[2] || '0');
            const ampm = match[3].toLowerCase();

            if (ampm === 'p' && hour !== 12) hour += 12;
            if (ampm === 'a' && hour === 12) hour = 0;

            return hour + minutes / 60;
        }
        return 0;
    }

    generateBreaks(shift) {
        const start = this.parseStartTime(shift);

        if (start < 12) { // Morning shift
            return `Break 1: ${this.formatTime(start + 2)}a-${this.formatTime(start + 2.25)}a | Lunch: ${this.formatTime(start + 4.5)}a-${this.formatTime(start + 5)}p | Break 2: ${this.formatTime(start + 7)}p-${this.formatTime(start + 7.25)}p`;
        } else { // Evening shift
            return `Break 1: ${this.formatTime(start + 2)}p-${this.formatTime(start + 2.25)}p | Lunch: ${this.formatTime(start + 4)}p-${this.formatTime(start + 4.5)}p | Break 2: ${this.formatTime(start + 6.5)}p-${this.formatTime(start + 6.75)}p`;
        }
    }

    formatTime(hours) {
        const h = Math.floor(hours) % 24;
        const m = Math.round((hours % 1) * 60);
        const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
        const ampm = h >= 12 ? 'p' : 'a';
        return `${displayHour}:${String(m).padStart(2, '0')}${ampm}`;
    }

    // ==========================================
    // API METHODS
    // ==========================================

    getSchedule(date) {
        const dateStr = this.formatDate(date);

        // If schedule doesn't exist, generate it
        if (!this.scheduleData[dateStr]) {
            this.scheduleData[dateStr] = this.generateScheduleFromTemplate(dateStr, 'standard');
            this.saveToStorage();
        }

        return this.scheduleData[dateStr];
    }

    updateSchedule(date, scheduleData) {
        const dateStr = this.formatDate(date);
        this.scheduleData[dateStr] = scheduleData;
        this.saveToStorage();
        return true;
    }

    deleteSchedule(date) {
        const dateStr = this.formatDate(date);
        delete this.scheduleData[dateStr];
        this.saveToStorage();
        return true;
    }

    getAllSchedules() {
        return this.scheduleData;
    }

    exportSchedules(format = 'json') {
        if (format === 'json') {
            return JSON.stringify(this.scheduleData, null, 2);
        } else if (format === 'csv') {
            return this.convertToCSV(this.scheduleData);
        }
    }

    convertToCSV(data) {
        const csv = ['Date,Position,Employee Name,Nickname,Shift,Assignment,Breaks'];

        Object.keys(data).forEach(date => {
            const schedule = data[date];

            schedule.phleb?.forEach(emp => {
                csv.push(`${date},PHLEB,"${emp.name}","${emp.nickname}","${emp.shift}","${emp.assignment}","${emp.breaks}"`);
            });

            schedule.lab?.forEach(emp => {
                csv.push(`${date},${emp.dept},"${emp.name}","${emp.nickname}","${emp.shift}","${emp.assignment}","${emp.breaks}"`);
            });
        });

        return csv.join('\n');
    }
}

// ==========================================
// GLOBAL INSTANCE
// ==========================================
const largoScheduleManager = new ScheduleManager();

// Auto-fill October 15, 2025 if missing
largoScheduleManager.fillMissingDates('2025-10-15', '2025-10-15');

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScheduleManager;
}