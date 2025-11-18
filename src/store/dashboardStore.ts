import { create } from 'zustand';
import { dashboardMetrics } from '@/data/dashboardMetrics';
import type {
  AlertMessage,
  DashboardPayload,
  DashboardStats,
  InventoryLevel,
  SchedulePreviewEntry,
} from '@/types';

interface DashboardState {
  stats: DashboardStats;
  schedulePreview: SchedulePreviewEntry[];
  inventory: InventoryLevel[];
  alerts: AlertMessage[];
  updatedAt: string;
  loading: boolean;
  error?: string;
  hydrate: () => Promise<void>;
}

const DASHBOARD_ENDPOINTS = ['/api/dashboard', '/data/dashboard.json'];

const fetchDashboardPayload = async (): Promise<DashboardPayload | null> => {
  if (typeof window === 'undefined') {
    return null;
  }

  for (const endpoint of DASHBOARD_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, { headers: { 'Accept': 'application/json' } });
      if (response.ok) {
        return (await response.json()) as DashboardPayload;
      }
    } catch (error) {
      console.warn(`Dashboard fetch failed for ${endpoint}`, error);
    }
  }

  return null;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  ...dashboardMetrics,
  loading: false,
  error: undefined,
  hydrate: async () => {
    set({ loading: true, error: undefined });

    try {
      const payload = await fetchDashboardPayload();
      if (payload) {
        set({
          ...payload,
          loading: false,
          error: undefined,
        });
        return;
      }

      set({
        ...dashboardMetrics,
        loading: false,
        error: 'Unable to reach dashboard API. Displaying cached data.',
      });
    } catch (error) {
      set({
        ...dashboardMetrics,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown dashboard error',
      });
    }
  },
}));
