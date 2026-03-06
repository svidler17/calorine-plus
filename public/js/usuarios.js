import { crearUsuario } from "js/auth.js";
import { db } from "js/firebase-config.js";
import { collection, getDocs, doc, updateDoc, deleteDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const crearBtn = document.getElementById("crearBtn");
const mensaje = document.getElementById("mensaje");
const tabla = document.getElementById("tablaUsuarios");

crearBtn.addEventListener("click", async () => {

    const nombre = document.getElementById("nombre").value;
    const cedula = document.getElementById("cedula").value;
    const password = document.getElementById("password").value;
    const rol = document.getElementById("rol").value;

    const res = await crearUsuario(nombre, cedula, password, rol);

    if (res.success) {
        mensaje.textContent = "Usuario creado correctamente";
        cargarUsuarios();
    } else {
        mensaje.textContent = res.message;
    }
});

async function cargarUsuarios() {

    tabla.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "usuarios"));

    querySnapshot.forEach((docSnap) => {

        const data = docSnap.data();
        const uid = docSnap.id;

        tabla.innerHTML += `
            <tr>
                <td>${data.nombre}</td>
                <td>${data.cedula}</td>
                <td>${data.rol}</td>
                <td>
                    <button onclick="cambiarRol('${uid}', '${data.rol}')">Cambiar Rol</button>
                    <button onclick="eliminarUsuario('${uid}')">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

window.cambiarRol = async (uid, rolActual) => {

    const nuevoRol = rolActual === "admin" ? "operador" : "admin";

    await updateDoc(doc(db, "usuarios", uid), {
        rol: nuevoRol
    });

    cargarUsuarios();
};

window.eliminarUsuario = async (uid) => {

    await deleteDoc(doc(db, "usuarios", uid));
    cargarUsuarios();
};

cargarUsuarios();