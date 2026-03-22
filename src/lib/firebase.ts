import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDoposHPfXWReCeJSZq6VsFGjgSH_Oyr_c",
  authDomain: "saarthii-bd346.firebaseapp.com",
  projectId: "saarthii-bd346",
  storageBucket: "saarthii-bd346.firebasestorage.app",
  messagingSenderId: "78566913803",
  appId: "1:78566913803:web:29ccb114f97777adfa940e",
  measurementId: "G-Y14FB16Q6M" 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
