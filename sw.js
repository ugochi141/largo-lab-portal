/**
 * Service Worker for Largo Lab Portal
 * Provides offline functionality and caching
 */

const CACHE_NAME = 'largo-lab-portal-v1.0.0';
const RUNTIME_CACHE = 'largo-lab-runtime-v1.0.0';

// Resources to cache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/enhanced-dashboard.html',
  '/assets/css/modern-theme-system.css',
  '/assets/css/enhanced-dashboard.css',
  '/assets/css/kps-portal.css',
  '/js/theme-manager.js',
  '/js/enhanced-dashboard.js',
  '/js/main.js',
  '/js/advanced-reporting.js'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching static resources');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE];

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            console.log('[SW] Deleting old cache:', cacheToDelete);
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // For HTML pages, use network-first strategy
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the new version
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fall back to cache
          return caches.match(event.request).then((cachedResponse) => {
            return (
              cachedResponse ||
              caches.match('/index.html') ||
              new Response('<h1>Offline</h1><p>You are currently offline.</p>', {
                headers: { 'Content-Type': 'text/html' }
              })
            );
          });
        })
    );
    return;
  }

  // For other resources, use cache-first strategy
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version and update cache in background
        fetch(event.request)
          .then((response) => {
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
          })
          .catch(() => {
            // Network failed, but we have cache
          });

        return cachedResponse;
      }

      // Not in cache, fetch from network
      return fetch(event.request)
        .then((response) => {
          // Cache successful responses
          if (response && response.status === 200 && response.type === 'basic') {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Network error and not in cache
          return new Response('Network error', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' }
          });
        });
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-schedules') {
    event.waitUntil(syncSchedules());
  }
});

async function syncSchedules() {
  try {
    // Sync pending schedule updates
    const pendingUpdates = await getPendingScheduleUpdates();
    if (pendingUpdates.length > 0) {
      await Promise.all(pendingUpdates.map((update) => postScheduleUpdate(update)));
      await clearPendingUpdates();
      console.log('[SW] Synced', pendingUpdates.length, 'schedule updates');
    }
  } catch (error) {
    console.error('[SW] Sync failed:', error);
    throw error; // Retry sync
  }
}

async function getPendingScheduleUpdates() {
  // Get pending updates from IndexedDB
  return []; // Implementation depends on IndexedDB setup
}

async function postScheduleUpdate(update) {
  // Post update to server
  return fetch('/api/schedules/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update)
  });
}

async function clearPendingUpdates() {
  // Clear pending updates from IndexedDB
}

// Push notifications for critical alerts
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};

  const title = data.title || 'Largo Lab Portal';
  const options = {
    body: data.body || 'New notification',
    icon: '/assets/icons/kaiser-favicon.svg',
    badge: '/assets/icons/badge-icon.png',
    vibrate: [200, 100, 200],
    data: data.url || '/',
    actions: [
      {
        action: 'open',
        title: 'Open'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    const urlToOpen = event.notification.data || '/';

    event.waitUntil(
      clients
        .matchAll({
          type: 'window',
          includeUncontrolled: true
        })
        .then((clientList) => {
          // Check if there's already a window open
          for (const client of clientList) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }

          // Open new window
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Message handler for client communication
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    const urlsToCache = event.data.urls || [];
    event.waitUntil(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.addAll(urlsToCache);
      })
    );
  }
});

console.log('[SW] Service Worker loaded');
