

// ============================================
// ESCÁNER BIOGRAM IA
// Navegación, sesión y registro de pruebas
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // 1. ELEMENTOS DEL HTML
    // ========================================

    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");

    const pantallaInicio = document.getElementById("pantalla-inicio");
    const pantallaPreparacion = document.getElementById("pantalla-preparacion");
    const pantallaCaptura = document.getElementById("pantalla-captura");

    const botonIniciar = document.getElementById("btn-iniciar-escaner");
    const botonRegresar = document.getElementById("btn-regresar-escaner");
    const botonContinuar = document.getElementById("btn-continuar-escaner");
    const botonRegresarPreparacion = document.getElementById("btn-regresar-preparacion");

    const numeroPrueba = document.getElementById("numero-prueba");


    // ========================================
    // 2. SIDEBAR
    // ========================================

    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", function () {
            sidebar.classList.toggle("open");
        });
    }


    // ========================================
    // 3. DATOS DE LA SESIÓN
    // ========================================

    let sesionEscaner = null;

    /*
        La sesión contiene:
        - id: identificador único.
        - estado: situación actual.
        - fechaInicio: momento en que comenzó.
        - pruebas: pruebas registradas.
        - resultadoFinal: resultado general del análisis.
    */

    function crearSesion() {

        const identificador = window.crypto?.randomUUID
            ? window.crypto.randomUUID()
            : "sesion-" + Date.now();

        sesionEscaner = {
            id: identificador,
            estado: "en_proceso",
            fechaInicio: new Date().toISOString(),
            pruebas: [],
            resultadoFinal: null
        };

        console.log("Sesión BIOGRAM iniciada:", sesionEscaner.id);

        renderizarHistorial();

    }


    // ========================================
    // 4. REGISTRO DE UNA PRUEBA
    // ========================================

    function registrarPrueba(datos) {

        if (!sesionEscaner) {
            console.error("No existe una sesión activa.");
            return false;
        }

        if (!datos || !datos.tipo || !datos.resultado) {
            console.error("Faltan datos para registrar la prueba.");
            return false;
        }

        const nuevaPrueba = {
            numero: sesionEscaner.pruebas.length + 1,
            tipo: datos.tipo,
            resultado: datos.resultado,
            observaciones: datos.observaciones || "",
            fotografia: datos.fotografia || null,
            fecha: new Date().toISOString()
        };

        sesionEscaner.pruebas.push(nuevaPrueba);

        //Actualizamos el contador de pruebas
        renderizarHistorial();

        console.log("Prueba registrada:", nuevaPrueba);

        return nuevaPrueba;

    }


    // ========================================
    // 5. ACTUALIZAR EL CONTADOR
    // ========================================

    function actualizarNumeroPrueba() {

        if (!sesionEscaner || !numeroPrueba) {
            return;
        }

        const siguienteNumero = sesionEscaner.pruebas.length + 1;

        numeroPrueba.textContent = String(siguienteNumero).padStart(2, "0");

    }

    // ========================================
    // 5.1. MOSTRAR HISTORIAL DE PRUEBAS
    // ========================================

    function renderizarHistorial() {

        const listaHistorial = document.getElementById("lista-historial-pruebas");
        const totalPruebas = document.getElementById("total-pruebas");

        if (!listaHistorial || !totalPruebas) {
            return;
        }

        // Obtener las pruebas de la sesión
        const pruebas = obtenerPruebas();

        // Actualizar el total
        totalPruebas.textContent = pruebas.length;

        // Limpiar el contenido anterior
        listaHistorial.innerHTML = "";

        // Mostrar mensaje si todavía no hay pruebas
        if (pruebas.length === 0) {

            const mensajeVacio = document.createElement("div");
            mensajeVacio.className = "historial-vacio";

            const icono = document.createElement("div");
            icono.className = "historial-vacio-icono";

            const iconoFlask = document.createElement("i");
            iconoFlask.className = "fa-solid fa-flask";

            icono.appendChild(iconoFlask);

            const titulo = document.createElement("h4");
            titulo.textContent = "Aún no hay pruebas registradas";

            const descripcion = document.createElement("p");
            descripcion.textContent =
                "Cuando se capture y analice tu primer tubo, aparecerá aquí su información.";

            mensajeVacio.append(icono, titulo, descripcion);
            listaHistorial.appendChild(mensajeVacio);

            return;
        }

        // Crear una tarjeta por cada prueba
        pruebas.forEach(function (prueba) {

            const tarjeta = document.createElement("div");
            tarjeta.className = "historial-tarjeta";

            // Número de tubo
            const numero = document.createElement("div");
            numero.className = "historial-numero";
            numero.textContent = String(prueba.numero).padStart(2, "0");

            // Información de la prueba
            const detalles = document.createElement("div");
            detalles.className = "historial-detalles";

            const tipo = document.createElement("h4");
            tipo.textContent = prueba.tipo;

            const observaciones = document.createElement("p");
            observaciones.textContent = prueba.observaciones || "Sin observaciones.";

            detalles.append(tipo, observaciones);

            // Resultado
            const resultado = document.createElement("span");
            resultado.className = "historial-resultado";
            resultado.textContent = prueba.resultado;

            tarjeta.append(numero, detalles, resultado);

            // Fotografía, únicamente si existe una imagen válida
            if (
                typeof prueba.fotografia === "string" &&
                /^https?:\/\//i.test(prueba.fotografia) ||
                typeof prueba.fotografia === "string" &&
                /^data:image\//i.test(prueba.fotografia)
            ) {

                const fotografia = document.createElement("img");
                fotografia.className = "historial-fotografia";
                fotografia.src = prueba.fotografia;
                fotografia.alt = "Fotografía de la prueba " + prueba.numero;

                tarjeta.appendChild(fotografia);
            }

            listaHistorial.appendChild(tarjeta);

        });

    }

    // ========================================
    // 6. CONSULTAR LAS PRUEBAS REGISTRADAS
    // ========================================

    function obtenerPruebas() {

        if (!sesionEscaner) {
            return [];
        }

        return sesionEscaner.pruebas;

    }


    // ========================================
    // 7. NAVEGACIÓN ENTRE PANTALLAS
    // ========================================

    function subirPantalla() {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    // INICIO → PREPARACIÓN

    if (botonIniciar) {

        botonIniciar.addEventListener("click", function () {

            // Crear sesión únicamente si todavía no existe
            if (!sesionEscaner) {
                crearSesion();
            }

            pantallaInicio.hidden = true;
            pantallaPreparacion.hidden = false;
            pantallaCaptura.hidden = true;

            actualizarNumeroPrueba();
            subirPantalla();

        });

    }


    // PREPARACIÓN → INICIO

    if (botonRegresar) {

        botonRegresar.addEventListener("click", function () {

            pantallaPreparacion.hidden = true;
            pantallaCaptura.hidden = true;
            pantallaInicio.hidden = false;

            subirPantalla();

        });

    }


    // PREPARACIÓN → CAPTURA

    if (botonContinuar) {

        botonContinuar.addEventListener("click", function () {

            pantallaInicio.hidden = true;
            pantallaPreparacion.hidden = true;
            pantallaCaptura.hidden = false;

            actualizarNumeroPrueba();
            subirPantalla();

        });

    }


    // CAPTURA → PREPARACIÓN

    if (botonRegresarPreparacion) {

        botonRegresarPreparacion.addEventListener("click", function () {

            pantallaCaptura.hidden = true;
            pantallaPreparacion.hidden = false;
            pantallaInicio.hidden = true;

            subirPantalla();

        });

    }


    // ========================================
    // 8. FUNCIONES DISPONIBLES PARA INTEGRACIÓN
    // ========================================

    /*
        Permitirá que posteriormente podamos
        registrar la respuesta recibida del backend
        y consultar los datos desde otras funciones.
    */

    window.BIOGRAM_ESCANER = {

        obtenerSesion: function () {
            return sesionEscaner;
        },

        obtenerPruebas: obtenerPruebas,

        registrarPrueba: registrarPrueba

    };

});