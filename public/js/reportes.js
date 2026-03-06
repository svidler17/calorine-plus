import { db } from "./firebase-config.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function cargarReportes(){

const snapshot = await getDocs(collection(db,"ventas"))

let ventas = []

snapshot.forEach(doc=>{
ventas.push(doc.data())
})

generarReportes(ventas)

}

function generarReportes(ventas){

let totalHoy = 0
let totalMes = 0

let pagos = {}
let productos = {}

const hoy = new Date()
const mesActual = hoy.getMonth()

ventas.forEach(v=>{

const fecha = new Date(v.fecha.seconds * 1000)

if(fecha.toDateString() === hoy.toDateString()){
totalHoy += v.total
}

if(fecha.getMonth() === mesActual){
totalMes += v.total
}

if(v.metodoPago){

pagos[v.metodoPago] =
(pagos[v.metodoPago] || 0) + v.total

}

v.productos.forEach(p=>{

productos[p.nombre] =
(productos[p.nombre] || 0) + p.cantidad

})

})

document.getElementById("ventasHoy").textContent = "$"+totalHoy
document.getElementById("ventasMes").textContent = "$"+totalMes

crearTabla("tablaPagos",pagos)

ordenarProductos(productos)

crearGraficas(pagos,productos,ventas)

}

function crearTabla(id,data){

const tabla = document.getElementById(id)
tabla.innerHTML = ""

for(const key in data){

tabla.innerHTML += `
<tr>
<td>${key}</td>
<td>$${data[key]}</td>
</tr>
`

}

}

function ordenarProductos(productos){

const lista = Object.entries(productos)

lista.sort((a,b)=> b[1]-a[1])

const mas = lista.slice(0,5)
const menos = lista.slice(-5)

const tablaMas = document.getElementById("tablaMasVendidos")
const tablaMenos = document.getElementById("tablaMenosVendidos")

tablaMas.innerHTML=""
tablaMenos.innerHTML=""

mas.forEach(p=>{
tablaMas.innerHTML+=`
<tr>
<td>${p[0]}</td>
<td>${p[1]}</td>
</tr>`
})

menos.forEach(p=>{
tablaMenos.innerHTML+=`
<tr>
<td>${p[0]}</td>
<td>${p[1]}</td>
</tr>`
})

}

function crearGraficas(pagos,productos,ventas){

graficaPagos(pagos)
graficaProductos(productos)
graficaVentasMes(ventas)

}

function graficaVentasMes(ventas){

let dias={}
const hoy=new Date()
const mesActual=hoy.getMonth()

ventas.forEach(v=>{

const fecha=new Date(v.fecha.seconds*1000)

if(fecha.getMonth()===mesActual){

const dia=fecha.getDate()

dias[dia]=(dias[dia]||0)+v.total

}

})

const labels=Object.keys(dias)
const data=Object.values(dias)

new Chart(document.getElementById("graficaVentasMes"),{

type:"line",

data:{
labels:labels,
datasets:[{
label:"Ventas",
data:data,
borderWidth:3,
tension:.3,
fill:true
}]
},

options:{
responsive:true,
animation:{duration:1200},
plugins:{legend:{display:false}}
}

})

}

function graficaPagos(pagos){

const labels=Object.keys(pagos)
const data=Object.values(pagos)

new Chart(document.getElementById("graficaPagos"),{

type:"pie",

data:{
labels:labels,
datasets:[{data:data}]
},

options:{
responsive:true,
animation:{duration:1500}
}

})

}

function graficaProductos(productos){

const lista=Object.entries(productos)

lista.sort((a,b)=>b[1]-a[1])

const top=lista.slice(0,5)

const labels=top.map(p=>p[0])
const data=top.map(p=>p[1])

new Chart(document.getElementById("graficaProductos"),{

type:"bar",

data:{
labels:labels,
datasets:[{
label:"Cantidad Vendida",
data:data
}]
},

options:{
responsive:true,
animation:{duration:1200}
}

})

}

cargarReportes()