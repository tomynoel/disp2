const GOOGLE_SHEETS_URL = "https://cors-anywhere.herokuapp.com/https://script.google.com/macros/s/AKfycbwfstXha7KIW7O0Xn0fjqHzZ_LF79z51ar9KM-9UVo9H8Fle91Flf1ZuNyA2j1g1y-MUA/exec"; // Pega aquí la URL de Apps Script

let scanner;  // Variable para el escáner QR

// Función para iniciar el escaneo
function iniciarEscaneo() {
    let nombreUsuario = document.getElementById("nombre").value.trim();

    if (!nombreUsuario) {
        alert("Por favor, ingresa tu nombre antes de escanear el QR.");
        return;
    }

    document.getElementById("reader").style.display = "block"; // Mostrar escáner

    scanner = new Html5Qrcode("reader");
    scanner.start(
        { facingMode: "environment" }, // Usa la cámara trasera
        { fps: 10, qrbox: 250 },
        qrCodeMessage => {
            scanner.stop();  // Detiene el escáner después de leer un QR
            document.getElementById("reader").style.display = "none"; // Oculta el escáner

            registrarRecarga(qrCodeMessage, nombreUsuario);
        }
    ).catch(err => {
        console.error("Error al iniciar el escáner:", err);
    });
}

// Función para registrar la recarga
// 🔥 Configuración de Firebase
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROYECTO.firebaseapp.com",
    projectId: "TU_PROYECTO",
    storageBucket: "TU_PROYECTO.appspot.com",
    messagingSenderId: "TU_MENSAJERIA_ID",
    appId: "TU_APP_ID"
};

// 🔥 Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 📌 Función para registrar recarga en Firestore
async function registrarRecarga(dispenserId, usuario) {
    try {
        await db.collection("recargas").add({
            dispenser: dispenserId,
            usuario: usuario,
            fecha: new Date().toLocaleString()
        });
        document.getElementById("status").innerText = "Registro guardado en Firebase!";
    } catch (error) {
        document.getElementById("status").innerText = "Error al guardar.";
        console.error("Error en la solicitud:", error);
    }
}
