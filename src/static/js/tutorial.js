
document.addEventListener("DOMContentLoaded", () => {

    const overlay = document.getElementById("tutorialOverlay");
    const tarjeta = document.getElementById("tutorialTarjeta");

    if (!overlay || !tarjeta) return;

    const titulo = document.getElementById("tutorialTitulo");
    const descripcion = document.getElementById("tutorialDescripcion");
    const pasoTexto = document.getElementById("tutorialPaso");
    const barra = document.getElementById("tutorialBarra");

    const anterior = document.getElementById("tutorialAnterior");
    const siguiente = document.getElementById("tutorialSiguiente");
    const omitir = document.getElementById("tutorialOmitir");

    const flecha = tarjeta.querySelector(".tutorial-flecha");

    const pasos = [
        {
            elemento: "#btnIdentificar",
            titulo: "Identificar bacterias",
            descripcion: "En esta sección puedes comenzar un proceso de identificación bacteriana utilizando los resultados de las pruebas bioquímicas."
        },
        {
            elemento: "#btnBuscar",
            titulo: "Buscar bacterias",
            descripcion: "Consulta información sobre diferentes bacterias, sus características y datos relevantes."
        },
        {
            elemento: "#btnTutoriales",
            titulo: "Tutoriales y material de apoyo",
            descripcion: "Aquí encontrarás recursos educativos, guías y materiales que te ayudarán a comprender los procedimientos."
        },
        {
            elemento: "#btnEscanear",
            titulo: "Escanear pruebas",
            descripcion: "Desde aquí podrás acceder al escaneo de pruebas mediante el dispositivo compatible con BIOGRAM."
        }
    ];

    let actual = 0;
    let elementoActual = null;

    function posicionar() {

        const rect = elementoActual.getBoundingClientRect();

        if (window.innerWidth <= 600) {
            tarjeta.style.top = "auto";
            tarjeta.style.left = "16px";
            flecha.style.display = "none";
            return;
        }

        flecha.style.display = "block";

        const ancho = tarjeta.offsetWidth;
        const alto = tarjeta.offsetHeight;

        let izquierda = rect.left + rect.width / 2 - ancho / 2;

        izquierda = Math.max(
            16,
            Math.min(izquierda, window.innerWidth - ancho - 16)
        );

        tarjeta.style.left = `${izquierda}px`;

        const espacioAbajo = window.innerHeight - rect.bottom;

        if (espacioAbajo >= alto + 25) {
            tarjeta.style.top = `${rect.bottom + 18}px`;
            flecha.className = "tutorial-flecha arriba";
        } else {
            tarjeta.style.top = `${Math.max(16, rect.top - alto - 18)}px`;
            flecha.className = "tutorial-flecha abajo";
        }
    }

    function mostrarPaso(indice) {

        if (elementoActual) {
            elementoActual.classList.remove("tour-resaltado");
        }

        actual = indice;

        const paso = pasos[actual];

        elementoActual = document.querySelector(paso.elemento);

        if (!elementoActual) return;

        elementoActual.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        titulo.textContent = paso.titulo;
        descripcion.textContent = paso.descripcion;

        pasoTexto.textContent =
            `PASO ${actual + 1} DE ${pasos.length}`;

        barra.style.width =
            `${((actual + 1) / pasos.length) * 100}%`;

        anterior.style.visibility =
            actual === 0 ? "hidden" : "visible";

        siguiente.textContent =
            actual === pasos.length - 1
                ? "Finalizar"
                : "Siguiente →";

        setTimeout(() => {
            elementoActual.classList.add("tour-resaltado");
            posicionar();
        }, 350);
    }

    function cerrar() {
        if (elementoActual) {
            elementoActual.classList.remove("tour-resaltado");
        }

        overlay.remove();
        tarjeta.remove();
    }

    siguiente.addEventListener("click", () => {
        if (actual < pasos.length - 1) {
            mostrarPaso(actual + 1);
        } else {
            cerrar();
        }
    });

    anterior.addEventListener("click", () => {
        if (actual > 0) {
            mostrarPaso(actual - 1);
        }
    });

    omitir.addEventListener("click", cerrar);

    window.addEventListener("resize", () => {
        if (elementoActual && tarjeta.isConnected) posicionar();
    });

    window.addEventListener("scroll", () => {
        if (elementoActual && tarjeta.isConnected) posicionar();
    });

    mostrarPaso(0);

});
