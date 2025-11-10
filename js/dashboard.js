/**
 * Dashboard JavaScript - Largo Laboratory Portal
 * Handles dashboard functionality, real-time updates, and data visualization
 */

(function() {
    'use strict';

    // Initialize dashboard when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initializeDashboard();
        startAutoRefresh();
        loadDashboardData();
    });

    /**
     * Initialize dashboard components
     */
    function initializeDashboard() {
        console.log('Dashboard initialized');

        // Update current date/time
        updateDateTime();
        setInterval(updateDateTime, 60000); // Update every minute

        // Load saved preferences
        loadUserPreferences();

        // Initialize alert notifications
        checkCriticalAlerts();

        // Set up event listeners
        setupEventListeners();
    }

    /**
     * Update date and time display
     */
    function updateDateTime() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };

        const dateTimeElement = document.getElementById('current-datetime');
        if (dateTimeElement) {
            dateTimeElement.textContent = now.toLocaleDateString('en-US', options);
        }
    }

    /**
     * Load dashboard data from localStorage or API
     */
    function loadDashboardData() {
        // Load staff count
        updateStaffCount();

        // Load pending orders
        updatePendingOrders();

        // Load QC tasks
        updateQCTasks();

        // Update inventory status
        updateInventoryStatus();
    }

    /**
     * Update staff count display
     */
    function updateStaffCount() {
        const staffCountElement = document.getElementById('staff-count');
        if (staffCountElement) {
            // In production, fetch from API
            const count = localStorage.getItem('current_staff_count') || '22';
            staffCountElement.textContent = count;
        }
    }

    /**
     * Update pending orders count
     */
    function updatePendingOrders() {
        const pendingOrdersElement = document.getElementById('pending-orders');
        if (pendingOrdersElement) {
            // Check localStorage for inventory orders
            const inventoryOrders = JSON.parse(localStorage.getItem('inventory_orders') || '[]');
            const pendingCount = inventoryOrders.filter(order => order.status === 'pending').length;
            pendingOrdersElement.textContent = pendingCount;
        }
    }

    /**
     * Update QC tasks due
     */
    function updateQCTasks() {
        const qcTasksElement = document.getElementById('qc-tasks');
        if (qcTasksElement) {
            // In production, fetch from QC system
            const tasks = localStorage.getItem('qc_tasks_due') || '8';
            qcTasksElement.textContent = tasks;
        }
    }

    /**
     * Update inventory status bars
     */
    function updateInventoryStatus() {
        // Load inventory data from localStorage
        const inventoryData = JSON.parse(localStorage.getItem('inventory_data') || '{}');

        // Update each category if elements exist
        const categories = ['chemistry', 'hematology', 'urinalysis', 'kits'];
        categories.forEach(category => {
            const progressBar = document.querySelector(`.inventory-category[data-category="${category}"] .progress-fill`);
            if (progressBar && inventoryData[category]) {
                const percentage = inventoryData[category].percentage || 75;
                progressBar.style.width = percentage + '%';

                // Update color based on stock level
                if (percentage >= 70) {
                    progressBar.style.background = '#28a745'; // Green
                } else if (percentage >= 40) {
                    progressBar.style.background = '#ffc107'; // Yellow
                } else {
                    progressBar.style.background = '#dc3545'; // Red
                }
            }
        });
    }

    /**
     * Check for critical alerts
     */
    function checkCriticalAlerts() {
        const alertsContainer = document.getElementById('alerts-container');
        if (!alertsContainer) return;

        // Load alerts from localStorage
        const alerts = JSON.parse(localStorage.getItem('lab_alerts') || '[]');

        if (alerts.length > 0) {
            alertsContainer.innerHTML = '';
            alerts.slice(0, 5).forEach(alert => {
                const alertDiv = document.createElement('div');
                alertDiv.className = `alert-item ${alert.level || 'info-box'}`;
                alertDiv.innerHTML = `<strong>${alert.title}:</strong> ${alert.message}`;
                alertsContainer.appendChild(alertDiv);
            });
        }
    }

    /**
     * Set up event listeners for dashboard interactions
     */
    function setupEventListeners() {
        // Refresh button
        const refreshBtn = document.getElementById('refresh-dashboard');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function(e) {
                e.preventDefault();
                loadDashboardData();
                showNotification('Dashboard refreshed', 'success');
            });
        }

        // Export data button
        const exportBtn = document.getElementById('export-dashboard');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportDashboardData);
        }
    }

    /**
     * Auto-refresh dashboard data every 5 minutes
     */
    function startAutoRefresh() {
        setInterval(function() {
            loadDashboardData();
            console.log('Dashboard data auto-refreshed at ' + new Date().toLocaleTimeString());
        }, 300000); // 5 minutes
    }

    /**
     * Load user preferences from localStorage
     */
    function loadUserPreferences() {
        const preferences = JSON.parse(localStorage.getItem('user_preferences') || '{}');

        // Apply theme preference
        if (preferences.theme === 'dark') {
            document.body.classList.add('dark-mode');
        }

        // Apply other preferences as needed
        if (preferences.autoRefresh === false) {
            // Disable auto-refresh if user prefers
        }
    }

    /**
     * Show notification message
     */
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#0066cc'};
            color: white;
            border-radius: 4px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(function() {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(function() {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    /**
     * Export dashboard data to CSV
     */
    function exportDashboardData() {
        const data = {
            timestamp: new Date().toISOString(),
            staff_count: document.getElementById('staff-count')?.textContent || 'N/A',
            pending_orders: document.getElementById('pending-orders')?.textContent || 'N/A',
            qc_tasks: document.getElementById('qc-tasks')?.textContent || 'N/A'
        };

        const csv = 'Metric,Value\n' +
                    Object.entries(data).map(([key, value]) => `${key},${value}`).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-export-${Date.now()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        showNotification('Dashboard data exported successfully', 'success');
    }

    // Expose public API
    window.Dashboard = {
        refresh: loadDashboardData,
        notify: showNotification,
        updateStaffCount: updateStaffCount,
        updateInventory: updateInventoryStatus
    };

})();
