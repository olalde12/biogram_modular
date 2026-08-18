// ===============================
// ANIMACION DE CARGA
// ===============================
window.onload = function () {
    setTimeout(() => {
        document.getElementById("pantallaCargaIdentificacion").style.opacity = "0";
        setTimeout(() => {
            document.getElementById("pantallaCargaIdentificacion").style.display = "none";
            document.getElementById("contenidoIdentificacion").style.display = "block";
        }, 800);
    }, 2000);
}

// ===============================
// NAVEGACIÓN
// ===============================
document.querySelectorAll(".btn-principal").forEach(boton => {
    boton.addEventListener("click", () => {
        if (boton.dataset.url) {
            window.location.href = boton.dataset.url;
        }
    });
});

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
// PRUEBAS DEL MOTOR DE IDENTIFICACIÓN
// ===============================

const pruebas = [

    {
        id: "gram",
        nombrePaso: "Gram",
        titulo: "Tinción de Gram",
        pregunta: "Selecciona el resultado obtenido.",
        conceptoDiccionario: "gram",

        opciones: [
            {
                texto: "Gram positivo",
                valor: "positivo"
            },
            {
                texto: "Gram negativo",
                valor: "negativo"
            }
        ]
    },

    {
        id: "forma",
        nombrePaso: "Morfología",
        titulo: "Forma bacteriana",
        pregunta: "¿Qué morfología presenta la bacteria?",
        conceptoDiccionario: "forma",

        opciones: [
            {
                texto: "Cocos",
                valor: "cocos"
            },
            {
                texto: "Bacilos",
                valor: "bacilos"
            }
        ]
    },

    {
        id: "glu",
        nombrePaso: "Glucosa",
        titulo: "Fermentación de glucosa",
        pregunta: "¿Cuál fue el resultado de la prueba de glucosa?",
        conceptoDiccionario: "glucosa",

        opciones: [
            {
                texto: "Positiva",
                valor: "+"
            },
            {
                texto: "Negativa",
                valor: "-"
            }
        ]
    },

    {
        id: "lac",
        nombrePaso: "Lactosa",
        titulo: "Fermentación de lactosa",
        pregunta: "¿Cuál fue el resultado de la prueba de lactosa?",
        conceptoDiccionario: "lactosa",

        opciones: [
            {
                texto: "Positiva",
                valor: "+"
            },
            {
                texto: "Negativa",
                valor: "-"
            }
        ]
    },

    {
        id: "sac",
        nombrePaso: "Sacarosa",
        titulo: "Fermentación de sacarosa",
        pregunta: "¿Cuál fue el resultado de la prueba de sacarosa?",
        conceptoDiccionario: "sacarosa",

        opciones: [
            {
                texto: "Positiva",
                valor: "+"
            },
            {
                texto: "Negativa",
                valor: "-"
            }
        ]
    },

    {
        id: "ure",
        nombrePaso: "Ureasa",
        titulo: "Prueba de ureasa",
        pregunta: "¿Cuál fue el resultado de la prueba de ureasa?",
        conceptoDiccionario: "ureasa",

        opciones: [
            {
                texto: "Positiva",
                valor: "+"
            },
            {
                texto: "Negativa",
                valor: "-"
            }
        ]
    },

    {
        id: "cit",
        nombrePaso: "Citrato",
        titulo: "Utilización de citrato",
        pregunta: "¿Cuál fue el resultado de la prueba de citrato?",
        conceptoDiccionario: "citrato",

        opciones: [
            {
                texto: "Positiva",
                valor: "+"
            },
            {
                texto: "Negativa",
                valor: "-"
            }
        ]
    },

    {
        id: "mov",
        nombrePaso: "Movilidad",
        titulo: "Prueba de movilidad",
        pregunta: "¿La bacteria presentó movilidad?",
        conceptoDiccionario: "movilidad",

        opciones: [
            {
                texto: "Positiva",
                valor: "+"
            },
            {
                texto: "Negativa",
                valor: "-"
            }
        ]
    },

    {
        id: "ind",
        nombrePaso: "Indol",
        titulo: "Producción de indol",
        pregunta: "¿Cuál fue el resultado de la prueba de indol?",
        conceptoDiccionario: "indol",

        opciones: [
            {
                texto: "Positiva",
                valor: "+"
            },
            {
                texto: "Negativa",
                valor: "-"
            }
        ]
    },

    {
        id: "oxidasa",
        nombrePaso: "Oxidasa",
        titulo: "Prueba de oxidasa",
        pregunta: "¿Cuál fue el resultado de la prueba de oxidasa?",
        conceptoDiccionario: "oxidasa",

        opciones: [
            {
                texto: "Positiva",
                valor: "+"
            },
            {
                texto: "Negativa",
                valor: "-"
            }
        ]
    }

];

// ===============================
// BASE DE DATOS DE MICROORGANISMOS
// ===============================

const bacterias = [

    {
        id: "e_coli",
        nombre: "Escherichia coli",

        gram: "negativo",
        forma: "bacilos",

        pruebas: {
            glu: "+",
            sac: "+",
            lac: "+",
            ure: "-",
            cit: "-",
            mov: "+",
            ind: "+",
            oxidasa: "-",
            h2s: "-",
            gas: "+",
            mr: "+",
            vp: "-",
            orn: "+",
            nit: "+",
            gel: "-"
        }
    },

    {
        id: "k_pneumoniae",
        nombre: "Klebsiella pneumoniae",

        gram: "negativo",
        forma: "bacilos",

        pruebas: {
            glu: "+",
            sac: "+",
            lac: "+",
            ure: "+",
            cit: "+",
            mov: "-",
            ind: "-",
            oxidasa: "-",
            h2s: "-",
            gas: "+",
            mr: "-",
            vp: "+",
            orn: "-",
            nit: "+",
            gel: "-"
        }
    },

    {
        id: "e_aerogenes",
        nombre: "Enterobacter aerogenes",
        gram: "negativo",

        pruebas: {
            glu: "+",
            sac: "+",
            lac: "+",
            ure: "-",
            cit: "+",
            mov: "+",
            ind: "-",
            oxidasa: "-",
            h2s: "-",
            gas: "+",
            mr: "-",
            vp: "+",
            orn: "+",
            nit: "+",
            gel: "-"
        }
    },

    {
        id: "p_mirabilis",
        nombre: "Proteus mirabilis",
        gram: "negativo",

        pruebas: {
            glu: "+",
            sac: "-",
            lac: "-",
            ure: "+",
            cit: "+",
            mov: "+",
            ind: "-",
            oxidasa: "-",
            h2s: "+",
            gas: "+",
            mr: "+",
            vp: "-",
            orn: "+",
            nit: "+",
            gel: "+"
        }
    }

];


let pasoActual = 0;
let respuestaSeleccionada = null; //aquí se irá guardando la respuesta elegida
let respuestas = []; // de primeras es una lista vacia pero conforme el 
// usuario elige opciones, aquí se guardarán todas las respuestas

const btnContinuar = document.querySelector(".continue"); //obtiene el botón Continuar
const btnAtras = document.getElementById("btnAtras"); //obtiene el botón Atrás

const btnDiccionario = document.querySelector(".dictionary-btn"); //obtiene el botón Diccionario

const diccionarioModal = document.getElementById("diccionarioModal"); //obtiene el modal del diccionario
const cerrarDiccionario = document.getElementById("cerrarDiccionario"); //obtiene el botón de cerrar del modal del diccionario

const diccionarioTitulo = document.getElementById("diccionarioTitulo");
const diccionarioDefinicion = document.getElementById("diccionarioDefinicion");
const diccionarioInterpretacion = document.getElementById("diccionarioInterpretacion");

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

        console.log("Diccionario cargado para identificación:", diccionario);

    })
    .catch(error => {

        console.error("Error al cargar el diccionario:", error);

    });

// ===============================
// FUNCION PRINCIPAL
// ===============================

function actualizarPantalla() {
    mostrarPrueba();
    actualizarProgreso();
    actualizarBotones();
    reiniciarSeleccion();
}

// ===============================
// FUNCIONES SECUNDARIAS
// ===============================

function mostrarPrueba() {

    // Obtener la prueba actual
    const prueba = pruebas[pasoActual];

    // Cambiar el título
    document.getElementById("tituloPrueba").textContent = prueba.titulo;

    // Cambiar la pregunta
    document.getElementById("preguntaPrueba").textContent = prueba.pregunta;

    // Obtener el contenedor de opciones
    const contenedor = document.getElementById("contenedorOpciones");

    // Limpiar las opciones anteriores
    contenedor.innerHTML = "";

    // Buscar si esta prueba ya había sido respondida
    const respuestaAnterior = respuestas.find(
        respuesta => respuesta.prueba === prueba.id
    );

    // Crear las opciones de la prueba actual
    prueba.opciones.forEach(opcion => {

        const boton = document.createElement("button");

        boton.className = "option";

        boton.textContent = opcion.texto;

        boton.dataset.value = opcion.valor;

        // Si ya había una respuesta guardada,
        // volver a marcarla
        if (
            respuestaAnterior &&
            respuestaAnterior.respuesta === opcion.valor
        ) {
            boton.classList.add("selected");
        }

        // Evento de selección
        boton.addEventListener("click", () => {

            // Quitar selección anterior
            document.querySelectorAll(".option").forEach(btn => {
                btn.classList.remove("selected");
            });

            // Marcar opción seleccionada
            boton.classList.add("selected");

            // Guardar respuesta temporal
            respuestaSeleccionada = opcion.valor;

            // Activar Continuar
            btnContinuar.disabled = false;
        });

        // Agregar botón al contenedor
        contenedor.appendChild(boton);
    });

    // Si ya había una respuesta guardada,
    // mantenerla como respuesta seleccionada
    if (respuestaAnterior) {
        respuestaSeleccionada = respuestaAnterior.respuesta;
        btnContinuar.disabled = false;
    } else {
        respuestaSeleccionada = null;
        btnContinuar.disabled = true;
    }
}

function actualizarProgreso() {
    document.getElementById("pasoActual").textContent = pasoActual + 1;
    document.getElementById("totalPasos").textContent = pruebas.length;
    const porcentaje = ((pasoActual + 1) / pruebas.length) * 100;
    document.getElementById("progressFill").style.width = porcentaje + "%";
}

function actualizarBotones() {
    if (pasoActual === 0) {
        btnAtras.disabled = true;
    } else {
        btnAtras.disabled = false;
    }
}

function reiniciarSeleccion() {
    const respuestaAnterior = respuestas.find(
        respuesta => respuesta.prueba === pruebas[pasoActual].id
    );
    if (respuestaAnterior) {
        respuestaSeleccionada = respuestaAnterior.respuesta;
        btnContinuar.disabled = false;
    } else {
        respuestaSeleccionada = null;
        btnContinuar.disabled = true;
    }
}

function obtenerSiguientePrueba() {
    // Obtener la prueba actual
    const pruebaActual = pruebas[pasoActual];

    // Buscar la opción seleccionada
    const opcionElegida = pruebaActual.opciones.find(
        opcion => opcion.valor === respuestaSeleccionada
    );

    // Si posteriormente queremos crear
    // un camino específico, podemos usar "siguiente"
    if (opcionElegida && opcionElegida.siguiente) {
        return opcionElegida.siguiente;
    }

    // Si no hay un camino especial, continuar con la siguiente prueba
    if (pasoActual < pruebas.length - 1) {
        return pruebas[pasoActual + 1].id;
    }

    // Si estamos en la última prueba, terminar la identificación
    return null;
}

// ===============================
// MOTOR DE IDENTIFICACIÓN
// ===============================

function calcularCoincidencias() {

    const resultados = [];

    // Recorrer todas las bacterias disponibles
    bacterias.forEach(bacteria => {

        let coincidencias = 0;
        let pruebasComparadas = 0;
        const detalle = [];

        // Comparar cada respuesta del alumno
        respuestas.forEach(respuesta => {

            const idPrueba = respuesta.prueba;
            const valorAlumno = respuesta.respuesta;

            let valorBacteria = null;

            // CARACTERÍSTICAS GENERALES

            if (idPrueba === "gram") {
                valorBacteria = bacteria.gram;
            }
            else if (idPrueba === "forma") {
                valorBacteria = bacteria.forma;
            }

            // PRUEBAS BIOQUÍMICAS

            else if (bacteria.pruebas[idPrueba] !== undefined) {
                valorBacteria = bacteria.pruebas[idPrueba];
            }

            // COMPARACIÓN

            if (valorBacteria !== null) {

                pruebasComparadas++;

                const coincide = valorAlumno === valorBacteria;

                if (coincide) {
                    coincidencias++;
                }
                detalle.push({
                    prueba: idPrueba,
                    resultadoAlumno: valorAlumno,
                    resultadoEsperado: valorBacteria,
                    coincide: coincide
                });
            }

        });

        // PORCENTAJE

        let porcentaje = 0;

        if (pruebasComparadas > 0) {
            porcentaje = (coincidencias / pruebasComparadas) * 100;
        }

        resultados.push({
            id: bacteria.id,
            nombre: bacteria.nombre,
            coincidencias: coincidencias,
            pruebasComparadas: pruebasComparadas,
            porcentaje: porcentaje,
            detalle: detalle
        });

    });

    // Ordenar de mayor a menor porcentaje
    resultados.sort((a, b) => {
        return b.porcentaje - a.porcentaje;
    });

    return resultados;
}

function mostrarResultados(resultados) {
    // Obtiene el mejor resultado
    const mejorResultado = resultados[0];

    // Obtener los elementos de la pantalla de resultados
    const nombreBacteria = document.getElementById("nombreBacteria");
    const porcentajeCoincidencia = document.getElementById("porcentajeCoincidencia");

    // Mostrar el nombre del microorganismo
    nombreBacteria.textContent = mejorResultado.nombre;

    // Mostrar el porcentaje de coincidencia
    porcentajeCoincidencia.textContent = mejorResultado.porcentaje.toFixed(0) + "%";

    // Detalle de coincidencias
    const contenedorDetalle = document.getElementById("tablaCoincidencias");

    contenedorDetalle.innerHTML = "";

    mejorResultado.detalle.forEach(detalle => {

        const fila = document.createElement("div");

        fila.className =
            detalle.coincide
                ? "coincidencia correcta"
                : "coincidencia incorrecta";


        const prueba = pruebas.find(
            prueba => prueba.id === detalle.prueba
        );

        const nombrePrueba =
            prueba ? prueba.nombrePaso : detalle.prueba;


        fila.innerHTML = `
            <div class="detalle-prueba">
                <strong>${nombrePrueba}</strong>
            </div>

            <div class="detalle-alumno">
                Tu resultado:
                <strong>${detalle.resultadoAlumno}</strong>
            </div>

            <div class="detalle-esperado">
                Esperado:
                <strong>${detalle.resultadoEsperado}</strong>
            </div>

            <div class="detalle-icono">
                ${detalle.coincide ? "✓" : "✗"}
            </div>
        `;

        contenedorDetalle.appendChild(fila);

    });
    // Ocultar la tarjeta de identificación y mostrar la de resultados
    document.querySelector(".card").style.display = "none";
    document.getElementById("resultadoIdentificacion").style.display = "block";
}

function abrirDiccionario() {

}


// ===============================
// EVENTOS
// ===============================
btnContinuar.addEventListener("click", () => {

    // 1. Verificar que haya respuesta
    if (respuestaSeleccionada === null) {
        return;
    }

    // 2. Obtener la prueba actual
    const pruebaActual = pruebas[pasoActual];

    // 3. Guardar la respuesta
    const respuestaExistente = respuestas.find(
        respuesta => respuesta.prueba === pruebaActual.id
    );
    if (respuestaExistente) {
        respuestaExistente.respuesta = respuestaSeleccionada;
    }
    else {
        respuestas.push({
            paso: pasoActual,
            prueba: pruebaActual.id,
            respuesta: respuestaSeleccionada
        });
    }

    console.log("Respuestas:", respuestas);

    // 4. Obtener la siguiente prueba
    const siguienteId = obtenerSiguientePrueba();

    console.log("Siguiente prueba:", siguienteId);

    // 5. ¿Existe una siguiente prueba?
    if (siguienteId) {

        const siguientePrueba = pruebas.find(prueba => prueba.id === siguienteId);

        if (siguientePrueba) {
            // Cambiar al indice de la siguiente prueba y actualizar la pantalla
            pasoActual = pruebas.indexOf(siguientePrueba);
            actualizarPantalla();
        } else {
            console.error("No se encontró la prueba con id:", siguienteId);
        }

    } else {

        // IDENTIFICACIÓN FINALIZADA

        console.log("Identificación finalizada.");

        console.log("Respuestas del alumno:", respuestas);

        // Calcular coincidencias
        const resultados = calcularCoincidencias();

        console.log("Resultados de identificación:", resultados);

        // Mostrar el microorganismo con mayor coincidencia
        if (resultados.length > 0) {
            mostrarResultados(resultados);
        }
    }

});

btnAtras.addEventListener("click", () => {
    if (pasoActual > 0) {
        pasoActual--;
        actualizarPantalla();
    }
});

btnDiccionario.addEventListener("click", () => {

    // Obtener la prueba actual
    const prueba = pruebas[pasoActual];

    // Obtener el identificador del concepto
    const idConcepto = prueba.conceptoDiccionario;

    console.log("Concepto solicitado:", idConcepto);

    // Buscar el concepto dentro del diccionario
    const concepto = diccionario[idConcepto];

    // Verificar que exista
    if (!concepto) {

        console.error(
            "No se encontró el concepto en el diccionario:",
            idConcepto
        );
        return;
    }

    // Mostrar información del concepto
    diccionarioTitulo.textContent = concepto.titulo;

    diccionarioDefinicion.textContent =
        concepto.definicion || "Información próximamente disponible.";

    diccionarioInterpretacion.textContent =
        concepto.interpretacion || "Información próximamente disponible.";

    // Abrir el modal
    diccionarioModal.classList.add("abierto");

});

cerrarDiccionario.addEventListener("click", () => {
    diccionarioModal.classList.remove("abierto");
});

document.getElementById("btnNuevaIdentificacion").addEventListener("click", () => {
    pasoActual = 0;
    respuestas = [];
    respuestaSeleccionada = null;
    document.getElementById("resultadoIdentificacion").style.display = "none";
    document.querySelector(".card").style.display = "block";
    actualizarPantalla();
});

// ===============================
// INICIALIZACIÓN
// ===============================
actualizarPantalla();