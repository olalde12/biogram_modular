/* ==========================================================
   FORO BIOGRAM
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ======================================================
    // 1. ELEMENTOS DEL HTML
    // ======================================================

    const contenedorForo = document.getElementById("foro");

    // Modal para crear una pregunta.
    const modalNuevaPregunta = document.getElementById("modalNuevaPregunta");
    const btnNuevaPregunta = document.getElementById("btnNuevaPregunta");
    const cerrarNuevaPregunta = document.getElementById("cerrarNuevaPregunta");
    const cancelarNuevaPregunta = document.getElementById("cancelarNuevaPregunta");
    const formNuevaPregunta = document.getElementById("formNuevaPregunta");

    // Campos de la pregunta nueva.
    const tituloPregunta = document.getElementById("tituloPregunta");
    const categoriaPregunta = document.getElementById("categoriaPregunta");
    const descripcionPregunta = document.getElementById("descripcionPregunta");
    const contadorPregunta = document.getElementById("contadorPregunta");

    // Modal para ver una publicación.
    const modalPublicacion = document.getElementById("modalPublicacion");
    const cerrarPublicacion = document.getElementById("cerrarPublicacion");
    const publicacionTitulo = document.getElementById("publicacionTitulo");
    const publicacionAutor = document.getElementById("publicacionAutor");
    const publicacionCategoria = document.getElementById("publicacionCategoria");
    const publicacionDescripcion = document.getElementById("publicacionDescripcion");

    // Acciones de la publicación.
    const btnMeGusta = document.getElementById("btnMeGusta");
    const textoMeGusta = document.getElementById("textoMeGusta");
    const cantidadMeGusta = document.getElementById("cantidadMeGusta");
    const accionesPublicacionPropia =
        document.getElementById("accionesPublicacionPropia");
    const btnEditarPublicacion =
        document.getElementById("btnEditarPublicacion");
    const btnEliminarPublicacion =
        document.getElementById("btnEliminarPublicacion");

    // Comentarios.
    const formComentario = document.getElementById("formComentario");
    const textoComentario = document.getElementById("textoComentario");
    const listaComentarios = document.getElementById("listaComentarios");
    const cantidadComentarios = document.getElementById("cantidadComentarios");

    // Modal de confirmación de eliminación que ya tenías.
    const modalConfirmarEliminar = document.getElementById("modalEliminar");
    const cancelarEliminar = document.getElementById("cancelarEliminar");
    const confirmarEliminar = document.getElementById("confirmarEliminar");


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

    // Identificador local para las preguntas creadas desde el formulario.
    let siguienteIdLocal = 1;

    // Nombre de ejemplo mientras no conectemos la sesión real.
    const usuarioActual = "Hannia";


    // ======================================================
    // 3. FUNCIONES AUXILIARES
    // ======================================================

    // Convierte un texto a una versión segura para usar como texto.
    // Para mostrar texto usamos textContent, no HTML del usuario.
    function obtenerTexto(elemento, selector) {
        const encontrado = elemento.querySelector(selector);
        return encontrado ? encontrado.textContent.trim() : "";
    }

    // Obtiene el ID de la tarjeta.
    function obtenerId(tarjeta) {
        return tarjeta.dataset.preguntaId;
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
    // 4. MODAL NUEVA PREGUNTA
    // ======================================================

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

    // Contador de caracteres de la descripción.
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
        tarjeta.tabIndex = 0;

        // Identificador y datos para las interacciones.
        tarjeta.dataset.preguntaId = String(
            datos.id ?? `local-${siguienteIdLocal++}`
        );

        tarjeta.dataset.propio = String(Boolean(datos.propia ?? datos.propio));
        tarjeta.dataset.likes = String(Number(datos.likes) || 0);
        tarjeta.dataset.liked = "false";

        // Contenido principal.
        const contenido = document.createElement("div");
        contenido.className = "foro-card-contenido";

        const categoria = document.createElement("div");
        categoria.className = "foro-card-categoria";

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
        avatar.textContent = (datos.autor || "U").charAt(0).toUpperCase();

        const datosAutor = document.createElement("div");

        const nombre = document.createElement("strong");
        nombre.textContent = datos.autor || "Usuario";

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
        cantidadLikesTarjeta.textContent = tarjeta.dataset.likes;

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


    // ======================================================
    // 6. CARGAR PUBLICACIONES
    // ======================================================

    async function cargarPublicaciones() {

        if (!contenedorForo) return;

        contenedorForo.replaceChildren();

        try {

            // Conservamos la ruta que ya usaba tu proyecto.
            const respuesta = await fetch("/publicaciones");

            if (!respuesta.ok) {
                throw new Error("No se pudieron cargar las publicaciones.");
            }

            const publicaciones = await respuesta.json();

            publicaciones.forEach((pub) => {

                const autor = pub.autor || "Usuario";

                // Modo de prueba: Hannia se considera la autora propia.
                // Más adelante esto debe venir de la sesión/backend.
                const propia =
                    typeof pub.es_propia === "boolean"
                        ? pub.es_propia
                        : autor.toLowerCase() === usuarioActual.toLowerCase();

                const tarjeta = crearTarjeta({
                    id: pub.id ?? pub.id_publicacion ?? pub.id_pregunta,
                    titulo: pub.titulo,
                    categoria: pub.categoria,
                    contenido: pub.contenido,
                    autor: autor,
                    fecha_creacion: pub.fecha_creacion,
                    respuestas: pub.respuestas,
                    likes: pub.likes || 0,
                    propia: propia
                });

                contenedorForo.appendChild(tarjeta);
            });

            if (publicaciones.length === 0) {
                mostrarMensajeVacio();
            }

        } catch (error) {

            console.warn("No se pudieron cargar publicaciones:", error);

            // Si el servidor no está disponible, mostramos ejemplos
            // para poder probar la interfaz sin depender del backend.
            mostrarPublicacionesDePrueba();
        }
    }

    function mostrarMensajeVacio() {
        const mensaje = document.createElement("p");
        mensaje.className = "foro-sin-comentarios";
        mensaje.textContent =
            "Todavía no hay publicaciones. ¡Anímate a hacer la primera pregunta!";

        contenedorForo.appendChild(mensaje);
    }

    function mostrarPublicacionesDePrueba() {

        const ejemplos = [
            {
                id: "demo-1",
                titulo: "¿Cómo diferenciar una bacteria Gram positiva de una Gram negativa?",
                categoria: "Bacteriología",
                contenido:
                    "Estoy estudiando identificación bacteriana y tengo dudas sobre las diferencias entre ambos tipos de bacterias.",
                autor: "Hannia",
                fecha_creacion: "Hace 2 horas",
                respuestas: 2,
                likes: 3,
                propia: true
            },
            {
                id: "demo-2",
                titulo: "¿Qué cuidados debo tener al preparar un medio de cultivo?",
                categoria: "Laboratorio",
                contenido:
                    "Quiero repasar los cuidados básicos para preparar y manipular medios de cultivo en el laboratorio.",
                autor: "María",
                fecha_creacion: "Hace 4 horas",
                respuestas: 1,
                likes: 5,
                propia: false
            },
            {
                id: "demo-3",
                titulo: "¿Para qué sirven las pruebas bioquímicas?",
                categoria: "Pruebas bioquímicas",
                contenido:
                    "¿Cómo se interpretan las pruebas bioquímicas durante la identificación de microorganismos?",
                autor: "Daniel",
                fecha_creacion: "Ayer",
                respuestas: 0,
                likes: 1,
                propia: false
            }
        ];

        ejemplos.forEach((datos) => {
            contenedorForo.appendChild(crearTarjeta(datos));
        });
    }


    // ======================================================
    // 7. ABRIR UNA PUBLICACIÓN
    // ======================================================

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

    function actualizarMeGusta() {

        // Comprobamos que haya una publicación abierta.
        if (!tarjetaActual) return;

        const id = obtenerId(tarjetaActual);

        // Si todavía no existe una reacción, comienza desactivada.
        if (!reacciones.has(id)) {
            reacciones.set(id, false);
        }

        // Obtenemos la cantidad de Me gusta y el estado del usuario.
        const total = Number(tarjetaActual.dataset.likes) || 0;
        const activo = reacciones.get(id);

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

        btnMeGusta.addEventListener("click", () => {

            if (!tarjetaActual) return;

            const id = obtenerId(tarjetaActual);
            const activo = reacciones.get(id) || false;

            let total = Number(tarjetaActual.dataset.likes) || 0;

            // Si ya había dado Me gusta, lo quitamos.
            if (activo) {

                total = Math.max(0, total - 1);
                reacciones.set(id, false);

            } else {

                // Si no había dado Me gusta, lo agregamos.
                total++;
                reacciones.set(id, true);
            }

            // Guardamos la nueva cantidad en la tarjeta.
            tarjetaActual.dataset.likes = String(total);

            // Actualizamos el modal y la tarjeta exterior.
            actualizarMeGusta();
        });
    }

    // ======================================================
    // 9. COMENTARIOS
    // ======================================================

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
        formComentario.addEventListener("submit", (evento) => {

            evento.preventDefault();

            if (!tarjetaActual) return;

            const texto = textoComentario.value.trim();

            if (!texto) {
                textoComentario.focus();
                return;
            }

            obtenerComentariosActuales().push({
                autor: usuarioActual,
                texto: texto
            });

            mostrarComentarios();

            // Actualizamos también el contador de respuestas de la tarjeta.
            const contadorTarjeta =
                tarjetaActual.querySelector(".foro-respuestas span");

            if (contadorTarjeta) {
                const total = obtenerComentariosActuales().length;
                contadorTarjeta.textContent =
                    `${total} respuestas`;
            }

            textoComentario.value = "";
            textoComentario.focus();
        });
    }


    // ======================================================
    // 10. EDITAR UNA PUBLICACIÓN
    // ======================================================

    if (btnEditarPublicacion) {
        btnEditarPublicacion.addEventListener("click", () => {

            if (!tarjetaActual || !esPropia(tarjetaActual)) return;

            const tituloTarjeta = tarjetaActual.querySelector(
                ".foro-card-contenido h3"
            );

            const descripcionTarjeta = tarjetaActual.querySelector(
                ".foro-card-descripcion"
            );

            const nuevoTitulo = prompt(
                "Escribe el nuevo título:",
                tituloTarjeta.textContent
            );

            if (nuevoTitulo === null) return;

            if (!nuevoTitulo.trim()) {
                alert("El título no puede quedar vacío.");
                return;
            }

            const nuevaDescripcion = prompt(
                "Escribe la nueva descripción:",
                descripcionTarjeta.textContent
            );

            if (nuevaDescripcion === null) return;

            if (!nuevaDescripcion.trim()) {
                alert("La descripción no puede quedar vacía.");
                return;
            }

            tituloTarjeta.textContent = nuevoTitulo.trim();
            descripcionTarjeta.textContent = nuevaDescripcion.trim();

            publicacionTitulo.textContent = nuevoTitulo.trim();
            publicacionDescripcion.textContent = nuevaDescripcion.trim();

            alert("La publicación se actualizó en esta vista.");
        });
    }


    // ======================================================
    // 11. ELIMINAR UNA PUBLICACIÓN
    //     Reutilizamos el modal que ya existe en foro.html.
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
        confirmarEliminar.addEventListener("click", () => {

            if (!tarjetaPendienteEliminar) return;

            const id = obtenerId(tarjetaPendienteEliminar);

            comentarios.delete(id);
            reacciones.delete(id);

            tarjetaPendienteEliminar.remove();

            cerrarModal(modalConfirmarEliminar);
            cerrarModal(modalPublicacion);

            tarjetaPendienteEliminar = null;
            tarjetaActual = null;

            if (contenedorForo && !contenedorForo.querySelector(".foro-card")) {
                mostrarMensajeVacio();
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

        if (modalPublicacion?.classList.contains("activo")) {
            cerrarModal(modalPublicacion);
            tarjetaActual = null;
            return;
        }

        if (modalNuevaPregunta?.classList.contains("activo")) {
            cerrarModal(modalNuevaPregunta);
        }
    });


    // ======================================================
    // 13. PUBLICAR UNA NUEVA PREGUNTA EN LA VISTA
    // ======================================================

    if (formNuevaPregunta) {
        formNuevaPregunta.addEventListener("submit", (evento) => {

            evento.preventDefault();

            const titulo = tituloPregunta.value.trim();
            const categoria = categoriaPregunta.value;
            const contenido = descripcionPregunta.value.trim();

            if (!titulo || !categoria || !contenido) {
                alert("Completa todos los campos antes de publicar.");
                return;
            }

            // Creamos una publicación local, sin enviarla al backend.
            const tarjeta = crearTarjeta({
                id: `local-${siguienteIdLocal++}`,
                titulo: titulo,
                categoria: categoria,
                contenido: contenido,
                autor: usuarioActual,
                fecha_creacion: "Ahora",
                respuestas: 0,
                likes: 0,
                propia: true
            });

            contenedorForo.prepend(tarjeta);

            // Limpiamos el formulario.
            formNuevaPregunta.reset();

            if (contadorPregunta) {
                contadorPregunta.textContent = "0";
            }

            cerrarModal(modalNuevaPregunta);

            alert("La pregunta se agregó a la vista del foro.");
        });
    }


    // ======================================================
    // 14. INICIAR EL FORO
    // ======================================================

    cargarPublicaciones();

});