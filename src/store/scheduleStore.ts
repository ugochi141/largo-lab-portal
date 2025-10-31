import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  Schedule,
  ScheduleEntry,
  ScheduleConflict,
} from '@/types';

interface ScheduleState {
  schedules: Schedule[];
  currentSchedule: Schedule | null;
  conflicts: ScheduleConflict[];
  loading: boolean;
  error: string | null;

  // Actions
  setSchedules: (schedules: Schedule[]) => void;
  setCurrentSchedule: (schedule: Schedule | null) => void;
  addScheduleEntry: (entry: ScheduleEntry) => void;
  updateScheduleEntry: (entryId: string, updates: Partial<ScheduleEntry>) => void;
  removeScheduleEntry: (entryId: string) => void;
  detectConflicts: (scheduleId: string) => void;
  publishSchedule: (scheduleId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearConflicts: () => void;
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    immer((set) => ({
      schedules: [],
      currentSchedule: null,
      conflicts: [],
      loading: false,
      error: null,

      setSchedules: (schedules) =>
        set((state) => {
          state.schedules = schedules;
        }),

      setCurrentSchedule: (schedule) =>
        set((state) => {
          state.currentSchedule = schedule;
        }),

      addScheduleEntry: (entry) =>
        set((state) => {
          if (state.currentSchedule) {
            state.currentSchedule.entries.push(entry);
            state.currentSchedule.updatedAt = new Date();
          }
        }),

      updateScheduleEntry: (entryId, updates) =>
        set((state) => {
          if (state.currentSchedule) {
            const entryIndex = state.currentSchedule.entries.findIndex(
              (e) => e.id === entryId
            );
            if (entryIndex !== -1) {
              state.currentSchedule.entries[entryIndex] = {
                ...state.currentSchedule.entries[entryIndex],
                ...updates,
                updatedAt: new Date(),
              };
            }
          }
        }),

      removeScheduleEntry: (entryId) =>
        set((state) => {
          if (state.currentSchedule) {
            state.currentSchedule.entries = state.currentSchedule.entries.filter(
              (e) => e.id !== entryId
            );
            state.currentSchedule.updatedAt = new Date();
          }
        }),

      detectConflicts: (scheduleId) =>
        set((state) => {
          const schedule = state.schedules.find((s) => s.id === scheduleId);
          if (!schedule) return;

          const conflicts: ScheduleConflict[] = [];
          const staffTimeMap = new Map<string, Set<string>>();

          // Check for double bookings
          schedule.entries.forEach((entry) => {
            const key = entry.staffId;
            if (!staffTimeMap.has(key)) {
              staffTimeMap.set(key, new Set());
            }

            const timeSlots = staffTimeMap.get(key)!;
            if (timeSlots.has(entry.timeSlotId)) {
              conflicts.push({
                type: 'DOUBLE_BOOKING',
                staffId: entry.staffId,
                timeSlotId: entry.timeSlotId,
                message: 'Staff member is double-booked for this time slot',
                severity: 'ERROR',
              });
            } else {
              timeSlots.add(entry.timeSlotId);
            }
          });

          state.conflicts = conflicts;
        }),

      publishSchedule: (scheduleId) =>
        set((state) => {
          const schedule = state.schedules.find((s) => s.id === scheduleId);
          if (schedule) {
            schedule.published = true;
            schedule.updatedAt = new Date();
          }
        }),

      setLoading: (loading) =>
        set((state) => {
          state.loading = loading;
        }),

      setError: (error) =>
        set((state) => {
          state.error = error;
        }),

      clearConflicts: () =>
        set((state) => {
          state.conflicts = [];
        }),
    })),
    {
      name: 'schedule-storage',
      partialize: (state) => ({
        schedules: state.schedules,
        currentSchedule: state.currentSchedule,
      }),
    }
  )
);
