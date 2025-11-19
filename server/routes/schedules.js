/**
 * Schedule Routes
 * Endpoints for daily staff scheduling
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

// Mock schedule data - in production this would come from database
const mockScheduleData = {
  '2025-11-06': {
    phleb: [
      {name: 'Christina Bolden-Davis', nickname: 'Christina', assignment: 'Draw Patients/Opener', shift: '6:00a-2:30p', breaks: 'Break 1: 8:00a-8:15a | Lunch: 10:30a-11:00a | Break 2: 12:30p-12:45p', startTime: 6},
      {name: 'Farah Moise', nickname: 'Farah', assignment: 'Draw Patients (Backup Processor)', shift: '6:00a-4:30p', breaks: 'Break 1: 8:00a-8:15a | Lunch: 11:30a-12:00p | Break 2: 2:00p-2:15p', startTime: 6},
      {name: 'Johnette Brooks', nickname: 'Netta', assignment: 'Draw Patients', shift: '7:00a-3:30p', breaks: 'Break 1: 9:00a-9:15a | Lunch: 11:00a-11:30a | Break 2: 1:00p-1:15p', startTime: 7},
      {name: 'Anne Saint Phirin', nickname: 'Anne', assignment: 'Processor', shift: '8:00a-4:30p', breaks: 'Break 1: 10:00a-10:15a | Lunch: 12:30p-1:00p | Break 2: 3:00p-3:15p', startTime: 8},
      {name: 'Manoucheca Onuma', nickname: 'Mimi', assignment: 'Draw Patients', shift: '8:00a-4:30p', breaks: 'Break 1: 10:15a-10:30a | Lunch: 1:00p-1:30p | Break 2: 3:15p-3:30p', startTime: 8},
      {name: 'Micaela Scarborough', nickname: 'Micaela', assignment: 'Processing Training/Draw Patients', shift: '8:00a-1:00p', breaks: 'Break 1: 10:00a-10:15a | Break 2: 12:00p-12:15p', notes: 'Part-time shift', startTime: 8},
      {name: 'Nichole Fauntleroy', nickname: 'Nichole', assignment: 'Draw Patients', shift: '2:00p-10:30p', breaks: 'Break 1: 4:15p-4:30p | Lunch: 6:30p-7:00p | Break 2: 8:45p-9:00p', startTime: 14},
      {name: 'Danalisa Hayes', nickname: 'Danalisa', assignment: 'Processor', shift: '2:00p-10:30p', breaks: 'Break 1: 4:30p-4:45p | Lunch: 7:00p-7:30p | Break 2: 9:00p-9:15p', startTime: 14},
      {name: 'Shannon Pilkington', nickname: 'Shannon', assignment: 'Draw Patients/Hot Seat', shift: '2:00p-10:30p', breaks: 'Break 1: 4:45p-5:00p | Lunch: 7:30p-8:00p | Break 2: 9:15p-9:30p', startTime: 14},
      {name: 'Taric White', nickname: 'Taric', assignment: 'Draw Patients', shift: '5:00p-9:00p', breaks: 'Break 1: 6:45p-7:00p', notes: 'Evening part-time shift', startTime: 17}
    ],
    lab: [
      {name: 'Emily Creekmore', nickname: 'Emily', dept: 'MLT', shift: '7:30a-4:00p', assignment: 'AUC - Tech 1 - Processing, Wipe Benches, Clean Microscopes, Log QC', breaks: 'Break 1: 9:30a-9:45a | Lunch: 12:00p-12:30p | Break 2: 2:30p-2:45p', startTime: 7.5},
      {name: 'Francis Azih Ngene', nickname: 'Francis', dept: 'MLS', shift: '7:30a-4:00p', assignment: 'AUC - Tech 2 - Urines, Kits, Coag, Kits QC [DAILY], Stago Maint, Wipe Benches, Clean Microscopes, Log QC', breaks: 'Break 1: 9:30a-9:45a | Lunch: 12:00p-12:30p | Break 2: 2:30p-2:45p', startTime: 7.5},
      {name: 'Ingrid Benitez-Ruiz', nickname: 'Ingrid', dept: 'MLS', shift: '7:30a-4:00p', assignment: 'AUC - Tech 3 - Hematology, Chemistry, Molecular, MedTox QC [DAILY], Sysmex XN Startup/QC [DAILY], Hematek Startup/QC [DAILY], Wipe Benches, Clean Microscopes, Log QC', breaks: 'Break 1: 9:45a-10:00a | Lunch: 12:30p-1:00p | Break 2: 2:45p-3:00p', startTime: 7.5},
      {name: 'Ogheneochuko Eshofa', nickname: 'Tracy', dept: 'MLT', shift: '3:30p-12:00a', assignment: 'AUC Front - Tech 1 - Processing/Urines, Kits, Stago, Kits QC [DAILY], ESR 10% Check QC [DAILY], Stago Maint, Wipe Benches, Clean Microscopes, Log QC', breaks: 'Break 1: 5:30p-5:45p | Lunch: 7:30p-8:00p | Break 2: 10:00p-10:15p', startTime: 15.5},
      {name: 'Albert Che', nickname: 'Albert', dept: 'MLS', shift: '3:30p-12:00a', assignment: 'AUC Back - Tech 2 - Hematology, Chemistry, Molecular, Wipe Benches, Clean Microscopes, Log QC', breaks: 'Break 1: 5:45p-6:00p | Lunch: 8:00p-8:30p | Break 2: 10:15p-10:30p', startTime: 15.5},
      {name: 'Emmanuel Lejano', nickname: 'Boyet', dept: 'MLT', shift: '9:30p-6:00a', assignment: 'AUC Front - Tech 1 - Processing/Urines, Kits, Stago, Kits QC [DAILY], Stago Maint, Wipe Benches, Clean Microscopes, Log QC', breaks: 'Break 1: 11:30p-11:45p | Lunch: 2:00a-2:30a | Break 2: 4:30a-4:45a', startTime: 21.5},
      {name: 'George Etape', nickname: 'George', dept: 'MLS', shift: '11:30p-8:00a', assignment: 'AUC Back - Tech 2 - Hematology, Chemistry, Molecular, Pure 2 QC @3am [DAILY], MiniSed QC [DAILY], GeneXpert QC [DAILY], Wipe Benches, Clean Microscopes, Log QC', breaks: 'Break 1: 1:00a-1:15a | Lunch: 3:00a-3:30a | Break 2: 5:30a-5:45a', startTime: 23.5}
    ]
  },
  '2025-11-17': {
    phleb: [
      {name: 'Christina Bolden-Davis', nickname: 'Christina', assignment: 'Draw Patients/Opener', shift: '6:00a-2:30p', breaks: 'Break 1: 8:00a-8:15a | Lunch: 10:30a-11:00a | Break 2: 12:30p-12:45p', startTime: 6},
      {name: 'Youlana Miah', nickname: 'Youlana', assignment: 'Draw Patients/Opener', shift: '6:00a-2:30p', breaks: 'Break 1: 8:15a-8:30a | Lunch: 11:00a-11:30a | Break 2: 12:45p-1:00p', startTime: 6},
      {name: 'Johnette Brooks', nickname: 'Netta', assignment: 'Draw Patients', shift: '7:00a-3:30p', breaks: 'Break 1: 9:00a-9:15a | Lunch: 11:00a-11:30a | Break 2: 1:00p-1:15p', startTime: 7},
      {name: 'Anne Saint Phirin', nickname: 'Anne', assignment: 'Draw Patients', shift: '8:00a-4:30p', breaks: 'Break 1: 10:00a-10:15a | Lunch: 12:30p-1:00p | Break 2: 3:00p-3:15p', startTime: 8},
      {name: 'Farah Moise', nickname: 'Farah', assignment: 'Processor', shift: '8:00a-4:30p', breaks: 'Break 1: 10:15a-10:30a | Lunch: 1:00p-1:30p | Break 2: 3:15p-3:30p', startTime: 8},
      {name: 'Manoucheca Onuma', nickname: 'Mimi', assignment: 'Draw Patients', shift: '8:00a-4:30p', breaks: 'Break 1: 10:30a-10:45a | Lunch: 1:30p-2:00p | Break 2: 3:30p-3:45p', startTime: 8},
      {name: 'Getu Babsa', nickname: 'Getu', assignment: 'Draw Patients', shift: '9:00a-1:00p', breaks: 'Break 1: 10:45a-11:00a', notes: 'Part-time shift', startTime: 9},
      {name: 'Stephanie Dodson', nickname: 'Stephanie', assignment: 'Draw Patients', shift: '2:00p-10:30p', breaks: 'Break 1: 4:15p-4:30p | Lunch: 6:30p-7:00p | Break 2: 8:45p-9:00p', startTime: 14},
      {name: 'Nichole Fauntleroy', nickname: 'Nichole', assignment: 'Draw Patients', shift: '2:00p-10:30p', breaks: 'Break 1: 4:30p-4:45p | Lunch: 7:00p-7:30p | Break 2: 9:00p-9:15p', startTime: 14},
      {name: 'Danalisa Hayes', nickname: 'Danalisa', assignment: 'Processor', shift: '2:00p-10:30p', breaks: 'Break 1: 4:45p-5:00p | Lunch: 7:30p-8:00p | Break 2: 9:15p-9:30p', startTime: 14},
      {name: 'Shannon Pilkington', nickname: 'Shannon', assignment: 'Draw Patients/Hot Seat', shift: '2:00p-10:30p', breaks: 'Break 1: 5:00p-5:15p | Lunch: 8:00p-8:30p | Break 2: 9:30p-9:45p', startTime: 14},
      {name: 'Taric White', nickname: 'Taric', assignment: 'Draw Patients', shift: '5:00p-9:00p', breaks: 'Break 1: 6:45p-7:00p', notes: 'Evening part-time shift', startTime: 17}
    ],
    lab: [
      {name: 'Francis Azih Ngene', nickname: 'Francis', dept: 'MLS', shift: '7:30a-4:00p', assignment: 'AUC - Tech 1 - Processing, Wipe Benches, Clean Microscopes, Log QC', breaks: 'Break 1: 9:30a-9:45a | Lunch: 12:00p-12:30p | Break 2: 2:30p-2:45p', startTime: 7.5},
      {name: 'Ingrid Benitez-Ruiz', nickname: 'Ingrid', dept: 'MLS', shift: '7:30a-4:00p', assignment: 'MOB - Tech 2 - Urines, Kits, Coag, Kits QC [DAILY], Stago Maint, Wipe Benches, Clean Microscopes, Log QC', breaks: 'Break 1: 9:45a-10:00a | Lunch: 12:30p-1:00p | Break 2: 2:45p-3:00p', startTime: 7.5},
      {name: 'Albert Che', nickname: 'Albert', dept: 'MLS', shift: '8:00a-4:30p', assignment: 'AUC - Tech 3 - Hematology, Chemistry, Molecular, MedTox QC [DAILY], Sysmex XN Startup/QC [DAILY], Hematek Startup/QC [DAILY], Wipe Benches, Clean Microscopes, Log QC', breaks: 'Break 1: 10:00a-10:15a | Lunch: 1:00p-1:30p | Break 2: 3:00p-3:15p', notes: 'Extended shift coverage', startTime: 8},
      {name: 'Ogheneochuko Eshofa', nickname: 'Tracy', dept: 'MLT', shift: '3:30p-12:00a', assignment: 'AUC Front - Tech 1 - Processing/Urines, Kits, Stago, Kits QC [DAILY], ESR 10% Check QC [DAILY], Stago Maint, Wipe Benches, Clean Microscopes, Log QC', breaks: 'Break 1: 5:30p-5:45p | Lunch: 7:30p-8:00p | Break 2: 10:00p-10:15p', startTime: 15.5},
      {name: 'Lionel Ndifor', nickname: 'Lionel', dept: 'MLT', shift: '3:30p-12:00a', assignment: 'AUC Back - Tech 2 - Hematology, Chemistry, Molecular, Wipe Benches, Clean Microscopes, Log QC', breaks: 'Break 1: 5:45p-6:00p | Lunch: 8:00p-8:30p | Break 2: 10:15p-10:30p', startTime: 15.5},
      {name: 'Emmanuel Lejano', nickname: 'Boyet', dept: 'MLT', shift: '9:30p-6:00a', assignment: 'AUC Front - Tech 1 - Processing/Urines, Kits, Stago, Kits QC [DAILY], Stago Maint, Wipe Benches, Clean Microscopes, Log QC', breaks: 'Break 1: 11:30p-11:45p | Lunch: 2:00a-2:30a | Break 2: 4:30a-4:45a', notes: 'Extended night coverage', startTime: 21.5},
      {name: 'George Etape', nickname: 'George', dept: 'MLS', shift: '11:30p-8:00a', assignment: 'AUC Back - Tech 2 - Hematology, Chemistry, Molecular, Pure 2 QC @3am [DAILY], MiniSed QC [DAILY], GeneXpert QC [DAILY], Wipe Benches, Clean Microscopes, Log QC', breaks: 'Break 1: 1:00a-1:15a | Lunch: 3:00a-3:30a | Break 2: 5:30a-5:45a', startTime: 23.5}
    ]
  }
};

// Get daily schedule
router.get('/daily', (req, res) => {
  try {
    res.json(mockScheduleData);
  } catch (error) {
    console.error('Error fetching daily schedule:', error);
    res.status(500).json({ error: 'Failed to fetch schedule data' });
  }
});

// Get schedule for specific date
router.get('/daily/:date', (req, res) => {
  try {
    const { date } = req.params;
    const scheduleForDate = mockScheduleData[date];
    
    if (!scheduleForDate) {
      return res.status(404).json({ 
        error: 'Schedule not found for this date',
        message: `No schedule data available for ${date}`
      });
    }
    
    res.json(scheduleForDate);
  } catch (error) {
    console.error('Error fetching schedule for date:', error);
    res.status(500).json({ error: 'Failed to fetch schedule data' });
  }
});

module.exports = router;
