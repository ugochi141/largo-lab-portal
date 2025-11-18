import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from './components/layout/Navigation';
import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import DashboardPage from './pages/DashboardPage';
import SafetyPage from './pages/SafetyPage';
import StaffPage from './pages/StaffPage';
import InventoryPage from './pages/InventoryPage';
import SbarPage from './pages/SbarPage';
import EquipmentTrackerPage from './pages/EquipmentTrackerPage';
import ScheduleManagerPage from './pages/ScheduleManagerPage';
import { sampleStaff, sampleIncidents, sampleComplianceItems, sampleTrainingRequirements } from './data/sampleData';
import { useStaffStore } from './store/staffStore';
import { useSafetyStore } from './store/safetyStore';
import { useTrainingStore } from './store/trainingStore';
import ErrorBoundary from './components/common/ErrorBoundary';
import './styles/globals.css';

function App() {
  const { staff, setStaff } = useStaffStore((state) => ({
    staff: state.staff,
    setStaff: state.setStaff,
  }));
  const { incidents, complianceItems, setIncidents, setComplianceItems } = useSafetyStore((state) => ({
    incidents: state.incidents,
    complianceItems: state.complianceItems,
    setIncidents: state.setIncidents,
    setComplianceItems: state.setComplianceItems,
  }));
  const { requirements, setRequirements } = useTrainingStore((state) => ({
    requirements: state.requirements,
    setRequirements: state.setRequirements,
  }));

  useEffect(() => {
    if (staff.length === 0) {
      setStaff(sampleStaff);
    }
    if (incidents.length === 0) {
      setIncidents(sampleIncidents);
    }
    if (complianceItems.length === 0) {
      setComplianceItems(sampleComplianceItems);
    }
    if (requirements.length === 0) {
      setRequirements(sampleTrainingRequirements);
    }
  }, [
    staff.length,
    incidents.length,
    complianceItems.length,
    requirements.length,
    setStaff,
    setIncidents,
    setComplianceItems,
    setRequirements,
  ]);

  return (
    <ErrorBoundary>
      <Router basename="/largo-lab-portal">
        <div className="min-h-screen bg-neutral-50">
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          <Navigation />

          <main id="main-content" className="py-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/schedule-manager" element={<ScheduleManagerPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/equipment" element={<EquipmentTrackerPage />} />
              <Route path="/sbar" element={<SbarPage />} />
              <Route path="/safety" element={<SafetyPage />} />
              <Route path="/staff" element={<StaffPage />} />
            </Routes>
          </main>

          <footer className="bg-white border-t border-neutral-200 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-neutral-600">
                    © {new Date().getFullYear()} Largo Laboratory Portal
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Healthcare laboratory operations management system
                  </p>
                </div>

                <div className="flex items-center gap-6 text-sm text-neutral-600">
                  <a href="#" className="hover:text-primary-700 transition-colors">
                    Support
                  </a>
                  <a href="#" className="hover:text-primary-700 transition-colors">
                    Documentation
                  </a>
                  <a href="#" className="hover:text-primary-700 transition-colors">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
