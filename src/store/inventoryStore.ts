import { create } from 'zustand';
import { inventoryDataset } from '@/data/inventoryData';
import type { InventoryDataset, InventoryItem, InventoryStatus } from '@/types';

type InventoryFilters = {
  search: string;
  category: string | 'ALL';
  status: InventoryStatus | 'ALL';
  location: string | 'ALL';
};

interface InventoryState {
  items: InventoryItem[];
  categories: string[];
  locations: string[];
  updatedAt: string;
  filters: InventoryFilters;
  loading: boolean;
  error?: string;
  hydrate: () => Promise<void>;
  setFilters: (updates: Partial<InventoryFilters>) => void;
}

const INVENTORY_ENDPOINTS = ['/api/inventory', '/data/inventory.json'];

const fetchInventoryDataset = async (): Promise<InventoryDataset | null> => {
  if (typeof window === 'undefined') {
    return null;
  }

  for (const endpoint of INVENTORY_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, { headers: { Accept: 'application/json' } });
      if (response.ok) {
        return (await response.json()) as InventoryDataset;
      }
    } catch (error) {
      console.warn(`Inventory fetch failed for ${endpoint}`, error);
    }
  }

  return null;
};

export const useInventoryStore = create<InventoryState>((set) => ({
  items: inventoryDataset.items,
  categories: inventoryDataset.categories,
  locations: inventoryDataset.locations,
  updatedAt: inventoryDataset.updatedAt,
  filters: {
    search: '',
    category: 'ALL',
    status: 'ALL',
    location: 'ALL',
  },
  loading: false,
  error: undefined,
  hydrate: async () => {
    set({ loading: true, error: undefined });
    try {
      const dataset = await fetchInventoryDataset();
      if (dataset) {
        set({
          items: dataset.items,
          categories: dataset.categories,
          locations: dataset.locations,
          updatedAt: dataset.updatedAt,
          loading: false,
          error: undefined,
        });
        return;
      }

      set({
        items: inventoryDataset.items,
        categories: inventoryDataset.categories,
        locations: inventoryDataset.locations,
        updatedAt: inventoryDataset.updatedAt,
        loading: false,
        error: 'Unable to reach inventory API. Displaying cached data.',
      });
    } catch (error) {
      set({
        ...inventoryDataset,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown inventory error',
      });
    }
  },
  setFilters: (updates) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...updates,
      },
    })),
}));
