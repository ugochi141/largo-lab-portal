import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Staff, Certification, Availability } from '@/types';

interface StaffState {
  staff: Staff[];
  selectedStaff: Staff | null;
  loading: boolean;
  error: string | null;

  // Actions
  setStaff: (staff: Staff[]) => void;
  addStaff: (staff: Staff) => void;
  updateStaff: (staffId: string, updates: Partial<Staff>) => void;
  removeStaff: (staffId: string) => void;
  setSelectedStaff: (staff: Staff | null) => void;
  addCertification: (staffId: string, certification: Certification) => void;
  updateCertification: (
    staffId: string,
    certId: string,
    updates: Partial<Certification>
  ) => void;
  removeCertification: (staffId: string, certId: string) => void;
  addAvailability: (staffId: string, availability: Availability) => void;
  updateAvailability: (
    staffId: string,
    availId: string,
    updates: Partial<Availability>
  ) => void;
  removeAvailability: (staffId: string, availId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStaffStore = create<StaffState>()(
  persist(
    immer((set) => ({
      staff: [],
      selectedStaff: null,
      loading: false,
      error: null,

      setStaff: (staff) =>
        set((state) => {
          state.staff = staff;
        }),

      addStaff: (staff) =>
        set((state) => {
          state.staff.push(staff);
        }),

      updateStaff: (staffId, updates) =>
        set((state) => {
          const staffIndex = state.staff.findIndex((s) => s.id === staffId);
          if (staffIndex !== -1) {
            state.staff[staffIndex] = { ...state.staff[staffIndex], ...updates };
          }
        }),

      removeStaff: (staffId) =>
        set((state) => {
          state.staff = state.staff.filter((s) => s.id !== staffId);
        }),

      setSelectedStaff: (staff) =>
        set((state) => {
          state.selectedStaff = staff;
        }),

      addCertification: (staffId, certification) =>
        set((state) => {
          const staffIndex = state.staff.findIndex((s) => s.id === staffId);
          if (staffIndex !== -1) {
            state.staff[staffIndex].certifications.push(certification);
          }
        }),

      updateCertification: (staffId, certId, updates) =>
        set((state) => {
          const staffIndex = state.staff.findIndex((s) => s.id === staffId);
          if (staffIndex !== -1) {
            const certIndex = state.staff[staffIndex].certifications.findIndex(
              (c) => c.id === certId
            );
            if (certIndex !== -1) {
              state.staff[staffIndex].certifications[certIndex] = {
                ...state.staff[staffIndex].certifications[certIndex],
                ...updates,
              };
            }
          }
        }),

      removeCertification: (staffId, certId) =>
        set((state) => {
          const staffIndex = state.staff.findIndex((s) => s.id === staffId);
          if (staffIndex !== -1) {
            state.staff[staffIndex].certifications = state.staff[
              staffIndex
            ].certifications.filter((c) => c.id !== certId);
          }
        }),

      addAvailability: (staffId, availability) =>
        set((state) => {
          const staffIndex = state.staff.findIndex((s) => s.id === staffId);
          if (staffIndex !== -1) {
            state.staff[staffIndex].availability.push(availability);
          }
        }),

      updateAvailability: (staffId, availId, updates) =>
        set((state) => {
          const staffIndex = state.staff.findIndex((s) => s.id === staffId);
          if (staffIndex !== -1) {
            const availIndex = state.staff[staffIndex].availability.findIndex(
              (a) => a.id === availId
            );
            if (availIndex !== -1) {
              state.staff[staffIndex].availability[availIndex] = {
                ...state.staff[staffIndex].availability[availIndex],
                ...updates,
              };
            }
          }
        }),

      removeAvailability: (staffId, availId) =>
        set((state) => {
          const staffIndex = state.staff.findIndex((s) => s.id === staffId);
          if (staffIndex !== -1) {
            state.staff[staffIndex].availability = state.staff[
              staffIndex
            ].availability.filter((a) => a.id !== availId);
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
    })),
    {
      name: 'staff-storage',
      partialize: (state) => ({
        staff: state.staff,
      }),
    }
  )
);
