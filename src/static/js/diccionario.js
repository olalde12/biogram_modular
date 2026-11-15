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
        const todosResultados = [
            ...diccionario.pruebas.map(item => ({
                ...item,
                tipo: "prueba"
            })),

            ...diccionario.microorganismos.map(item => ({
                ...item,
                tipo: "microorganismo"
            })),

            ...diccionario.medios.map(item => ({
                ...item,
                tipo: "medio"
            }))
        ];

        //Coincidencias exactas
        const busqueda = texto.toLowerCase().trim();

        const principales = todosResultados.filter(item =>
            item.nombre.toLowerCase().trim().startsWith(busqueda)
        );

        // Resultados relacionados
        const relacionados = todosResultados.filter(item =>
            !principales.includes(item)
        );

        // Crear botones de resultados
        function crearResultado(item) {

            const resultado = document.createElement("button");
            resultado.className = "resultado-busqueda";
            resultado.textContent = item.nombre;

            resultado.addEventListener("click", () => {

                if (item.tipo === "prueba") {
                    mostrarFichaPrueba(item.id_prueba);

                } else if (item.tipo === "microorganismo") {
                    mostrarFichaMicro(item.id_microorganismo);

                } else if (item.tipo === "medio") {
                    mostrarFichaMedio(item.id_medio);
                }

            });

            return resultado;
        }

        // Mostrar coincidencia principal
        if (principales.length > 0) {

            const tituloPrincipal = document.createElement("h4");
            tituloPrincipal.textContent = "Coincidencia principal";

            resultados.appendChild(tituloPrincipal);

            principales.forEach(item => {
                resultados.appendChild(crearResultado(item));
            });
        }

        // Mostrar relacionados
        if (relacionados.length > 0) {

            const tituloRelacionados = document.createElement("h4");
            tituloRelacionados.textContent = "Conceptos relacionados";

            resultados.appendChild(tituloRelacionados);

            relacionados.forEach(item => {
                resultados.appendChild(crearResultado(item));
            });
        }

        // Cuando no hay resultados
        if (todosResultados.length === 0) {

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
