// =========================================
// NAVEGACIÓN DEL ESCÁNER BIOGRAM IA
// =========================================

document.addEventListener("DOMContentLoaded", function () {

    // Obtener las pantallas
    const pantallaInicio = document.getElementById("pantalla-inicio");
    const pantallaPreparacion = document.getElementById("pantalla-preparacion");

    // Obtener los botones
    const botonIniciar = document.getElementById("btn-iniciar-escaner");
    const botonRegresar = document.getElementById("btn-regresar-escaner");


    // Mostrar la pantalla de preparación
    botonIniciar.addEventListener("click", function () {

        pantallaInicio.hidden = true;
        pantallaPreparacion.hidden = false;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });


    // Regresar a la pantalla principal
    botonRegresar.addEventListener("click", function () {

        pantallaPreparacion.hidden = true;
        pantallaInicio.hidden = false;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

});