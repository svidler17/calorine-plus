import { auth } from "js/firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const btn = document.getElementById("logoutBtn");

btn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
});