// 🔹 Importaciones
import { auth, db } from "./firebase-config.js";

import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
    doc, 
    setDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// 🔐 LOGIN
export async function loginUsuario(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, message: error.message };
    }
}


// 👤 CREAR USUARIO (SOLO ADMIN)
export async function crearUsuario(nombre, cedula, password, rol) {
    try {
        const email = cedula + "@calorineplus.com";

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        await setDoc(doc(db, "usuarios", userCredential.user.uid), {
            nombre: nombre,
            cedula: cedula,
            rol: rol,
            estado: "activo"
        });

        return { success: true };

    } catch (error) {
        return { success: false, message: error.message };
    }
}