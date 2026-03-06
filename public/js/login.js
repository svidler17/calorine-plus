import { loginUsuario } from "./auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "./firebase-config.js";

const form = document.getElementById("loginForm");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const documento = document.getElementById("documento").value;
    const password = document.getElementById("password").value;

    const email = documento + "@calorineplus.com";

    const resultado = await loginUsuario(email, password);

    if (resultado.success) {

        const uid = resultado.user.uid;

        const docRef = doc(db, "usuarios", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

            const datos = docSnap.data();

            if (datos.rol === "admin") {
                window.location.href = "admin-dashboard.html";
            } else {
                window.location.href = "operador.html";
            }

        } else {
            mensaje.textContent = "Usuario sin datos registrados";
        }

    } else {
        mensaje.textContent = "Error: " + resultado.message;
    }
});