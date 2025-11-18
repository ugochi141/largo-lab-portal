/**
 * Navigation JavaScript - Largo Laboratory Portal
 * Handles responsive navigation, mobile menu, and navigation state
 */

(function() {
    'use strict';

    // Initialize navigation when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initializeNavigation();
        highlightCurrentPage();
        setupMobileMenu();
        setupDropdowns();
    });

    /**
     * Initialize navigation components
     */
    function initializeNavigation() {
        console.log('Navigation initialized');

        // Add keyboard navigation
        setupKeyboardNavigation();

        // Add scroll behavior
        setupScrollBehavior();

        // Track navigation clicks
        trackNavigationClicks();
    }

    /**
     * Highlight current page in navigation
     */
    function highlightCurrentPage() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

        // Remove all active classes
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current page
        document.querySelectorAll('.nav-link').forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || linkHref === './' + currentPage) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    /**
     * Setup mobile menu toggle
     */
    function setupMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (mobileMenuToggle && navMenu) {
            mobileMenuToggle.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';

                this.setAttribute('aria-expanded', !isExpanded);
                navMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');

                // Animate hamburger icon
                this.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.main-nav') && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('menu-open');
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('menu-open');
                    mobileMenuToggle.focus();
                }
            });
        }
    }

    /**
     * Setup dropdown menus
     */
    function setupDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');

        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');

            if (toggle && menu) {
                // Toggle on click
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation(); // Prevent event bubbling
                    const isOpen = dropdown.classList.contains('open');

                    // Close all other dropdowns
                    document.querySelectorAll('.dropdown.open').forEach(d => {
                        if (d !== dropdown) {
                            d.classList.remove('open');
                        }
                    });

                    // Toggle current dropdown
                    dropdown.classList.toggle('open');
                    toggle.setAttribute('aria-expanded', !isOpen);

                    // Force immediate visual feedback on mobile
                    if (window.innerWidth <= 768 && !isOpen) {
                        dropdown.classList.add('open');
                        toggle.setAttribute('aria-expanded', 'true');
                    }
                });

                // Keyboard navigation
                toggle.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggle.click();
                    } else if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        dropdown.classList.add('open');
                        menu.querySelector('a')?.focus();
                    }
                });

                // Arrow key navigation within menu
                menu.querySelectorAll('a').forEach((link, index, links) => {
                    link.addEventListener('keydown', function(e) {
                        if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            links[(index + 1) % links.length].focus();
                        } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            links[(index - 1 + links.length) % links.length].focus();
                        } else if (e.key === 'Escape') {
                            e.preventDefault();
                            dropdown.classList.remove('open');
                            toggle.focus();
                        }
                    });
                });
            }
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown.open').forEach(dropdown => {
                    dropdown.classList.remove('open');
                    dropdown.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
                });
            }
        });
    }

    /**
     * Setup keyboard navigation
     */
    function setupKeyboardNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach((link, index) => {
            link.addEventListener('keydown', function(e) {
                let targetIndex;

                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    targetIndex = (index + 1) % navLinks.length;
                    navLinks[targetIndex].focus();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    targetIndex = (index - 1 + navLinks.length) % navLinks.length;
                    navLinks[targetIndex].focus();
                } else if (e.key === 'Home') {
                    e.preventDefault();
                    navLinks[0].focus();
                } else if (e.key === 'End') {
                    e.preventDefault();
                    navLinks[navLinks.length - 1].focus();
                }
            });
        });
    }

    /**
     * Setup scroll behavior for header
     */
    function setupScrollBehavior() {
        const header = document.querySelector('.main-header');
        if (!header) return;

        let lastScroll = 0;
        let scrollTimeout;

        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);

            scrollTimeout = setTimeout(function() {
                const currentScroll = window.pageYOffset;

                // Add shadow when scrolled
                if (currentScroll > 10) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                // Hide header on scroll down, show on scroll up
                if (currentScroll > lastScroll && currentScroll > 100) {
                    header.classList.add('header-hidden');
                } else {
                    header.classList.remove('header-hidden');
                }

                lastScroll = currentScroll;
            }, 10);
        });
    }

    /**
     * Track navigation clicks for analytics
     */
    function trackNavigationClicks() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                const page = this.getAttribute('href');
                const label = this.textContent.trim();

                // Log navigation event
                console.log('Navigation clicked:', { page, label });

                // In production, send to analytics
                if (window.gtag) {
                    gtag('event', 'navigation_click', {
                        page_name: page,
                        link_text: label
                    });
                }

                // Save to localStorage for session tracking
                const navHistory = JSON.parse(localStorage.getItem('nav_history') || '[]');
                navHistory.push({
                    timestamp: new Date().toISOString(),
                    page: page,
                    label: label
                });

                // Keep only last 50 entries
                if (navHistory.length > 50) {
                    navHistory.shift();
                }

                localStorage.setItem('nav_history', JSON.stringify(navHistory));
            });
        });
    }

    /**
     * Get navigation history
     */
    function getNavigationHistory() {
        return JSON.parse(localStorage.getItem('nav_history') || '[]');
    }

    /**
     * Clear navigation history
     */
    function clearNavigationHistory() {
        localStorage.removeItem('nav_history');
    }

    /**
     * Add breadcrumb navigation
     */
    function addBreadcrumbs() {
        const currentPath = window.location.pathname;
        const pathParts = currentPath.split('/').filter(part => part);

        if (pathParts.length <= 1) return; // Skip for home page

        const breadcrumbContainer = document.createElement('nav');
        breadcrumbContainer.setAttribute('aria-label', 'Breadcrumb');
        breadcrumbContainer.className = 'breadcrumb-nav';

        let breadcrumbHTML = '<ol class="breadcrumb">';
        breadcrumbHTML += '<li><a href="index.html">Home</a></li>';

        let currentUrl = '';
        pathParts.forEach((part, index) => {
            currentUrl += '/' + part;
            const isLast = index === pathParts.length - 1;
            const label = part.replace(/\.html$/, '').replace(/-/g, ' ');

            if (isLast) {
                breadcrumbHTML += `<li aria-current="page">${label}</li>`;
            } else {
                breadcrumbHTML += `<li><a href="${currentUrl}">${label}</a></li>`;
            }
        });

        breadcrumbHTML += '</ol>';
        breadcrumbContainer.innerHTML = breadcrumbHTML;

        // Insert after header
        const header = document.querySelector('.main-header');
        if (header && header.nextSibling) {
            header.parentNode.insertBefore(breadcrumbContainer, header.nextSibling);
        }
    }

    // Expose public API
    window.Navigation = {
        highlightCurrentPage: highlightCurrentPage,
        getHistory: getNavigationHistory,
        clearHistory: clearNavigationHistory,
        addBreadcrumbs: addBreadcrumbs
    };

})();
