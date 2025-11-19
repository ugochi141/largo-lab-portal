import { useState, useEffect } from 'react';
import { apiService, InventoryItem } from '../services/api';

interface UseInventoryResult {
  items: InventoryItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useInventory = (category?: string): UseInventoryResult => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (category) {
        const data = await apiService.getInventoryByCategory(category);
        setItems(data);
      } else {
        const response = await apiService.getInventory();
        setItems(response.supplies);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inventory');
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  return {
    items,
    loading,
    error,
    refetch: fetchData,
  };
};
