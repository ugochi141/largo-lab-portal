import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/schedule', label: 'Schedule', icon: '📅' },
    { path: '/dashboard', label: 'Manager Dashboard', icon: '📊' },
    { path: '/safety', label: 'Safety & Compliance', icon: '🛡️' },
    { path: '/staff', label: 'Staff Management', icon: '👥' },
  ];

  return (
    <nav className="bg-white shadow-soft sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                L
              </div>
              <div>
                <h1 className="text-lg font-bold text-primary-700">Largo Laboratory</h1>
                <p className="text-xs text-neutral-600">Operations Portal</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  px-4 py-2 rounded-lg text-sm font-semibold transition-all
                  flex items-center gap-2
                  ${isActive(link.path)
                    ? 'bg-primary-500 text-white'
                    : 'text-neutral-700 hover:bg-primary-50 hover:text-primary-700'
                  }
                `}
                aria-current={isActive(link.path) ? 'page' : undefined}
              >
                <span aria-hidden="true">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-primary-50 transition-colors"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    px-4 py-3 rounded-lg text-sm font-semibold transition-all
                    flex items-center gap-3
                    ${isActive(link.path)
                      ? 'bg-primary-500 text-white'
                      : 'text-neutral-700 hover:bg-primary-50 hover:text-primary-700'
                    }
                  `}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                >
                  <span aria-hidden="true" className="text-xl">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Breadcrumb Navigation */}
      {location.pathname !== '/' && (
        <div className="bg-neutral-50 border-t border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <nav aria-label="Breadcrumb" className="flex items-center text-sm">
              <Link to="/" className="text-primary-600 hover:text-primary-800 font-medium">
                Home
              </Link>
              <svg className="w-4 h-4 mx-2 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-neutral-700 font-medium">
                {navLinks.find((link) => link.path === location.pathname)?.label || 'Current Page'}
              </span>
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
