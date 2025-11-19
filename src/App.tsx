import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from './components/layout/Navigation';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import ScheduleManagerPage from './pages/ScheduleManagerPage';
import PhlebotomyRotationPage from './pages/schedules/PhlebotomyRotationPage';
import QCMaintenancePage from './pages/schedules/QCMaintenancePage';
import DashboardPage from './pages/DashboardPage';
import SafetyPage from './pages/SafetyPage';
import StaffPage from './pages/StaffPage';
import StaffDirectoryPage from './pages/staff/StaffDirectoryPage';
import TrainingPage from './pages/staff/TrainingPage';
import TimecardPage from './pages/staff/TimecardPage';
import InventoryPage from './pages/InventoryPage';
import ChemistryPage from './pages/inventory/ChemistryPage';
import HematologyPage from './pages/inventory/HematologyPage';
import UrinalysisPage from './pages/inventory/UrinalysisPage';
import CoagulationPage from './pages/inventory/CoagulationPage';
import KitsPage from './pages/inventory/KitsPage';
import OrderManagementPage from './pages/inventory/OrderManagementPage';
import SOPPage from './pages/resources/SOPPage';
import CompliancePage from './pages/resources/CompliancePage';
import ContactsPage from './pages/resources/ContactsPage';
import TechnicalSupportPage from './pages/TechnicalSupportPage';
import EquipmentTrackerPage from './pages/EquipmentTrackerPage';
import SbarPage from './pages/SbarPage';

// Staff Portal Pages
import StaffPortalLayout from './pages/staff/StaffPortalLayout';
import StaffHomePage from './pages/staff/StaffHomePage';
import StaffSOPsPage from './pages/staff/StaffSOPsPage';
import StaffSchedulePage from './pages/staff/StaffSchedulePage';
import StaffQCPage from './pages/staff/StaffQCPage';
import StaffInventoryPage from './pages/staff/StaffInventoryPage';
import StaffSupportPage from './pages/staff/StaffSupportPage';
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
      <Router basename={import.meta.env.MODE === 'production' ? '/' : '/largo-lab-portal'}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ProtectedRoute><ResetPasswordPage /></ProtectedRoute>} />
          
          {/* Staff Portal - Read-Only Access (Protected) */}
          <Route path="/staff" element={<ProtectedRoute><StaffPortalLayout /></ProtectedRoute>}>
            <Route index element={<StaffHomePage />} />
            <Route path="sops" element={<StaffSOPsPage />} />
            <Route path="schedule" element={<StaffSchedulePage />} />
            <Route path="qc" element={<StaffQCPage />} />
            <Route path="inventory" element={<StaffInventoryPage />} />
            <Route path="support" element={<StaffSupportPage />} />
          </Route>

          {/* Admin Portal - Full Access (Protected - Admin Only) */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin>
              <div className="min-h-screen bg-neutral-50">
                <a href="#main-content" className="skip-link">Skip to main content</a>
                <Navigation />
                <main id="main-content" className="py-6">
                  <Routes>
                  <Route index element={<HomePage />} />
                  
                  {/* Schedule Routes */}
                  <Route path="schedule" element={<SchedulePage />} />
                  <Route path="schedule-manager" element={<ScheduleManagerPage />} />
                  <Route path="schedules/phlebotomy-rotation" element={<PhlebotomyRotationPage />} />
                  <Route path="schedules/qc-maintenance" element={<QCMaintenancePage />} />
                  
                  {/* Inventory Routes */}
                  <Route path="inventory" element={<InventoryPage />} />
                  <Route path="inventory/chemistry" element={<ChemistryPage />} />
                  <Route path="inventory/hematology" element={<HematologyPage />} />
                  <Route path="inventory/urinalysis" element={<UrinalysisPage />} />
                  <Route path="inventory/coagulation" element={<CoagulationPage />} />
                  <Route path="inventory/kits" element={<KitsPage />} />
                  <Route path="inventory/order-management" element={<OrderManagementPage />} />
                  
                  {/* Staff Management Routes */}
                  <Route path="staff" element={<StaffPage />} />
                  <Route path="staff/directory" element={<StaffDirectoryPage />} />
                  <Route path="staff/training" element={<TrainingPage />} />
                  <Route path="staff/timecard" element={<TimecardPage />} />
                  
                  {/* Resource Routes */}
                  <Route path="resources/sop" element={<SOPPage />} />
                  <Route path="resources/compliance" element={<CompliancePage />} />
                  <Route path="resources/contacts" element={<ContactsPage />} />
                  
                  {/* Other Routes */}
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="safety" element={<SafetyPage />} />
                  <Route path="equipment" element={<EquipmentTrackerPage />} />
                  <Route path="sbar" element={<SbarPage />} />
                  <Route path="technical-support" element={<TechnicalSupportPage />} />
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
                      <a href="#" className="hover:text-primary-700 transition-colors">Support</a>
                      <a href="#" className="hover:text-primary-700 transition-colors">Documentation</a>
                      <a href="#" className="hover:text-primary-700 transition-colors">Privacy Policy</a>
                    </div>
                  </div>
                </div>
              </footer>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
