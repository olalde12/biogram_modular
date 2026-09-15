/* ==========================================================
   FORO BIOGRAM
   ========================================================== */


/* ==========================================================
   MODAL NUEVA PREGUNTA
   ========================================================== */

const btnNuevaPregunta = document.getElementById("btnNuevaPregunta");

const modalNuevaPregunta = document.getElementById("modalNuevaPregunta");

const cerrarNuevaPregunta = document.getElementById("cerrarNuevaPregunta");

const cancelarNuevaPregunta = document.getElementById("cancelarNuevaPregunta");


/* Abrir modal */

if (btnNuevaPregunta) {

    btnNuevaPregunta.addEventListener("click", () => {

        modalNuevaPregunta.classList.add("activo");

        document.body.style.overflow = "hidden";

        document.getElementById("tituloPregunta").focus();

    });

}


/* Cerrar modal con X */

if (cerrarNuevaPregunta) {

    cerrarNuevaPregunta.addEventListener("click", cerrarModalNuevaPregunta);

}


/* Cerrar modal con Cancelar */

if (cancelarNuevaPregunta) {

    cancelarNuevaPregunta.addEventListener("click", cerrarModalNuevaPregunta);

}


/* Función para cerrar */

function cerrarModalNuevaPregunta() {

    modalNuevaPregunta.classList.remove("activo");

    document.body.style.overflow = "";

}


/* ==========================================================
   CERRAR MODAL AL HACER CLICK EN EL FONDO
   ========================================================== */

if (modalNuevaPregunta) {

    modalNuevaPregunta.addEventListener("click", (evento) => {

        if (evento.target === modalNuevaPregunta) {

            cerrarModalNuevaPregunta();

        }

    });

}


/* ==========================================================
   CERRAR CON ESC
   ========================================================== */

document.addEventListener("keydown", (evento) => {

    if (evento.key === "Escape") {

        if (
            modalNuevaPregunta &&
            modalNuevaPregunta.classList.contains("activo")
        ) {

            cerrarModalNuevaPregunta();

        }

    }

});


/* ==========================================================
   CONTADOR DE CARACTERES
   ========================================================== */

const descripcionPregunta =
    document.getElementById("descripcionPregunta");

const contadorPregunta =
    document.getElementById("contadorPregunta");


if (descripcionPregunta) {

    descripcionPregunta.addEventListener("input", () => {

        contadorPregunta.textContent =
            descripcionPregunta.value.length;

    });

}


/* ==========================================================
   FORMULARIO NUEVA PREGUNTA
   ========================================================== */

const formNuevaPregunta =
    document.getElementById("formNuevaPregunta");


if (formNuevaPregunta) {

    formNuevaPregunta.addEventListener("submit", (evento) => {

        evento.preventDefault();

        /*
         * POR AHORA evitamos enviar el formulario.
         *
         * Aquí conectaremos posteriormente
         * con la ruta de FastAPI que ya tienes.
         */

        const titulo =
            document.getElementById("tituloPregunta").value;

        const categoria =
            document.getElementById("categoriaPregunta").value;

        const descripcion =
            document.getElementById("descripcionPregunta").value;


        console.log("Nueva pregunta:");

        console.log("Título:", titulo);

        console.log("Categoría:", categoria);

        console.log("Descripción:", descripcion);


        /*
         * Esta parte se sustituirá por el fetch()
         * que utilizará tu endpoint real.
         */

    });

}


/* ==========================================================
   ABRIR UNA PREGUNTA
   ========================================================== */

const tarjetasPregunta =
    document.querySelectorAll(".foro-card");


tarjetasPregunta.forEach((tarjeta) => {

    tarjeta.addEventListener("click", () => {

        const preguntaId =
            tarjeta.dataset.preguntaId;


        console.log(
            "Abrir pregunta:",
            preguntaId
        );


        /*
         * Aquí conectaremos la tarjeta con:
         *
         * /foro/pregunta/{id}
         *
         * cuando vea tu ruta real.
         */

    });


    /* También permitir abrir con Enter */

    tarjeta.addEventListener("keydown", (evento) => {

        if (evento.key === "Enter") {

            const preguntaId =
                tarjeta.dataset.preguntaId;


            console.log(
                "Abrir pregunta:",
                preguntaId
            );

        }

    });

});