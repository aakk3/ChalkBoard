import { BoardFile, TeacherProfile, DeviceBackupData } from '../types/whiteboard';

const DB_NAME = 'MyWhiteboard_DeviceDB';
const DB_VERSION = 1;
const STORE_PROFILES = 'profiles';
const STORE_BOARDS = 'boards';
const STORE_APP = 'app_state';

const LS_PROFILES = 'mywhiteboard_device_profiles_v3';
const LS_ACTIVE_PROFILE_ID = 'mywhiteboard_active_profile_id_v3';
const LS_BOARDS = 'mywhiteboard_device_boards_v3';
const LS_RECOVERY = 'mywhiteboard_recovery_snapshot_v3';

// IndexedDB instance cache
let dbInstance: IDBDatabase | null = null;

async function getDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) return null;
  if (dbInstance) return dbInstance;

  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = () => {
        resolve(null);
      };
      request.onsuccess = () => {
        dbInstance = request.result;
        resolve(dbInstance);
      };
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result as IDBDatabase;
        if (!db.objectStoreNames.contains(STORE_PROFILES)) {
          db.createObjectStore(STORE_PROFILES, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_BOARDS)) {
          db.createObjectStore(STORE_BOARDS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_APP)) {
          db.createObjectStore(STORE_APP, { keyPath: 'key' });
        }
      };
    } catch {
      resolve(null);
    }
  });
}

// Local Storage & IndexedDB Dual-Write for Safety
export async function saveProfilesToDevice(profiles: TeacherProfile[], activeId: string): Promise<void> {
  try {
    localStorage.setItem(LS_PROFILES, JSON.stringify(profiles));
    localStorage.setItem(LS_ACTIVE_PROFILE_ID, activeId);
  } catch {}

  const db = await getDB();
  if (!db) return;

  try {
    const tx = db.transaction([STORE_PROFILES, STORE_APP], 'readwrite');
    const profileStore = tx.objectStore(STORE_PROFILES);
    const appStore = tx.objectStore(STORE_APP);

    profileStore.clear();
    for (const p of profiles) {
      profileStore.put(p);
    }
    appStore.put({ key: 'activeProfileId', value: activeId });
  } catch {}
}

export function loadProfilesFromDevice(): { profiles: TeacherProfile[]; activeProfileId: string | null } {
  try {
    const savedProfiles = localStorage.getItem(LS_PROFILES);
    const activeId = localStorage.getItem(LS_ACTIVE_PROFILE_ID);
    if (savedProfiles) {
      const parsed = JSON.parse(savedProfiles);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { profiles: parsed, activeProfileId: activeId || parsed[0].id };
      }
    }
  } catch {}
  return { profiles: [], activeProfileId: null };
}

export async function saveBoardsToDevice(boards: BoardFile[]): Promise<void> {
  try {
    localStorage.setItem(LS_BOARDS, JSON.stringify(boards));
  } catch {}

  const db = await getDB();
  if (!db) return;

  try {
    const tx = db.transaction([STORE_BOARDS], 'readwrite');
    const boardStore = tx.objectStore(STORE_BOARDS);
    boardStore.clear();
    for (const b of boards) {
      boardStore.put(b);
    }
  } catch {}
}

export function loadBoardsFromDevice(): BoardFile[] | null {
  try {
    const saved = localStorage.getItem(LS_BOARDS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return null;
}

// Crash Recovery Snapshot
export function saveRecoverySnapshot(board: BoardFile): void {
  try {
    localStorage.setItem(
      LS_RECOVERY,
      JSON.stringify({
        board,
        timestamp: Date.now(),
      })
    );
  } catch {}
}

export function getRecoverySnapshot(): { board: BoardFile; timestamp: number } | null {
  try {
    const saved = localStorage.getItem(LS_RECOVERY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {}
  return null;
}

export function clearRecoverySnapshot(): void {
  try {
    localStorage.removeItem(LS_RECOVERY);
  } catch {}
}

// Export All Device Data into a single portable backup file
export function exportDeviceBackup(profiles: TeacherProfile[], activeProfileId: string, boards: BoardFile[]): void {
  const backup: DeviceBackupData = {
    version: 1,
    exportedAt: Date.now(),
    deviceLabel: 'ChalkBoard Classroom Device',
    activeProfileId,
    profiles,
    boards,
  };

  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  a.download = `ChalkBoard_Device_Backup_${dateStr}.chalkboard`;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
}

// Reset Device
export async function resetDeviceStorage(): Promise<void> {
  try {
    localStorage.removeItem(LS_PROFILES);
    localStorage.removeItem(LS_ACTIVE_PROFILE_ID);
    localStorage.removeItem(LS_BOARDS);
    localStorage.removeItem(LS_RECOVERY);
  } catch {}

  const db = await getDB();
  if (db) {
    try {
      const tx = db.transaction([STORE_PROFILES, STORE_BOARDS, STORE_APP], 'readwrite');
      tx.objectStore(STORE_PROFILES).clear();
      tx.objectStore(STORE_BOARDS).clear();
      tx.objectStore(STORE_APP).clear();
    } catch {}
  }
}
