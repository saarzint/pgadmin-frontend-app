import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Get current hostname for dynamic authDomain
const getCurrentHostname = () => {
  if (typeof window !== 'undefined') {
    return window.location.hostname;
  }
  return '';
};

// Firebase configuration
// Replace these values with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'your-api-key',
  // Use environment variable if set, otherwise construct from current domain
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 
    (import.meta.env.VITE_FIREBASE_PROJECT_ID 
      ? `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`
      : 'your-project.firebaseapp.com'),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'your-project-id',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'your-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'your-sender-id',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'your-app-id',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Set the auth domain settings to allow current origin
if (typeof window !== 'undefined') {
  const currentOrigin = window.location.origin;
  console.log('Current origin:', currentOrigin);
  console.log('Firebase authDomain:', firebaseConfig.authDomain);
}

export default app;

