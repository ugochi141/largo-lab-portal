// Main Portal JavaScript - Core Functionality

// Initialize portal on page load
document.addEventListener('DOMContentLoaded', function() {
    initializePortal();
    loadDashboardData();
    setupNavigationHandlers();
    checkAlerts();
    initializeAutoSave();
});

// Portal Initialization
function initializePortal() {
    // Set current date/time
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update every minute

    // Check for saved preferences
    loadUserPreferences();

    // Initialize tooltips
    initializeTooltips();

    // Check browser compatibility
    checkBrowserCompatibility();
}

// Update date and time display
function updateDateTime() {
    const now = new Date();
    const dateElements = document.querySelectorAll('.current-date');
    const timeElements = document.querySelectorAll('.current-time');

    const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    dateElements.forEach(el => {
        el.textContent = now.toLocaleDateString('en-US', dateOptions);
    });

    timeElements.forEach(el => {
        el.textContent = now.toLocaleTimeString('en-US', timeOptions);
    });
}

// Load Dashboard Data
function loadDashboardData() {
    // Load from localStorage or use defaults
    const dashboardData = JSON.parse(localStorage.getItem('dashboardData')) || getDefaultDashboardData();

    // Update stats
    updateElement('staff-count', dashboardData.staffOnDuty);
    updateElement('pending-orders', dashboardData.pendingOrders);
    updateElement('qc-tasks', dashboardData.qcTasksDue);

    // Update schedule preview
    updateSchedulePreview(dashboardData.schedulePreview);

    // Update inventory status
    updateInventoryStatus(dashboardData.inventory);

    // Update compliance status
    updateComplianceStatus(dashboardData.compliance);
}

// Default dashboard data
function getDefaultDashboardData() {
    return {
        staffOnDuty: 22,
        pendingOrders: 5,
        qcTasksDue: 8,
        compliance: 100,
        schedulePreview: [
            { time: '6:00 AM', staff: 'Netta', role: 'Opener', station: 'Station 1' },
            { time: '7:00 AM', staff: 'Tracy', role: 'Processor', station: 'Processing' },
            { time: '7:30 AM', staff: 'Booker', role: 'Runner', station: 'Mobile' },
            { time: '8:00 AM', staff: 'Boyet', role: 'Backup Processor', station: 'Station 2' }
        ],
        inventory: {
            chemistry: 75,
            hematology: 45,
            urinalysis: 90,
            kits: 30
        },
        compliance: {
            temperatureLogs: true,
            qcReview: true,
            weeklyMaintenance: false,
            safetyInspection: true,
            staffTraining: true
        }
    };
}

// Update element safely
function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// Update schedule preview table
function updateSchedulePreview(scheduleData) {
    const tbody = document.getElementById('schedule-preview-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    scheduleData.forEach(shift => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${shift.time}</td>
            <td>${shift.staff}</td>
            <td>${shift.role}</td>
            <td>${shift.station}</td>
        `;
    });
}

// Update inventory status bars
function updateInventoryStatus(inventoryData) {
    Object.keys(inventoryData).forEach(category => {
        const progressBar = document.querySelector(`.inventory-category:has(.category-label:contains("${category}")) .progress-fill`);
        if (progressBar) {
            const percentage = inventoryData[category];
            progressBar.style.width = percentage + '%';

            // Update color based on level
            if (percentage < 30) {
                progressBar.style.background = '#dc3545'; // Red
            } else if (percentage < 60) {
                progressBar.style.background = '#ffc107'; // Yellow
            } else {
                progressBar.style.background = '#28a745'; // Green
            }
        }
    });
}

// Update compliance checkmarks
function updateComplianceStatus(complianceData) {
    const complianceItems = document.querySelectorAll('.compliance-item');
    complianceItems.forEach((item, index) => {
        const statuses = Object.values(complianceData);
        if (statuses[index]) {
            item.classList.add('completed');
            item.classList.remove('pending');
            item.querySelector('.check-icon, .pending-icon').className = 'check-icon';
            item.querySelector('.check-icon').textContent = '✓';
        } else {
            item.classList.remove('completed');
            item.classList.add('pending');
            item.querySelector('.check-icon, .pending-icon').className = 'pending-icon';
            item.querySelector('.pending-icon').textContent = '○';
        }
    });
}

// Setup navigation handlers
function setupNavigationHandlers() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Dropdown menus for mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        toggle?.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.main-nav')) {
            navMenu?.classList.remove('active');
            dropdowns.forEach(d => d.classList.remove('active'));
        }
    });
}

// Check for critical alerts
function checkAlerts() {
    const alerts = [];

    // Check inventory levels
    const inventoryData = JSON.parse(localStorage.getItem('inventoryData')) || {};
    Object.keys(inventoryData).forEach(item => {
        if (inventoryData[item]?.stockLevel < inventoryData[item]?.parLevel * 0.3) {
            alerts.push({
                type: 'critical',
                message: `Low Stock Alert: ${item} below critical level`
            });
        }
    });

    // Check maintenance schedule
    const maintenanceData = JSON.parse(localStorage.getItem('maintenanceSchedule')) || {};
    const today = new Date().toISOString().split('T')[0];
    Object.keys(maintenanceData).forEach(equipment => {
        if (maintenanceData[equipment]?.nextDue === today) {
            alerts.push({
                type: 'warning',
                message: `Maintenance Due: ${equipment} scheduled for today`
            });
        }
    });

    // Display alerts
    displayAlerts(alerts);
}

// Display alerts in container
function displayAlerts(alerts) {
    const container = document.getElementById('alerts-container');
    if (!container) return;

    container.innerHTML = '';

    if (alerts.length === 0) {
        container.innerHTML = '<div class="info-box">No critical alerts at this time</div>';
        return;
    }

    alerts.forEach(alert => {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-item ${alert.type === 'critical' ? 'critical-box' : 'warning'}`;
        alertDiv.innerHTML = `<strong>${alert.type === 'critical' ? 'Critical:' : 'Warning:'}</strong> ${alert.message}`;
        container.appendChild(alertDiv);
    });
}

// Load user preferences
function loadUserPreferences() {
    const preferences = JSON.parse(localStorage.getItem('userPreferences')) || {};

    // Apply theme if set
    if (preferences.theme) {
        document.body.className = preferences.theme;
    }

    // Apply font size if set
    if (preferences.fontSize) {
        document.body.style.fontSize = preferences.fontSize + 'px';
    }

    return preferences;
}

// Save user preferences
function saveUserPreferences(preferences) {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
}

// Initialize auto-save functionality
function initializeAutoSave() {
    // Auto-save forms every 30 seconds
    setInterval(() => {
        const forms = document.querySelectorAll('form[data-auto-save="true"]');
        forms.forEach(form => {
            saveFormData(form);
        });
    }, 30000);
}

// Save form data to localStorage
function saveFormData(form) {
    const formData = new FormData(form);
    const data = {};

    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    const formId = form.getAttribute('id') || 'form_' + Date.now();
    localStorage.setItem('formData_' + formId, JSON.stringify(data));

    // Show save indicator
    showSaveIndicator();
}

// Show save indicator
function showSaveIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'save-indicator';
    indicator.textContent = 'Auto-saved';
    indicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        z-index: 9999;
        animation: fadeInOut 2s;
    `;

    document.body.appendChild(indicator);
    setTimeout(() => indicator.remove(), 2000);
}

// Initialize tooltips
function initializeTooltips() {
    const elements = document.querySelectorAll('[data-tooltip]');
    elements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

// Show tooltip
function showTooltip(e) {
    const text = e.target.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 5px 10px;
        border-radius: 3px;
        font-size: 12px;
        z-index: 9999;
        pointer-events: none;
    `;

    document.body.appendChild(tooltip);

    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
}

// Hide tooltip
function hideTooltip() {
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => tooltip.remove());
}

// Check browser compatibility
function checkBrowserCompatibility() {
    const features = {
        localStorage: typeof(Storage) !== "undefined",
        fetch: typeof fetch !== "undefined",
        promise: typeof Promise !== "undefined",
        arrow: (() => {})?.constructor === Function
    };

    const unsupported = Object.keys(features).filter(f => !features[f]);

    if (unsupported.length > 0) {
        console.warn('Browser missing features:', unsupported);
        showCompatibilityWarning(unsupported);
    }
}

// Show compatibility warning
function showCompatibilityWarning(unsupported) {
    const warning = document.createElement('div');
    warning.className = 'browser-warning';
    warning.innerHTML = `
        <div class="warning">
            <strong>Browser Compatibility Notice:</strong>
            Your browser may not support all features. Please update to the latest version for the best experience.
        </div>
    `;

    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(warning, container.firstChild);
    }
}

// Export functions for use in other modules
window.portalUtils = {
    updateDateTime,
    loadDashboardData,
    saveFormData,
    showSaveIndicator,
    checkAlerts,
    loadUserPreferences,
    saveUserPreferences
};