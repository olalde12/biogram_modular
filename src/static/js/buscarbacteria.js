// ANIMACION DE CARGA
window.onload = function () {
    setTimeout(() => {
        document.getElementById("pantallaCargaBacteria").style.opacity = "0";
        setTimeout(() => {
            document.getElementById("pantallaCargaBacteria").style.display = "none";
            document.getElementById("contenidoBacterias").style.display = "block";
        }, 800);
    }, 2000);
}

// ===============================
// SIDEBAR
// ===============================
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });
}


// ===============================
// CARGAR BASE DE DATOS DE BACTERIAS
// ===============================

let bacterias = {};

fetch("/static/data/bacterias.json")
    .then(response => {

        if (!response.ok) {
            throw new Error("No se pudo cargar la base de datos de bacterias.");
        }

        return response.json();

    })
    .then(data => {

        bacterias = data;

        console.log("Base de bacterias cargada:", bacterias);

    })
    .catch(error => {

        console.error("Error al cargar bacterias:", error);

    });

// ===============================
// ELEMENTOS
// ===============================

const buscador = document.getElementById("buscadorBacteria");
const resultados = document.getElementById("resultadosBacterias");

// ===============================
// BUSCADOR
// ===============================

buscador.addEventListener("input", () => {

    const texto = buscador.value
        .trim()
        .toLowerCase();

    resultados.innerHTML = "";

    // Si no escribió nada
    if (texto === "") {
        return;
    }

    // Buscar entre las bacterias
    Object.entries(bacterias).forEach(([id, bacteria]) => {

        const nombre = bacteria.nombre.toLowerCase();

        if (nombre.includes(texto)) {

            const resultado = document.createElement("button");

            resultado.className = "resultado-bacteria";

            resultado.textContent = bacteria.nombre;

            resultado.addEventListener("click", () => {

                mostrarBacteria(id);

            });

            resultados.appendChild(resultado);
        }

    });

});

// ===============================
// MOSTRAR FICHA DE BACTERIA
// ===============================

function mostrarBacteria(id) {

    const bacteria = bacterias[id];

    if (!bacteria) {
        console.error("No se encontró la bacteria:", id);
        return;
    }

    // ===============================
    // ELEMENTOS DE LA FICHA
    // ===============================

    const ficha = document.getElementById("fichaBacteria");

    const nombre =
        document.getElementById("fichaNombreBacteria");

    const descripcion =
        document.getElementById("fichaBacteriaDescripcion");

    const caracteristicas =
        document.getElementById("caracteristicasBacteria");

    const pruebas =
        document.getElementById("pruebasBacteria");

    const observaciones =
        document.getElementById("observacionesBacteria");


    // ===============================
    // INFORMACIÓN PRINCIPAL
    // ===============================

    nombre.textContent = bacteria.nombre;

    descripcion.textContent =
        bacteria.descripcion || "Información próximamente disponible.";


    // ===============================
    // CARACTERÍSTICAS
    // ===============================

    caracteristicas.innerHTML = "";

    if (bacteria.caracteristicas) {

        Object.entries(bacteria.caracteristicas).forEach(
            ([nombreCaracteristica, valor]) => {

                const dato = document.createElement("div");

                dato.className = "dato-bacteria";

                dato.innerHTML = `
                    <strong>${formatearNombre(nombreCaracteristica)}</strong>
                    <span class="dato-valor">${valor}</span>
                `;

                caracteristicas.appendChild(dato);

            }
        );

    }


    // ===============================
    // PRUEBAS BIOQUÍMICAS
    // ===============================

    pruebas.innerHTML = "";

    if (bacteria.pruebas) {

        Object.entries(bacteria.pruebas).forEach(
            ([nombrePrueba, resultado]) => {

                const dato = document.createElement("div");

                dato.className = "dato-bacteria";

                dato.innerHTML = `
                    <strong>${formatearNombre(nombrePrueba)}</strong>
                    <span class="dato-valor">${resultado}</span>
                `;

                pruebas.appendChild(dato);

            }
        );

    }


    // ===============================
    // OBSERVACIONES
    // ===============================

    observaciones.innerHTML = "";

    if (bacteria.observaciones) {

        bacteria.observaciones.forEach(observacion => {

            const elemento = document.createElement("li");

            elemento.textContent = observacion;

            observaciones.appendChild(elemento);

        });

    }


    // ===============================
    // MOSTRAR FICHA
    // ===============================

    resultados.innerHTML = "";

    ficha.classList.add("visible");

}

// ===============================
// FORMATEAR NOMBRES
// ===============================

function formatearNombre(texto) {

    return texto
        .replace(/_/g, " ")
        .replace(/\b\w/g, letra => letra.toUpperCase());

}

// ===============================
// CERRAR FICHA
// ===============================

const cerrarFichaBacteria =
    document.getElementById("cerrarFichaBacteria");

cerrarFichaBacteria.addEventListener("click", () => {

    const ficha =
        document.getElementById("fichaBacteria");

    ficha.classList.remove("visible");

});