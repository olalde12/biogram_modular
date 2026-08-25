const btnAvatar = document.getElementById("btnAvatar");
const modalAvatar = document.getElementById("modalAvatar");
const cerrarAvatar = document.getElementById("cerrarAvatar");
const avatarActual = document.getElementById("avatarActual");
const opcionesAvatar = document.querySelectorAll(".avatar-opcion");


// ABRIR SELECTOR
btnAvatar.addEventListener("click", () => {

    modalAvatar.classList.add("activo");

});

// CERRAR SELECTOR
cerrarAvatar.addEventListener("click", () => {

    modalAvatar.classList.remove("activo");

});

// CERRAR AL HACER CLICK FUERA
modalAvatar.addEventListener("click", (event) => {

    if (event.target === modalAvatar) {

        modalAvatar.classList.remove("activo");

    }

});

// SELECCIONAR AVATAR
opcionesAvatar.forEach((opcion) => {

    opcion.addEventListener("click", () => {

        const avatar = opcion.dataset.avatar;

        avatarActual.src =
            `/static/img/avatars/${avatar}`;

        opcionesAvatar.forEach((otraOpcion) => {

            otraOpcion.classList.remove("seleccionado");

        });

        opcion.classList.add("seleccionado");

        modalAvatar.classList.remove("activo");

    });

});