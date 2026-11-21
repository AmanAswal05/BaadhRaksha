/**
 * BaadhRaksha - IndexedDB Storage Engine
 * Provides transparent, robust local persistence for:
 * - rescueRequests (with sync status: queued | sending | delivered)
 * - alerts (received alert inbox & delivery logs)
 * - citizenReports
 * - rumours (status & evidence updates)
 * - cachedDistricts (risk telemetry packets)
 */

const DB_NAME = 'BaadhRakshaDB';
const DB_VERSION = 1;

class Database {
  constructor() {
    this.db = null;
    this.readyPromise = this.init();
  }

  async init() {
    if (typeof indexedDB === 'undefined') {
      return null;
    }
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Rescue Requests Store
        if (!db.objectStoreNames.contains('rescueRequests')) {
          const reqStore = db.createObjectStore('rescueRequests', { keyPath: 'id' });
          reqStore.createIndex('syncStatus', 'syncStatus', { unique: false });
          reqStore.createIndex('districtId', 'districtId', { unique: false });
        }

        // Alerts Store
        if (!db.objectStoreNames.contains('alerts')) {
          const alertStore = db.createObjectStore('alerts', { keyPath: 'id' });
          alertStore.createIndex('districtId', 'districtId', { unique: false });
          alertStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Citizen Reports Store
        if (!db.objectStoreNames.contains('citizenReports')) {
          const repStore = db.createObjectStore('citizenReports', { keyPath: 'id' });
          repStore.createIndex('districtId', 'districtId', { unique: false });
        }

        // Rumours Store
        if (!db.objectStoreNames.contains('rumours')) {
          db.createObjectStore('rumours', { keyPath: 'id' });
        }

        // Shelters Store (for dynamic occupancy)
        if (!db.objectStoreNames.contains('shelters')) {
          db.createObjectStore('shelters', { keyPath: 'id' });
        }

        // Cached Risk Telemetry
        if (!db.objectStoreNames.contains('riskTelemetry')) {
          db.createObjectStore('riskTelemetry', { keyPath: 'districtId' });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('IndexedDB error:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  async ready() {
    if (this.db) return this.db;
    return this.readyPromise;
  }

  async put(storeName, item) {
    const db = await this.ready();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);
      req.onsuccess = () => resolve(item);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async get(storeName, key) {
    const db = await this.ready();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async getAll(storeName) {
    const db = await this.ready();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async delete(storeName, key) {
    const db = await this.ready();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(key);
      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async clear(storeName) {
    const db = await this.ready();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();
      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e.target.error);
    });
  }
}

export const db = new Database();
