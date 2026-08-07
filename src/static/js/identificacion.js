// ===============================
// ANIMACIONES
// ===============================
window.onload = function () {
    setTimeout(() => {
        document.getElementById("pantallaCarga").style.opacity = "0";
        setTimeout(() => {
            document.getElementById("pantallaCarga").style.display = "none";
            document.getElementById("contenido").style.display = "block";
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
        nombrePaso: "Gram", //nombre del paso que se mostrará en la barra de progreso
        titulo: "Tinción de Gram", //titulo que se mostrará en la parte superior de la tarjeta
        pregunta: "Selecciona el resultado obtenido.", //es la instrucción que se mostrará en la parte inferior del título
        conceptoDiccionario: "gram", //es el concepto que se usará para abrir el diccionario, si no se quiere usar diccionario, se puede dejar en blanco
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
        nombrePaso: "Forma",
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

    }

];

/*const estado = {
    pasoActual: 0,
    respuestaSeleccionada: null,
    repuestas: []
}; proximamente se usara estas variables para guardar las respuestas y el paso actual, pero por ahora se usara variables simples para simplificar el código.
*/

let pasoActual = 0;
let respuestaSeleccionada = null; //aquí se irá guardando la respuesta elegida
let respuestas = []; // de primeras es una lista vacia pero conforme el 
            // usuario elige opciones, aquí se guardarán todas las respuestas
const btnContinuar = document.querySelector(".continue"); //obtiene el botón Continuar

//const opciones = document.querySelectorAll(".option"); //busca todos los botones que tenga la clase option


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

    // Obtener el contenedor de los botones
    const contenedor = document.getElementById("contenedorOpciones");

    // Limpiar las opciones anteriores
    contenedor.innerHTML = "";

    // Crear cada botón de la prueba
    prueba.opciones.forEach(opcion => {

        const boton = document.createElement("button");

        boton.className = "option";

        boton.textContent = opcion.texto;

        boton.dataset.value = opcion.valor;

        // Evento cuando el usuario selecciona una opción
        boton.addEventListener("click", () => {

            // Quitar la selección anterior
            document.querySelectorAll(".option").forEach(btn => {
                btn.classList.remove("selected");
            });

            // Marcar la nueva selección
            boton.classList.add("selected");

            // Guardar la respuesta
            respuestaSeleccionada = opcion.valor;

            // Activar el botón Continuar
            btnContinuar.disabled = false;

        });

        // Agregar el botón al contenedor
        contenedor.appendChild(boton);

    });

}

function actualizarProgreso() {
    document.getElementById("pasoActual").textContent = pasoActual + 1;

    document.getElementById("totalPasos").textContent = pruebas.length;

    const porcentaje = ((pasoActual + 1) / pruebas.length) * 100;

    document.getElementById("progressFill").style.width = porcentaje + "%";
}

function actualizarBotones() {
    // aqui controlaremos los botones Atras y Continuar
    // dependiendo del paso actual.
}

function reiniciarSeleccion() {
    respuestaSeleccionada = null;
    btnContinuar.disabled = true;
}

function abrirDiccionario() {

}

// ===============================
// EVENTOS
// ===============================
btnContinuar.addEventListener("click", () => {
    if (pasoActual < pruebas.length - 1) {
        respuestas.push({
            paso: pasoActual,
            prueba: pruebas[pasoActual].titulo, //agrega un elemento al final del arreglo
            respuesta: respuestaSeleccionada
        });
        console.log(respuestas);
        pasoActual++;
        actualizarPantalla();
    } else {
        alert("Identificación finalizada.");
    }
});

// ===============================
// INICIALIZACIÓN
// ===============================
actualizarPantalla();