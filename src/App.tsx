import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/layout/Navigation';
import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import DashboardPage from './pages/DashboardPage';
import SafetyPage from './pages/SafetyPage';
import StaffPage from './pages/StaffPage';
import ErrorBoundary from './components/common/ErrorBoundary';
import './styles/globals.css';

function App() {
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
              <Route path="/dashboard" element={<DashboardPage />} />
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
