import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Importa getAuth para la autenticación
import { getFirestore } from "firebase/firestore"; // Importa Firestore

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD7CztHrAbfA8BTPA24Mqp0t9VH6I6uBms",
  authDomain: "cisterna-otb.firebaseapp.com",
  projectId: "cisterna-otb",
  storageBucket: "cisterna-otb.appspot.com",
  messagingSenderId: "457775754305",
  appId: "1:457775754305:web:74f08d9f0806e0ea04eac0"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Obtén la instancia de autenticación
const auth = getAuth(app); // Inicializa la autenticación

// Obtén la instancia de Firestore
const db = getFirestore(app); // Inicializa Firestore

// Exporta la instancia de autenticación y Firestore
export { auth, db }; // Exporta auth y db para que se puedan usar en otros archivos
export default app; // Si necesitas exportar app también
