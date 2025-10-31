import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { SafetyIncident, ComplianceItem } from '@/types';

interface SafetyState {
  incidents: SafetyIncident[];
  complianceItems: ComplianceItem[];
  selectedIncident: SafetyIncident | null;
  loading: boolean;
  error: string | null;

  // Incident Actions
  setIncidents: (incidents: SafetyIncident[]) => void;
  addIncident: (incident: SafetyIncident) => void;
  updateIncident: (incidentId: string, updates: Partial<SafetyIncident>) => void;
  removeIncident: (incidentId: string) => void;
  setSelectedIncident: (incident: SafetyIncident | null) => void;
  closeIncident: (incidentId: string, closedBy: string) => void;

  // Compliance Actions
  setComplianceItems: (items: ComplianceItem[]) => void;
  addComplianceItem: (item: ComplianceItem) => void;
  updateComplianceItem: (itemId: string, updates: Partial<ComplianceItem>) => void;
  removeComplianceItem: (itemId: string) => void;
  completeComplianceItem: (itemId: string, verifiedBy: string) => void;

  // Queries
  getOpenIncidents: () => SafetyIncident[];
  getCriticalIncidents: () => SafetyIncident[];
  getOverdueCompliance: () => ComplianceItem[];
  getComplianceByCategory: (category: ComplianceItem['category']) => ComplianceItem[];

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSafetyStore = create<SafetyState>()(
  persist(
    immer((set, get) => ({
      incidents: [],
      complianceItems: [],
      selectedIncident: null,
      loading: false,
      error: null,

      setIncidents: (incidents) =>
        set((state) => {
          state.incidents = incidents;
        }),

      addIncident: (incident) =>
        set((state) => {
          state.incidents.push(incident);
        }),

      updateIncident: (incidentId, updates) =>
        set((state) => {
          const incidentIndex = state.incidents.findIndex((i) => i.id === incidentId);
          if (incidentIndex !== -1) {
            state.incidents[incidentIndex] = {
              ...state.incidents[incidentIndex],
              ...updates,
            };
          }
        }),

      removeIncident: (incidentId) =>
        set((state) => {
          state.incidents = state.incidents.filter((i) => i.id !== incidentId);
        }),

      setSelectedIncident: (incident) =>
        set((state) => {
          state.selectedIncident = incident;
        }),

      closeIncident: (incidentId, closedBy) =>
        set((state) => {
          const incidentIndex = state.incidents.findIndex((i) => i.id === incidentId);
          if (incidentIndex !== -1) {
            state.incidents[incidentIndex].status = 'CLOSED';
            state.incidents[incidentIndex].closedAt = new Date();
            state.incidents[incidentIndex].closedBy = closedBy;
          }
        }),

      setComplianceItems: (items) =>
        set((state) => {
          state.complianceItems = items;
        }),

      addComplianceItem: (item) =>
        set((state) => {
          state.complianceItems.push(item);
        }),

      updateComplianceItem: (itemId, updates) =>
        set((state) => {
          const itemIndex = state.complianceItems.findIndex((i) => i.id === itemId);
          if (itemIndex !== -1) {
            state.complianceItems[itemIndex] = {
              ...state.complianceItems[itemIndex],
              ...updates,
            };
          }
        }),

      removeComplianceItem: (itemId) =>
        set((state) => {
          state.complianceItems = state.complianceItems.filter((i) => i.id !== itemId);
        }),

      completeComplianceItem: (itemId, verifiedBy) =>
        set((state) => {
          const itemIndex = state.complianceItems.findIndex((i) => i.id === itemId);
          if (itemIndex !== -1) {
            state.complianceItems[itemIndex].status = 'COMPLETED';
            state.complianceItems[itemIndex].completedAt = new Date();
            state.complianceItems[itemIndex].verifiedBy = verifiedBy;
            state.complianceItems[itemIndex].verifiedAt = new Date();
          }
        }),

      getOpenIncidents: () => {
        return get().incidents.filter((i) => i.status !== 'CLOSED');
      },

      getCriticalIncidents: () => {
        return get().incidents.filter((i) => i.severity === 'CRITICAL' && i.status !== 'CLOSED');
      },

      getOverdueCompliance: () => {
        const now = new Date();
        return get().complianceItems.filter(
          (item) =>
            item.status !== 'COMPLETED' &&
            new Date(item.dueDate) < now
        );
      },

      getComplianceByCategory: (category) => {
        return get().complianceItems.filter((item) => item.category === category);
      },

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
      name: 'safety-storage',
      partialize: (state) => ({
        incidents: state.incidents,
        complianceItems: state.complianceItems,
      }),
    }
  )
);
