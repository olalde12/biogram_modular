const btnAvatar = document.getElementById("btnAvatar");
const modalAvatar = document.getElementById("modalAvatar");
const cerrarAvatar = document.getElementById("cerrarAvatar");
const avatarActual = document.getElementById("avatarActual");


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

const projectUrl = "https://zwusokregrpbywttromy.supabase.co/storage/v1/object/public/Base%20de%20datos";

document.querySelectorAll(".avatar-opcion").forEach(btn => {

    btn.addEventListener("click", async () => {

        const fileName = btn.dataset.avatar;

        // Si los archivos están directamente dentro del bucket:
        const avatarUrl = `${projectUrl}/${fileName}`;

        console.log("Avatar seleccionado:", fileName);
        console.log("URL que se enviará:", avatarUrl);

        try {

            const response = await fetch("/usuarios/update-avatar", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    avatar: avatarUrl
                })
            });

            console.log("Código de respuesta:", response.status);

            const resultado = await response.json();

            console.log("Respuesta del servidor:", resultado);

            if (!response.ok) {
                alert(
                    "Error: " +
                    (resultado.detail || "No se pudo actualizar el avatar")
                );
                return;
            }

            console.log("Avatar actualizado correctamente");


if (response.ok) {
    // Usa la URL que devuelve el backend si existe
    const nuevaUrl = resultado.avatar || avatarUrl;

    // Forzar recarga para evitar caché
    avatarActual.src = `${nuevaUrl}?t=${Date.now()}`;

    modalAvatar.classList.remove("activo");
    alert("Avatar actualizado correctamente");
}



        } catch (error) {

            console.error("Error en fetch:", error);

            alert("Ocurrió un error al conectar con el servidor");

        }

    });

});

