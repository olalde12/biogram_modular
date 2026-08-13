// ===============================
// ANIMACION DE CARGA
// ===============================
window.onload = function () {
    setTimeout(() => {
        document.getElementById("pantallaCargaDiccionario").style.opacity = "0";
        setTimeout(() => {
            document.getElementById("pantallaCargaDiccionario").style.display = "none";
            document.getElementById("contenidoDiccionario").style.display = "block";
        }, 800);
    }, 2000);
}

// ===============================
// CARGAR DICCIONARIO
// ===============================

let diccionario = {};

fetch("/static/data/diccionario.json")
    .then(response => {

        if (!response.ok) {
            throw new Error("No se pudo cargar el diccionario.");
        }

        return response.json();

    })
    .then(data => {

        diccionario = data;

        console.log("Diccionario cargado:", diccionario);

    })
    .catch(error => {

        console.error("Error al cargar el diccionario:", error);

    });


// ===============================
// ELEMENTOS
// ===============================

const buscador = document.getElementById("buscadorDiccionario");
const resultados = document.getElementById("resultadosDiccionario");

const ficha = document.getElementById("fichaDiccionario");
const fichaTitulo = document.getElementById("fichaTitulo");
const fichaDefinicion = document.getElementById("fichaDefinicion");
const fichaInterpretacion = document.getElementById("fichaInterpretacion");

const cerrarFicha = document.getElementById("cerrarFicha");


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
        resultados.innerHTML = "";
        ficha.classList.remove("visible");
        return;
    }

    // Buscar coincidencias
    // Buscar coincidencias
    let coincidencias = 0;

    Object.entries(diccionario).forEach(([id, concepto]) => {

        const titulo = concepto.titulo.toLowerCase();

        if (titulo.includes(texto)) {

            coincidencias++;

            const resultado = document.createElement("button");

            resultado.className = "resultado-busqueda";

            resultado.textContent = concepto.titulo;

            resultado.addEventListener("click", () => {
                // Resaltar temporalmente el concepto seleccionado
                resultado.classList.add("seleccionado");

                // Mostrar la ficha
                mostrarFicha(id);

                // Esperar un momento antes de ocultar los resultados
                setTimeout(() => {
                    resultados.innerHTML = "";
                }, 250);
            });

            resultados.appendChild(resultado);
        }

    });

    // Si no se encontró ningún resultado
    if (coincidencias === 0) {

        const mensaje = document.createElement("div");

        mensaje.className = "sin-resultados";

        mensaje.innerHTML = `
        <i class="fa-solid fa-circle-question"></i>
        <p>No encontramos ningún concepto relacionado con:</p>
        <strong>"${texto}"</strong>
        <span>Intenta buscar con otro término.</span>
    `;

        resultados.appendChild(mensaje);
    }

});

buscador.addEventListener("keydown", (evento) => {

    if (evento.key !== "Enter") {
        return;
    }

    const texto = buscador.value
        .trim()
        .toLowerCase();

    if (texto === "") {
        return;
    }

    const coincidencias = Object.entries(diccionario).filter(
        ([id, concepto]) => {

            const titulo = concepto.titulo.toLowerCase();

            const terminosBusqueda = [
                titulo,
                ...(concepto.busqueda || [])
            ].map(termino => termino.toLowerCase());

            return terminosBusqueda.some(termino =>
                termino.includes(texto)
            );
        }
    );

    // Si solamente existe una coincidencia
    if (coincidencias.length === 1) {

        const [id] = coincidencias[0];

        // Obtener el único resultado mostrado
        const resultadoSeleccionado =
            resultados.querySelector(".resultado-busqueda");

        if (resultadoSeleccionado) {

            // Resaltar la selección
            resultadoSeleccionado.classList.add("seleccionado");

            // Mostrar ficha
            mostrarFicha(id);

            // Ocultar resultados después de un momento
            setTimeout(() => {
                resultados.innerHTML = "";
            }, 250);

        } else {

            // Seguridad: abrir directamente si no existe el botón visual
            mostrarFicha(id);
            resultados.innerHTML = "";
        }
    }

});

// ===============================
// MOSTRAR FICHA
// ===============================

function mostrarFicha(id) {

    const concepto = diccionario[id];

    if (!concepto) {
        return;
    }

    fichaTitulo.textContent = concepto.titulo;

    fichaDefinicion.textContent =
        concepto.definicion || "Información próximamente disponible.";

    fichaInterpretacion.textContent =
        concepto.interpretacion || "Información próximamente disponible.";

    ficha.classList.add("visible");

}


// ===============================
// CERRAR FICHA
// ===============================

cerrarFicha.addEventListener("click", () => {

    ficha.classList.remove("visible");

});