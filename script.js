// 🔥 Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// 🔥 Configuración de Firebase (REEMPLAZA CON TUS DATOS)
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROYECTO.firebaseapp.com",
    projectId: "TU_PROYECTO",
    storageBucket: "TU_PROYECTO.appspot.com",
    messagingSenderId: "TU_MENSAJERIA_ID",
    appId: "TU_APP_ID"
};

// 🔥 Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 📌 Función para registrar recarga en Firestore
async function registrarRecarga(dispenserId, usuario) {
    try {
        await addDoc(collection(db, "recargas"), {
            dispenser: dispenserId,
            usuario: usuario,
            fecha: serverTimestamp() // 🔥 Firestore generará la fecha automáticamente
        });
        document.getElementById("status").innerText = "Registro guardado en Firebase!";
    } catch (error) {
        document.getElementById("status").innerText = "Error al guardar.";
        console.error("🔥 Error en la solicitud:", error);
    }
}

// 📌 Función para iniciar el escaneo de QR
function iniciarEscaneo() {
    let nombreUsuario = document.getElementById("nombre").value.trim();

    if (!nombreUsuario) {
        alert("Por favor, ingresa tu nombre antes de escanear el QR.");
        return;
    }

    document.getElementById("reader").style.display = "block";

    let scanner = new Html5Qrcode("reader");
    scanner.start(
        { facingMode: "environment" }, // Cámara trasera
        { fps: 10, qrbox: 250 },
        qrCodeMessage => {
            scanner.stop();
            document.getElementById("reader").style.display = "none";
            registrarRecarga(qrCodeMessage, nombreUsuario);
        }
    ).catch(err => {
        console.error("Error al iniciar el escáner:", err);
    });
}
