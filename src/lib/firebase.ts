import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const fallbackFirebaseConfig = {
  apiKey: "AIzaSyDoposHPfXWReCeJSZq6VsFGjgSH_Oyr_c",
  authDomain: "saarthii-bd346.firebaseapp.com",
  projectId: "saarthii-bd346",
  storageBucket: "saarthii-bd346.firebasestorage.app",
  messagingSenderId: "78566913803",
  appId: "1:78566913803:web:29ccb114f97777adfa940e",
  measurementId: "G-Y14FB16Q6M",
};

const fromEnv = (value: string | undefined, fallback: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
};

const firebaseConfig = {
  apiKey: fromEnv(import.meta.env.VITE_FIREBASE_API_KEY, fallbackFirebaseConfig.apiKey),
  authDomain: fromEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, fallbackFirebaseConfig.authDomain),
  projectId: fromEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID, fallbackFirebaseConfig.projectId),
  storageBucket: fromEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, fallbackFirebaseConfig.storageBucket),
  messagingSenderId: fromEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, fallbackFirebaseConfig.messagingSenderId),
  appId: fromEnv(import.meta.env.VITE_FIREBASE_APP_ID, fallbackFirebaseConfig.appId),
  measurementId: fromEnv(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, fallbackFirebaseConfig.measurementId),
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
