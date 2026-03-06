import { auth } from "js/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "js/firebase-config.js";

const menuBtn = document.getElementById("menuBtn");

onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return;

    const datos = docSnap.data();

    menuBtn.addEventListener("click", () => {

        if (datos.rol === "admin") {
            window.location.href = "admin-dashboard.html";
        } else {
            window.location.href = "operador-dashboard.html";
        }

    });

});
