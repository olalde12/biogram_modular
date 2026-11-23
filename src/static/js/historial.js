const API_HISTORIAL = "http://127.0.0.1:8000";

let identificaciones = [];
let identificacionSeleccionada = null;
const listaHistorial = document.getElementById("listaHistorial");
const buscarHistorial = document.getElementById("buscarHistorial");
const filtroFecha = document.getElementById("filtroFecha");

document.addEventListener("DOMContentLoaded", cargarHistorial);

// Pantalla de carga
const loaderWrapper = document.getElementById("loader-wrapper");
function mostrarCarga() {
    if (loaderWrapper) {
        loaderWrapper.style.display = "flex";
    }
}

function ocultarCarga() {
    if (loaderWrapper) {
        loaderWrapper.style.display = "none";
    }
}

async function cargarHistorial() {
    mostrarCarga()
    try {
        const response = await fetch(`${API_HISTORIAL}/cuestionarios/historial`,
            { credentials: "include" }
        );

        if (!response.ok) {
            throw new Error(
                response.status === 401
                    ? "Tu sesión ha expirado. Inicia sesión nuevamente."
                    : "No se pudo cargar el historial."
            );
        }

        identificaciones = await response.json();
        actualizarResumen(identificaciones);
        mostrarHistorial(identificaciones);
    } catch (error) {
        console.error(error);
        listaHistorial.innerHTML = `
            <div class="historial-error">
                <i class="fa-solid fa-circle-exclamation"></i>
                <p>${escaparHTML(error.message)}</p>
            </div>
        `;
    } finally {
        ocultarCarga();
    }
}

function actualizarResumen(datos) {
    document.getElementById("totalIdentificaciones").textContent =
        datos.length;

    const bacterias = datos.filter(
        item => item.nombre !== "Sin identificación"
    );

    document.getElementById("totalBacterias").textContent =
        bacterias.length;

    document.getElementById("ultimaIdentificacion").textContent =
        datos.length ? formatearFecha(datos[0].fecha) : "--";
}

function mostrarHistorial(datos) {
    const busqueda = buscarHistorial.value.toLowerCase().trim();
    const fecha = filtroFecha.value;

    const filtrados = datos.filter(item => {
        const coincideNombre = item.nombre.toLowerCase().includes(busqueda);

        const fechaItem = String(item.fecha).substring(0, 10);
        const coincideFecha = !fecha || fechaItem === fecha;

        return coincideNombre && coincideFecha;
    });

    document.getElementById("contadorResultados").textContent =
        `${filtrados.length} registros`;

    if (!filtrados.length) {
        listaHistorial.innerHTML = `
            <div class="historial-vacio">
                <i class="fa-solid fa-folder-open"></i>
                <h3>No hay identificaciones</h3>
                <p>No encontramos registros con esos filtros.</p>
            </div>
        `;
        return;
    }

    listaHistorial.innerHTML = filtrados.map(item => {
        const sinCoincidencia = item.nombre === "Sin identificación";

        const porcentaje = item.nombre == "Sin identificación"
            ? "--"
            : `<span>${item.porcentaje_coincidencia}% de coincidencia</span>`;

        return `
            <article class="historial-card">

                <div class="historial-card-top">
                    <div>
                        <h3>${escaparHTML(item.nombre)}</h3>
                        <p class="fecha">
                            <i class="fa-regular fa-calendar"></i>
                            ${formatearFecha(item.fecha)}
                        </p>
                    </div>

                    <span class="porcentaje ${sinCoincidencia ? "sin-coincidencia" : ""}">
                        ${porcentaje}
                    </span>
                </div>

                <div class="historial-card-footer">
                    <span>
                        <i class="fa-solid fa-flask"></i>
                        Identificación registrada
                    </span>

                    <button
                        class="btn-detalle"
                        onclick="verDetalle(${item.id_cuestionario})">
                        Ver detalles
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>

            </article>
        `;
    }).join("");
}

async function verDetalle(id) {
    const modal = document.getElementById("modalDetalle");
    const respuestas = document.getElementById("detalleRespuestas");

    identificacionSeleccionada = id;

    modal.classList.add("visible");
    mostrarCarga();

    try {
        const response = await fetch(
            `${API_HISTORIAL}/cuestionarios/historial/${id}/detalle`,
            { credentials: "include" }
        );

        const datos = await response.json();

        if (!response.ok) {
            throw new Error(datos.detail || "No se pudo cargar el detalle");
        }

        document.getElementById("detalleNombre").textContent =
            datos.nombre;

        document.getElementById("detalleFecha").textContent =
            formatearFecha(datos.fecha);

        const porcentaje = document.getElementById("detallePorcentaje");

        if (datos.nombre === "Sin identificación") {
            porcentaje.textContent = "Sin coincidencia exacta";
        } else {
            porcentaje.textContent =
                `${datos.porcentaje_coincidencia}% de coincidencia`;
        }

        if (!datos.respuestas.length) {
            respuestas.innerHTML =
                "<p>No hay respuestas registradas.</p>";
        } else {
            respuestas.innerHTML = datos.respuestas.map(item => `
                <div class="respuesta-item">
                    <strong>${escaparHTML(item.nombre_prueba)}</strong>
                    <span>${escaparHTML(item.resultado)}</span>
                </div>
            `).join("");
        }

    } catch (error) {
        respuestas.innerHTML = `
            <p class="historial-error">${escaparHTML(error.message)}</p>
        `;
    } finally {
        ocultarCarga();
    }
}

// Eliminar identificacion 
async function eliminarIdentificacion() {
    if (!identificacionSeleccionada) return;

    const confirmar = confirm(
        "¿Estás seguro de eliminar esta identificación? También se eliminarán todas sus respuestas. Esta acción no se puede deshacer."
    );

    if (!confirmar) return;

    const boton = document.getElementById("btnEliminarIdentificacion");
    boton.disabled = true;

    try {
        const response = await fetch(
            `${API_HISTORIAL}/cuestionarios/historial/${identificacionSeleccionada}/eliminar`,
            {
                method: "DELETE",
                credentials: "include"
            }
        );

        const datos = await response.json();

        if (!response.ok) {
            throw new Error(datos.detail || "No se pudo eliminar la identificación");
        }

        alert("La identificación se eliminó correctamente.");

        cerrarModal();
        identificacionSeleccionada = null;

        await cargarHistorial();

    } catch (error) {
        alert(error.message);
    } finally {
        boton.disabled = false;
    }
}

// Modificar identificacion
function modificarIdentificacion() {
    if (!identificacionSeleccionada) return;

    window.location.href =
        `/identificacion?editar=${identificacionSeleccionada}`;
}

// Fechas
function formatearFecha(fecha) {
    if (!fecha) return "--";
    const [year, month, day] = String(fecha).substring(0, 10).split("-");
    return `${day}/${month}/${year}`;
}

function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caracter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caracter]);
}

// Filtros
buscarHistorial.addEventListener("input", () => {
    mostrarHistorial(identificaciones);
});

filtroFecha.addEventListener("change", () => {
    mostrarHistorial(identificaciones);
});

document.getElementById("limpiarFiltros").addEventListener("click", () => {
    buscarHistorial.value = "";
    filtroFecha.value = "";
    mostrarHistorial(identificaciones);
});

// Botones del modal
document.getElementById("btnEliminarIdentificacion")
    .addEventListener("click", eliminarIdentificacion);

document.getElementById("btnModificarIdentificacion")
    .addEventListener("click", modificarIdentificacion);

// Cerrar modal
document.getElementById("cerrarModal").addEventListener("click", cerrarModal);
document.getElementById("modalDetalle").addEventListener("click", event => {
    if (event.target.id === "modalDetalle") {
        cerrarModal();
    }
});

function cerrarModal() {
    document.getElementById("modalDetalle").classList.remove("visible");
}
