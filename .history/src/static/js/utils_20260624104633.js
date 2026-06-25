// Expresiones regulares


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
            const user = await response.json()
            if (user.contraseña === contraseña) {
                console.log("Usuario correcto");
            } else {
                console.log("Contraseña incorrecta");
            }
        } else {
            document.getElementById
        }
    } catch (error) {
        console.error("Usuario no existente:", error);
    }
});