import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCyKL6k9-sP1iaeEAbu6wa48P0k_zn7zDg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "estudio-devjos.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "estudio-devjos",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "estudio-devjos.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "493881955821",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:493881955821:web:0a4c14a7b5999974e4c3e4"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleAuthProvider = new GoogleAuthProvider();
export default app;
