import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// TODO: Reemplazar con las credenciales de tu NUEVO proyecto Firebase "Shaddai Industrial"
const firebaseConfig = {
    apiKey: "AIzaSyD1cPtncpK4_Jalg_nYWrda6TVkaEmUwfs",
    authDomain: "techstore-e5aa2.firebaseapp.com",
    projectId: "techstore-e5aa2",
    storageBucket: "techstore-e5aa2.firebasestorage.app",
    messagingSenderId: "285228582253",
    appId: "1:285228582253:web:763be017fe0213ffb44664",
    measurementId: "G-MGX6364GJS"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
