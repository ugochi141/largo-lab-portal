/**
 * Enhanced Dashboard Manager
 * Handles metrics updates, data visualization, and real-time updates
 */

class EnhancedDashboard {
  constructor() {
    this.updateInterval = 30000; // 30 seconds
    this.charts = new Map();
    this.init();
  }

  async init() {
    try {
      await this.loadMetrics();
      await this.initializeCharts();
      this.startRealTimeUpdates();
      this.setupEventListeners();
    } catch (error) {
      console.error('Dashboard initialization error:', error);
      this.showNotification('error', 'Dashboard Error', 'Failed to initialize dashboard');
    }
  }

  async loadMetrics() {
    const metricsData = this.getMockMetricsData(); // Replace with API call
    this.updateMetricsDisplay(metricsData);
  }

  getMockMetricsData() {
    return {
      staffOnDuty: {
        value: 22,
        trend: 'up',
        change: '+2',
        description: '2 more than yesterday'
      },
      pendingOrders: {
        value: 5,
        trend: 'down',
        change: '-3',
        description: '3 fewer than this morning'
      },
      qcTasksDue: {
        value: 8,
        trend: 'neutral',
        change: '0',
        description: 'On schedule'
      },
      turnaroundTime: {
        value: '45 min',
        trend: 'down',
        change: '-5 min',
        description: '5 minutes faster than target'
      },
      compliance: {
        value: '100%',
        trend: 'up',
        change: '+2%',
        description: 'All checks passed'
      },
      criticalAlerts: {
        value: 0,
        trend: 'neutral',
        change: '0',
        description: 'No active alerts'
      }
    };
  }

  updateMetricsDisplay(data) {
    Object.entries(data).forEach(([key, metric]) => {
      const element = document.querySelector(`[data-metric="${key}"]`);
      if (!element) return;

      const valueEl = element.querySelector('.metric-value');
      const trendEl = element.querySelector('.metric-trend');
      const descEl = element.querySelector('.metric-description');

      if (valueEl) {
        this.animateValue(valueEl, metric.value);
      }

      if (trendEl) {
        trendEl.className = `metric-trend ${metric.trend}`;
        trendEl.textContent = metric.change;

        // Add appropriate icon
        const icon = metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→';
        trendEl.textContent = `${icon} ${metric.change}`;
      }

      if (descEl) {
        descEl.textContent = metric.description;
      }
    });
  }

  animateValue(element, newValue) {
    // If numeric, animate the count
    const numericValue = parseFloat(newValue);
    if (!isNaN(numericValue)) {
      const currentValue = parseFloat(element.textContent) || 0;
      const duration = 1000;
      const steps = 20;
      const increment = (numericValue - currentValue) / steps;
      let step = 0;

      const interval = setInterval(() => {
        step++;
        const value = currentValue + (increment * step);
        element.textContent = Math.round(value);

        if (step >= steps) {
          clearInterval(interval);
          element.textContent = newValue;
        }
      }, duration / steps);
    } else {
      // Non-numeric values just fade in
      element.style.opacity = '0';
      setTimeout(() => {
        element.textContent = newValue;
        element.style.opacity = '1';
      }, 100);
    }
  }

  async initializeCharts() {
    // Initialize test volume chart
    this.createTestVolumeChart();

    // Initialize turnaround time chart
    this.createTurnaroundTimeChart();

    // Initialize equipment status chart
    this.createEquipmentStatusChart();
  }

  createTestVolumeChart() {
    const container = document.getElementById('test-volume-chart');
    if (!container) return;

    const data = this.generateTestVolumeData();
    this.renderBarChart(container, data, {
      title: 'Test Volume by Department',
      colors: ['#0066cc', '#007fa3', '#f37021', '#4caf50']
    });
  }

  generateTestVolumeData() {
    return {
      labels: ['Chemistry', 'Hematology', 'Microbiology', 'POCT'],
      datasets: [{
        label: 'Tests Today',
        data: [245, 189, 67, 123]
      }]
    };
  }

  createTurnaroundTimeChart() {
    const container = document.getElementById('turnaround-time-chart');
    if (!container) return;

    const data = this.generateTurnaroundTimeData();
    this.renderLineChart(container, data, {
      title: 'Average Turnaround Time (minutes)',
      color: '#0066cc'
    });
  }

  generateTurnaroundTimeData() {
    return {
      labels: ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM'],
      datasets: [{
        label: 'TAT',
        data: [38, 35, 52, 48, 45, 42]
      }]
    };
  }

  createEquipmentStatusChart() {
    const container = document.getElementById('equipment-status-chart');
    if (!container) return;

    const data = {
      labels: ['Operational', 'Maintenance Due', 'Down'],
      datasets: [{
        data: [42, 5, 1]
      }]
    };

    this.renderDonutChart(container, data, {
      title: 'Equipment Status',
      colors: ['#4caf50', '#ff9800', '#f44336']
    });
  }

  renderBarChart(container, data, options) {
    // Simple SVG-based bar chart
    const { labels, datasets } = data;
    const { colors } = options;
    const maxValue = Math.max(...datasets[0].data);
    const barWidth = 80;
    const barGap = 20;
    const chartHeight = 250;
    const width = (barWidth + barGap) * labels.length;

    container.innerHTML = `
      <svg width="100%" height="${chartHeight}" viewBox="0 0 ${width} ${chartHeight}" class="bar-chart">
        ${datasets[0].data.map((value, index) => {
          const barHeight = (value / maxValue) * (chartHeight - 40);
          const x = index * (barWidth + barGap);
          const y = chartHeight - barHeight - 30;

          return `
            <g>
              <rect
                x="${x}"
                y="${y}"
                width="${barWidth}"
                height="${barHeight}"
                fill="${colors[index % colors.length]}"
                rx="4"
              />
              <text
                x="${x + barWidth / 2}"
                y="${y - 5}"
                text-anchor="middle"
                fill="var(--text-primary)"
                font-size="14"
                font-weight="600"
              >${value}</text>
              <text
                x="${x + barWidth / 2}"
                y="${chartHeight - 10}"
                text-anchor="middle"
                fill="var(--text-secondary)"
                font-size="12"
              >${labels[index]}</text>
            </g>
          `;
        }).join('')}
      </svg>
    `;
  }

  renderLineChart(container, data, options) {
    const { labels, datasets } = data;
    const { color } = options;
    const maxValue = Math.max(...datasets[0].data);
    const chartHeight = 200;
    const chartWidth = 600;
    const pointRadius = 4;

    const points = datasets[0].data.map((value, index) => {
      const x = (index / (labels.length - 1)) * (chartWidth - 40) + 20;
      const y = chartHeight - ((value / maxValue) * (chartHeight - 40)) - 20;
      return { x, y, value };
    });

    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    container.innerHTML = `
      <svg width="100%" height="${chartHeight}" viewBox="0 0 ${chartWidth} ${chartHeight}" class="line-chart">
        <path
          d="${pathData}"
          stroke="${color}"
          stroke-width="3"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        ${points.map(p => `
          <circle cx="${p.x}" cy="${p.y}" r="${pointRadius}" fill="${color}" />
          <text
            x="${p.x}"
            y="${p.y - 10}"
            text-anchor="middle"
            fill="var(--text-primary)"
            font-size="12"
            font-weight="600"
          >${p.value}</text>
        `).join('')}
        ${labels.map((label, i) => `
          <text
            x="${points[i].x}"
            y="${chartHeight - 5}"
            text-anchor="middle"
            fill="var(--text-secondary)"
            font-size="11"
          >${label}</text>
        `).join('')}
      </svg>
    `;
  }

  renderDonutChart(container, data, options) {
    const { labels, datasets } = data;
    const { colors } = options;
    const total = datasets[0].data.reduce((sum, val) => sum + val, 0);
    const size = 200;
    const radius = 70;
    const innerRadius = 45;
    const centerX = size / 2;
    const centerY = size / 2;

    let currentAngle = -90;
    const segments = datasets[0].data.map((value, index) => {
      const angle = (value / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      const x3 = centerX + innerRadius * Math.cos(endRad);
      const y3 = centerY + innerRadius * Math.sin(endRad);
      const x4 = centerX + innerRadius * Math.cos(startRad);
      const y4 = centerY + innerRadius * Math.sin(startRad);

      const largeArc = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
        'Z'
      ].join(' ');

      currentAngle = endAngle;

      return { pathData, color: colors[index], label: labels[index], value, percentage: ((value / total) * 100).toFixed(1) };
    });

    container.innerHTML = `
      <svg width="100%" height="${size}" viewBox="0 0 ${size} ${size}" class="donut-chart">
        ${segments.map(s => `
          <path d="${s.pathData}" fill="${s.color}" />
        `).join('')}
        <text
          x="${centerX}"
          y="${centerY}"
          text-anchor="middle"
          dominant-baseline="middle"
          fill="var(--text-primary)"
          font-size="24"
          font-weight="700"
        >${total}</text>
        <text
          x="${centerX}"
          y="${centerY + 20}"
          text-anchor="middle"
          fill="var(--text-secondary)"
          font-size="12"
        >Total</text>
      </svg>
      <div class="chart-legend">
        ${segments.map(s => `
          <div class="legend-item">
            <span class="legend-color" style="background-color: ${s.color}"></span>
            <span>${s.label}: ${s.value} (${s.percentage}%)</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  startRealTimeUpdates() {
    // Update metrics every 30 seconds
    this.updateIntervalId = setInterval(() => {
      this.loadMetrics();
    }, this.updateInterval);

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      if (this.updateIntervalId) {
        clearInterval(this.updateIntervalId);
      }
    });
  }

  setupEventListeners() {
    // Filter buttons for analytics
    document.querySelectorAll('.analytics-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const filter = e.target.dataset.filter;
        this.applyAnalyticsFilter(filter);

        // Update active state
        document.querySelectorAll('.analytics-filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      });
    });

    // Quick action buttons
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (!btn.href) {
          e.preventDefault();
          this.handleQuickAction(btn.dataset.action);
        }
      });
    });
  }

  applyAnalyticsFilter(filter) {
    console.log(`Applying filter: ${filter}`);
    // Implement filter logic
    // This would update the charts based on the selected time range
  }

  handleQuickAction(action) {
    console.log(`Quick action: ${action}`);
    // Implement quick action handlers
    switch (action) {
      case 'generate-report':
        this.generateReport();
        break;
      case 'view-schedule':
        window.location.href = 'Schedules/Daily Schedule.html';
        break;
      case 'qc-tasks':
        window.location.href = 'qc-tracking.html';
        break;
      default:
        this.showNotification('info', 'Action', `${action} clicked`);
    }
  }

  generateReport() {
    this.showNotification('info', 'Generating Report', 'Your report is being generated...');

    setTimeout(() => {
      this.showNotification('success', 'Report Ready', 'Your report has been generated successfully');
    }, 2000);
  }

  showNotification(type, title, message) {
    const notification = new NotificationManager();
    notification.show(type, title, message);
  }
}

/**
 * Notification Manager
 * Handles toast notifications
 */
class NotificationManager {
  constructor() {
    this.container = this.getOrCreateContainer();
  }

  getOrCreateContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  show(type, title, message, duration = 5000) {
    const toast = this.createToast(type, title, message);
    this.container.appendChild(toast);

    // Auto-remove after duration
    setTimeout(() => {
      this.remove(toast);
    }, duration);
  }

  createToast(type, title, message) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close notification">×</button>
    `;

    // Close button handler
    toast.querySelector('.toast-close').addEventListener('click', () => {
      this.remove(toast);
    });

    return toast;
  }

  remove(toast) {
    toast.style.animation = 'slideOutRight 300ms ease-in-out';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }
}

// Initialize dashboard when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new EnhancedDashboard();
  });
} else {
  window.dashboard = new EnhancedDashboard();
}

// Export for use in other modules
window.NotificationManager = NotificationManager;
