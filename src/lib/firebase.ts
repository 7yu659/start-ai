import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC-0Up6cD1OT1nXcDE7NpBHtD5BMW5y5UE",
  authDomain: "start-ai-guide.firebaseapp.com",
  projectId: "start-ai-guide",
  storageBucket: "start-ai-guide.firebasestorage.app",
  messagingSenderId: "137519537550",
  appId: "1:137519537550:web:e43439ab3b935e45a298df",
  measurementId: "G-97EY1YPDG3"
};

export const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);

// Enable offline caching
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
    } else if (err.code == 'unimplemented') {
      console.warn('The current browser does not support all of the features required to enable persistence');
    }
  });
}

export const storage = getStorage(app);
export const auth = getAuth(app);
