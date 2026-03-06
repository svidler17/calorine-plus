// Importar desde CDN (IMPORTANTE)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Tu configuración REAL
const firebaseConfig = {
  apiKey: "AIzaSyBowPt1PndIDYbyJailDD06VLBZSgjseBQ",
  authDomain: "calorine-plus.firebaseapp.com",
  projectId: "calorine-plus",
  storageBucket: "calorine-plus.firebasestorage.app",
  messagingSenderId: "907383707441",
  appId: "1:907383707441:web:f8e49cbd99ed8b22884210"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios que vamos a usar
const auth = getAuth(app);
const db = getFirestore(app);

// Exportar
export { auth, db };