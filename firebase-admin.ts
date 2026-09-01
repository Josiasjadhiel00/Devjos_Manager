import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import firebaseConfig from '../../firebase-applet-config.json';

if (!getApps().length) {
  // Prefer a real service account (needed for admin operations like
  // createUser / setCustomUserClaims, and for reliable token verification
  // in serverless environments). Falls back to project-id-only init, which
  // only supports verifying ID tokens, not admin actions.
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    const serviceAccount = JSON.parse(serviceAccountJson);
    initializeApp({
      credential: cert(serviceAccount),
      projectId: firebaseConfig.projectId,
    });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    initializeApp({
      credential: applicationDefault(),
      projectId: firebaseConfig.projectId,
    });
  } else {
    console.warn(
      'FIREBASE_SERVICE_ACCOUNT_JSON not set — Firebase Admin running in limited mode ' +
      '(ID token verification only; admin actions like creating users will fail).'
    );
    initializeApp({
      projectId: firebaseConfig.projectId,
    });
  }
}

export const adminAuth = getAuth();
