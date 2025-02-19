const GOOGLE_SHEETS_URL = "TU_URL_DEL_SCRIPT"; // Pega aquí la URL de Apps Script

// Función para enviar los datos al Google Sheets
async function registrarRecarga(dispenserId) {
    const datos = {
        dispenser: dispenserId,
        usuario: "Operario1" // Puedes personalizar esto si tienes autenticación
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
            cargarRegistros(); // Actualizar la tabla después del escaneo
        } else {
            document.getElementById("status").innerText = "Error: " + resultado.error;
        }
    } catch (error) {
        document.getElementById("status").innerText = "Error de conexión";
    }
}

// Inicializar el escáner QR
const scanner = new Html5Qrcode("reader");
scanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    qrCodeMessage => {
        registrarRecarga(qrCodeMessage);
    }
);

// Función para cargar registros desde Google Sheets y mostrarlos en la tabla
async function cargarRegistros() {
    try {
        const response = await fetch(GOOGLE_SHEETS_URL);
        const data = await response.json();
        const tabla = document.getElementById("tabla-recargas");
        tabla.innerHTML = "";

        data.forEach(registro => {
            const fila = `<tr>
                <td>${registro.dispenser}</td>
                <td>${registro.usuario}</td>
                <td>${new Date(registro.fecha).toLocaleString()}</td>
            </tr>`;
            tabla.innerHTML += fila;
        });
    } catch (error) {
        console.error("Error al cargar registros:", error);
    }
}

// Cargar registros al abrir la página
window.onload = cargarRegistros;
