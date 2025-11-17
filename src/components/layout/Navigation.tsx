import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavLink {
  path: string;
  label: string;
  icon: string;
}

interface NavDropdown {
  label: string;
  icon: string;
  items: NavLink[];
}

type NavItem = NavLink | NavDropdown;

const isNavDropdown = (item: NavItem): item is NavDropdown => {
  return 'items' in item;
};

const Navigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isDropdownActive = (items: NavLink[]) => {
    return items.some((item) => isActive(item.path));
  };

  const navItems: NavItem[] = [
    { path: '/', label: 'Home', icon: '🏠' },
    {
      label: 'Schedules',
      icon: '📅',
      items: [
        { path: '/schedule', label: 'Daily Schedule', icon: '📅' },
        { path: '/schedule-manager', label: 'Schedule Manager', icon: '📝' },
      ],
    },
    { path: '/inventory', label: 'Inventory', icon: '📦' },
    { path: '/equipment', label: 'Equipment', icon: '🔧' },
    { path: '/sbar', label: 'SBAR Toolkit', icon: '🗂️' },
    { path: '/dashboard', label: 'Manager Dashboard', icon: '📊' },
    { path: '/safety', label: 'Safety & Compliance', icon: '🛡️' },
    { path: '/staff', label: 'Staff Management', icon: '👥' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        const dropdownEl = dropdownRefs.current[openDropdown];
        if (dropdownEl && !dropdownEl.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const primaryNavId = 'primary-navigation';

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
          <div
            id={primaryNavId}
            className="hidden md:flex items-center space-x-1"
            role="menubar"
            aria-label="Primary navigation"
          >
            {navItems.map((item) => {
              if (isNavDropdown(item)) {
                const isOpen = openDropdown === item.label;
                const isItemActive = isDropdownActive(item.items);

                return (
                  <div
                    key={item.label}
                    className="relative"
                    ref={(el) => (dropdownRefs.current[item.label] = el)}
                  >
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className={`
                        px-4 py-2 rounded-lg text-sm font-semibold transition-all
                        flex items-center gap-2
                        ${isItemActive
                          ? 'bg-primary-500 text-white'
                          : 'text-neutral-700 hover:bg-primary-50 hover:text-primary-700'
                        }
                      `}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      role="menuitem"
                    >
                      <span aria-hidden="true">{item.icon}</span>
                      <span>{item.label}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-soft border border-neutral-200 py-2 min-w-[220px] z-50">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            onClick={() => setOpenDropdown(null)}
                            className={`
                              px-4 py-2 text-sm font-medium transition-all
                              flex items-center gap-3
                              ${isActive(subItem.path)
                                ? 'bg-primary-50 text-primary-700'
                                : 'text-neutral-700 hover:bg-neutral-50'
                              }
                            `}
                            role="menuitem"
                          >
                            <span aria-hidden="true">{subItem.icon}</span>
                            <span>{subItem.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // Regular link (not dropdown)
              const link = item as NavLink;
              return (
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
                  role="menuitem"
                >
                  <span aria-hidden="true">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-primary-50 transition-colors"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            aria-controls={primaryNavId}
            aria-haspopup="true"
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
          <div
            className="md:hidden py-4 border-t border-neutral-200"
            role="menu"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                if (isNavDropdown(item)) {
                  const isOpen = openDropdown === item.label;
                  const isItemActive = isDropdownActive(item.items);

                  return (
                    <div key={item.label}>
                      <button
                        onClick={() => toggleDropdown(item.label)}
                        className={`
                          w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all
                          flex items-center justify-between
                          ${isItemActive
                            ? 'bg-primary-500 text-white'
                            : 'text-neutral-700 hover:bg-primary-50 hover:text-primary-700'
                          }
                        `}
                        aria-expanded={isOpen}
                        role="menuitem"
                      >
                        <div className="flex items-center gap-3">
                          <span aria-hidden="true" className="text-xl">{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                        <svg
                          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {isOpen && (
                        <div className="ml-6 mt-2 space-y-2">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              onClick={() => {
                                setOpenDropdown(null);
                                setMobileMenuOpen(false);
                              }}
                              className={`
                                block px-4 py-2 rounded-lg text-sm font-medium transition-all
                                flex items-center gap-3
                                ${isActive(subItem.path)
                                  ? 'bg-primary-50 text-primary-700'
                                  : 'text-neutral-600 hover:bg-neutral-50'
                                }
                              `}
                              role="menuitem"
                            >
                              <span aria-hidden="true">{subItem.icon}</span>
                              <span>{subItem.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                // Regular link (not dropdown)
                const link = item as NavLink;
                return (
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
                    role="menuitem"
                    aria-current={isActive(link.path) ? 'page' : undefined}
                  >
                    <span aria-hidden="true" className="text-xl">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                );
              })}
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
                {(() => {
                  // Find the current page label
                  for (const item of navItems) {
                    if (isNavDropdown(item)) {
                      const subItem = item.items.find((sub) => sub.path === location.pathname);
                      if (subItem) return subItem.label;
                    } else if ('path' in item && item.path === location.pathname) {
                      return item.label;
                    }
                  }
                  return 'Current Page';
                })()}
              </span>
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
