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
async function registrarRecarga(dispenserId, usuario) {
    const datos = {
        dispenser: dispenserId,
        usuario: usuario
    };

    try {
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const resultado = await response.json();
        if (resultado.status === "ok") {
            document.getElementById("status").innerText = "Registro guardado!";
        } else {
            document.getElementById("status").innerText = "Error: " + resultado.error;
        }
    } catch (error) {
        document.getElementById("status").innerText = "Error de conexión";
        console.error("Error en la solicitud:", error);
    }
}
