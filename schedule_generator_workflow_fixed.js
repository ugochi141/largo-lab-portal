// ==========================================
// LARGO LAB SCHEDULE GENERATOR WORKFLOW - FIXED VERSION
// Automated schedule creation from employee lists
// Updated: Removed Sam and Lorraine, Fixed role/assignment issue
// ==========================================

class ScheduleGenerator {
    constructor() {
        // Define role assignment rules
        this.roleAssignmentRules = {
            phleb: {
                // Shift-based assignments
                '6:00a': ['Opener', 'Processor'],
                '7:00a': ['Runner'],
                '8:00a': ['Runner', 'Backup Processor', 'Draw Patients'],
                '9:00a': ['Runner', 'Draw Patients'],
                '12:00p': ['Draw Patients'],
                '2:00p': ['Hot Seat', 'Processor', 'Closer'],
                '5:00p': ['Draw Patients']
            },
            processorTrained: [
                'MIAH, YOULANA',
                'SAINT PHIRIN, ANNE',
                'MOISE, FARAH',
                'THEODORE, EMMANUELLA',
                'HAYES, DANALISA',
                'FAUNTLEROY, NICHOLE',
                'BOLDEN-DAVIS, CHRISTINA',
                'ONUMA, MANOUCHECA'
            ]
        };

        // QC Schedule by day of week
        this.qcSchedule = {
            0: {}, // Sunday
            1: {}, // Monday
            2: { // Tuesday
                day: { MOB: 'Previ Gram Stain [WEEKLY-Tue]' },
                night: { AUC: 'Novus [WEEKLY-Tue after 3am]' }
            },
            3: { // Wednesday
                day: { MOB: 'Novus [WEEKLY-Wed MOB]' },
                evening: { Both: 'Stago [WEEKLY-Wed Both]' }
            },
            4: { // Thursday
                night: { Both: 'GeneXpert [WEEKLY-Thu Both]' }
            },
            5: {}, // Friday
            6: { // Saturday
                evening: {
                    AUC: 'Sysmex XN Shutdown 9pm [WEEKLY-Sat]',
                    MOB: 'Sysmex XN Shutdown 10pm [WEEKLY-Sat]'
                },
                day: { Both: 'Hematek [WEEKLY-Sat]' }
            }
        };

        // Daily QC assignments
        this.dailyQC = {
            MOB_Day: 'Pure 1 QC @7:30am [DAILY], Kits QC [DAILY], Sysmex Startup/QC [DAILY], Hematek Startup/QC [DAILY], Previ Gram Stain [DAILY], Stago Maint, Beads Maint',
            AUC_Day_Back: 'MedTox QC [DAILY], Sysmex Startup/QC [DAILY], Hematek Startup/QC [DAILY], Stago Maint',
            AUC_Day_Front: 'Processing/Urines, Kits QC [DAILY], Stago Maint',
            AUC_Evening: 'ESR 10% Check QC [DAILY], Stago Maint',
            AUC_Night: 'MiniSed QC [DAILY], GeneXpert QC [DAILY], Pure 2 QC @3am [DAILY]'
        };

        // List of removed staff (no longer employed)
        this.removedStaff = [
            'SAMUEL', 'LAWSON', 'SAM',
            'LORRAINE', 'BLACKWELL'
        ];
    }

    isRemovedStaff(name) {
        const upperName = name.toUpperCase();
        return this.removedStaff.some(removed => upperName.includes(removed));
    }

    parseEmployeeList(listText, date) {
        const lines = listText.trim().split('\n');
        const employees = {
            phleb: [],
            lab: []
        };

        // Skip header line
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Parse each line
            const parts = line.split('\t').map(p => p.trim());
            if (parts.length < 3) continue;

            const position = parts[0];
            const fullName = parts[1];
            const shift = parts[2];

            // Skip removed staff
            if (this.isRemovedStaff(fullName)) {
                console.log(`Skipping removed staff member: ${fullName}`);
                continue;
            }

            // Extract name and nickname
            const nameMatch = fullName.match(/^([^(]+)(?:\(([^)]+)\))?$/);
            const lastName = nameMatch[1].trim().split(',')[0];
            const firstName = nameMatch[1].trim().split(',')[1]?.trim() || '';
            const nickname = nameMatch[2] || firstName.split(' ')[0];
            const name = `${firstName} ${lastName}`.trim();

            // Parse shift time
            const startTime = this.parseStartTime(shift);

            if (position === 'PHLEB') {
                employees.phleb.push({
                    name: name,
                    nickname: this.getCorrectNickname(name, nickname),
                    shift: this.formatShift(shift),
                    startTime: startTime,
                    originalEntry: fullName,
                    role: 'Phlebotomist', // Add role for phlebs
                    assignment: null // Will be set later
                });
            } else {
                employees.lab.push({
                    name: name,
                    nickname: this.getCorrectNickname(name, nickname),
                    dept: position,
                    shift: this.formatShift(shift),
                    startTime: startTime,
                    originalEntry: fullName,
                    role: this.getLabRole(position), // Add role for lab techs
                    assignment: null // Will be set later
                });
            }
        }

        // Sort by start time
        employees.phleb.sort((a, b) => a.startTime - b.startTime);
        employees.lab.sort((a, b) => a.startTime - b.startTime);

        // Assign roles and QC
        this.assignPhlebRoles(employees.phleb);
        this.assignLabRoles(employees.lab, date);

        // Add breaks
        this.assignBreaks(employees);

        return employees;
    }

    getLabRole(dept) {
        // Map department codes to roles
        const roleMap = {
            'MLS': 'Medical Laboratory Scientist',
            'MLT': 'Medical Laboratory Technician',
            'MLA': 'Medical Laboratory Assistant',
            'CLS': 'Clinical Laboratory Scientist'
        };
        return roleMap[dept] || 'Laboratory Technician';
    }

    getCorrectNickname(name, provided) {
        const nicknameMap = {
            'Johnette Brooks': 'Netta',
            'Emmanuella Theodore': 'Emma',
            'Emmanuel Lejano': 'Boyet',
            'Maxwell Booker': 'Booker',
            'Ogheneochuko Eshofa': 'Tracy',
            'Manoucheca Onuma': 'Mimi'
        };
        return nicknameMap[name] || provided;
    }

    formatShift(shiftText) {
        // Convert "8:00 a.m. - 4:30 p.m." to "8:00a-4:30p"
        return shiftText
            .replace(/\s+/g, '')
            .replace(/\.m\./g, '')
            .replace(/and/, '+ ')
            .replace(/([ap])(?!\.)/g, '$1')
            .replace(/-/g, '-');
    }

    parseStartTime(shift) {
        const match = shift.match(/(\d+):?(\d+)?\s*([ap])/i);
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

    assignPhlebRoles(phlebStaff) {
        let processorAssigned = false;
        let closerAssigned = false;
        let openerAssigned = false;

        phlebStaff.forEach((staff, index) => {
            // First 6am shift is Opener
            if (!openerAssigned && staff.startTime === 6) {
                if (!processorAssigned && this.isProcessorTrained(staff.originalEntry)) {
                    // If trained and first, can be processor
                    if (staff.originalEntry.includes('MIAH')) {
                        staff.assignment = 'Processor';
                        processorAssigned = true;
                    } else {
                        staff.assignment = 'Draw Patients/Opener';
                        openerAssigned = true;
                    }
                } else {
                    staff.assignment = 'Draw Patients/Opener';
                    openerAssigned = true;
                }
            }
            // 6am processor (Youlana usually)
            else if (!processorAssigned && staff.startTime === 6 && this.isProcessorTrained(staff.originalEntry)) {
                staff.assignment = 'Processor';
                processorAssigned = true;
            }
            // 7am shifts are usually runners
            else if (staff.startTime === 7) {
                staff.assignment = 'Draw Patients/Runner';
            }
            // 8am can be backup processor or runner
            else if (staff.startTime === 8) {
                if (this.isProcessorTrained(staff.originalEntry) && !staff.shift.includes('12:00p')) {
                    staff.assignment = 'Draw Patients (Backup Processor)';
                } else if (staff.shift.includes('12:00p')) {
                    staff.assignment = 'Draw Patients';
                } else {
                    staff.assignment = 'Draw Patients/Runner';
                }
            }
            // 9am shifts
            else if (staff.startTime === 9) {
                if (staff.shift.includes('+')) {
                    staff.assignment = 'Draw Patients'; // Split shift
                } else if (staff.originalEntry.includes('GRAYSON')) {
                    staff.assignment = 'Draw Patients/Runner';
                } else {
                    staff.assignment = 'Draw Patients';
                }
            }
            // Evening shifts (2pm)
            else if (staff.startTime === 14) {
                if (staff.originalEntry.includes('HAYES')) {
                    staff.assignment = 'Processor';
                } else if (staff.originalEntry.includes('DODSON')) {
                    staff.assignment = 'Draw Patients/Hot Seat';
                } else if (!closerAssigned) {
                    staff.assignment = 'Draw Patients/Closer';
                    closerAssigned = true;
                } else {
                    staff.assignment = 'Draw Patients';
                }
            }
            // Default
            else {
                staff.assignment = 'Draw Patients';
            }
        });
    }

    isProcessorTrained(name) {
        const trained = [
            'MIAH', 'SAINT PHIRIN', 'MOISE', 'THEODORE',
            'HAYES', 'FAUNTLEROY', 'BOLDEN-DAVIS', 'ONUMA'
        ];
        return trained.some(n => name.toUpperCase().includes(n));
    }

    assignLabRoles(labStaff, date) {
        const dayOfWeek = new Date(date).getDay();
        const dayOfMonth = new Date(date).getDate();
        const weekOfMonth = Math.ceil(dayOfMonth / 7);

        labStaff.forEach(tech => {
            const shift = tech.shift.toLowerCase();
            const isDay = tech.startTime < 15;
            const isEvening = tech.startTime >= 15 && tech.startTime < 21;
            const isNight = tech.startTime >= 21 || tech.startTime < 6;

            // Assign base assignments based on role and shift
            if (tech.dept === 'MLA') {
                tech.assignment = 'MOB Support - Assist with QC/Maint, Inventory, SQA Daily [DAILY], Urines, Kits ONLY (MLA Restriction)';
            } else if (isDay) {
                // Day shift assignments
                if (tech.originalEntry.includes('BOOKER') || tech.originalEntry.includes('BRUSSOT')) {
                    tech.assignment = 'MOB - ' + this.dailyQC.MOB_Day;
                } else if (tech.originalEntry.includes('CREEKMORE') || tech.originalEntry.includes('CHU')) {
                    tech.assignment = 'AUC Front - ' + this.dailyQC.AUC_Day_Front;
                } else if (tech.originalEntry.includes('FRANCIS') || tech.originalEntry.includes('NGENE')) {
                    tech.assignment = 'AUC Back - Hematology, Chemistry, Molecular, ' + this.dailyQC.AUC_Day_Back;
                } else {
                    tech.assignment = 'AUC - General Coverage';
                }
            } else if (isEvening) {
                // Evening shift assignments
                if (tech.originalEntry.includes('TRACY') || tech.originalEntry.includes('ESHOFA')) {
                    tech.assignment = 'AUC Evening - Urines, Kits, Stago, ' + this.dailyQC.AUC_Evening;
                } else if (tech.originalEntry.includes('ALBERT') || tech.originalEntry.includes('CHE')) {
                    tech.assignment = 'AUC Evening - Hematology, Chemistry, Molecular QC';
                } else {
                    tech.assignment = 'AUC Evening - General Coverage';
                }
            } else if (isNight) {
                // Night shift assignments
                tech.assignment = 'AUC Night Coverage - ' + this.dailyQC.AUC_Night;
            }

            // Add weekly QC for this day
            const weeklyQC = this.qcSchedule[dayOfWeek];
            if (weeklyQC) {
                if (isDay && weeklyQC.day) {
                    Object.entries(weeklyQC.day).forEach(([loc, qc]) => {
                        if (tech.assignment.includes(loc) || loc === 'Both') {
                            tech.assignment += ', ' + qc;
                        }
                    });
                }
                if (isEvening && weeklyQC.evening) {
                    Object.entries(weeklyQC.evening).forEach(([loc, qc]) => {
                        if (tech.assignment.includes(loc) || loc === 'Both') {
                            tech.assignment += ', ' + qc;
                        }
                    });
                }
                if (isNight && weeklyQC.night) {
                    Object.entries(weeklyQC.night).forEach(([loc, qc]) => {
                        if (tech.assignment.includes(loc) || loc === 'Both') {
                            tech.assignment += ', ' + qc;
                        }
                    });
                }
            }

            // Add monthly QC if applicable
            this.addMonthlyQC(tech, date, weekOfMonth, dayOfWeek);

            // Add universal tasks
            tech.assignment += ', Wipe Benches, Clean Microscopes, Log QC';
        });
    }

    addMonthlyQC(tech, date, weekOfMonth, dayOfWeek) {
        // 2nd Wednesday
        if (weekOfMonth === 2 && dayOfWeek === 3) {
            if (tech.shift.includes('7:30a') || tech.shift.includes('8:00a')) {
                tech.assignment += ', Hematek [MONTHLY-2nd Wed]';
            }
            if (tech.shift.includes('11:30p') || tech.shift.includes('9:30p')) {
                tech.assignment += ', GeneXpert [MONTHLY-2nd Wed]';
            }
        }
        // 3rd Wednesday
        if (weekOfMonth === 3 && dayOfWeek === 3) {
            if (tech.originalEntry.includes('CREEKMORE') || tech.originalEntry.includes('FRANCIS')) {
                tech.assignment += ', MedTox [MONTHLY-3rd Wed]';
            }
        }
    }

    assignBreaks(employees) {
        // Standard break patterns
        employees.phleb.forEach(staff => {
            staff.breaks = this.generateBreaks(staff.startTime, staff.shift);
        });

        employees.lab.forEach(staff => {
            staff.breaks = this.generateBreaks(staff.startTime, staff.shift);
        });
    }

    generateBreaks(startTime, shift) {
        const shiftDuration = this.calculateShiftDuration(shift);
        let breaks = [];

        if (shiftDuration >= 8) {
            // Full shift: 2 breaks + lunch
            const break1 = startTime + 2.25; // 2:15 after start
            const lunch = startTime + 4.5;   // 4:30 after start
            const break2 = startTime + 7;     // 7:00 after start

            breaks = [
                `Break 1: ${this.formatTime(break1)}-${this.formatTime(break1 + 0.25)}`,
                `Lunch: ${this.formatTime(lunch)}-${this.formatTime(lunch + 0.5)}`,
                `Break 2: ${this.formatTime(break2)}-${this.formatTime(break2 + 0.25)}`
            ];
        } else if (shiftDuration >= 6) {
            // 6-hour shift: 1 break + lunch
            const break1 = startTime + 2;
            const lunch = startTime + 4;

            breaks = [
                `Break 1: ${this.formatTime(break1)}-${this.formatTime(break1 + 0.25)}`,
                `Lunch: ${this.formatTime(lunch)}-${this.formatTime(lunch + 0.5)}`
            ];
        } else if (shiftDuration >= 4) {
            // 4-hour shift: 1 break
            const break1 = startTime + 2;
            breaks = [`Break 1: ${this.formatTime(break1)}-${this.formatTime(break1 + 0.25)}`];
        }

        return breaks.join(' | ');
    }

    calculateShiftDuration(shift) {
        const times = shift.match(/(\d+):?(\d+)?([ap])/gi);
        if (times && times.length >= 2) {
            const start = this.parseTimeString(times[0]);
            const end = this.parseTimeString(times[1]);
            return end > start ? end - start : (24 - start) + end;
        }
        return 8; // Default 8-hour shift
    }

    parseTimeString(timeStr) {
        const match = timeStr.match(/(\d+):?(\d+)?([ap])/i);
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

    formatTime(decimalTime) {
        const hours = Math.floor(decimalTime) % 24;
        const minutes = Math.round((decimalTime % 1) * 60);
        const displayHour = hours === 0 ? 12 : (hours > 12 ? hours - 12 : hours);
        const ampm = hours >= 12 ? 'p' : 'a';
        const minStr = minutes.toString().padStart(2, '0');
        return `${displayHour}:${minStr}${ampm}`;
    }

    generateScheduleHTML(employees, date) {
        const dateObj = new Date(date);
        const dateStr = dateObj.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        let html = `
        <div class="schedule-output">
            <h2>Schedule for ${dateStr}</h2>
            <div class="updated-notice">Staff list updated: Removed Sam Lawson and Lorraine Blackwell</div>

            <div class="schedule-section">
                <h3>Phlebotomy Team</h3>
                <table class="schedule-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Assignment</th>
                            <th>Shift</th>
                            <th>Breaks</th>
                        </tr>
                    </thead>
                    <tbody>`;

        employees.phleb.forEach(staff => {
            html += `
                        <tr>
                            <td>${staff.name} (${staff.nickname})</td>
                            <td>${staff.role}</td>
                            <td>${staff.assignment}</td>
                            <td>${staff.shift}</td>
                            <td>${staff.breaks || 'N/A'}</td>
                        </tr>`;
        });

        html += `
                    </tbody>
                </table>
            </div>

            <div class="schedule-section">
                <h3>Laboratory Team</h3>
                <table class="schedule-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Role</th>
                            <th>Assignment</th>
                            <th>Shift</th>
                            <th>Breaks</th>
                        </tr>
                    </thead>
                    <tbody>`;

        employees.lab.forEach(tech => {
            html += `
                        <tr>
                            <td>${tech.name} (${tech.nickname})</td>
                            <td>${tech.dept}</td>
                            <td>${tech.role}</td>
                            <td>${tech.assignment}</td>
                            <td>${tech.shift}</td>
                            <td>${tech.breaks || 'N/A'}</td>
                        </tr>`;
        });

        html += `
                    </tbody>
                </table>
            </div>

            <div class="schedule-summary">
                <h3>Summary</h3>
                <p>Phlebotomy Staff: ${employees.phleb.length}</p>
                <p>Laboratory Staff: ${employees.lab.length}</p>
                <p>Total Staff: ${employees.phleb.length + employees.lab.length}</p>
            </div>
        </div>`;

        return html;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScheduleGenerator;
}