import React, { useState, useEffect, useMemo } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { format, addDays, subDays } from 'date-fns';
import { useScheduleStore } from '@/store/scheduleStore';
import { useStaffStore } from '@/store/staffStore';
import { exportSchedule } from '@/utils/export';
import { validateScheduleEntry } from '@/utils/validation';
import { PhlebotomyRole, type ScheduleEntry, type TimeSlot, type ExportOptions } from '@/types';
import ScheduleTimeSlot from './ScheduleTimeSlot';
import StaffCard from './StaffCard';
import ConflictAlert from './ConflictAlert';

const TIME_SLOTS: TimeSlot[] = Array.from({ length: 14 }, (_, i) => ({
  id: `slot-${i}`,
  startTime: `${(6 + i).toString().padStart(2, '0')}:00`,
  endTime: `${(7 + i).toString().padStart(2, '0')}:00`,
  date: new Date(),
}));

const InteractiveScheduleManager: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeStaffId, setActiveStaffId] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const {
    currentSchedule,
    setCurrentSchedule,
    addScheduleEntry,
    updateScheduleEntry,
    removeScheduleEntry,
    conflicts,
    detectConflicts,
    clearConflicts,
  } = useScheduleStore();

  const { staff } = useStaffStore();

  // Filter schedule entries for selected date
  const todayEntries = useMemo(() => {
    if (!currentSchedule) return [];
    return currentSchedule.entries.filter(
      (entry) => format(entry.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    );
  }, [currentSchedule, selectedDate]);

  // Initialize or load schedule for selected date
  useEffect(() => {
    if (!currentSchedule || format(currentSchedule.date, 'yyyy-MM-dd') !== format(selectedDate, 'yyyy-MM-dd')) {
      setCurrentSchedule({
        id: `schedule-${format(selectedDate, 'yyyy-MM-dd')}`,
        date: selectedDate,
        entries: [],
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        published: false,
      });
    }
  }, [selectedDate, currentSchedule, setCurrentSchedule]);

  // Detect conflicts when entries change
  useEffect(() => {
    if (currentSchedule) {
      detectConflicts(currentSchedule.id);
    }
  }, [currentSchedule?.entries.length, detectConflicts]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveStaffId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveStaffId(null);

    if (!over) return;

    const staffId = active.id as string;
    const timeSlotId = over.id as string;

    // Check if dropping on a time slot
    if (!timeSlotId.startsWith('slot-')) return;

    // Create new schedule entry
    const timeSlot = TIME_SLOTS.find((slot) => slot.id === timeSlotId);
    if (!timeSlot) return;

    const staffMember = staff.find((s) => s.id === staffId);
    if (!staffMember) return;

    const newEntry: ScheduleEntry = {
      id: `entry-${Date.now()}`,
      staffId,
      timeSlotId,
      date: selectedDate,
      role: staffMember.role,
      station: '',
      notes: '',
      isBreak: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Validate before adding
    const entryConflicts = validateScheduleEntry(
      newEntry,
      todayEntries,
      staff,
      TIME_SLOTS
    );

    if (entryConflicts.some((c) => c.severity === 'ERROR')) {
      alert('Cannot add entry: ' + entryConflicts.map((c) => c.message).join(', '));
      return;
    }

    addScheduleEntry(newEntry);
  };

  const handleRemoveEntry = (entryId: string) => {
    if (confirm('Are you sure you want to remove this schedule entry?')) {
      removeScheduleEntry(entryId);
    }
  };

  const handleUpdateEntry = (entryId: string, updates: Partial<ScheduleEntry>) => {
    updateScheduleEntry(entryId, updates);
  };

  const handleAddBreak = (staffId: string, timeSlotId: string) => {
    const staffMember = staff.find((s) => s.id === staffId);
    if (!staffMember) return;

    const breakEntry: ScheduleEntry = {
      id: `break-${Date.now()}`,
      staffId,
      timeSlotId,
      date: selectedDate,
      role: staffMember.role,
      notes: 'Break',
      isBreak: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addScheduleEntry(breakEntry);
  };

  const handleExport = (format: 'PDF' | 'EXCEL' | 'CSV') => {
    if (!currentSchedule) return;

    const options: ExportOptions = { format };
    try {
      exportSchedule(currentSchedule, staff, options);
      setShowExportMenu(false);
    } catch (error) {
      alert('Export failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleDateChange = (days: number) => {
    if (days < 0) {
      setSelectedDate(subDays(selectedDate, Math.abs(days)));
    } else {
      setSelectedDate(addDays(selectedDate, days));
    }
    clearConflicts();
  };

  // Get entries for each time slot
  const getEntriesForTimeSlot = (timeSlotId: string): ScheduleEntry[] => {
    return todayEntries.filter((entry) => entry.timeSlotId === timeSlotId);
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary-700 mb-2">
                Interactive Schedule Manager
              </h1>
              <p className="text-neutral-600">
                Phlebotomy Staff Daily Schedule
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDateChange(-1)}
                className="btn btn-secondary"
                aria-label="Previous day"
              >
                ← Previous
              </button>

              <input
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="form-input"
                aria-label="Select date"
              />

              <button
                onClick={() => handleDateChange(1)}
                className="btn btn-secondary"
                aria-label="Next day"
              >
                Next →
              </button>
            </div>
          </div>

          {/* Date Banner */}
          <div className="mt-6 bg-primary-50 border-l-4 border-primary-500 p-4 rounded-lg">
            <p className="text-lg font-semibold text-primary-700 text-center">
              {format(selectedDate, 'EEEE, MMMM dd, yyyy')}
            </p>
          </div>
        </div>
      </div>

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <div className="max-w-7xl mx-auto mb-6">
          <ConflictAlert conflicts={conflicts} staff={staff} />
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto" id="main-content">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Staff Roster Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-soft p-6 sticky top-6">
              <h2 className="text-xl font-bold text-primary-700 mb-4">
                Available Staff
              </h2>

              <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="space-y-3">
                  {staff
                    .filter((s) => s.active)
                    .map((staffMember) => (
                      <StaffCard
                        key={staffMember.id}
                        staff={staffMember}
                        isDragging={activeStaffId === staffMember.id}
                      />
                    ))}
                </div>

                <DragOverlay>
                  {activeStaffId ? (
                    <StaffCard
                      staff={staff.find((s) => s.id === activeStaffId)!}
                      isDragging={true}
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>

              <div className="mt-6 pt-6 border-t border-neutral-200">
                <h3 className="text-sm font-semibold text-neutral-700 mb-2">
                  Role Legend
                </h3>
                <div className="space-y-2 text-xs">
                  {Object.values(PhlebotomyRole).map((role) => (
                    <div key={role} className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary-500 rounded-full" />
                      <span>{role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Grid */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary-700">
                  Daily Schedule (6:00 AM - 8:00 PM)
                </h2>

                <div className="relative">
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="btn btn-primary"
                  >
                    Export Schedule
                  </button>

                  {showExportMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-strong border border-neutral-200 py-2 z-10">
                      <button
                        onClick={() => handleExport('PDF')}
                        className="w-full px-4 py-2 text-left hover:bg-primary-50 transition-colors"
                      >
                        Export as PDF
                      </button>
                      <button
                        onClick={() => handleExport('EXCEL')}
                        className="w-full px-4 py-2 text-left hover:bg-primary-50 transition-colors"
                      >
                        Export as Excel
                      </button>
                      <button
                        onClick={() => handleExport('CSV')}
                        className="w-full px-4 py-2 text-left hover:bg-primary-50 transition-colors"
                      >
                        Export as CSV
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Time Slots */}
              <DndContext onDragEnd={handleDragEnd}>
                <div className="space-y-4">
                  {TIME_SLOTS.map((timeSlot) => {
                    const entries = getEntriesForTimeSlot(timeSlot.id);
                    return (
                      <ScheduleTimeSlot
                        key={timeSlot.id}
                        timeSlot={timeSlot}
                        entries={entries}
                        staff={staff}
                        onRemoveEntry={handleRemoveEntry}
                        onUpdateEntry={handleUpdateEntry}
                        onAddBreak={handleAddBreak}
                      />
                    );
                  })}
                </div>
              </DndContext>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="max-w-7xl mx-auto mt-6">
        <div className="bg-secondary-50 border-l-4 border-secondary-500 p-4 rounded-lg">
          <h3 className="font-semibold text-secondary-700 mb-2">
            How to Use
          </h3>
          <ul className="text-sm text-secondary-700 space-y-1">
            <li>• Drag staff members from the left sidebar to time slots to create schedule entries</li>
            <li>• Click the edit icon to modify entry details</li>
            <li>• Click the delete icon to remove an entry</li>
            <li>• System automatically detects conflicts and displays warnings</li>
            <li>• Use export buttons to generate PDF or Excel reports</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InteractiveScheduleManager;
