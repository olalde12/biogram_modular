function mostrarNotificacion(mensaje, tipo = "exito", titulo = "") {
    let contenedor = document.getElementById("notificacionesGenerales");
    // Crear el contenedor si todavía no existe
    if (!contenedor) {
        contenedor = document.createElement("div");
        contenedor.id = "notificacionesGenerales";
        document.body.appendChild(contenedor);
    }

    const notificacion = document.createElement("div");
    notificacion.className = `foro-notificacion ${tipo}`;

    const icono = document.createElement("div");
    icono.className = "foro-notificacion-icono";

    const elementoIcono = document.createElement("i");

    if (tipo === "error") {
        elementoIcono.className = "fa-solid fa-circle-exclamation";
    } else if (tipo === "info") {
        elementoIcono.className = "fa-solid fa-circle-info";
    } else {
        elementoIcono.className = "fa-solid fa-check";
    }

    icono.appendChild(elementoIcono);

    const contenido = document.createElement("div");
    contenido.className = "foro-notificacion-contenido";

    const encabezado = document.createElement("strong");
    encabezado.textContent = titulo || (
        tipo === "error"
            ? "Revisa los datos"
            : tipo === "info"
                ? "Información"
                : "¡Listo!"
    );

    const texto = document.createElement("p");
    texto.textContent = mensaje;

    contenido.append(encabezado, texto);

    const botonCerrar = document.createElement("button");
    botonCerrar.type = "button";
    botonCerrar.className = "foro-notificacion-cerrar";
    botonCerrar.setAttribute("aria-label", "Cerrar notificación");
    botonCerrar.innerHTML = '<i class="fa-solid fa-xmark"></i>';

    botonCerrar.addEventListener("click", () => {
        notificacion.remove();
    });

    notificacion.append(icono, contenido, botonCerrar);
    contenedor.appendChild(notificacion);

    setTimeout(() => {
        if (!notificacion.isConnected) return;

        notificacion.style.animation =
            "desaparecerNotificacion 0.25s ease forwards";

        setTimeout(() => {
            notificacion.remove();
        }, 250);

    }, 4000);
}

// Formulario registro o login
const signIn = document.getElementById("sign-in");
const signUp = document.getElementById("sign-up");
const form = document.getElementById("form");
const banner = document.getElementById("banner");

if (signIn && form && banner) {
    signIn.addEventListener("click", () => {
        form.classList.remove("toggle");
        banner.classList.remove("toggle");
    });
}

if (signUp && form && banner) {
    signUp.addEventListener("click", () => {
        form.classList.add("toggle");
        banner.classList.add("toggle");
    });
}

// Menu hamburguesa
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });
}

// Acceso al historial
const btnHistorial = document.getElementById("btnHistorial");
if (btnHistorial) {
    btnHistorial.addEventListener("click", () => {
        const autenticado = btnHistorial.dataset.autenticado === "true";
        if (!autenticado) {
            mostrarNotificacion(
                "Para consultar tu historial necesitas iniciar sesión o crear una cuenta en BIOGRAM.",
                "info",
                "¡Inicia sesión!"
            );
            return;
        }
        window.location.href = "/historial";
    });
}
