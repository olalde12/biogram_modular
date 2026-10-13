// ================================
// NAVEGACIÓN
// ================================
document.querySelectorAll(".btn-principal").forEach((boton) => {
    boton.addEventListener("click", () => {
        if (boton.dataset.url) {
            window.location.href = boton.dataset.url;
        }
    });
});

// ================================
// SIDEBAR
// ================================
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });
}

// ================================
// DATOS DE LA API
// ================================
const API_URL = "http://127.0.0.1:8000";

let pruebas = [];
let microorganismos = [];
let pasoActual = 0;
let respuestaSeleccionada = null;
let respuestas = [];

// Elementos del HTML
const btnContinuar = document.querySelector(".continue");
const btnAtras = document.getElementById("btnAtras");
const btnDiccionario = document.querySelector(".dictionary-btn");
const diccionarioModal = document.getElementById("diccionarioModal");
const cerrarDiccionario = document.getElementById("cerrarDiccionario");

const diccionarioTitulo = document.getElementById("diccionarioTitulo");
const diccionarioDefinicion = document.getElementById("diccionarioDefinicion");
const diccionarioInterpretacion = document.getElementById("diccionarioInterpretacion");

// ================================
// CARGAR PRUEBAS
// ================================
async function cargarPruebas() {
    const response = await fetch(`${API_URL}/pruebas/`);

    if (!response.ok) {
        throw new Error("No se pudieron cargar las pruebas.");
    }

    const datos = await response.json();

    pruebas = Array.isArray(datos) ? datos : [];

    console.log("Pruebas cargadas:", pruebas);
}

// ================================
// CARGAR MICROORGANISMOS
// ================================
async function cargarMicroorganismos() {
    const response = await fetch(`${API_URL}/microorganismos/`);

    if (!response.ok) {
        throw new Error("No se pudieron cargar los microorganismos.");
    }

    const datos = await response.json();

    microorganismos = Array.isArray(datos) ? datos : [];

    console.log("Microorganismos cargados:", microorganismos);
}

// ================================
// CREAR PREGUNTA DE GRAM
// ================================
function crearPruebaGram() {
    return {
        id_prueba: "gram",
        nombre: "Tinción de Gram",

        opc_prueba: [
            {
                id_opcion: "gram_pos",
                nombre_resultado: "Positivo"
            },
            {
                id_opcion: "gram_neg",
                nombre_resultado: "Negativo"
            }
        ],

        descripcion:
            "La tinción de Gram es una técnica de coloración utilizada para observar y diferenciar bacterias de acuerdo con las características de su pared celular.",

        fundamento:
            "Las bacterias se clasifican principalmente como Gram positivas o Gram negativas según su reacción a la tinción. Esta característica ayuda a orientar la identificación."
    };
}

// ================================
// PANTALLA DEL CUESTIONARIO
// ================================
function actualizarPantalla() {
    if (!pruebas.length) {
        return;
    }

    mostrarPrueba();
    actualizarProgreso();
    actualizarBotones();
}

// ================================
// MOSTRAR PRUEBA ACTUAL
// ================================
function mostrarPrueba() {
    const prueba = pruebas[pasoActual];

    if (!prueba) {
        return;
    }

    const titulo = document.getElementById("tituloPrueba");
    const pregunta = document.getElementById("preguntaPrueba");
    const contenedor = document.getElementById("contenedorOpciones");

    if (!contenedor) {
        return;
    }

    if (titulo) {
        titulo.textContent = prueba.nombre;
    }

    if (pregunta) {
        pregunta.textContent = prueba.nombre;
    }

    // Eliminar las opciones de la prueba anterior
    contenedor.innerHTML = "";

    // Buscar si ya se respondió esta prueba
    const respuestaAnterior = respuestas.find(
        (respuesta) =>
            String(respuesta.id_prueba) === String(prueba.id_prueba)
    );

    const opciones = Array.isArray(prueba.opc_prueba)
        ? prueba.opc_prueba
        : [];

    // Crear los botones de las opciones
    opciones.forEach((opcion) => {
        const idOpcion = obtenerIdOpcion(opcion);

        const boton = document.createElement("button");

        boton.type = "button";
        boton.className = "option";
        boton.textContent = opcion.nombre_resultado ?? "Opción";
        boton.dataset.idOpcion = String(idOpcion);

        // Marcar la respuesta anterior
        if (
            respuestaAnterior &&
            String(respuestaAnterior.id_opcion) === String(idOpcion)
        ) {
            boton.classList.add("selected");
        }

        boton.addEventListener("click", () => {
            // Quitar la selección de las demás opciones
            contenedor.querySelectorAll(".option").forEach((otroBoton) => {
                otroBoton.classList.remove("selected");
            });

            // Marcar la opción elegida
            boton.classList.add("selected");

            // Guardar temporalmente la selección
            respuestaSeleccionada = {
                id_opcion: idOpcion,
                nombre_resultado: opcion.nombre_resultado
            };

            if (btnContinuar) {
                btnContinuar.disabled = false;
            }
        });

        contenedor.appendChild(boton);
    });

    // Recuperar la respuesta anterior
    if (respuestaAnterior) {
        respuestaSeleccionada = {
            id_opcion: respuestaAnterior.id_opcion,
            nombre_resultado: respuestaAnterior.respuesta
        };

        if (btnContinuar) {
            btnContinuar.disabled = false;
        }
    } else {
        respuestaSeleccionada = null;

        if (btnContinuar) {
            btnContinuar.disabled = true;
        }
    }
}

// ================================
// OBTENER ID DE UNA OPCIÓN
// ================================
function obtenerIdOpcion(opcion) {
    return (
        opcion.id_opcion ??
        opcion.id_opcion_prueba ??
        opcion.id_resultado
    );
}

// ================================
// ACTUALIZAR PROGRESO
// ================================
function actualizarProgreso() {
    const paso = document.getElementById("pasoActual");
    const total = document.getElementById("totalPasos");
    const barra = document.getElementById("progressFill");

    if (paso) {
        paso.textContent = String(pasoActual + 1);
    }

    if (total) {
        total.textContent = String(pruebas.length);
    }

    if (barra && pruebas.length > 0) {
        const porcentaje =
            ((pasoActual + 1) / pruebas.length) * 100;

        barra.style.width = `${porcentaje}%`;
    }
}

// ================================
// ACTUALIZAR BOTONES
// ================================
function actualizarBotones() {
    if (btnAtras) {
        btnAtras.disabled = pasoActual === 0;
    }
}

// ================================
// OBTENER SIGUIENTE PRUEBA
// ================================
function obtenerSiguientePrueba() {
    if (pasoActual < pruebas.length - 1) {
        return pasoActual + 1;
    }

    return null;
}

// ================================
// COMPARAR RESPUESTAS
// ================================


function calcularCoincidencias(listaMicroorganismos) {
    const totalRespuestas = respuestas.length;

    if (totalRespuestas === 0) {
        return [];
    }

    const resultados = [];

    for (const microorganismo of listaMicroorganismos) {
        let coincidencias = 0;
        let pruebasComparadas = 0;
        let informacionCompleta = true;
        const detalle = [];

        for (const respuesta of respuestas) {
            const esGram =
                String(respuesta.id_prueba).toLowerCase() === "gram" ||
                respuesta.tipo === "gram";

            const prueba = pruebas.find(
                p =>
                    String(p.id_prueba) ===
                    String(respuesta.id_prueba)
            );

            let coincide = false;
            let resultadosEsperados = [];

            if (esGram) {
                const gramUsuario = normalizarTexto(
                    respuesta.respuesta
                );

                const gramMicroorganismo = normalizarTexto(
                    microorganismo.gram ?? ""
                );

                if (!gramMicroorganismo) {
                    informacionCompleta = false;
                    continue;
                }

                // Aceptar variantes como "Positivo",
                // "Gram positivo" o "Gram-positivo".
                const esPositivo = texto =>
                    texto.includes("positivo") ||
                    texto === "gram+";

                const esNegativo = texto =>
                    texto.includes("negativo") ||
                    texto === "gram-";

                coincide =
                    gramUsuario === gramMicroorganismo ||
                    (
                        esPositivo(gramUsuario) &&
                        esPositivo(gramMicroorganismo)
                    ) ||
                    (
                        esNegativo(gramUsuario) &&
                        esNegativo(gramMicroorganismo)
                    );

                resultadosEsperados = [
                    microorganismo.gram
                ];

                pruebasComparadas++;

            } else {
                const idPrueba = Number(respuesta.id_prueba);
                const idOpcionUsuario = Number(
                    respuesta.id_opcion
                );

                const variantes = (
                    microorganismo.res_prueba_micro ?? []
                ).filter(
                    resultado =>
                        Number(resultado.id_prueba) === idPrueba
                );

                if (variantes.length === 0) {
                    informacionCompleta = false;
                    continue;
                }

                // Recuperar todas las opciones válidas.
                const idsEsperados = variantes
                    .map(resultado =>
                        resultado.id_opcion ??
                        resultado.id_opcion_prueba ??
                        resultado.id_resultado
                    )
                    .filter(id => id != null);

                resultadosEsperados = [
                    ...new Set(idsEsperados)
                ].map(id => {
                    const opcion = (prueba?.opc_prueba ?? []).find(
                        op =>
                            String(
                                op.id_opcion ??
                                op.id_opcion_prueba ??
                                op.id_resultado
                            ) === String(id)
                    );

                    return opcion?.nombre_resultado ??
                        `Opción ${id}`;
                });

                // Una prueba puede tener varias respuestas válidas.
                coincide = idsEsperados.some(
                    id => Number(id) === idOpcionUsuario
                );

                pruebasComparadas++;
            }

            if (coincide) {
                coincidencias++;
            }

            detalle.push({
                id_prueba: respuesta.id_prueba,
                prueba: prueba?.nombre ??
                    (esGram ? "Tinción de Gram" : "Prueba bioquímica"),
                resultadoAlumno: respuesta.respuesta,
                resultadoEsperado: resultadosEsperados.join(" / "),
                coincide: coincide
            });
        }

        const porcentaje = totalRespuestas > 0
            ? (coincidencias / totalRespuestas) * 100
            : 0;

        resultados.push({
            microorganismo: microorganismo,

            // Nombre para mostrar en la interfaz.
            nombre:
                microorganismo.nombre ??
                microorganismo.nombre_microorganismo ??
                microorganismo.nombre_cientifico ??
                "Microorganismo sin nombre",

            coincidencias: coincidencias,
            pruebasComparadas: pruebasComparadas,
            totalRespuestas: totalRespuestas,
            porcentaje: porcentaje,

            exacto:
                informacionCompleta &&
                pruebasComparadas === totalRespuestas &&
                coincidencias === totalRespuestas,

            detalle: detalle
        });
    }

    return resultados.sort((a, b) => {
        if (a.exacto !== b.exacto) {
            return a.exacto ? -1 : 1;
        }

        return b.porcentaje - a.porcentaje;
    });
}


// ================================
// NORMALIZAR TEXTO
// ================================
function normalizarTexto(valor) {
    return String(valor ?? "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// ================================
// MOSTRAR RESULTADOS
// ================================

function mostrarResultados(resultados) {
    const tarjetaCuestionario = document.querySelector(".card");

    const pantallaResultados = document.getElementById(
        "resultadoIdentificacion"
    );

    const coincidenciasExactas = resultados.filter(
        resultado => resultado.exacto
    );

    if (coincidenciasExactas.length === 0) {
        mostrarSinCoincidencias();
        return;
    }

    const mejorResultado = coincidenciasExactas[0];

    const nombreBacteria = document.getElementById("nombreBacteria");

    const porcentajeCoincidencia = document.getElementById(
        "porcentajeCoincidencia"
    );

    const contenedorDetalle = document.getElementById(
        "tablaCoincidencias"
    );

    const otrosResultados = document.getElementById(
        "otrosResultados"
    );

    // Mostrar el nombre correcto del microorganismo.
    if (nombreBacteria) {
        nombreBacteria.textContent = mejorResultado.nombre;
    }

    if (porcentajeCoincidencia) {
        porcentajeCoincidencia.textContent =
            `${mejorResultado.porcentaje}% de coincidencia`;
    }

    // Detalle de las pruebas y sus resultados.
    if (contenedorDetalle) {
        contenedorDetalle.innerHTML = "";

        mejorResultado.detalle.forEach(detalle => {
            const fila = document.createElement("div");
            fila.className = "coincidencia correcta";

            fila.innerHTML = `
                <div class="detalle-prueba">
                    <strong>${detalle.prueba}</strong>
                </div>

                <div class="detalle-alumno">
                    Tu resultado:
                    <strong>${detalle.resultadoAlumno}</strong>
                </div>

                <div class="detalle-esperado">
                    Resultado esperado:
                    <strong>${detalle.resultadoEsperado}</strong>
                </div>

                <div class="detalle-icono">✓</div>
            `;

            contenedorDetalle.appendChild(fila);
        });
    }

    // Mostrar las otras coincidencias exactas.
    if (otrosResultados) {
        otrosResultados.innerHTML = "";

        coincidenciasExactas.slice(1).forEach(resultado => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "otro-resultado";

            tarjeta.innerHTML = `
                <div>
                    <strong>${resultado.nombre}</strong>
                    <span>${resultado.porcentaje}%</span>
                </div>

                <div class="barra-coincidencia">
                    <div
                        class="barra-coincidencia-fill"
                        style="width: ${resultado.porcentaje}%">
                    </div>
                </div>
            `;

            otrosResultados.appendChild(tarjeta);
        });
    }

    if (tarjetaCuestionario) {
        tarjetaCuestionario.style.display = "none";
    }

    if (pantallaResultados) {
        pantallaResultados.style.display = "block";
    }
}

// ================================
// MOSTRAR CUANDO NO HAY COINCIDENCIAS
// ================================
function mostrarSinCoincidencias() {
    const tarjetaCuestionario = document.querySelector(".card");

    const pantallaResultados = document.getElementById(
        "resultadoIdentificacion"
    );

    const nombreBacteria = document.getElementById("nombreBacteria");

    const porcentaje = document.getElementById(
        "porcentajeCoincidencia"
    );

    const detalle = document.getElementById("tablaCoincidencias");

    const otros = document.getElementById("otrosResultados");

    if (nombreBacteria) {
        nombreBacteria.textContent =
            "No se encontraron coincidencias";
    }

    if (porcentaje) {
        porcentaje.textContent =
            "Ningún microorganismo coincide con las respuestas registradas.";
    }

    if (detalle) {
        detalle.innerHTML = "";
    }

    if (otros) {
        otros.innerHTML = "";
    }

    if (tarjetaCuestionario) {
        tarjetaCuestionario.style.display = "none";
    }

    if (pantallaResultados) {
        pantallaResultados.style.display = "block";
    }
}

// ================================
// BOTÓN CONTINUAR
// ================================
if (btnContinuar) {
    btnContinuar.addEventListener("click", () => {
        // Comprobar que exista una respuesta seleccionada
        if (!respuestaSeleccionada) {
            return;
        }

        const pruebaActual = pruebas[pasoActual];

        if (!pruebaActual) {
            return;
        }

        // Buscar si la prueba ya tiene una respuesta guardada
        const respuestaExistente = respuestas.find(
            (respuesta) =>
                String(respuesta.id_prueba) ===
                String(pruebaActual.id_prueba)
        );

        // Crear la respuesta actual
        const nuevaRespuesta = {
            paso: pasoActual,
            id_prueba: pruebaActual.id_prueba,
            id_opcion: respuestaSeleccionada.id_opcion,
            respuesta: respuestaSeleccionada.nombre_resultado
        };

        // Actualizar o guardar la respuesta
        if (respuestaExistente) {
            Object.assign(respuestaExistente, nuevaRespuesta);
        } else {
            respuestas.push(nuevaRespuesta);
        }

        console.log("Respuestas guardadas:", respuestas);

        // Avanzar a la siguiente prueba
        const siguientePaso = obtenerSiguientePrueba();

        if (siguientePaso !== null) {
            pasoActual = siguientePaso;
            actualizarPantalla();
        } else {
            // Terminar el cuestionario y calcular coincidencias
            const resultados = calcularCoincidencias(microorganismos);

            console.log(
                "Resultados de identificación:",
                resultados
            );

            mostrarResultados(resultados);
        }
    });
}

// ================================
// BOTÓN ATRÁS
// ================================
if (btnAtras) {
    btnAtras.addEventListener("click", () => {
        if (pasoActual > 0) {
            pasoActual--;
            actualizarPantalla();
        }
    });
}

// ================================
// DICCIONARIO
// ================================
if (btnDiccionario) {
    btnDiccionario.addEventListener("click", () => {
        const prueba = pruebas[pasoActual];

        if (!prueba || !diccionarioModal) {
            return;
        }

        if (diccionarioTitulo) {
            diccionarioTitulo.textContent = prueba.nombre;
        }

        if (diccionarioDefinicion) {
            diccionarioDefinicion.textContent =
                prueba.descripcion ||
                "Información próximamente disponible.";
        }

        if (diccionarioInterpretacion) {
            diccionarioInterpretacion.textContent =
                prueba.fundamento ||
                "Información próximamente disponible.";
        }

        diccionarioModal.classList.add("abierto");
    });
}

// ================================
// CERRAR DICCIONARIO
// ================================
if (cerrarDiccionario && diccionarioModal) {
    cerrarDiccionario.addEventListener("click", () => {
        diccionarioModal.classList.remove("abierto");
    });
}

// ================================
// NUEVA IDENTIFICACIÓN
// ================================
const btnNuevaIdentificacion = document.getElementById(
    "btnNuevaIdentificacion"
);

if (btnNuevaIdentificacion) {
    btnNuevaIdentificacion.addEventListener("click", () => {
        pasoActual = 0;
        respuestas = [];
        respuestaSeleccionada = null;

        const pantallaResultados = document.getElementById(
            "resultadoIdentificacion"
        );

        const tarjetaCuestionario = document.querySelector(".card");

        if (pantallaResultados) {
            pantallaResultados.style.display = "none";
        }

        if (tarjetaCuestionario) {
            tarjetaCuestionario.style.display = "block";
        }

        actualizarPantalla();
    });
}

// ================================
// INICIAR IDENTIFICACIÓN
// ================================
async function iniciarIdentificacion() {
    const pantallaCarga = document.getElementById(
        "pantallaCargaIdentificacion"
    );

    const contenido = document.getElementById(
        "contenidoIdentificacion"
    );

    try {
        // Cargar pruebas y microorganismos al mismo tiempo
        await Promise.all([
            cargarPruebas(),
            cargarMicroorganismos()
        ]);

        // Agregar Gram al principio porque se obtiene
        // del campo microorganismo.gram.
        pruebas = [
            crearPruebaGram(),
            ...pruebas
        ];

        if (!pruebas.length) {
            throw new Error(
                "La API no devolvió pruebas para mostrar."
            );
        }

        // Mostrar la primera pregunta
        actualizarPantalla();

        // Ocultar pantalla de carga
        if (pantallaCarga) {
            pantallaCarga.style.opacity = "0";

            window.setTimeout(() => {
                pantallaCarga.style.display = "none";

                if (contenido) {
                    contenido.style.display = "block";
                }
            }, 300);
        } else if (contenido) {
            contenido.style.display = "block";
        }

    } catch (error) {
        console.error(
            "No se pudo iniciar la identificación:",
            error
        );

        const mensaje = document.getElementById(
            "mensajeErrorIdentificacion"
        );

        if (mensaje) {
            mensaje.textContent =
                "No se pudo cargar la identificación. Verifica que la API esté activa e inténtalo de nuevo.";

            mensaje.style.display = "block";
        }
    }
}

// Ejecutar el cuestionario
iniciarIdentificacion();