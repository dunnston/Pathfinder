/**
 * Service Worker Registration
 * SEC-20: Offline support service worker management
 *
 * Handles registration, updates, and communication with the service worker.
 */

import { FEATURES } from '@/config/constants';

interface ServiceWorkerCallbacks {
  onSuccess?: () => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onOffline?: () => void;
  onOnline?: () => void;
}

/**
 * Register the service worker
 *
 * @param callbacks - Optional callbacks for various SW events
 */
export function registerServiceWorker(callbacks?: ServiceWorkerCallbacks): void {
  // Only register in production and if feature is enabled
  if (!FEATURES.offlineSupport) {
    console.log('[SW] Offline support is disabled');
    return;
  }

  if (!('serviceWorker' in navigator)) {
    console.log('[SW] Service workers not supported');
    return;
  }

  // Wait for window load to not affect initial page load
  window.addEventListener('load', () => {
    const swUrl = '/sw.js';

    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log('[SW] Registered successfully');

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Every hour

        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) {
            return;
          }

          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New content is available
                console.log('[SW] New content available, will update on reload');
                callbacks?.onUpdate?.(registration);
              } else {
                // Content cached for offline use
                console.log('[SW] Content cached for offline use');
                callbacks?.onSuccess?.();
              }
            }
          };
        };
      })
      .catch((error) => {
        console.error('[SW] Registration failed:', error);
      });

    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('[SW] Back online');
      callbacks?.onOnline?.();
    });

    window.addEventListener('offline', () => {
      console.log('[SW] Gone offline');
      callbacks?.onOffline?.();
    });
  });
}

/**
 * Unregister all service workers
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      const success = await registration.unregister();
      console.log('[SW] Unregistered:', success);
      return success;
    } catch (error) {
      console.error('[SW] Unregister failed:', error);
      return false;
    }
  }
  return false;
}

/**
 * Send a message to the service worker
 *
 * @param message - Message to send
 */
export function sendMessageToSW(message: { type: string; data?: unknown }): void {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(message);
  }
}

/**
 * Skip waiting and activate new service worker
 */
export function skipWaitingAndReload(): void {
  sendMessageToSW({ type: 'SKIP_WAITING' });
  window.location.reload();
}

/**
 * Clear the service worker cache
 */
export function clearSWCache(): void {
  sendMessageToSW({ type: 'CLEAR_CACHE' });
}

/**
 * Check if the app is running offline
 */
export function isOffline(): boolean {
  return !navigator.onLine;
}

/**
 * Hook to check online status (can be used in React components)
 */
export function getOnlineStatus(): boolean {
  return navigator.onLine;
}
