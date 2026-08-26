import {
  doc,
  setDoc,
  onSnapshot,
  getDoc,
} from 'firebase/firestore';
import { db } from './firebase';

const STUDIO_DOC_ID = 'main_studio_state';
const COLLECTION_NAME = 'devjos_studios';

export interface StudioSyncPayload {
  settings?: any;
  clients?: any[];
  projects?: any[];
  tasks?: any[];
  services?: any[];
  quotes?: any[];
  incomes?: any[];
  expenses?: any[];
  payments?: any[];
  photoSessions?: any[];
  galleries?: any[];
  mediaProjects?: any[];
  files?: any[];
  calendarEvents?: any[];
  team?: any[];
  notifications?: any[];
  activityLogs?: any[];
  lastUpdated?: string;
  updatedBy?: string;
}

/**
 * Subscribes to real-time changes in Firestore.
 */
export function subscribeToStudioData(
  onData: (data: StudioSyncPayload) => void,
  onError?: (error: any) => void
) {
  try {
    const docRef = doc(db, COLLECTION_NAME, STUDIO_DOC_ID);
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as StudioSyncPayload;
          onData(data);
        }
      },
      (err) => {
        console.warn('Firestore subscription status:', err.message);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Could not establish Firestore listener:', err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Fetches the current studio state once.
 */
export async function getStudioDataOnce(): Promise<StudioSyncPayload | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, STUDIO_DOC_ID);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as StudioSyncPayload;
    }
    return null;
  } catch (err) {
    console.warn('Firestore getDoc warning:', err);
    return null;
  }
}

/**
 * Saves or updates studio state in Firestore.
 */
let debounceTimer: any = null;
export function saveStudioDataToFirestore(
  payload: StudioSyncPayload,
  userName?: string
): Promise<void> {
  return new Promise((resolve) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    
    debounceTimer = setTimeout(async () => {
      try {
        const docRef = doc(db, COLLECTION_NAME, STUDIO_DOC_ID);
        const cleanPayload: StudioSyncPayload = {
          ...payload,
          lastUpdated: new Date().toISOString(),
          updatedBy: userName || 'Sistema',
        };
        await setDoc(docRef, cleanPayload, { merge: true });
        resolve();
      } catch (err) {
        console.warn('Firestore save status:', err);
        resolve();
      }
    }, 600);
  });
}
