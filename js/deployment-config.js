/**
 * Deployment Configuration and Feature Availability Detection
 * Largo Lab Portal
 *
 * This module detects whether the portal is running in:
 * - Static mode (GitHub Pages) - Frontend only
 * - Full-stack mode (With Node.js backend) - All features
 */

class PortalConfig {
    constructor() {
        this.mode = null;
        this.backendAvailable = false;
        this.apiBase = this.detectAPIBase();
        this.features = {
            inventory: false,
            emailNotifications: false,
            tatMonitoring: false,
            supportTickets: false,
            pdfExport: false,
            csvExport: false,
            authentication: false
        };

        this.init();
    }

    /**
     * Detect API base URL
     */
    detectAPIBase() {
        // In production with backend, this would be the API URL
        // For local development, check if backend is running on localhost:3000
        const hostname = window.location.hostname;

        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:3000';
        } else if (hostname.includes('github.io')) {
            return null; // GitHub Pages - no backend
        } else {
            // Production deployment - try same origin
            return window.location.origin;
        }
    }

    /**
     * Initialize configuration by checking backend availability
     */
    async init() {
        if (!this.apiBase) {
            this.mode = 'static';
            this.backendAvailable = false;
            console.info('🌐 Portal Mode: STATIC (GitHub Pages)');
            console.info('   Backend-dependent features are disabled');
            this.updateFeatureFlags();
            return;
        }

        // Try to ping the backend health endpoint
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

            const response = await fetch(`${this.apiBase}/health`, {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json'
                }
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                this.mode = 'full-stack';
                this.backendAvailable = true;
                console.info('🚀 Portal Mode: FULL-STACK');
                console.info('   All features enabled');

                // Parse backend response to get feature configuration
                const healthData = await response.json();
                this.parseBackendFeatures(healthData);
            } else {
                this.mode = 'static';
                this.backendAvailable = false;
                console.warn('⚠️  Backend responded with error. Running in STATIC mode.');
            }
        } catch (error) {
            this.mode = 'static';
            this.backendAvailable = false;
            console.warn('⚠️  Backend not available. Running in STATIC mode.');
            console.warn('   To enable all features, start the backend server:');
            console.warn('   npm run pm2:start  OR  npm run dev');
        }

        this.updateFeatureFlags();
        this.addFeatureIndicators();
    }

    /**
     * Parse backend health response to determine available features
     */
    parseBackendFeatures(healthData) {
        this.features.inventory = true;
        this.features.emailNotifications = healthData.integrations?.emailService === 'configured';
        this.features.tatMonitoring = true;
        this.features.supportTickets = true;
        this.features.pdfExport = true; // Will be implemented
        this.features.csvExport = true; // Will be implemented
        this.features.authentication = true;
    }

    /**
     * Update feature flags based on mode
     */
    updateFeatureFlags() {
        if (this.mode === 'static') {
            // In static mode, only localStorage-based features work
            this.features.inventory = false;
            this.features.emailNotifications = false;
            this.features.tatMonitoring = false; // Real TAT requires backend
            this.features.supportTickets = false;
            this.features.pdfExport = true; // Can work client-side with jsPDF
            this.features.csvExport = true; // Can work client-side
            this.features.authentication = false;
        }
    }

    /**
     * Add visual indicators to the page for feature availability
     */
    addFeatureIndicators() {
        // Add a status badge to the page
        const badge = document.createElement('div');
        badge.id = 'portal-mode-indicator';
        badge.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 15px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: bold;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        if (this.mode === 'static') {
            badge.style.background = 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)';
            badge.style.color = '#000';
            badge.innerHTML = '📱 STATIC MODE';
            badge.title = 'Static deployment (GitHub Pages). Some features require backend server.';
        } else {
            badge.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
            badge.style.color = '#fff';
            badge.innerHTML = '🚀 FULL-STACK MODE';
            badge.title = 'Backend server connected. All features available.';
        }

        badge.addEventListener('click', () => this.showFeatureStatus());
        document.body.appendChild(badge);

        // Add feature unavailable badges to backend-dependent elements
        if (this.mode === 'static') {
            this.markUnavailableFeatures();
        }
    }

    /**
     * Mark unavailable features with visual indicators
     */
    markUnavailableFeatures() {
        // This will be called by individual pages to mark their specific features
        const style = document.createElement('style');
        style.textContent = `
            .feature-unavailable {
                opacity: 0.6;
                pointer-events: none;
                position: relative;
            }
            .feature-unavailable::after {
                content: '🔒 Requires Backend';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: bold;
                white-space: nowrap;
                z-index: 10;
            }
            .demo-data-warning {
                background: #fff3cd;
                border: 2px solid #ffc107;
                border-radius: 8px;
                padding: 12px;
                margin: 15px 0;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .demo-data-warning::before {
                content: '⚠️';
                font-size: 24px;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Show detailed feature status modal
     */
    showFeatureStatus() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 30px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        `;

        const featuresHTML = Object.entries(this.features)
            .map(([feature, available]) => `
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">
                        ${feature.replace(/([A-Z])/g, ' $1').trim()}
                    </td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">
                        ${available ? '✅ Available' : '❌ Unavailable'}
                    </td>
                </tr>
            `).join('');

        content.innerHTML = `
            <h2 style="margin: 0 0 20px 0; color: #005EB8;">
                ${this.mode === 'static' ? '📱 Static Mode' : '🚀 Full-Stack Mode'}
            </h2>
            <p style="margin-bottom: 20px; color: #666;">
                ${this.mode === 'static'
                    ? 'Running on GitHub Pages with limited functionality. Start the backend server for all features.'
                    : 'Backend server is running. All features are available.'}
            </p>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f5f5f5;">
                        <th style="padding: 10px; text-align: left;">Feature</th>
                        <th style="padding: 10px; text-align: center;">Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${featuresHTML}
                </tbody>
            </table>
            ${this.mode === 'static' ? `
                <div style="background: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin-top: 20px; border-radius: 4px;">
                    <strong style="color: #1976D2;">💡 Enable All Features:</strong><br>
                    <code style="background: #fff; padding: 4px 8px; border-radius: 4px; display: inline-block; margin-top: 8px;">
                        npm run pm2:start
                    </code> or
                    <code style="background: #fff; padding: 4px 8px; border-radius: 4px; display: inline-block;">
                        npm run dev
                    </code>
                </div>
            ` : ''}
            <button onclick="this.parentElement.parentElement.remove()"
                    style="margin-top: 20px; padding: 10px 20px; background: #005EB8; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                Close
            </button>
        `;

        modal.appendChild(content);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        document.body.appendChild(modal);
    }

    /**
     * Check if a specific feature is available
     */
    isFeatureAvailable(featureName) {
        return this.features[featureName] === true;
    }

    /**
     * Get API endpoint URL
     */
    getAPIUrl(endpoint) {
        if (!this.backendAvailable) {
            return null;
        }
        return `${this.apiBase}${endpoint}`;
    }

    /**
     * Show a user-friendly error when backend-dependent feature is accessed
     */
    showBackendRequiredMessage(featureName) {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 3px solid #ffc107;
            border-radius: 12px;
            padding: 30px;
            max-width: 500px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            z-index: 10000;
            text-align: center;
        `;

        message.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 15px;">🔒</div>
            <h3 style="margin: 0 0 15px 0; color: #005EB8;">Backend Required</h3>
            <p style="color: #666; margin-bottom: 20px;">
                The <strong>${featureName}</strong> feature requires the Node.js backend server.
            </p>
            <p style="background: #f5f5f5; padding: 15px; border-radius: 8px; font-size: 14px; margin-bottom: 20px;">
                Start the backend server:<br>
                <code style="background: #fff; padding: 4px 8px; border-radius: 4px; display: inline-block; margin-top: 8px;">npm run pm2:start</code>
                or
                <code style="background: #fff; padding: 4px 8px; border-radius: 4px; display: inline-block;">npm run dev</code>
            </p>
            <button onclick="this.parentElement.remove()"
                    style="padding: 10px 24px; background: #005EB8; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                Got It
            </button>
        `;

        document.body.appendChild(message);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (message.parentElement) {
                message.remove();
            }
        }, 10000);
    }
}

// Create global instance
window.portalConfig = new PortalConfig();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortalConfig;
}
