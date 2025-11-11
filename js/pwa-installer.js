/**
 * PWA Installer and Manager
 * Handles service worker registration and install prompts
 */

class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.init();
  }

  async init() {
    // Check if already installed
    this.checkInstallStatus();

    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('[PWA] Service Worker registered:', registration.scope);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error);
      }
    }

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed successfully');
      this.isInstalled = true;
      this.hideInstallButton();
      this.showNotification('success', 'App Installed', 'Largo Lab Portal is now installed!');
    });

    // Detect if running as PWA
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      console.log('[PWA] Running in standalone mode');
      this.isInstalled = true;
    }
  }

  checkInstallStatus() {
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    ) {
      this.isInstalled = true;
      console.log('[PWA] App is installed');
    }
  }

  showInstallButton() {
    let installBtn = document.getElementById('pwa-install-btn');

    if (!installBtn) {
      installBtn = document.createElement('button');
      installBtn.id = 'pwa-install-btn';
      installBtn.className = 'pwa-install-button';
      installBtn.innerHTML = `
                <span class="pwa-install-icon">📱</span>
                <span class="pwa-install-text">Install App</span>
            `;

      installBtn.addEventListener('click', () => this.promptInstall());

      // Add to page
      document.body.appendChild(installBtn);
    }

    installBtn.style.display = 'flex';
  }

  hideInstallButton() {
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
      installBtn.style.display = 'none';
    }
  }

  async promptInstall() {
    if (!this.deferredPrompt) {
      console.log('[PWA] Install prompt not available');
      return;
    }

    // Show install prompt
    this.deferredPrompt.prompt();

    // Wait for user choice
    const choiceResult = await this.deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      console.log('[PWA] User accepted install');
    } else {
      console.log('[PWA] User dismissed install');
    }

    // Clear the prompt
    this.deferredPrompt = null;
    this.hideInstallButton();
  }

  showNotification(type, title, message) {
    if (window.NotificationManager) {
      const notification = new NotificationManager();
      notification.show(type, title, message);
    }
  }

  // Request notification permission
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.log('[PWA] Notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  // Show browser notification
  showBrowserNotification(title, options = {}) {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/assets/icons/kaiser-favicon.svg',
        badge: '/assets/icons/badge-icon.png',
        vibrate: [200, 100, 200],
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    }

    return null;
  }
}

// Add PWA install button styles
const pwaStyles = document.createElement('style');
pwaStyles.textContent = `
    .pwa-install-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9998;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        background: linear-gradient(135deg, #0066cc 0%, #007fa3 100%);
        color: white;
        border: none;
        border-radius: 50px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
        transition: all 0.3s ease;
        animation: pulse 2s infinite;
    }

    .pwa-install-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 102, 204, 0.4);
    }

    .pwa-install-icon {
        font-size: 20px;
    }

    @keyframes pulse {
        0%, 100% {
            box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
        }
        50% {
            box-shadow: 0 4px 20px rgba(0, 102, 204, 0.6);
        }
    }

    @media (max-width: 768px) {
        .pwa-install-button {
            bottom: 80px;
            right: 10px;
            font-size: 14px;
            padding: 10px 20px;
        }
    }
`;

document.head.appendChild(pwaStyles);

// Initialize PWA Manager
const pwaManager = new PWAManager();
window.pwaManager = pwaManager;
