/**
 * Firebase Firestore — "Hi" counter integration example.
 *
 * SETUP:
 * 1. npm install firebase
 * 2. Create .env with your Firebase config (see README)
 * 3. Replace localStorage calls in HiBox with these functions
 *
 * Collection structure:
 *   hi-counts/{YYYY-MM-DD} → { count: number, updatedAt: Timestamp }
 */

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  increment,
  serverTimestamp,
} from 'firebase/firestore';

// -- Firebase config from environment variables --
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const HI_COLLECTION = 'hi-counts';

/**
 * Increment today's hi count (transactional).
 * Also sets a localStorage flag to prevent client-side double-sends.
 */
export async function sendHi() {
  const dateKey = new Date().toISOString().slice(0, 10);

  // Client-side rate-limit check
  if (localStorage.getItem('hi-sent-today') === dateKey) {
    return null;
  }

  const docRef = doc(db, HI_COLLECTION, dateKey);
  await setDoc(docRef, {
    count: increment(1),
    updatedAt: serverTimestamp(),
  }, { merge: true });

  // Mark as sent locally
  localStorage.setItem('hi-sent-today', dateKey);
  return dateKey;
}

/**
 * Subscribe to all hi-counts in real time.
 * Calls onChange({ "YYYY-MM-DD": number, ... }) on every update.
 * Returns an unsubscribe function.
 */
export function subscribeHiCounts(onChange) {
  const colRef = collection(db, HI_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    const counts = {};
    snapshot.forEach((doc) => {
      counts[doc.id] = doc.data().count || 0;
    });
    onChange(counts);
  });
}

/**
 * Read all hi-counts once (for initial render).
 */
export async function fetchHiCounts() {
  const colRef = collection(db, HI_COLLECTION);
  const { getDocs } = await import('firebase/firestore');
  const snapshot = await getDocs(colRef);
  const counts = {};
  snapshot.forEach((doc) => {
    counts[doc.id] = doc.data().count || 0;
  });
  return counts;
}
