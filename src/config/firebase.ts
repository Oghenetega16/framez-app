import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAngO0JTa6h2GAtZxEe6f2TqQv1wlVvnt0",
    authDomain: "framez-app-29e6c.firebaseapp.com",
    projectId: "framez-app-29e6c",
    storageBucket: "framez-app-29e6c.firebasestorage.app",
    messagingSenderId: "999318676577",
    appId: "1:999318676577:web:381dc906cbc070ad6ab620",
    measurementId: "G-E47GC6EB79"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;