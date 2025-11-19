import { useState, useEffect } from 'react';

export interface Equipment {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  location: string;
  status: 'operational' | 'maintenance' | 'down';
  lastMaintenance: string;
  nextMaintenance: string;
}

interface UseEquipmentResult {
  equipment: Equipment[];
  loading: boolean;
  error: string | null;
}

export const useEquipment = (): UseEquipmentResult => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const sampleData: Equipment[] = [
          { id: 'EQ001', name: 'Roche cobas 8000', manufacturer: 'Roche', model: 'cobas 8000', serialNumber: 'RC8000-12345', location: 'Chemistry Lab', status: 'operational', lastMaintenance: '2025-11-01', nextMaintenance: '2025-12-01' },
          { id: 'EQ002', name: 'Sysmex XN-2000', manufacturer: 'Sysmex', model: 'XN-2000', serialNumber: 'SX2000-67890', location: 'Hematology Lab', status: 'operational', lastMaintenance: '2025-10-15', nextMaintenance: '2025-11-15' },
          { id: 'EQ003', name: 'Stago Star Max', manufacturer: 'Stago', model: 'Star Max', serialNumber: 'SM-45678', location: 'Coagulation Area', status: 'maintenance', lastMaintenance: '2025-11-10', nextMaintenance: '2025-11-20' },
        ];
        
        setEquipment(sampleData);
      } catch (err) {
        setError('Failed to load equipment');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return { equipment, loading, error };
};
