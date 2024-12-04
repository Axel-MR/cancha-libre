import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCOct71MoEFK3T1X2jYu8hG9NtrPXDGCFc",
  authDomain: "canchalibre-6610f.firebaseapp.com",
  projectId: "canchalibre-6610f",
  storageBucket: "canchalibre-6610f.firebasestorage.app",
  messagingSenderId: "782191710290",
  appId: "1:782191710290:web:2205e4525a1040747f4f8b",
  measurementId: "G-RLFV9B7S3S"
};

// Inicializa Firebase solo si no está ya inicializado
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app); // Esto asegura que se esté utilizando el mismo app
const db = getFirestore(app);

export { auth, db, collection, addDoc }; // Asegúrate de exportar auth y db correctamente
