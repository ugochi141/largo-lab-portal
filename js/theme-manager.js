/**
 * Theme Manager - Dark/Light Mode Toggle
 * Handles theme persistence and system preference detection
 */

class ThemeManager {
  constructor() {
    this.THEME_KEY = 'lab-portal-theme';
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
    this.init();
  }

  init() {
    // Apply initial theme
    this.applyTheme(this.currentTheme);

    // Listen for system theme changes
    this.watchSystemTheme();

    // Create theme toggle button if not exists
    this.createToggleButton();
  }

  getSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  getStoredTheme() {
    return localStorage.getItem(this.THEME_KEY);
  }

  setStoredTheme(theme) {
    localStorage.setItem(this.THEME_KEY, theme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    this.setStoredTheme(theme);

    // Update toggle button if it exists
    this.updateToggleButton();

    // Dispatch custom event for theme change
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  toggle() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }

  watchSystemTheme() {
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!this.getStoredTheme()) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  createToggleButton() {
    // Check if button already exists
    if (document.querySelector('.theme-toggle')) {
      return;
    }

    const button = document.createElement('button');
    button.className = 'theme-toggle';
    button.setAttribute('aria-label', 'Toggle dark mode');
    button.innerHTML = `
      <span class="theme-toggle-icon" aria-hidden="true"></span>
      <span class="theme-toggle-text"></span>
    `;

    button.addEventListener('click', () => this.toggle());

    document.body.appendChild(button);
    this.updateToggleButton();
  }

  updateToggleButton() {
    const button = document.querySelector('.theme-toggle');
    if (!button) return;

    const icon = button.querySelector('.theme-toggle-icon');
    const text = button.querySelector('.theme-toggle-text');

    if (this.currentTheme === 'dark') {
      icon.textContent = '☀️';
      text.textContent = 'Light Mode';
      button.setAttribute('aria-label', 'Switch to light mode');
    } else {
      icon.textContent = '🌙';
      text.textContent = 'Dark Mode';
      button.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  getCurrentTheme() {
    return this.currentTheme;
  }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Expose globally for console access
window.themeManager = themeManager;
