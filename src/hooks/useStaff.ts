import { useState, useEffect } from 'react';

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  shift: string;
  status: 'active' | 'on-leave' | 'off-duty';
}

interface UseStaffResult {
  staff: StaffMember[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// TODO: Replace with real API call when endpoint is available
// const API_URL = '/api/staff';

export const useStaff = (): UseStaffResult => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call with sample data
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Sample data - will be replaced with API call
      const sampleData: StaffMember[] = [
        { id: 'S001', name: 'Dr. Alex Morgan', role: 'Lab Director', department: 'Administration', email: 'alex.morgan@kp.org', phone: '(301) 555-0101', shift: 'Day', status: 'active' },
        { id: 'S002', name: 'Netta Johnson', role: 'Lead Phlebotomist', department: 'Phlebotomy', email: 'netta.johnson@kp.org', phone: '(301) 555-0102', shift: 'Day', status: 'active' },
        { id: 'S003', name: 'Tracy Williams', role: 'Medical Technologist', department: 'Chemistry', email: 'tracy.williams@kp.org', phone: '(301) 555-0103', shift: 'Day', status: 'active' },
        { id: 'S004', name: 'Booker Smith', role: 'Lab Technician', department: 'Hematology', email: 'booker.smith@kp.org', phone: '(301) 555-0104', shift: 'Evening', status: 'active' },
        { id: 'S005', name: 'Boyet Rodriguez', role: 'Specimen Processor', department: 'Processing', email: 'boyet.rodriguez@kp.org', phone: '(301) 555-0105', shift: 'Night', status: 'active' },
      ];
      
      setStaff(sampleData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { staff, loading, error, refetch: fetchData };
};
