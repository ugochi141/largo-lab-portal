// Complete October 15, 2025 Schedule with ALL 21 Employees
const october15Schedule = {
    '2025-10-15': {
        phleb: [
            // DAY SHIFT PHLEBOTOMY
            {
                name: 'Christina Bolden-Davis',
                nickname: 'Christina',
                assignment: 'Draw Patients/Opener',
                shift: '6:00a-2:30p',
                breaks: 'Break 1: 8:15a-8:30a | Lunch: 10:30a-11:00a | Break 2: 1:00p-1:15p',
                startTime: 6
            },
            {
                name: 'Youlana Miah',
                nickname: 'Youlana',
                assignment: 'Processor',
                shift: '6:00a-2:30p',
                breaks: 'Break 1: 8:30a-8:45a | Lunch: 11:00a-11:30a | Break 2: 1:15p-1:30p',
                startTime: 6
            },
            {
                name: 'Johnette Brooks',
                nickname: 'Netta',
                assignment: 'Draw Patients/Runner',
                shift: '7:00a-3:30p',
                breaks: 'Break 1: 9:00a-9:15a | Lunch: 11:00a-11:30a | Break 2: 1:00p-1:15p',
                startTime: 7
            },
            {
                name: 'Cheryl Gray',
                nickname: 'Cheryl',
                assignment: 'Draw Patients/Runner',
                shift: '8:00a-4:30p',
                breaks: 'Break 1: 10:15a-10:30a | Lunch: 12:30p-1:00p | Break 2: 2:45p-3:00p',
                startTime: 8
            },
            {
                name: 'Anne Saint Phirin',
                nickname: 'Anne',
                assignment: 'Draw Patients (Backup Processor)',
                shift: '8:00a-4:30p',
                breaks: 'Break 1: 10:30a-10:45a | Lunch: 1:00p-1:30p | Break 2: 3:00p-3:15p',
                startTime: 8
            },
            {
                name: 'Micaela Scarborough',
                nickname: 'Micaela',
                assignment: 'Draw Patients',
                shift: '8:00a-12:00p',
                breaks: 'Break 1: 10:00a-10:15a',
                startTime: 8
            },
            {
                name: 'Raquel Grayson',
                nickname: 'Raquel',
                assignment: 'Draw Patients/Runner',
                shift: '9:00a-5:30p',
                breaks: 'Break 1: 11:15a-11:30a | Lunch: 1:00p-1:30p | Break 2: 3:45p-4:00p',
                startTime: 9
            },
            {
                name: 'Emmanuella Theodore',
                nickname: 'Emma',
                assignment: 'Draw Patients',
                shift: '9:00a-5:30p',
                breaks: 'Break 1: 11:30a-11:45a | Lunch: 1:30p-2:00p | Break 2: 4:00p-4:15p',
                startTime: 9
            },
            {
                name: 'Taric White',
                nickname: 'Taric',
                assignment: 'Draw Patients',
                shift: '9:00a-1:00p + 5:00p-9:00p',
                breaks: 'AM: Break 1: 10:45a-11:00a | PM: Break 1: 6:45p-7:00p',
                startTime: 9
            },
            // EVENING SHIFT PHLEBOTOMY
            {
                name: 'Stephanie Dodson',
                nickname: 'Stephanie',
                assignment: 'Draw Patients/Hot Seat',
                shift: '2:00p-10:30p',
                breaks: 'Break 1: 4:00p-4:15p | Lunch: 6:00p-6:30p | Break 2: 8:30p-8:45p',
                startTime: 14
            },
            {
                name: 'Nichole Fauntleroy',
                nickname: 'Nichole',
                assignment: 'Draw Patients/Closer',
                shift: '2:00p-10:30p',
                breaks: 'Break 1: 4:15p-4:30p | Lunch: 6:30p-7:00p | Break 2: 8:45p-9:00p',
                startTime: 14
            },
            {
                name: 'Danalisa Hayes',
                nickname: 'Danalisa',
                assignment: 'Processor',
                shift: '2:00p-10:30p',
                breaks: 'Break 1: 4:30p-4:45p | Lunch: 6:45p-7:15p | Break 2: 9:00p-9:15p',
                startTime: 14
            }
        ],
        lab: [
            // DAY SHIFT LAB
            {
                name: 'Dat Chu',
                nickname: 'Dat',
                dept: 'MLS',
                assignment: 'AUC Front - Processing/Urines, Kits QC [DAILY], Stago Maint, Log QC (Evening: Stago [WEEKLY-Wed Both])',
                shift: '7:00a-2:30p + 3:30p-12:00a',
                breaks: 'AM: Break 1: 9:15a-9:30a | Lunch: 11:30a-12:00p | PM: Break 1: 6:15p-6:30p | Lunch: 8:30p-9:00p | Break 2: 10:45p-11:00p',
                startTime: 7
            },
            {
                name: 'Francis Azih Ngene',
                nickname: 'Francis',
                dept: 'MLS',
                assignment: 'AUC Back - Hematology, Chemistry, Molecular, MedTox QC [DAILY], MedTox [MONTHLY-3rd Wed], Hematek [MONTHLY-CATCH UP], Sysmex/Hematek Startup, Stago Maint, Log QC',
                shift: '7:30a-4:00p',
                breaks: 'Break 1: 9:45a-10:00a | Lunch: 12:00p-12:30p | Break 2: 2:30p-2:45p',
                startTime: 7.5
            },
            // Lorraine Blackwell - REMOVED (No longer staff)
            {
                name: 'Steeven Brussot',
                nickname: 'Steeven',
                dept: 'MLT',
                assignment: 'MOB - Pure 1 QC @7:30am [DAILY], Kits QC [DAILY], Sysmex/Hematek Startup, Previ Gram [DAILY], Novus [WEEKLY-Wed MOB], Hematek [MONTHLY-CATCH UP], Stago Maint, Beads Maint, Log QC',
                shift: '8:00a-4:30p',
                breaks: 'Break 1: 10:15a-10:30a | Lunch: 1:00p-1:30p | Break 2: 3:00p-3:15p',
                startTime: 8
            },
            // EVENING SHIFT LAB
            {
                name: 'Ogheneochuko Eshofa',
                nickname: 'Tracy',
                dept: 'MLT',
                assignment: 'AUC Evening - Urines, Kits, Stago, ESR 10% Check QC [DAILY], Stago [WEEKLY-Wed Both], Log QC',
                shift: '3:30p-12:00a',
                breaks: 'Break 1: 5:45p-6:00p | Lunch: 7:30p-8:00p | Break 2: 10:00p-10:15p',
                startTime: 15.5
            },
            {
                name: 'Albert Che',
                nickname: 'Albert',
                dept: 'MLS',
                assignment: 'AUC Evening - Hematology, Chemistry, Molecular QC, Stago [WEEKLY-Wed Both], Log QC',
                shift: '3:30p-12:00a',
                breaks: 'Break 1: 6:00p-6:15p | Lunch: 8:00p-8:30p | Break 2: 10:15p-10:30p',
                startTime: 15.5
            },
            // Samuel Lawson - REMOVED (No longer staff)
            // NIGHT SHIFT LAB
            {
                name: 'Emmanuel Lejano',
                nickname: 'Boyet',
                dept: 'MLT',
                assignment: 'AUC Night - MiniSed QC [DAILY], GeneXpert QC [DAILY], GeneXpert [MONTHLY-CATCH UP], Log QC',
                shift: '9:30p-6:00a',
                breaks: 'Break 1: 11:30p-11:45p | Lunch: 1:30a-2:00a | Break 2: 4:00a-4:15a',
                startTime: 21.5
            },
            {
                name: 'George Etape',
                nickname: 'George',
                dept: 'MLS',
                assignment: 'AUC Night - Pure 2 QC @3am [DAILY], MiniSed QC [DAILY], GeneXpert QC [DAILY], GeneXpert [MONTHLY-CATCH UP], Log QC',
                shift: '11:30p-8:00a',
                breaks: 'Break 1: 1:00a-1:15a | Lunch: 3:00a-3:30a | Break 2: 5:30a-5:45a',
                startTime: 23.5
            }
        ]
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = october15Schedule;
}