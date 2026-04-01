import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey:            "AIzaSyC9dPKX1js41YbvNB0O7W5iS1Cs9klT4dQ",
  authDomain:        "opt-website-cms.firebaseapp.com",
  projectId:         "opt-website-cms",
  storageBucket:     "opt-website-cms.firebasestorage.app",
  messagingSenderId: "603464120637",
  appId:             "1:603464120637:web:a6682848dc1d48b48aad54",
};

const app = initializeApp(firebaseConfig);
export const db      = getFirestore(app);
export const storage = getStorage(app);