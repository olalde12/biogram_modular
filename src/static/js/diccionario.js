// Animación de carga
window.onload = function () {
    setTimeout(() => {
        document.getElementById("pantallaCargaDiccionario").style.opacity = "0";
        setTimeout(() => {
            document.getElementById("pantallaCargaDiccionario").style.display = "none";
            document.getElementById("contenidoDiccionario").style.display = "block";
        }, 800);
    }, 2000);
}

// Se hace un GET para traer información de la base de datos
let diccionario = []; 
async function cargarDiccionario(texto) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/buscar/${texto}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("No se pudo cargar el diccionario desde la API.");
        }

        const data = await response.json();
        diccionario = data;

    } catch (error) {
        console.error("Error al cargar el diccionario:", error);
    }
}

// Se traen los elementos necesarios desde el HTML
const buscador = document.getElementById("buscadorDiccionario");
const resultados = document.getElementById("resultadosDiccionario");
const ficha = document.getElementById("fichaDiccionario");
const fichaTitulo = document.getElementById("fichaTitulo");
const fichaDefinicion = document.getElementById("fichaDefinicion");
const fichaInterpretacion = document.getElementById("fichaInterpretacion");
const cerrarFicha = document.getElementById("cerrarFicha");
let tiempoBusqueda;

// Se bucan resultadps
buscador.addEventListener("input", async () => {
    clearTimeout(tiempoBusqueda);

    // Se valida que el buscador no este vacio
    const texto = buscador.value.trim();

    if (texto === "") {
        resultados.innerHTML = "";
        ficha.classList.remove("visible");
        return;
    }

    // Función para esperar un poco a que el usuario termine de escribir
    tiempoBusqueda = setTimeout(async () => {
        // Llamamos a la función que tiene el endpoint y enviamos el texto del usuario
        await cargarDiccionario(texto);
        resultados.innerHTML = "";
        const coincidencias = diccionario.pruebas.length + diccionario.microorganismos.length + diccionario.medios.length;

        // Se buscan resultados en la tabla de pruebas
        diccionario.pruebas.forEach(prueba => {
            // Se crean los botones para seleccionar un resultado
            const resultado = document.createElement("button");
            resultado.className = "resultado-busqueda";
            resultado.textContent = prueba.nombre;

            // Se llama a la funcion que muestra la ficha
            resultado.addEventListener("click", () => {
                resultado.classList.add("seleccionado");
                mostrarFichaPrueba(prueba.id_prueba);
            });
            resultados.appendChild(resultado);
        });

        // Se buscan resultados en la tabla de microorganismos
        diccionario.microorganismos.forEach(microorganismo => {
            // Se crean los botones para seleccionar un resultado
            const resultado = document.createElement("button");
            resultado.className = "resultado-busqueda";
            resultado.textContent = microorganismo.nombre;

            // Se llama a la funcion que muestra la ficha
            resultado.addEventListener("click", () => {
                resultado.classList.add("seleccionado");
                mostrarFichaMicro(microorganismo.id_microorganismo);
            });
            resultados.appendChild(resultado);
        });

        // Se buscan resultados en la tabla de medios
        diccionario.medios.forEach(medio => {
            // Se crean los botones para seleccionar un resultado
            const resultado = document.createElement("button");
            resultado.className = "resultado-busqueda";
            resultado.textContent = medio.nombre;

            // Se llama a la funcion que muestra la ficha
            resultado.addEventListener("click", () => {
                resultado.classList.add("seleccionado");
                mostrarFichaMedio(medio.id_medio);
            });
            resultados.appendChild(resultado);
        });

        // Cuando no se encuentren coincidencias se le hace saber al usuario por medio de un texto
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
    }, 400);
});

const interpretacion = document.getElementById("inter");    

// Función para mostrar la ficha (cuando hay resultados) y depende de en que tabla
function mostrarFichaPrueba(id) {
    const concepto = diccionario.pruebas.find(
        prueba => prueba.id_prueba === id
    );
    if (!concepto) return;

    fichaTitulo.textContent = concepto.nombre;
    fichaDefinicion.textContent =
        concepto.descripcion || "Información próximamente disponible.";

    interpretacion.style.display = "block";
    fichaInterpretacion.textContent =
        concepto.fundamento || "Información próximamente disponible.";

    resultados.style.display = "none";
    ficha.classList.add("visible");
}

function mostrarFichaMicro(id) {
    const concepto = diccionario.microorganismos.find(
        microorganismo => microorganismo.id_microorganismo === id
    );
    if (!concepto) return;

    fichaTitulo.textContent = concepto.nombre;
    fichaDefinicion.textContent =
        concepto.descripcion || "Información próximamente disponible.";

    interpretacion.style.display = "none";
    resultados.style.display = "none";
    ficha.classList.add("visible");
}

function mostrarFichaMedio(id) {
    const concepto = diccionario.medios.find(
        medio => medio.id_medio === id
    );
    if (!concepto) return;

    fichaTitulo.textContent = concepto.nombre;
    fichaDefinicion.textContent =
        concepto.descripcion || "Información próximamente disponible.";

    interpretacion.style.display = "block";
    fichaInterpretacion.textContent =
        concepto.procedimiento || "Información próximamente disponible.";

    resultados.style.display = "none";
    ficha.classList.add("visible");
}

// Funcion para cerrar ficha
cerrarFicha.addEventListener("click", () => {
    ficha.classList.remove("visible");
    resultados.style.display = "block";
});
