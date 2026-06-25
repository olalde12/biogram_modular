// Expresiones regulares
const expresiones = {
    nombre: , 
    apellido: ,
    email: /^[\w.-]+@[\w.-]+\.\w{2,}$/, //
    password: 
}

// Validación para crear un usuario
const createUser = document.getElementById("CreateUser");

createUser.addEventListener("submit", async (event) => {
    event.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const correo = document.getElementById("email").value;
    const contraseña = document.getElementById("password").value;
    const userData = {
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        contraseña: contraseña
    };

    try {
        const response = await fetch("http://127.0.0.1:8000/usuarios/create", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });
        if (response.ok) {
            console.log("Creado 200!");
        }
    } catch (error) {
        console.error("Error creando usuario:", error);
    }
});

// Validación para iniciar sesion
const getUser = document.getElementById("login");

getUser.addEventListener("submit", async (event) => {
    event.preventDefault();
    const correo = document.getElementById("emailL").value;
    const contraseña = document.getElementById("passwordL").value;
    try {
        const response = await fetch(`http://127.0.0.1:8000/usuarios/${correo}`, {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (response.ok) {
            document.getElementById("error_correo").style = 'display: none';
            const user = await response.json()
            if (user.contraseña === contraseña) {
                document.getElementById("error_contrasena").style = 'display: none';
            } else {
                document.getElementById("error_contrasena").innerText = "Contraseña incorrecta";
                document.getElementById("error_contrasena").style = 'display: block';
            }
        } else {
            document.getElementById("error_correo").innerText = "Ese correo no es válido";
            document.getElementById("error_correo").style = 'display: block';
        }
    } catch (error) {
        console.error("Error al encontrar usuario:", error);
    }
});