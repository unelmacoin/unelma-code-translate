import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();
if (!apiKey) {
  throw new Error('Firebase API key is missing or empty');
}

const firebaseConfig = {
  apiKey,
  authDomain: "unelma-code-translator-57181.firebaseapp.com",
  projectId: "unelma-code-translator-57181",
  storageBucket: "unelma-code-translator-57181.firebasestorage.app",
  messagingSenderId: "142875031273",
  appId: "1:142875031273:web:7d8edef9def97196dc6278"
};


// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Authentication
const auth = getAuth(app);

export { app, auth };