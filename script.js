// 📌 Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, doc, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// 🔥 Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCJzNFFjA__D7GDCHkxj_H6_HTtIvUBHzY",
    authDomain: "registrodis.firebaseapp.com",
    projectId: "registrodis",
    storageBucket: "registrodis.firebasestorage.app",
    messagingSenderId: "274283773647",
    appId: "1:274283773647:web:4adef02eabc01fde5901ba"
};

// 🔥 Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 📌 Función para registrar recarga en Firestore en una subcolección de cada dispenser
async function registrarRecarga(dispenserId, usuario) {
    try {
        console.log("📤 Intentando registrar en Firebase en el dispenser:", dispenserId, "Usuario:", usuario);

        // 🔥 Obtener fecha y hora actual en formato deseado
        const fechaActual = new Date();
        const fechaFormateada = `${fechaActual.getDate().toString().padStart(2, '0')}/${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}/${fechaActual.getFullYear()}`;
        
        // 🔥 Formato de hora con AM/PM
        let horas = fechaActual.getHours();
        const minutos = fechaActual.getMinutes().toString().padStart(2, '0');
        const segundos = fechaActual.getSeconds().toString().padStart(2, '0');
        const ampm = horas >= 12 ? 'PM' : 'AM';
        horas = horas % 12 || 12; // Convierte 0 en 12 para formato AM/PM
        const horaFormateada = `${horas}:${minutos}:${segundos} ${ampm}`;

        // 🔥 Crear referencia al documento del dispenser (aunque no exista aún, Firestore lo crea)
        const dispenserRef = doc(db, "recargas", dispenserId);
        
        // 🔥 Crear referencia a la subcolección "registros" dentro del dispenser
        const registrosRef = collection(dispenserRef, "registros");

        // 🔥 Agregar un nuevo documento con ID aleatorio en la subcolección "registros"
        await addDoc(registrosRef, {  
            usuario: usuario,
            fecha: fechaFormateada,  // 🔥 Guardamos la fecha en formato dd/mm/aaaa
            hora: horaFormateada     // 🔥 Guardamos la hora en formato hh:mm:ss AM/PM
        });

        document.getElementById("status").innerText = `✅ Registro guardado en ${dispenserId} (${fechaFormateada} - ${horaFormateada})!`;
        console.log("✅ Registro exitoso en:", dispenserId, "Fecha:", fechaFormateada, "Hora:", horaFormateada);
    } catch (error) {
        document.getElementById("status").innerText = "❌ Error al guardar. Ver consola.";
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

    // 📌 Mostrar el escáner
    document.getElementById("reader").style.display = "block";

    const scanner = new Html5Qrcode("reader");

    scanner.start(
        { facingMode: "environment" }, // Usa la cámara trasera
        {
            fps: 10,
            qrbox: { width: 250, height: 250 } // Define el tamaño del área de escaneo
        },
        qrCodeMessage => {
            console.log("🎯 QR Detectado:", qrCodeMessage);
            scanner.stop();
            document.getElementById("reader").style.display = "none";
            registrarRecarga(qrCodeMessage, nombreUsuario);
        },
        errorMessage => {
            console.warn("⚠️ No se detectó QR:", errorMessage);
        }
    ).catch(err => {
        console.error("⚠️ Error al iniciar el escáner:", err);
        alert("No se pudo iniciar el escáner. Verifica los permisos de la cámara.");
    });
}

// 📌 Asignar la función de escaneo al botón
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btnEscanear").addEventListener("click", iniciarEscaneo);
});
