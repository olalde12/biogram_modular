// Navegación
document.querySelectorAll(".btn-principal").forEach(boton => {
    boton.addEventListener("click", () => {
        if (boton.dataset.url) {
            window.location.href = boton.dataset.url;
        }
    });
});

// Sidebar
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });
}

// Obtener pruebas y microorganismos desde la base de datos
let pruebas = [];
let microorganismos = []; 
async function cargarMicroorganismos() {
    try {
        const response = await fetch(`http://127.0.0.1:8000/microorganismos`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        
        if (!response.ok) {
            throw new Error("No se pudieron cargar las pruebas desde la API.");
        }

        microorganismos = await response.json();

    } catch (error) {
        console.error("Error al cargar pruebas:", error);
    }
}

async function cargarPruebas() {
    try {

        const response = await fetch(
            "http://127.0.0.1:8000/pruebas"
        );

        if (!response.ok) {
            throw new Error("No se pudieron cargar las pruebas.");
        }

        pruebas = await response.json();

        console.log("Pruebas cargadas:", pruebas);

    } catch (error) {
        console.error("Error al cargar pruebas:", error);
    }
}

// Definimos variables necesarias y obtenemos elementos del HTML
let pasoActual = 0;
let respuestaSeleccionada = null; // Aquí se irá guardando la respuesta elegida
let respuestas = []; // Aquí se guardarán todas las respuestas

// Obtiene los botones necesarios (junto con el modal de diccionario)
const btnContinuar = document.querySelector(".continue"); 
const btnAtras = document.getElementById("btnAtras"); 
const btnDiccionario = document.querySelector(".dictionary-btn"); 
const diccionarioModal = document.getElementById("diccionarioModal"); 
const cerrarDiccionario = document.getElementById("cerrarDiccionario"); 

// Función principal
function actualizarPantalla() {
    mostrarPrueba();
    actualizarProgreso();
    actualizarBotones();
    reiniciarSeleccion();
}

// Función para crear cada pregunta con las pruebas
function mostrarPrueba() {
    // Obtener la prueba actual
    const prueba = pruebas[pasoActual];

    // Cambiar informacion para cada prueba
    document.getElementById("tituloPrueba").textContent = prueba.nombre;
    document.getElementById("preguntaPrueba").textContent = prueba.nombre;
    const contenedor = document.getElementById("contenedorOpciones");

    // Limpiar las opciones anteriores
    contenedor.innerHTML = "";

    // Buscar si esta prueba ya había sido respondida
    const respuestaAnterior = respuestas.find(
        respuesta => respuesta.prueba === prueba.id_prueba
    );

    // Crear las opciones de la prueba actual
    prueba.opc_prueba.forEach(opcion => {
        const boton = document.createElement("button");
        boton.className = "option";
        boton.textContent = opcion.nombre_resultado;
        boton.dataset.idOpcion = opcion.id_opcion;

        // Si ya había una respuesta guardada, marcarla
        if (respuestaAnterior && respuestaAnterior.respuesta === opcion.nombre_resultado) {
            boton.classList.add("selected");
        }

        // Evento para marcar la seleccion
        boton.addEventListener("click", () => {
            // Quitar selección anterior 
            document.querySelectorAll(".option").forEach(btn => {
                btn.classList.remove("selected");
            });

            // Marcar opción seleccionada
            boton.classList.add("selected");

            // Guardar respuesta temporal
            respuestaSeleccionada = {
                id_opcion: opcion.id_opcion_prueba,
                nombre_resultado: opcion.nombre_resultado
            };

            // Activar boton Continuar
            btnContinuar.disabled = false;
        });

        // Agregar botón al contenedor
        contenedor.appendChild(boton);
    });

    // Si ya había una respuesta guardada, mantenerla como respuesta seleccionada
    if (respuestaAnterior) {
        respuestaSeleccionada = respuestaAnterior.respuesta;
        btnContinuar.disabled = false;
    } else {
        respuestaSeleccionada = null;
        btnContinuar.disabled = true;
    }
}

// Función para actualizar el progreso segun lo que lleve el usuario
function actualizarProgreso() {
    document.getElementById("pasoActual").textContent = pasoActual + 1;
    document.getElementById("totalPasos").textContent = pruebas.length;
    const porcentaje = ((pasoActual + 1) / pruebas.length) * 100;
    document.getElementById("progressFill").style.width = porcentaje + "%";
}

// Función para actualizar los botones para la siguiente prueba
function actualizarBotones() {
    if (pasoActual === 0) {
        btnAtras.disabled = true;
    } else {
        btnAtras.disabled = false;
    }
}

function reiniciarSeleccion() {
    const respuestaAnterior = respuestas.find(
        respuesta => respuesta.prueba === pruebas[pasoActual].id_prueba
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
    // Si no hay un camino especial, continuar con la siguiente prueba
    if (pasoActual < pruebas.length - 1) {
        return pasoActual + 1;
    }

    // Si estamos en la última prueba, terminar la identificación
    return null;
}

// Función para comparar y obtener un microorganismo
function calcularCoincidencias(microorganismos) {
    const resultados = [];

    microorganismos.forEach(microorganismo => {
        let coincidencias = 0;
        let pruebasComparadas = 0;
        const detalle = [];

        respuestas.forEach(respuesta => {
            let coincidencia = false;
            let resultadoEsperado = null;
            let opcionEsperada = null;
            if (respuesta.id_prueba === "gram") {
                resultadoEsperado = microorganismo.gram;
                coincidencia = (respuesta.respuesta === resultadoEsperado);
                opcionEsperada = { nombre_resultado: resultadoEsperado };
            } else {
                const resultadoEsperado = microorganismo.res_prueba_micro.find(
                    resultado =>
                        resultado.id_prueba === respuesta.id_prueba
                );

                // Buscar la prueba
                const prueba = pruebas.find(
                    prueba => prueba.id_prueba === respuesta.id_prueba
                );

                // Buscar el nombre de la opción esperada
                opcionEsperada = prueba?.opc_prueba.find(
                    opcion =>
                        opcion.id_opcion_prueba === resultadoEsperado?.id_opcion
                );

                coincidencia =
                        resultadoEsperado &&
                        resultadoEsperado.id_opcion === respuesta.id_opcion
            }

            pruebasComparadas++;
            if (coincidencia) {
                coincidencias++;
            }
        
            detalle.push({
                prueba: respuesta.id_prueba,
                resultadoAlumno: respuesta.respuesta,
                resultadoEsperado: resultadoEsperado || "Sin resultado",
                coincide: !!coincidencia
            });
        });

        const porcentaje = pruebasComparadas > 0
            ? (coincidencias / pruebasComparadas) * 100 : 0;

        resultados.push({
            id: microorganismo.id_microorganismo,
            nombre: microorganismo.nombre,
            coincidencias,
            pruebasComparadas,
            porcentaje, 
            detalle
        });

    });

    // Ordenar de mayor a menor porcentaje
    resultados.sort((a, b) => {
        return b.porcentaje - a.porcentaje;
    });

    return resultados;
}

// Función para mostrar los resultados obtenidos
function mostrarResultados(resultados) {
    // Obtiene el mejor resultado
    const mejorResultado = resultados[0];

    // Obtener los elementos de la pantalla de resultados
    const nombreBacteria = document.getElementById("nombreBacteria");
    const porcentajeCoincidencia = document.getElementById("porcentajeCoincidencia");

    // Mostrar la información del microorganismo
    nombreBacteria.textContent = mejorResultado.nombre;
    porcentajeCoincidencia.textContent = mejorResultado.porcentaje.toFixed(0) + "%";
    const contenedorDetalle = document.getElementById("tablaCoincidencias");
    contenedorDetalle.innerHTML = "";

    mejorResultado.detalle.forEach(detalle => {
        const fila = document.createElement("div");
        fila.className =
            detalle.coincide
                ? "coincidencia correcta"
                : "coincidencia incorrecta";

        const prueba = pruebas.find(
            prueba => prueba.id_prueba === detalle.prueba
        );

        const nombrePrueba =
            prueba ? prueba.nombre : detalle.prueba;

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

// Eventos para el boton continuar
btnContinuar.addEventListener("click", () => {
    // Verificar que haya respuesta
    if (respuestaSeleccionada === null) {
        return;
    }

    // Obtener la prueba actual
    const pruebaActual = pruebas[pasoActual];

    // Guardar la respuesta
    const respuestaExistente = respuestas.find(
        respuesta => respuesta.id_prueba === pruebaActual.id_prueba
    );
    if (respuestaExistente) {
        respuestaExistente.id_opcion = respuestaSeleccionada.id_opcion;
        respuestaExistente.respuesta = respuestaSeleccionada.nombre_resultado;
    }
    else {
        respuestas.push({
            paso: pasoActual,
            id_prueba: pruebaActual.id_prueba,
            id_opcion: respuestaSeleccionada.id_opcion,
            respuesta: respuestaSeleccionada.nombre_resultado
        });
    }

    // Obtener la siguiente prueba
    const siguientePaso = obtenerSiguientePrueba();
    // ¿Existe una siguiente prueba?
    if (siguientePaso !== null) {
        pasoActual = siguientePaso;
        actualizarPantalla();
    } else {
        // Calcular coincidencias
        const resultados = calcularCoincidencias(microorganismos);

        // Mostrar el microorganismo con mayor coincidencia
        if (resultados.length > 0) {
            mostrarResultados(resultados);
        }
    }
});

// Retroceder a una prueba anterior
btnAtras.addEventListener("click", () => {
    if (pasoActual > 0) {
        pasoActual--;
        actualizarPantalla();
    }
});

// Mostrar concepto de la prueba
btnDiccionario.addEventListener("click", () => {
    // Obtener la prueba actual
    const prueba = pruebas[pasoActual];

    // Obtener el identificador del concepto
    const idConcepto = prueba.conceptoDiccionario;

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

// Iniciar la identificacion
async function iniciarIdentificacion() {
    // Llamar a funciones para obtener data
    await cargarPruebas();
    await cargarMicroorganismos();

    // Crear prueba Gram (porque esta en otro campo)
    const pruebaGram = {
        id_prueba: "gram",
        nombre: "Tinción de Gram",
        opc_prueba: [
            { id_opcion_prueba: "gram_pos", nombre_resultado: "Positivo" },
            { id_opcion_prueba: "gram_neg", nombre_resultado: "Negativo" }
        ],
        conceptoDiccionario: "gram"
    };

    // Insertar al inicio del cuestionario
    pruebas.unshift(pruebaGram);
    actualizarPantalla();

    // Animación de carga (hasta que se obtenga la data)
    document.getElementById("pantallaCargaIdentificacion").style.opacity = "0";
        setTimeout(() => {
            document.getElementById("pantallaCargaIdentificacion").style.display = "none";
            document.getElementById("contenidoIdentificacion").style.display = "block";
    }, 800);
}

iniciarIdentificacion();
