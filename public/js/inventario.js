import { db } from "./firebase-config.js";
import { 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const nombre = document.getElementById("nombreProducto");
const codigo = document.getElementById("codigoProducto");
const stock = document.getElementById("stockProducto");
const precioCompra = document.getElementById("precioCompra");
const precioVenta = document.getElementById("precioVenta");
const fechaVencimiento = document.getElementById("fechaVencimiento");
const stockMinimo = document.getElementById("stockMinimo");
const guardarBtn = document.getElementById("guardarProducto");
const tabla = document.getElementById("tablaInventario");

guardarBtn.addEventListener("click", async () => {

    if (!nombre.value || !codigo.value) {
        alert("Completa los campos obligatorios");
        return;
    }

    await addDoc(collection(db, "inventario"), {
        nombre: nombre.value,
        codigo: codigo.value,
        stock: Number(stock.value),
        precioCompra: Number(precioCompra.value),
        precioVenta: Number(precioVenta.value),
        fechaVencimiento: fechaVencimiento.value || null,
        stockMinimo: Number(stockMinimo.value),
        createdAt: serverTimestamp()
    });

    alert("Producto guardado correctamente");
    limpiarFormulario();
    cargarInventario();
});

function limpiarFormulario() {
    nombre.value = "";
    codigo.value = "";
    stock.value = "";
    precioCompra.value = "";
    precioVenta.value = "";
    fechaVencimiento.value = "";
    stockMinimo.value = "";
}

async function cargarInventario() {

    tabla.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "inventario"));

    querySnapshot.forEach((docSnap) => {

        const data = docSnap.data();

        const claseStock = Number(data.stock) <= Number(data.stockMinimo)
            ? "badge-stock stock-bajo"
            : "badge-stock stock-ok";

        tabla.innerHTML += `
            <tr>
                <td>${data.nombre}</td>
                <td>${data.codigo}</td>
                <td>
                    <span class="${claseStock}">
                        ${data.stock}
                    </span>
                </td>
                <td>$${data.precioVenta}</td>
                <td>${data.fechaVencimiento || "-"}</td>
                <td>
                    <button onclick="eliminarProducto('${docSnap.id}')">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });
}

window.eliminarProducto = async (id) => {
    await deleteDoc(doc(db, "inventario", id));
    cargarInventario();
};

cargarInventario();
