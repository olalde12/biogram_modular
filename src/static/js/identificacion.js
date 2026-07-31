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
        nombrePaso: "Gram",
        titulo: "Tinción de Gram",
        pregunta: "Selecciona el resultado obtenido.",
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
        nombrePaso: "Forma",
        titulo: "Forma bacteriana",
        pregunta: "¿Qué morfología presenta la bacteria?",
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

let pasoActual = 0;
let respuestaSeleccionada = null; //aquí se irá guardando la respuesta elegida
const btnContinuar = document.querySelector(".continue"); //obtiene el botón Continuar

//const opciones = document.querySelectorAll(".option"); //busca todos los botones que tenga la clase option


// ===============================
// FUNCIONES
// ===============================

function actualizarProgreso() {
    document.getElementById("pasoActual").textContent = pasoActual + 1;

    document.getElementById("totalPasos").textContent = pruebas.length;

    const porcentaje = ((pasoActual + 1) / pruebas.length) * 100;

    document.getElementById("progressFill").style.width = porcentaje + "%";
}


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

    // Desactivar el botón Continuar
    btnContinuar.disabled = true;

    // Reiniciar la respuesta seleccionada
    respuestaSeleccionada = null;

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

function reiniciarSeleccion() {

}
function abrirDiccionario() {

}

// ===============================
// EVENTOS
// ===============================
btnContinuar.addEventListener("click", () => {
    pasoActual++;
    if (pasoActual < pruebas.length) {
        mostrarPrueba();
    } else {
        alert("Identificación finalizada.");
    }
});

// ===============================
// INICIALIZACIÓN
// ===============================
mostrarPrueba();