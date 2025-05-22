// firestoreConfig.js - Configuración de Firebase

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Aquí debes colocar tu configuración de Firebase:
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);

// Exportación de la instancia de Firestore
export const db = getFirestore(app);
