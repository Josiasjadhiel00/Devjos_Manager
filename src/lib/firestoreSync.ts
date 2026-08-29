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

let firestoreErrorLogged = false;
let isFirestoreAvailable: boolean | null = null;

/**
 * Subscribes to real-time changes in Firestore only if explicitly enabled.
 */
export function subscribeToStudioData(
  onData: (data: StudioSyncPayload) => void,
  onError?: (error: any) => void
) {
  // If Firestore is already known to be unavailable, don't spam listeners
  if (isFirestoreAvailable === false) {
    return () => {};
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, STUDIO_DOC_ID);
    const unsubscribe = onSnapshot(
      docRef,
      { includeMetadataChanges: true },
      (snapshot) => {
        isFirestoreAvailable = true;
        if (snapshot.exists() && !snapshot.metadata.hasPendingWrites) {
          const data = snapshot.data() as StudioSyncPayload;
          onData(data);
        }
      },
      (err) => {
        isFirestoreAvailable = false;
        if (!firestoreErrorLogged) {
          firestoreErrorLogged = true;
          // Silent log - Firestore not provisioned, app will use PostgreSQL or local state
        }
        if (onError) onError(err);
      }
    );
    return unsubscribe;
  } catch (err) {
    isFirestoreAvailable = false;
    if (!firestoreErrorLogged) {
      firestoreErrorLogged = true;
    }
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Tests direct read/write connection to Firestore
 */
export async function testFirestoreConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const docRef = doc(db, COLLECTION_NAME, STUDIO_DOC_ID);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      // Try writing initial blank doc
      await setDoc(docRef, { initialSetup: true, lastUpdated: new Date().toISOString() }, { merge: true });
    }
    return {
      success: true,
      message: 'Conexión exitosa con Firestore (Proyecto: estudio-devjos). Los datos se sincronizan en tiempo real entre todas las cuentas y dispositivos.',
    };
  } catch (err: any) {
    const msg = err?.message || String(err);
    if (msg.includes('permission-denied') || msg.includes('PERMISSION_DENIED')) {
      return {
        success: false,
        message: 'Permiso denegado por las reglas de Firestore. Ve a la consola de Firebase > Firestore Database > pestaña "Reglas" y permite lectura/escritura (allow read, write: if true;).',
      };
    }
    if (msg.includes('not-found') || msg.includes('NOT_FOUND') || msg.includes('Failed to get document')) {
      return {
        success: false,
        message: 'La base de datos Firestore aún no ha sido creada en tu consola de Firebase. Abre Firebase > Firestore Database y haz clic en "Crear base de datos".',
      };
    }
    return {
      success: false,
      message: `Error al conectar con Firestore: ${msg}`,
    };
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
 * Forces an immediate save to Firestore without debounce delay.
 */
export async function directForceSaveToFirestore(
  payload: StudioSyncPayload,
  userName?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const docRef = doc(db, COLLECTION_NAME, STUDIO_DOC_ID);
    const cleanPayload: StudioSyncPayload = {
      ...payload,
      lastUpdated: new Date().toISOString(),
      updatedBy: userName || 'Sistema',
    };
    await setDoc(docRef, cleanPayload, { merge: true });
    return {
      success: true,
      message: '¡Datos sincronizados y subidos exitosamente a Firebase Firestore!',
    };
  } catch (err: any) {
    const msg = err?.message || String(err);
    if (msg.includes('permission-denied') || msg.includes('PERMISSION_DENIED')) {
      return {
        success: false,
        message: 'Permiso denegado por las reglas de Firestore. Ve a Firebase Console > Firestore Database > Reglas y permite allow read, write: if true;.',
      };
    }
    if (msg.includes('not-found') || msg.includes('NOT_FOUND') || msg.includes('Failed to get document')) {
      return {
        success: false,
        message: 'La base de datos Firestore aún no existe en tu consola de Firebase (estudio-devjos). Entra a https://console.firebase.google.com/project/estudio-devjos/firestore y pulsa "Crear base de datos".',
      };
    }
    return {
      success: false,
      message: `Error al subir a Firestore: ${msg}`,
    };
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
