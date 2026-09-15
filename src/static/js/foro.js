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
async function cargarPublicaciones() {
  const response = await fetch("/publicaciones");
  const data = await response.json();
  console.log(data);

  const contenedor = document.getElementById("foro"); 
  contenedor.innerHTML = "";

  data.forEach(pub => {
    const article = document.createElement("article");
    article.classList.add("foro-card");

    article.innerHTML = `
      <div class="foro-card-contenido">
        <div class="foro-card-categoria">
          <i class="fa-solid fa-bacterium"></i>
          ${pub.categoria}
        </div>
        <h3>${pub.titulo}</h3>
        <p class="foro-card-descripcion">${pub.contenido}</p>
        <div class="foro-card-etiquetas">
        </div>
      </div>
      <div class="foro-card-footer">
        <div class="foro-autor">
          <div class="foro-avatar">
            <img src="${pub.avatar || 'default.png'}" alt="Avatar">
          </div>
          <div>
            <strong>${pub.autor.charAt(0).toUpperCase() + pub.autor.slice(1)}</strong>
            <span>${pub.fecha_creacion}</span>
          </div>
        </div>
        <div class="foro-respuestas">
          <i class="fa-regular fa-comment"></i>
          <span>${pub.respuestas} respuestas</span>
        </div>
      </div>
    `;

    contenedor.appendChild(article);
  });
}

document.addEventListener("DOMContentLoaded", () => {
    cargarPublicaciones();
});
