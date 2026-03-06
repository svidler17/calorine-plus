import { auth, db } from "./firebase-config.js";

import { onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
  collection, 
  getDocs, 
  updateDoc, 
  doc, 
  addDoc,
  increment 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


/* =========================
   VALIDAR SESIÓN
========================= */

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  iniciarSistemaVentas();
});


/* =========================
   SISTEMA DE VENTAS
========================= */

function iniciarSistemaVentas() {

  const buscador = document.getElementById("buscador");
  const resultados = document.getElementById("resultados");
  const carritoDiv = document.getElementById("carrito");
  const totalSpan = document.getElementById("total");
  const btnVender = document.getElementById("btnVender");

  let inventario = [];
  let carrito = [];


  /* =========================
     CARGAR INVENTARIO
  ========================= */

  async function cargarInventario() {

    const querySnapshot = await getDocs(collection(db, "inventario"));
    inventario = [];

    querySnapshot.forEach((docSnap) => {
      inventario.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });

    console.log("Inventario cargado:", inventario);
  }

  cargarInventario();


  /* =========================
     BUSCADOR (NOMBRE + CÓDIGO)
  ========================= */

  buscador.addEventListener("input", () => {

    const texto = buscador.value.toLowerCase().trim();
    resultados.innerHTML = "";

    if (texto === "") return;

    const filtrados = inventario.filter(item =>
      item.nombre?.toLowerCase().includes(texto) ||
      item.codigo?.toLowerCase().includes(texto)
    );

    const coincidenciaExacta = inventario.find(item =>
      item.codigo?.toLowerCase() === texto
    );

    if (coincidenciaExacta) {
      agregarAlCarrito(coincidenciaExacta.id);
      buscador.value = "";
      resultados.innerHTML = "";
      return;
    }

    filtrados.forEach(item => {

      const div = document.createElement("div");
      div.classList.add("producto-item");

      div.innerHTML = `
        <div>
          <strong>${item.nombre}</strong><br>
          Código: ${item.codigo}<br>
          Stock: ${item.stock}
        </div>
        <div>
          $${item.precioVenta}
          <button onclick="agregarAlCarrito('${item.id}')">
            Agregar
          </button>
        </div>
      `;

      resultados.appendChild(div);
    });

  });


  /* =========================
     AGREGAR AL CARRITO
  ========================= */

  window.agregarAlCarrito = function(id) {

    const producto = inventario.find(p => p.id === id);

    if (!producto) {
      alert("Producto no encontrado");
      return;
    }

    if (producto.stock <= 0) {
      alert("Sin stock disponible");
      return;
    }

    const existente = carrito.find(p => p.id === id);

    if (existente) {

      if (existente.cantidad >= producto.stock) {
        alert("No hay más stock disponible");
        return;
      }

      existente.cantidad++;

    } else {

      carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precioVenta,
        cantidad: 1
      });
    }

    renderCarrito();
  };


  /* =========================
     RENDER CARRITO
  ========================= */

  function renderCarrito(){

    carritoDiv.innerHTML = "";
    let total = 0;

    carrito.forEach((item,index)=>{

      const subtotal = item.precio * item.cantidad;
      total += subtotal;

      const div = document.createElement("div");
      div.classList.add("carrito-item");

      div.innerHTML = `

      <div>

      <strong>${item.nombre}</strong>

      <div class="carrito-controles">

      <button class="btn-cantidad" onclick="restarCantidad(${index})">-</button>

      <span>${item.cantidad}</span>

      <button class="btn-cantidad" onclick="sumarCantidad(${index})">+</button>

      <button class="btn-eliminar" onclick="eliminarProducto(${index})">x</button>

      </div>

      </div>

      <div>
      $${subtotal.toFixed(2)}
      </div>

      `;

      carritoDiv.appendChild(div);

    });

    totalSpan.textContent = total.toFixed(2);
  }


  /* =========================
     CONTROLES DEL CARRITO
  ========================= */

  window.sumarCantidad = function(index){

    const producto = carrito[index];
    const productoInventario = inventario.find(p => p.id === producto.id);

    if(producto.cantidad >= productoInventario.stock){
      alert("No hay más stock disponible");
      return;
    }

    carrito[index].cantidad++;
    renderCarrito();
  }

  window.restarCantidad = function(index){

    if(carrito[index].cantidad > 1){
      carrito[index].cantidad--;
    }else{
      carrito.splice(index,1);
    }

    renderCarrito();
  }

  window.eliminarProducto = function(index){

    carrito.splice(index,1);
    renderCarrito();
  }


  /* =========================
     FINALIZAR VENTA
  ========================= */

  btnVender.addEventListener("click", async () => {

    if (carrito.length === 0) {
      alert("Carrito vacío");
      return;
    }

    try {

      const totalVenta = parseFloat(totalSpan.textContent);
      const metodoPago = document.getElementById("metodoPago").value;

      await addDoc(collection(db, "ventas"), {
        fecha: new Date(),
        productos: carrito,
        total: totalVenta,
        metodoPago: metodoPago
      });

      for (const item of carrito) {

        const ref = doc(db, "inventario", item.id);

        await updateDoc(ref, {
          stock: increment(-Number(item.cantidad))
        });
      }

      alert("Venta realizada correctamente");

      carrito = [];
      renderCarrito();
      cargarInventario();
      buscador.value = "";
      resultados.innerHTML = "";

    } catch (error) {

      console.error("Error al finalizar venta:", error);
      alert("Error al procesar la venta");

    }

  });

}