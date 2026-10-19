document.addEventListener("DOMContentLoaded", () => {
    // Elementos del HTML
    const contenedorForo = document.getElementById("foro");

    // Modal para crear una pregunta
    const modalNuevaPregunta = document.getElementById("modalNuevaPregunta");
    const btnNuevaPregunta = document.getElementById("btnNuevaPregunta");
    const cerrarNuevaPregunta = document.getElementById("cerrarNuevaPregunta");
    const cancelarNuevaPregunta = document.getElementById("cancelarNuevaPregunta");
    const formNuevaPregunta = document.getElementById("formNuevaPregunta");

    // Campos de la pregunta nueva
    const tituloPregunta = document.getElementById("tituloPregunta");
    const categoriaPregunta = document.getElementById("categoriaPregunta");
    const descripcionPregunta = document.getElementById("descripcionPregunta");
    const contadorPregunta = document.getElementById("contadorPregunta");

    // Modal para ver una publicación
    const modalPublicacion = document.getElementById("modalPublicacion");
    const cerrarPublicacion = document.getElementById("cerrarPublicacion");
    const publicacionTitulo = document.getElementById("publicacionTitulo");
    const publicacionAutor = document.getElementById("publicacionAutor");
    const publicacionCategoria = document.getElementById("publicacionCategoria");
    const publicacionDescripcion = document.getElementById("publicacionDescripcion");

    // Acciones de la publicación
    const btnMeGusta = document.getElementById("btnMeGusta");
    const textoMeGusta = document.getElementById("textoMeGusta");
    const cantidadMeGusta = document.getElementById("cantidadMeGusta");
    const accionesPublicacionPropia = document.getElementById("accionesPublicacionPropia");
    const btnEditarPublicacion = document.getElementById("btnEditarPublicacion");
    const btnEliminarPublicacion = document.getElementById("btnEliminarPublicacion");

    // Comentarios
    const formComentario = document.getElementById("formComentario");
    const textoComentario = document.getElementById("textoComentario");
    const listaComentarios = document.getElementById("listaComentarios");
    const cantidadComentarios = document.getElementById("cantidadComentarios");

    // Modal de confirmacion de eliminacion
    const modalConfirmarEliminar = document.getElementById("modalEliminar");
    const cancelarEliminar = document.getElementById("cancelarEliminar");
    const confirmarEliminar = document.getElementById("confirmarEliminar");

    // Modal para editar una publicacion
    const modalEditarPublicacion = document.getElementById("modalEditarPublicacion");
    const formEditarPublicacion = document.getElementById("formEditarPublicacion");
    const editarTitulo = document.getElementById("editarTitulo");
    const editarCategoria = document.getElementById("editarCategoria");
    const editarDescripcion = document.getElementById("editarDescripcion");
    const cerrarModalEditar = document.getElementById("cerrarModalEditar");
    const cancelarModalEditar = document.getElementById("cancelarModalEditar");

    // Contenedor de los avisos personalizados
    const foroNotificaciones = document.getElementById("foroNotificaciones");

    // ======================================================
    // 2. ESTADO TEMPORAL DEL FRONTEND
    // ======================================================

    // Tarjeta que está abierta actualmente.
    let tarjetaActual = null;

    // Tarjeta que se eliminará si se confirma la acción.
    let tarjetaPendienteEliminar = null;

    // Comentarios organizados por identificador de publicación.
    const comentarios = new Map();

    // Datos temporales de reacciones.
    const reacciones = new Map();

    // Nombre de ejemplo mientras no conectemos la sesión real.
    const usuarioActual = "Hannia";

    // Convierte un texto a una versión segura para usar como texto.
    // Para mostrar texto usamos textContent, no HTML del usuario.
    function obtenerTexto(elemento, selector) {
        const encontrado = elemento.querySelector(selector);
        return encontrado ? encontrado.textContent.trim() : "";
    }

    // Obtiene el ID de la tarjeta.
    function obtenerId(tarjeta) {
        return tarjeta?.dataset.preguntaId || null;
    }

    // Comprueba si una publicación está marcada como propia.
    function esPropia(tarjeta) {
        return tarjeta.dataset.propio === "true";
    }

    // Abre un modal usando la clase que ya utiliza tu proyecto.
    function abrirModal(modal) {
        if (!modal) return;

        modal.classList.add("activo");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    // Cierra un modal y libera el desplazamiento si no queda otro abierto.
    function cerrarModal(modal) {
        if (!modal) return;

        modal.classList.remove("activo");
        modal.setAttribute("aria-hidden", "true");

        const quedaModalAbierto = document.querySelector(
            ".modal-foro.activo"
        );

        if (!quedaModalAbierto) {
            document.body.style.overflow = "";
        }
    }

    // ======================================================
    // NOTIFICACIONES PERSONALIZADAS
    // ======================================================

    function mostrarNotificacion(mensaje, tipo = "exito", titulo = "") {
        // Si el contenedor no existe, no hacemos nada
        if (!foroNotificaciones) return;
        const notificacion = document.createElement("div");
        notificacion.className = `foro-notificacion ${tipo}`;

        // Icono según el tipo de mensaje
        const icono = document.createElement("div");
        icono.className = "foro-notificacion-icono";
        const elementoIcono = document.createElement("i");

        if (tipo === "error") {
            elementoIcono.className = "fa-solid fa-circle-exclamation";
        } else if (tipo === "info") {
            elementoIcono.className = "fa-solid fa-circle-info";
        } else {
            elementoIcono.className = "fa-solid fa-check";
        }

        icono.appendChild(elementoIcono);

        // Título y descripción del aviso.
        const contenido = document.createElement("div");
        contenido.className = "foro-notificacion-contenido";

        const encabezado = document.createElement("strong");
        encabezado.textContent = titulo || (
            tipo === "error"
                ? "Revisa los datos"
                : tipo === "info"
                    ? "Información"
                    : "¡Listo!"
        );

        const texto = document.createElement("p");
        texto.textContent = mensaje;

        contenido.append(encabezado, texto);

        // Boton para cerrar el aviso manualmenten
        const botonCerrar = document.createElement("button");
        botonCerrar.type = "button";
        botonCerrar.className = "foro-notificacion-cerrar";
        botonCerrar.setAttribute("aria-label", "Cerrar notificación");
        botonCerrar.innerHTML = '<i class="fa-solid fa-xmark"></i>';

        botonCerrar.addEventListener("click", () => {
            notificacion.remove();
        });

        notificacion.append(icono, contenido, botonCerrar);
        foroNotificaciones.appendChild(notificacion);

        // El aviso desaparece automáticamente después de 4 segundos
        setTimeout(() => {
            if (!notificacion.isConnected) return;
            notificacion.style.animation = "desaparecerNotificacion 0.25s ease forwards";
            setTimeout(() => {
                notificacion.remove();
            }, 250);
        }, 4000);
    }

    // Modal para nueva pregunta
    if (btnNuevaPregunta) {
        btnNuevaPregunta.addEventListener("click", () => {
            abrirModal(modalNuevaPregunta);
            if (tituloPregunta) {
                tituloPregunta.focus();
            }
        });
    }

    if (cerrarNuevaPregunta) {
        cerrarNuevaPregunta.addEventListener("click", () => {
            cerrarModal(modalNuevaPregunta);
        });
    }

    if (cancelarNuevaPregunta) {
        cancelarNuevaPregunta.addEventListener("click", () => {
            cerrarModal(modalNuevaPregunta);
        });
    }

    // Cerrar el modal al pulsar en su fondo.
    if (modalNuevaPregunta) {
        modalNuevaPregunta.addEventListener("click", (evento) => {
            if (evento.target === modalNuevaPregunta) {
                cerrarModal(modalNuevaPregunta);
            }
        });
    }

    // Contador de caracteres de la descripcion
    if (descripcionPregunta && contadorPregunta) {
        descripcionPregunta.addEventListener("input", () => {
            contadorPregunta.textContent =
                descripcionPregunta.value.length;
        });
    }

    // ======================================================
    // 5. CREAR UNA TARJETA DE PUBLICACIÓN
    // ======================================================

    
function crearTarjeta(datos) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "foro-card";

    // ID real del autor de la publicación.
    tarjeta.dataset.usuarioId = String(datos.id_usuario);

    tarjeta.tabIndex = 0;

    // Identificador de la publicación.
    tarjeta.dataset.preguntaId = String(datos.id_publicacion);

    tarjeta.dataset.likes = String(Number(datos.likes) || 0);
    tarjeta.dataset.liked = "false";


        // Contenido principal.
        const contenido = document.createElement("div");
        contenido.className = "foro-card-contenido";

        const categoria = document.createElement("div");
        categoria.className = "foro-card-categoria";
        categoria.dataset.categoria = datos.categoria || "General";

        const iconoCategoria = document.createElement("i");
        iconoCategoria.className = "fa-solid fa-bacterium";

        categoria.appendChild(iconoCategoria);
        categoria.appendChild(
            document.createTextNode(" " + (datos.categoria || "General"))
        );

        const titulo = document.createElement("h3");
        titulo.textContent = datos.titulo || "Pregunta sin título";

        const descripcion = document.createElement("p");
        descripcion.className = "foro-card-descripcion";
        descripcion.textContent = datos.contenido || datos.descripcion || "";

        const etiquetas = document.createElement("div");
        etiquetas.className = "foro-card-etiquetas";

        contenido.append(categoria, titulo, descripcion, etiquetas);

        // Pie de tarjeta: autor, avatar y fecha.
        const footer = document.createElement("div");
        footer.className = "foro-card-footer";

        const autorContenedor = document.createElement("div");
        autorContenedor.className = "foro-autor";

        const avatar = document.createElement("div");
        avatar.className = "foro-avatar";

        const nombreAutor = datos.autor || "Usuario";

        // Detectar la imagen de perfil del usuario.
        const urlAvatar =
            datos.avatar ||
            datos.foto_perfil ||
            datos.imagen_perfil ||
            datos.foto ||
            datos.imagen ||
            "";

        if (urlAvatar) {
            const imagen = document.createElement("img");

            imagen.src = urlAvatar;
            imagen.alt = `Avatar de ${nombreAutor}`;
            imagen.className = "foro-avatar-imagen";

            imagen.onerror = () => {
                imagen.remove();
                avatar.textContent = nombreAutor.charAt(0).toUpperCase();
            };

            avatar.appendChild(imagen);
        } else {
            // Si no tiene foto, mostrar la inicial.
            avatar.textContent = nombreAutor.charAt(0).toUpperCase();
        }

        const datosAutor = document.createElement("div");

        const nombre = document.createElement("strong");
        nombre.textContent = datos.autor.charAt(0).toUpperCase() + datos.autor.slice(1) || "Usuario";

        const fecha = document.createElement("span");
        fecha.textContent = datos.fecha_creacion || datos.fecha || "Ahora";

        datosAutor.append(nombre, fecha);
        autorContenedor.append(avatar, datosAutor);

        // Contenedor de las estadísticas de la publicación.
        const estadisticas = document.createElement("div");
        estadisticas.className = "foro-card-estadisticas";

        // Corazón y cantidad de Me gusta.
        const meGustaTarjeta = document.createElement("div");
        meGustaTarjeta.className = "foro-me-gusta-tarjeta";

        const iconoCorazon = document.createElement("i");
        iconoCorazon.className = "fa-regular fa-heart";

        const cantidadLikesTarjeta = document.createElement("span");
        cantidadLikesTarjeta.className = "cantidad-likes-tarjeta";
        cantidadLikesTarjeta.textContent = String(Number(datos.likes) || 0);

        meGustaTarjeta.append(iconoCorazon, cantidadLikesTarjeta);

        // Contador de comentarios o respuestas.
        const respuestas = document.createElement("div");
        respuestas.className = "foro-respuestas";

        const iconoComentario = document.createElement("i");
        iconoComentario.className = "fa-regular fa-comment";

        const textoRespuestas = document.createElement("span");
        textoRespuestas.textContent =
            `${Number(datos.respuestas) || 0} respuestas`;

        respuestas.append(iconoComentario, textoRespuestas);

        // Juntamos las estadísticas y las colocamos en el pie.
        estadisticas.append(meGustaTarjeta, respuestas);
        footer.append(autorContenedor, estadisticas);

        tarjeta.append(contenido, footer);

        return tarjeta;
    }

    // Cargar publicaciones
    // Estructura de la publicacion
    async function cargarPublicaciones(publicaciones, orden = "recientes") {
        const contenedor = document.getElementById("foro"); 
        contenedor.innerHTML = "";
        const ordenadas = [...publicaciones];
        switch (orden) {
        case "recientes":
            ordenadas.sort((a, b) =>
                new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
            );
            break;

        case "antiguas":
            ordenadas.sort((a, b) =>
                new Date(a.fecha_creacion) - new Date(b.fecha_creacion)
            );
            break;

        case "likes":
            ordenadas.sort((a, b) =>
                (Number(b.likes) || 0) - (Number(a.likes) || 0)
            );
            break;

        case "respuestas":
            ordenadas.sort((a, b) =>
                (Number(b.respuestas) || 0) - (Number(a.respuestas) || 0)
            );
            break;
    }
        ordenadas.forEach(pub => {
            const article = crearTarjeta(pub);
            contenedor.appendChild(article);
        });
    }

    // Cargar publicaciones desde la base de datos
    let ordenActual = "recientes";
    let categoriaActual = "todas";
    let textoBusqueda = "";
    let publicacionesActuales = [];
    async function cargar() {
    try {
        let url = "/publicaciones";

        if (categoriaActual !== "todas") {
            url = `/publicaciones/categoria/${encodeURIComponent(categoriaActual)}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Error al cargar las publicaciones");
        }

        publicacionesActuales = await response.json();

        mostrarPublicacionesFiltradas();

    } catch (error) {
        console.error("Error cargando publicaciones:", error);
    }
}


function mostrarPublicacionesFiltradas() {
    const normalizar = texto =>
        (texto || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

    const busqueda = normalizar(textoBusqueda);

    const resultados = publicacionesActuales.filter(pub => {
        const titulo = normalizar(pub.titulo);
        const contenido = normalizar(pub.contenido);

        return titulo.includes(busqueda) ||
               contenido.includes(busqueda);
    });

    const contenedor = document.getElementById("foro");

    // Si no hay resultados, mostrar un mensaje.
    if (resultados.length === 0) {
        contenedor.innerHTML = `
            <div class="foro-sin-resultados">
                <i class="fa-solid fa-magnifying-glass"></i>
                <h3>No se encontraron publicaciones relacionadas con tu búsqueda</h3>
                <p>Intenta buscar con otras palabras.</p>
            </div>
        `;
        return;
    }

    // Si hay resultados, mostrar las tarjetas normalmente.
    cargarPublicaciones(resultados, ordenActual);
}

const inputBusqueda = document.getElementById("buscarPregunta");

inputBusqueda.addEventListener("input", () => {
    textoBusqueda = inputBusqueda.value.trim();
    mostrarPublicacionesFiltradas();
});

    cargar();

    // Filtrar por categorias
    document.querySelectorAll(".categoria-btn").forEach(btn => {
    btn.addEventListener("click", () => {

        document.querySelectorAll(".categoria-btn").forEach(b => {
            b.classList.remove("categoria-activa");
        });

        btn.classList.add("categoria-activa");

        categoriaActual = btn.dataset.categoria;

        cargar();
    });
});

    
const btnOrdenar = document.getElementById("btnOrdenar");
const menuOrdenar = document.getElementById("menuOrdenar");
const textoOrden = document.getElementById("textoOrden");

const nombresOrden = {
    recientes: "Más recientes",
    antiguas: "Más antiguas",
    likes: "Más Me gusta",
    respuestas: "Más respuestas"
};

btnOrdenar.addEventListener("click", () => {
    const abierto = !menuOrdenar.hidden;

    menuOrdenar.hidden = abierto;
    btnOrdenar.setAttribute("aria-expanded", String(!abierto));
});

menuOrdenar.addEventListener("click", async (event) => {
    const opcion = event.target.closest("[data-orden]");

    if (!opcion) return;

    ordenActual = opcion.dataset.orden;
    textoOrden.textContent = nombresOrden[ordenActual];

    menuOrdenar.querySelectorAll("[data-orden]").forEach(boton => {
        boton.classList.toggle("seleccionado", boton === opcion);
    });

    menuOrdenar.hidden = true;
    btnOrdenar.setAttribute("aria-expanded", "false");

    await cargar();
});

document.addEventListener("click", (event) => {
    if (!event.target.closest(".foro-orden-container")) {
        menuOrdenar.hidden = true;
        btnOrdenar.setAttribute("aria-expanded", "false");
    }
});


    function mostrarMensajeVacio() {
        const mensaje = document.createElement("p");
        mensaje.className = "foro-sin-comentarios";
        mensaje.textContent =
            "Todavía no hay publicaciones. ¡Anímate a hacer la primera pregunta!";

        contenedorForo.appendChild(mensaje);
    }

    // ======================================================
    // 7. ABRIR UNA PUBLICACIÓN
    // ======================================================

function esPropia(tarjeta) {
    const idActual = Number(
        document.querySelector(".foro-pagina")?.dataset.usuario
    );

    const idAutor = Number(tarjeta.dataset.usuarioId);

    return (
        Number.isInteger(idActual) &&
        idActual > 0 &&
        Number.isInteger(idAutor) &&
        idAutor > 0 &&
        idActual === idAutor
    );
}

    function abrirPublicacion(tarjeta) {

        if (!modalPublicacion || !tarjeta) return;

        tarjetaActual = tarjeta;

        publicacionTitulo.textContent =
            obtenerTexto(tarjeta, ".foro-card-contenido h3");

        publicacionDescripcion.textContent =
            obtenerTexto(tarjeta, ".foro-card-descripcion");

        const categoria = tarjeta.querySelector(".foro-card-categoria");

        publicacionCategoria.textContent = categoria
            ? categoria.textContent.trim()
            : "General";

        const autor = obtenerTexto(tarjeta, ".foro-autor strong");
        const fecha = obtenerTexto(tarjeta, ".foro-autor span");

        publicacionAutor.textContent =
            `Publicado por ${autor || "Usuario"} · ${fecha || ""}`;

        // Mostrar editar y eliminar únicamente en publicaciones propias.
        accionesPublicacionPropia.hidden = !esPropia(tarjeta);

        actualizarMeGusta();
        cargarEstadoMeGusta(tarjeta);
        cargarComentarios(obtenerId(tarjetaActual));
        mostrarComentarios();

        abrirModal(modalPublicacion);
        cerrarPublicacion.focus();
    }

    if (cerrarPublicacion) {
        cerrarPublicacion.addEventListener("click", () => {
            cerrarModal(modalPublicacion);
            tarjetaActual = null;
        });
    }

    if (modalPublicacion) {
        modalPublicacion.addEventListener("click", (evento) => {
            if (evento.target === modalPublicacion) {
                cerrarModal(modalPublicacion);
                tarjetaActual = null;
            }
        });
    }

    // Delegación: funciona aunque las tarjetas se creen después del fetch.
    if (contenedorForo) {

        contenedorForo.addEventListener("click", (evento) => {

            const tarjeta = evento.target.closest(".foro-card");

            if (tarjeta) {
                abrirPublicacion(tarjeta);
            }
        });

        contenedorForo.addEventListener("keydown", (evento) => {

            const tarjeta = evento.target.closest(".foro-card");

            if (
                tarjeta &&
                (evento.key === "Enter" || evento.key === " ")
            ) {
                evento.preventDefault();
                abrirPublicacion(tarjeta);
            }
        });
    }


    // ======================================================
    // 8. ME GUSTA
    // ======================================================

    async function cargarEstadoMeGusta(tarjeta) {
    const idPublicacion = obtenerId(tarjeta);

    const idUsuario = Number(
        document.querySelector(".foro-pagina")?.dataset.usuario
    );

    if (!idPublicacion || !Number.isInteger(idUsuario) || idUsuario <= 0) {
        return;
    }

    try {
        const respuesta = await fetch(
            `http://127.0.0.1:8000/publicaciones/${idPublicacion}/me-gusta?id_usuario=${idUsuario}`
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo consultar el estado de Me gusta");
        }

        const datos = await respuesta.json();

        // Evita actualizar otra publicación si el usuario cambió de modal.
        if (tarjetaActual !== tarjeta) return;

        tarjeta.dataset.likes = String(datos.likes);
        tarjeta.dataset.liked = String(datos.liked);

        actualizarMeGusta();
    } catch (error) {
        console.error("Error al consultar Me gusta:", error);
    }
}

    function actualizarMeGusta() {

        // Comprobamos que haya una publicación abierta.
        if (!tarjetaActual) return;

        const id = obtenerId(tarjetaActual);

        // Obtenemos la cantidad de Me gusta y el estado del usuario.
        const total = Number(tarjetaActual.dataset.likes) || 0;
        const activo = tarjetaActual.dataset.liked === "true";

        // Actualizamos el contador y el texto dentro del modal.
        if (cantidadMeGusta) {
            cantidadMeGusta.textContent = total;
        }

        if (textoMeGusta) {
            textoMeGusta.textContent = activo
                ? "Te gusta"
                : "Me gusta";
        }

        // Cambiamos el corazón del botón dentro del modal.
        if (btnMeGusta) {
            const icono = btnMeGusta.querySelector("i");

            btnMeGusta.classList.toggle(
                "foro-me-gusta-activo",
                activo
            );

            if (icono) {
                icono.className = activo
                    ? "fa-solid fa-heart"
                    : "fa-regular fa-heart";
            }
        }

        // También actualizamos el corazón de la tarjeta exterior.
        const corazonTarjeta = tarjetaActual.querySelector(
            ".foro-me-gusta-tarjeta"
        );

        if (corazonTarjeta) {

            const iconoTarjeta = corazonTarjeta.querySelector("i");

            const cantidadTarjeta = corazonTarjeta.querySelector(
                ".cantidad-likes-tarjeta"
            );

            if (cantidadTarjeta) {
                cantidadTarjeta.textContent = total;
            }

            if (iconoTarjeta) {
                iconoTarjeta.className = total > 0
                    ? "fa-solid fa-heart"
                    : "fa-regular fa-heart";
            }

            corazonTarjeta.classList.toggle(
                "tiene-me-gusta",
                total > 0
            );
        }
    }

    // Evento del botón Me gusta dentro del modal.
    if (btnMeGusta) {
    btnMeGusta.addEventListener("click", async () => {
        if (!tarjetaActual) return;

        const tarjeta = tarjetaActual;
        const idPublicacion = obtenerId(tarjeta);

        const idUsuario = Number(
            document.querySelector(".foro-pagina")?.dataset.usuario
        );

        if (!idPublicacion || !Number.isInteger(idUsuario) || idUsuario <= 0) {
            mostrarNotificacion(
                "No se pudo identificar al usuario o la publicación.",
                "error"
            );
            return;
        }

        // Evita solicitudes repetidas mientras se procesa la anterior.
        if (btnMeGusta.disabled) return;

        btnMeGusta.disabled = true;

        try {
            const respuesta = await fetch(
                `http://127.0.0.1:8000/publicaciones/${idPublicacion}/likes?id_usuario=${idUsuario}`,
                { method: "POST" }
            );

            if (!respuesta.ok) {
                const error = await respuesta.json().catch(() => ({}));
                throw new Error(
                    error.detail || "No se pudo actualizar el Me gusta."
                );
            }

            const datos = await respuesta.json();

            tarjeta.dataset.likes = String(datos.likes);
            tarjeta.dataset.liked = String(datos.liked);

            actualizarMeGusta();
        } catch (error) {
            console.error("Error al actualizar Me gusta:", error);

            mostrarNotificacion(
                error.message || "No se pudo guardar el Me gusta.",
                "error"
            );
        } finally {
            btnMeGusta.disabled = false;
        }
    });
}

    // ======================================================
    // 9. COMENTARIOS
    // ======================================================

    async function cargarComentarios(idPublicacion) {
    try {
        const respuesta = await fetch(
            `http://127.0.0.1:8000/comentarios/?id_publicacion=${idPublicacion}`
        );

        if (respuesta.status === 404) {
            comentarios.set(String(idPublicacion), []);
            mostrarComentarios();
            return;
        }

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const datos = await respuesta.json();

        comentarios.set(
            String(idPublicacion),
            datos.map(comentario => ({
                autor: comentario.autor,
                texto: comentario.contenido
            }))
        );

        mostrarComentarios();

    } catch (error) {
        console.error("Error al cargar comentarios:", error);
    }
}

    function obtenerComentariosActuales() {

        if (!tarjetaActual) return [];

        const id = obtenerId(tarjetaActual);

        if (!comentarios.has(id)) {
            comentarios.set(id, []);
        }

        return comentarios.get(id);
    }

    function mostrarComentarios() {

        if (!listaComentarios || !cantidadComentarios) return;

        const lista = obtenerComentariosActuales();

        listaComentarios.replaceChildren();
        cantidadComentarios.textContent = lista.length;

        if (lista.length === 0) {
            const mensaje = document.createElement("p");
            mensaje.className = "foro-sin-comentarios";
            mensaje.textContent =
                "Todavía no hay comentarios. ¡Participa en la conversación!";

            listaComentarios.appendChild(mensaje);
            return;
        }

        lista.forEach((comentario) => {

            const tarjeta = document.createElement("article");
            tarjeta.className = "foro-comentario";

            const nombre = document.createElement("strong");
            nombre.textContent = comentario.autor;

            const texto = document.createElement("p");
            texto.textContent = comentario.texto;

            tarjeta.append(nombre, texto);
            listaComentarios.appendChild(tarjeta);
        });
    }

if (formComentario) {
    formComentario.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const texto = textoComentario.value.trim();

        if (!texto) {
            console.log("hola")
            mostrarNotificacion(
                "Comentario vacío.",
                "error",
                "Faltan algunos datos"
            );
            return;
        }

        if (!tarjetaActual) return;

        const idPublicacion = obtenerId(tarjetaActual);

        try {
            const respuesta = await fetch(
                "http://127.0.0.1:8000/comentarios/create/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id_publicacion: Number(idPublicacion),
                        id_usuario: Number(document.querySelector(".foro-pagina")?.dataset.usuario),
                        contenido: texto
                    })
                }
            );

            if (!respuesta.ok) {
                const error = await respuesta.text();
                throw new Error(error);
            }

            // Limpiar el campo y cargar los comentarios guardados
            textoComentario.value = "";

            await cargarComentarios(idPublicacion);

            // Actualizar el contador de respuestas de la tarjeta
            const contadorTarjeta =
                tarjetaActual.querySelector(".foro-respuestas span");

            if (contadorTarjeta) {
                const total = obtenerComentariosActuales().length;
                contadorTarjeta.textContent = `${total} respuestas`;
            }

            textoComentario.focus();

            mostrarNotificacion(
                "Comentario añadido con éxito.",
                "info",
                "Comentario publicado"
            );

        } catch (error) {
            console.error("Error al publicar comentario:", error);
        }
    });
} 

    // ======================================================
    // 10. EDITAR UNA PUBLICACIÓN
    // ======================================================

    // Abrir el formulario de edición.
    if (btnEditarPublicacion) {

        btnEditarPublicacion.addEventListener("click", () => {

            if (!tarjetaActual || !esPropia(tarjetaActual)) return;

            const tituloTarjeta = tarjetaActual.querySelector(
                ".foro-card-contenido h3"
            );

            const descripcionTarjeta = tarjetaActual.querySelector(
                ".foro-card-descripcion"
            );

            // Cargar el título y la descripción actuales.
            editarTitulo.value = tituloTarjeta.textContent.trim();
            editarDescripcion.value = descripcionTarjeta.textContent.trim();

            /*
             * Cargar la categoría actual.
             * Para esto necesitamos que la tarjeta tenga
             * un elemento identificable para su categoría.
             */
            const categoriaTarjeta = tarjetaActual.querySelector(
                "[data-categoria]"
            );

            /*if (categoriaTarjeta) {
                editarCategoria.value =
                    categoriaTarjeta.dataset.categoria ||
                    categoriaTarjeta.textContent.trim();
            }  PENDIENTEEEE */

            if (categoriaTarjeta) {
                editarCategoria.value = categoriaTarjeta.dataset.categoria;
            }    

            // Cerrar el detalle y abrir el modal de edición.
            cerrarModal(modalPublicacion);
            abrirModal(modalEditarPublicacion);

            editarTitulo.focus();
        });
    }

    // Cerrar la edición y regresar al detalle.
    function cancelarEdicion() {

        cerrarModal(modalEditarPublicacion);

        if (tarjetaActual && tarjetaActual.isConnected) {
            abrirModal(modalPublicacion);
        }
    }

    if (cerrarModalEditar) {
        cerrarModalEditar.addEventListener("click", cancelarEdicion);
    }

    if (cancelarModalEditar) {
        cancelarModalEditar.addEventListener("click", cancelarEdicion);
    }

    // Cerrar al hacer clic fuera del modal.
    if (modalEditarPublicacion) {

        modalEditarPublicacion.addEventListener("click", (evento) => {

            if (evento.target === modalEditarPublicacion) {
                cancelarEdicion();
            }
        });
    }

    
 // Guardar los cambios.
if (formEditarPublicacion) {
    formEditarPublicacion.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        if (!tarjetaActual || !tarjetaActual.isConnected) {
            mostrarNotificacion(
                "No se encontró la publicación que quieres editar.",
                "error"
            );
            return;
        }

        const nuevoTitulo = editarTitulo.value.trim();
        const nuevaCategoria = editarCategoria.value;
        const nuevaDescripcion = editarDescripcion.value.trim();

        if (!nuevoTitulo || !nuevaCategoria || !nuevaDescripcion) {
            mostrarNotificacion(
                "Completa el título, la categoría y la descripción.",
                "error",
                "Faltan algunos datos"
            );
            return;
        }

        const idPublicacion = obtenerId(tarjetaActual);

        const idUsuario = Number(
            document.querySelector(".foro-pagina")?.dataset.usuario
        );

        if (!idPublicacion || !Number.isInteger(idUsuario) || idUsuario <= 0) {
            mostrarNotificacion(
                "No se pudo identificar la publicación o el usuario.",
                "error"
            );
            return;
        }

        try {
            const respuesta = await fetch(
                `http://127.0.0.1:8000/publicaciones/update/${idPublicacion}?id_usuario=${idUsuario}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        titulo: nuevoTitulo,
                        contenido: nuevaDescripcion,
                        categoria: nuevaCategoria
                    })
                }
            );

            if (!respuesta.ok) {
                const error = await respuesta.json().catch(() => ({}));

                throw new Error(
                    error.detail || `Error HTTP: ${respuesta.status}`
                );
            }

            
            // Actualizar los datos de la tarjeta.
            const tituloTarjeta = tarjetaActual.querySelector(
                ".foro-card-contenido h3"
            );

            const descripcionTarjeta = tarjetaActual.querySelector(
                ".foro-card-descripcion"
            );

            const categoriaTarjeta = tarjetaActual.querySelector(
                ".foro-card-categoria"
            );

            if (tituloTarjeta) {
                tituloTarjeta.textContent = nuevoTitulo;
            }

            if (descripcionTarjeta) {
                descripcionTarjeta.textContent = nuevaDescripcion;
            }

            if (categoriaTarjeta) {
                // Actualizar el atributo usado por el formulario de edición.
                categoriaTarjeta.dataset.categoria = nuevaCategoria;

                // Conservar el icono de la categoría.
                const icono = categoriaTarjeta.querySelector("i");

                categoriaTarjeta.replaceChildren();

                if (icono) {
                    categoriaTarjeta.appendChild(icono);
                }

                categoriaTarjeta.appendChild(
                    document.createTextNode(" " + nuevaCategoria)
                );
            }

            // Actualizar también los datos guardados en memoria.
            const publicacion = publicacionesActuales.find(
                pub => String(pub.id_publicacion) === String(idPublicacion)
            );

            if (publicacion) {
                publicacion.titulo = nuevoTitulo;
                publicacion.contenido = nuevaDescripcion;
                publicacion.categoria = nuevaCategoria;
            }

            // Cerrar edición y actualizar el modal de detalle.
            cerrarModal(modalEditarPublicacion);

            if (tarjetaActual && tarjetaActual.isConnected) {
                abrirPublicacion(tarjetaActual);
            }

            mostrarNotificacion(
                "Publicación modificada con éxito.",
                "info",
                "Publicación actualizada"
            );

            // Después actualizaremos también el modal de publicación.

        } catch (error) {
            console.error("Error al actualizar la publicación:", error);

            mostrarNotificacion(
                error.message || "No se pudo actualizar la publicación.",
                "error"
            );
        }
    });
}


    // ======================================================
    // 11. ELIMINAR UNA PUBLICACIÓN
    //     Reutilizamos el modal que ya existe en foro.html
    // ======================================================

    if (btnEliminarPublicacion) {
        btnEliminarPublicacion.addEventListener("click", () => {

            if (!tarjetaActual || !esPropia(tarjetaActual)) return;

            tarjetaPendienteEliminar = tarjetaActual;

            abrirModal(modalConfirmarEliminar);
        });
    }

    if (cancelarEliminar) {
        cancelarEliminar.addEventListener("click", () => {
            cerrarModal(modalConfirmarEliminar);
            tarjetaPendienteEliminar = null;
        });
    }

    if (modalConfirmarEliminar) {
        modalConfirmarEliminar.addEventListener("click", (evento) => {

            if (evento.target === modalConfirmarEliminar) {
                cerrarModal(modalConfirmarEliminar);
                tarjetaPendienteEliminar = null;
            }
        });
    }

    
    

if (confirmarEliminar) {
    confirmarEliminar.addEventListener("click", async () => {
        if (!tarjetaPendienteEliminar) return;

        const tarjeta = tarjetaPendienteEliminar;
        const idPublicacion = obtenerId(tarjeta);

        const idUsuario = Number(
            document.querySelector(".foro-pagina")?.dataset.usuario
        );

        const elementoForo = document.querySelector(".foro-pagina");

const idUsuarioTexto = elementoForo?.dataset.usuario;

console.log("Tarjeta:", tarjeta);
console.log("Atributos de la tarjeta:", tarjeta?.dataset);
console.log("ID publicación:", idPublicacion);
console.log("ID usuario:", idUsuarioTexto);

if (!idPublicacion || !/^\d+$/.test(idPublicacion)) {
    alert("El ID de la publicación no es válido: " + idPublicacion);
    return;
}

if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
    alert("El ID del usuario no es válido: " + idUsuarioTexto);
    return;
}

        confirmarEliminar.disabled = true;

        try {
            const url = new URL(
                `http://127.0.0.1:8000/publicaciones/delete/${encodeURIComponent(idPublicacion)}`
            );

            url.searchParams.set("id_usuario", String(idUsuario));

            const response = await fetch(url, {
                method: "DELETE",
                credentials: "include"
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));

                console.log(
                    error.detail ||
                    "No se pudo eliminar la publicación."
                );

                return;
            }

            // Actualizar la interfaz solo después de confirmar el borrado.
            comentarios.delete(idPublicacion);
            reacciones.delete(idPublicacion);

            tarjeta.remove();

            cerrarModal(modalConfirmarEliminar);
            cerrarModal(modalPublicacion);

            tarjetaPendienteEliminar = null;
            tarjetaActual = null;

            if (
                contenedorForo &&
                !contenedorForo.querySelector(".foro-card")
            ) {
                mostrarMensajeVacio();
            }

            mostrarNotificacion(
                    "La publicación que seleccionaste ha sido eliminada.",
                    "info",
                    "Publicación eliminada"
                );

        } catch (error) {
            console.error("Error al eliminar la publicación:", error);
        } finally {
            confirmarEliminar.disabled = false;
        }
    });
}





    // ======================================================
    // 12. CERRAR MODALES CON ESCAPE
    // ======================================================

    document.addEventListener("keydown", (evento) => {

        if (evento.key !== "Escape") return;

        if (modalConfirmarEliminar?.classList.contains("activo")) {
            cerrarModal(modalConfirmarEliminar);
            tarjetaPendienteEliminar = null;
            return;
        }

        if (modalEditarPublicacion?.classList.contains("activo")) {
            cancelarEdicion();
            return;
        }

        if (modalPublicacion?.classList.contains("activo")) {
            cerrarModal(modalPublicacion);
            tarjetaActual = null;
            return;
        }

        if (modalNuevaPregunta?.classList.contains("activo")) {
            cerrarModal(modalNuevaPregunta);
        }
    });

    if (formNuevaPregunta) {
        formNuevaPregunta.addEventListener("submit", (evento) => {
            evento.preventDefault();
            // Comprobar que ninguno de los campos esté vacío
            if (!tituloPregunta.value || !categoriaPregunta.value || !descripcionPregunta.value) {
                mostrarNotificacion(
                    "Completa todos los campos antes de publicar.",
                    "error",
                    "Faltan algunos datos"
                );
                return;
            }
            nuevaPublicacion(tituloPregunta.value, categoriaPregunta.value, descripcionPregunta.value);
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
                console.log("Hecho");
                cerrarModal(modalNuevaPregunta);
                mostrarNotificacion(
                    "La publicación ha sido publicada con éxito.",
                    "info",
                    "¡Enhorabuena!"
                );
                document.getElementById("formNuevaPregunta").reset();
                cargar();
                return;
            }
        } catch (error) {
            console.error("Error creando la publicación:", error);
        }
    }


    // ======================================================
    // 14. INICIAR EL FORO
    // ======================================================

    cargarPublicaciones();

});