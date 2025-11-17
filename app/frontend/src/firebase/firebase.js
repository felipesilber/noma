import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
const firebaseConfig = {
    apiKey: 'AIzaSyDPiAjDKBciL_gNVEP7vc4_dsmbQIXgOb4',
    authDomain: 'noma-65c5e.firebaseapp.com',
    projectId: 'noma-65c5e',
    storageBucket: 'noma-65c5e.firebasestorage.app',
    messagingSenderId: '865775715096',
    appId: '1:865775715096:web:58a2a7915b594fb223546d',
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth };
setPersistence(auth, browserLocalPersistence).catch(() => {
});
