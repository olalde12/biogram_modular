// Modal nueva pregunta
const btnNuevaPregunta = document.getElementById("btnNuevaPregunta");
const modalNuevaPregunta = document.getElementById("modalNuevaPregunta");
const cerrarNuevaPregunta = document.getElementById("cerrarNuevaPregunta");
const cancelarNuevaPregunta = document.getElementById("cancelarNuevaPregunta");

// Abri el modal
if (btnNuevaPregunta) {
    btnNuevaPregunta.addEventListener("click", () => {
        modalNuevaPregunta.classList.add("activo");
        document.body.style.overflow = "hidden";
        document.getElementById("tituloPregunta").focus();
    });
}

// Cerrar modal con "x"
if (cerrarNuevaPregunta) {
    cerrarNuevaPregunta.addEventListener("click", cerrarModalNuevaPregunta);
}

// Cerrar modal con "Cerrar"
if (cancelarNuevaPregunta) {
    cancelarNuevaPregunta.addEventListener("click", cerrarModalNuevaPregunta);
}

// Funcion para cerrar
function cerrarModalNuevaPregunta() {
    modalNuevaPregunta.classList.remove("activo");
    document.body.style.overflow = "";
}

// Cerrar haciendo clie en el fondo
if (modalNuevaPregunta) {
    modalNuevaPregunta.addEventListener("click", (evento) => {
        if (evento.target === modalNuevaPregunta) {
            cerrarModalNuevaPregunta();
        }
    });
}

// Cerrar con "Esc"
document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
        if (modalNuevaPregunta && modalNuevaPregunta.classList.contains("activo")) {
            cerrarModalNuevaPregunta();
        }
    }
});


// Contador para los caracteres
const descripcionPregunta = document.getElementById("descripcionPregunta");
const contadorPregunta = document.getElementById("contadorPregunta");
if (descripcionPregunta) {
    descripcionPregunta.addEventListener("input", () => {
        contadorPregunta.textContent = descripcionPregunta.value.length;
    });
}

// Obtenemos campos del HTML
const formNuevaPregunta = document.getElementById("formNuevaPregunta");
if (formNuevaPregunta) {
    formNuevaPregunta.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const titulo = document.getElementById("tituloPregunta").value;
        const categoria = document.getElementById("categoriaPregunta").value;
        const descripcion = document.getElementById("descripcionPregunta").value;
        nuevaPublicacion(titulo, categoria, descripcion);
    });
}

// Hacer POST a la base de datos
async function nuevaPublicacion(titulo, categoria, descripcion) {
    try {
        const data = {
            titulo: titulo,
            contenido: descripcion,
            categoria: categoria,
            id_usuario: parseInt(document.querySelector(".foro-pagina").dataset.usuario)
        };
        const response = await fetch("http://127.0.0.1:8000/publicaciones/create", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error en la respuesta:", errorData);
            return;
        } else {
            console.error("Hecho");
            titulo.value = "";
            cerrarModalNuevaPregunta();
            return;
        }
    } catch (error) {
        console.error("Error creando la publicación:", error);
    }
}

// Abrir una pregunta
const tarjetasPregunta = document.querySelectorAll(".foro-card");
tarjetasPregunta.forEach((tarjeta) => {
    tarjeta.addEventListener("click", () => {
        const preguntaId = tarjeta.dataset.preguntaId;
        console.log("Abrir pregunta:", preguntaId);
        /*
         * Aquí conectaremos la tarjeta con:
         *
         * /foro/pregunta/{id}
         *
         * cuando vea tu ruta real.
         */
    });

    // También permitir abrir con Enter 
    tarjeta.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter") {
            const preguntaId = tarjeta.dataset.preguntaId;
            console.log("Abrir pregunta:", preguntaId);
        }
    });
});

// Estructura de la publicacion
async function cargarPublicaciones(publicaciones) {
  const contenedor = document.getElementById("foro"); 
  contenedor.innerHTML = "";
  publicaciones.forEach(pub => {
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

// Cargar publicaciones desde la base de datos
async function cargar() {
    const response = await fetch("/publicaciones");
    const data = await response.json();
    cargarPublicaciones(data);
}

document.addEventListener("DOMContentLoaded", () => {
    cargar();
});

// Filtrar por categorias
document.querySelectorAll(".categoria-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    // Quitar clase activa de todos
    document.querySelectorAll(".categoria-btn").forEach(b => b.classList.remove("categoria-activa"));
    btn.classList.add("categoria-activa");
    const categoria = btn.dataset.categoria;
    // Construir la URL
    let url = "/publicaciones";
    if (categoria !== "todas") {
      url = `/publicaciones/categoria/${categoria}`;
    }
    // Hacer fetch al backend
    fetch(url).then(res => res.json()).then(data => {
        cargarPublicaciones(data);
      })
      .catch(err => console.error("Error cargando publicaciones:", err));
  });
});
