/**
 * Encryption Service
 * Provides AES-GCM encryption for sensitive data stored in localStorage
 *
 * Security Notes:
 * - Uses Web Crypto API (AES-256-GCM)
 * - Encryption key is stored in IndexedDB (more secure than localStorage)
 * - Each encryption uses a random IV (Initialization Vector)
 * - Key is non-extractable from IndexedDB
 */

import { logger } from './logger';

const DB_NAME = 'pathfinder-secure';
const DB_VERSION = 1;
const STORE_NAME = 'keys';
const KEY_ID = 'encryption-key';

/**
 * Open IndexedDB connection for key storage
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

/**
 * Load encryption key from IndexedDB
 */
async function loadKeyFromStorage(): Promise<CryptoKey | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(KEY_ID);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result?.key || null);
      };
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Save encryption key to IndexedDB
 */
async function saveKeyToStorage(key: CryptoKey): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({ id: KEY_ID, key });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    // SEC-7: Use logger instead of console.error
    logger.error('Failed to save encryption key', error instanceof Error ? error : undefined);
  }
}

// Singleton key promise
let keyPromise: Promise<CryptoKey> | null = null;

/**
 * Get or create the encryption key
 */
async function getOrCreateKey(): Promise<CryptoKey> {
  if (keyPromise) return keyPromise;

  keyPromise = (async () => {
    // Try to load existing key
    const storedKey = await loadKeyFromStorage();
    if (storedKey) {
      return storedKey;
    }

    // Generate new key
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      false, // non-extractable for security
      ['encrypt', 'decrypt']
    );

    await saveKeyToStorage(key);
    return key;
  })();

  return keyPromise;
}

/**
 * Encrypt plaintext data
 * @param plaintext - The data to encrypt
 * @returns Base64-encoded encrypted data (IV + ciphertext)
 */
export async function encrypt(plaintext: string): Promise<string> {
  const key = await getOrCreateKey();

  // Generate random IV for each encryption
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );

  // Combine IV + ciphertext
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);

  // Base64 encode for storage
  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt encrypted data
 * @param encrypted - Base64-encoded encrypted data
 * @returns Decrypted plaintext
 */
export async function decrypt(encrypted: string): Promise<string> {
  const key = await getOrCreateKey();

  // Decode base64
  const combined = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));

  // Extract IV and ciphertext
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}

/**
 * Check if encryption is supported in this environment
 */
export function isEncryptionSupported(): boolean {
  return !!(
    typeof crypto !== 'undefined' &&
    crypto.subtle &&
    typeof indexedDB !== 'undefined'
  );
}

/**
 * Create encrypted storage adapter for Zustand persist middleware
 * Falls back to plain storage if encryption is not supported
 */
export function createEncryptedStorage() {
  const supportsEncryption = isEncryptionSupported();

  return {
    getItem: async (name: string): Promise<string | null> => {
      const stored = localStorage.getItem(name);
      if (!stored) return null;

      // Check if data is encrypted (encrypted data is base64)
      const isEncrypted = stored.startsWith('eyJ') === false && !stored.startsWith('{');

      if (isEncrypted && supportsEncryption) {
        try {
          const decrypted = await decrypt(stored);
          return decrypted;
        } catch {
          // If decryption fails, data might be corrupted or old unencrypted data
          // SEC-7: Use logger instead of console.warn
          logger.warn('Failed to decrypt stored data, returning null');
          return null;
        }
      }

      // Return as-is for unencrypted data (migration case)
      return stored;
    },

    setItem: async (name: string, value: string): Promise<void> => {
      if (supportsEncryption) {
        const encrypted = await encrypt(value);
        localStorage.setItem(name, encrypted);
      } else {
        localStorage.setItem(name, value);
      }
    },

    removeItem: (name: string): void => {
      localStorage.removeItem(name);
    },
  };
}

/**
 * Clear the stored encryption key (for testing or key rotation)
 */
export async function clearEncryptionKey(): Promise<void> {
  keyPromise = null;
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(KEY_ID);
  } catch {
    // Ignore errors during cleanup
  }
}
