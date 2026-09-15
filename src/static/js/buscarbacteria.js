// Animacion de carga
window.onload = function () {
    setTimeout(() => {
        const pantallaCarga =
            document.getElementById("pantallaCargaBacteria");
        if (pantallaCarga) {
            pantallaCarga.style.opacity = "0";
            setTimeout(() => {
                pantallaCarga.style.display = "none";
                const contenido =
                    document.getElementById("contenidoBacterias");
                if (contenido) {
                    contenido.style.display = "block";
                }
            }, 800);
        }
    }, 2000);
};

// Sidebar
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });
}

let microorganismos = [];
let pruebas = [];

// Obtener elementos
const buscador = document.getElementById("buscadorBacteria");
const resultados = document.getElementById("resultadosBacterias");
const cerrarFichaBacteria = document.getElementById("cerrarFichaBacteria");

// Cargar microorganismos
async function cargarMicroorganismos() {
    try {
        const response = await fetch("http://127.0.0.1:8000/microorganismos/");

        if (!response.ok) {
            throw new Error("No se pudieron cargar los microorganismos.");
        }

        microorganismos = await response.json();

        console.log("Microorganismos cargados:", microorganismos);

    } catch (error) {
        console.error("Error al cargar microorganismos:", error);
    }
}

// Cargar pruebas
async function cargarPruebas() {
    try {
        const response = await fetch("http://127.0.0.1:8000/pruebas/");

        if (!response.ok) {
            throw new Error("No se pudieron cargar las pruebas.");
        }

        pruebas = await response.json();

        console.log("Pruebas cargadas:", pruebas);

    } catch (error) {
        console.error("Error al cargar pruebas:", error);
    }
}

// Iniciar pagina
async function iniciarPagina() {
    try {
        // Cargar microorganismos y pruebas al mismo tiempo
        await Promise.all([cargarMicroorganismos(), cargarPruebas()]);

        console.log("Datos cargados correctamente.");

    } catch (error) {
        console.error("Error al iniciar la página:", error);
    }
}

iniciarPagina();

// Buscador
if (buscador) {
    buscador.addEventListener("input", () => {
        const texto = buscador.value.trim().toLowerCase();

        resultados.innerHTML = "";

        // Si no escribió nada
        if (texto === "") {
            return;
        }

        // Buscar microorganismos
        microorganismos.forEach(microorganismo => {
            const nombre =
                microorganismo.nombre
                    ? microorganismo.nombre.toLowerCase()
                    : "";

            if (nombre.includes(texto)) {
                const resultado = document.createElement("button");
                resultado.className = "resultado-bacteria";
                resultado.textContent = microorganismo.nombre;

                // Mostrar la ficha al hacer clic
                resultado.addEventListener("click", () => {
                    mostrarBacteria(microorganismo.id_microorganismo);
                });

                resultados.appendChild(resultado);
            }
        });
    });
}

// Mostrar ficha de microorganismo
function mostrarBacteria(id) {
    // Buscar el microorganismo por su ID
    const bacteria = microorganismos.find(microorganismo => microorganismo.id_microorganismo === id);

    // Verificar que exista
    if (!bacteria) {
        console.error("No se encontró la bacteria:", id);
        return;
    }

    console.log("Bacteria seleccionada:", bacteria);

    // Obtener elementos de la ficha
    const ficha = document.getElementById("fichaBacteria");
    const nombre = document.getElementById("fichaNombreBacteria");
    const descripcion = document.getElementById("fichaBacteriaDescripcion");
    const caracteristicas = document.getElementById("caracteristicasBacteria");
    const contenedorPruebas = document.getElementById("pruebasBacteria");

    // Informacion principal
    nombre.textContent = bacteria.nombre || "Sin nombre";
    // descripcion.textContent = bacteria.descripcion || "Información próximamente disponible.";

    // Caracteristicas
    caracteristicas.innerHTML = "";

    // Gram
    if (bacteria.gram) {
        const dato = document.createElement("div");
        dato.className = "dato-bacteria";
        dato.innerHTML = `
            <strong>Gram</strong>
            <span class="dato-valor">
                ${bacteria.gram}
            </span>
        `;

        caracteristicas.appendChild(dato);
    }

    // Forma
    if (bacteria.forma) {
        const dato = document.createElement("div");
        dato.className = "dato-bacteria";
        dato.innerHTML = `
            <strong>Forma</strong>
            <span class="dato-valor">
                ${bacteria.forma}
            </span>
        `;

        caracteristicas.appendChild(dato);
    }

    // Tipo
    if (bacteria.tipo) {
        const dato = document.createElement("div");
        dato.className = "dato-bacteria";
        dato.innerHTML = `
            <strong>Tipo</strong>
            <span class="dato-valor">
                ${bacteria.tipo}
            </span>
        `;

        caracteristicas.appendChild(dato);
    }

    // Si no existen características
    if (caracteristicas.children.length === 0) {
        caracteristicas.innerHTML = `
            <p>
                Información próximamente disponible.
            </p>
        `;
    }

// Pruebas bioquimicas
contenedorPruebas.innerHTML = "";
if (bacteria.res_prueba_micro && Array.isArray(bacteria.res_prueba_micro)) {
    // Agrupar resultados por prueba
    const pruebasAgrupadas = {};
    bacteria.res_prueba_micro.forEach(resultadoMicro => {
        const idPrueba = resultadoMicro.id_prueba;

        // Crear grupo si todavía no existe
        if (!pruebasAgrupadas[idPrueba]) {
            pruebasAgrupadas[idPrueba] = [];
        }

        // Buscar la prueba
        const prueba = pruebas.find(prueba => prueba.id_prueba === idPrueba);

        if (!prueba) {
            return;
        }

        // Buscar la opción correspondiente
        const opcion = prueba.opc_prueba?.find(opcion => opcion.id_opcion_prueba === resultadoMicro.id_opcion);

        if (opcion) {
            pruebasAgrupadas[idPrueba].push(opcion.nombre_resultado);
        }
    });

    // Mostrar las pruebas agrupadas
    Object.entries(pruebasAgrupadas).forEach(
        ([idPrueba, resultados]) => {
            // Buscar nuevamente la prueba
            const prueba = pruebas.find(prueba => prueba.id_prueba === Number(idPrueba)) || pruebas.find(prueba => prueba.id_prueba === idPrueba);
            if (!prueba) {
                return;
            }

            const dato = document.createElement("div");
            dato.className = "dato-bacteria";

            // Eliminar resultados repetidos
            const resultadosUnicos =
                [...new Set(resultados)];

            // Unir los resultados
            const resultadoTexto =
                resultadosUnicos.join(" / ");

            dato.innerHTML = `
                <strong>
                    ${prueba.nombre}
                </strong>

                <span class="dato-valor">
                    ${resultadoTexto}
                </span>
            `;

            contenedorPruebas.appendChild(dato);
        }
    );
}

// Si no tiene pruebas registradas
if (contenedorPruebas.children.length === 0) {
    contenedorPruebas.innerHTML = `
        <p>
            No hay pruebas bioquímicas registradas.
        </p>
    `;
}
    // Mostrar ficha
    resultados.style.display = "none";
    ficha.classList.add("visible");
}

// Formatear nombres
function formatearNombre(texto) {
    return texto.replace(/_/g, " ").replace(/\b\w/g, letra => letra.toUpperCase());
}

// Cerrar ficha
if (cerrarFichaBacteria) {
    cerrarFichaBacteria.addEventListener("click", () => {
        const ficha = document.getElementById("fichaBacteria");
        ficha.classList.remove("visible");
        resultados.style.display = "block";
        }
    );
}
