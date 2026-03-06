document.addEventListener("DOMContentLoaded", () => {
    const msg = document.getElementById("msg-carga");
    
    const estados = [
        "Sincronizando inventario...",
        "Validando farmacéutico...",
        "Preparando sucursal...",
        "¡Bienvenido!"
    ];

    let i = 0;
    const timer = setInterval(() => {
        if (i < estados.length) {
            msg.innerText = estados[i];
            i++;
        }
    }, 900);

    // Guardar estado para evitar saltos
    sessionStorage.setItem("visita_valida", "true");

    // Redirección
    setTimeout(() => {
    window.location.href = "principal.html";
}, 4000);
});