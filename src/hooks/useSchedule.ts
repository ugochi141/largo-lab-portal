import { useState, useEffect } from 'react';

export interface ScheduleEntry {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  shift: string;
  station: string;
  department: string;
}

interface UseScheduleResult {
  schedule: ScheduleEntry[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useSchedule = (): UseScheduleResult => {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Sample schedule data
      const today = new Date();
      const sampleData: ScheduleEntry[] = [
        { id: '1', staffId: 'S002', staffName: 'Netta Johnson', date: today.toISOString(), shift: 'Day (7AM-3PM)', station: 'Phlebotomy Station 1', department: 'Phlebotomy' },
        { id: '2', staffId: 'S003', staffName: 'Tracy Williams', date: today.toISOString(), shift: 'Day (7AM-3PM)', station: 'Chemistry Bench', department: 'Chemistry' },
        { id: '3', staffId: 'S004', staffName: 'Booker Smith', date: today.toISOString(), shift: 'Evening (3PM-11PM)', station: 'Hematology', department: 'Hematology' },
      ];
      
      setSchedule(sampleData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { schedule, loading, error, refetch: fetchData };
};
