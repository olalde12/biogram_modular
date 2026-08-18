// Validación para iniciar sesion
//Obtenemos los datos del formulario
const getUser = document.getElementById("login");
const correo = document.getElementById("login-email");
const contrasena = document.getElementById("login-password");

// Escondemos los mensajes de error cuando el usuario lo modifique
correo.addEventListener("input", () => {
    if (correo.value.trim() !== ultimoCorreoError) {
        document.getElementById("error_correo").style.display = "none";
    }
});
contrasena.addEventListener("input", () => {
    if (contrasena.value.trim() !== ultimaContrasenaError) {
        document.getElementById("error_password").style.display = "none";
    }
});

getUser.addEventListener("submit", async (event) => {
    event.preventDefault();
    const recordar = document.getElementById("remember").checked;
    // Hacemos un POST a la ruta del login
    try {
        const response = await fetch(`http://127.0.0.1:8000/usuarios/login`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                correo: correo.value, 
                contraseña: contrasena.value,
                recordar: recordar
            })
        });
        // Validamos que el correo exista y la contraseña sea la correspondiente
        if (response.ok) {
            window.location.href = "/";
        } else if (response.status === 404) {
            ultimoCorreoError = correo.value;
            document.getElementById("error_correo").innerText = "Ese correo no es válido";
            document.getElementById("error_correo").style.display = 'block';
        } else if (response.status === 401) {
            ultimaContrasenaError = contrasena.value;
            document.getElementById("error_password").innerText = "Contraseña incorrecta";
            document.getElementById("error_password").style.display = 'block';
        }
    } catch (error) {
        console.error("Error al encontrar usuario:", error);
    }
});

// Expresiones regulares
const expresiones = {
    nombre: /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+$/, // Solo se permiten letras 
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ // Contraseña válida
}

// Validación para crear un usuario
// Obtenemos campos del HTML
const createUser = document.getElementById("form_register");
const nombre = document.getElementById("register-name");
const email = document.getElementById("register-email");
const password = document.getElementById("register-password");

// Escondemos los mensajes de error cuando el usuario lo modifique
nombre.addEventListener("input", () => {
    if (nombre.value.trim() !== ultimoNombreError) {
        document.getElementById("error_nombre").style.display = "none";
    }
});
email.addEventListener("input", () => {
    if (email.value.trim() !== ultimoEmailError) {
        document.getElementById("error_correo_register").style.display = "none";
    }
});
password.addEventListener("input", () => {
    if (password.value.trim() !== ultimaPasswordError) {
        document.getElementById("error_password_register").style.display = "none";
    }
});

createUser.addEventListener("submit", async (event) => {
    event.preventDefault();
    const partes = nombre.value.trim().split(" ");
    
    const campos = {
        nombre: partes[0],
        apellido: partes[1],
        correo: email.value.trim(),
        contrasena: password.value.trim()
    };

    // Validaciones para el nombre y apellido
    if (!expresiones.nombre.test(campos.nombre) || !expresiones.nombre.test(campos.apellido)) {
        ultimoNombreError = nombre.value;
        document.getElementById("error_nombre").innerText = "El nombre solo debe contener letras";
        document.getElementById("error_nombre").style = 'display: block';
    }

    const userData = {nombre: campos.nombre, apellido: campos.apellido, correo: campos.correo, contraseña: campos.contrasena};

    // Hacemos un POST a la base de datos para crear usuario
    try {
        const response = await fetch("http://127.0.0.1:8000/usuarios/create", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });
        if (response.ok) {
            console.log("Usuario creado correctamente");
            window.location.href = "/login";
        } else if (response.status === 409) {
            ultimoEmailError = email.value;
            document.getElementById("error_correo_register").innerText = "Ese correo ya existe";
            document.getElementById("error_correo_register").style.display = 'block';
        } else if (response.status === 400) {
            ultimaPasswordError = password.value;
            document.getElementById("error_password_register").innerText = "La contraseña debe contener por lo menos: \n· 8 caracteres \n· 1 mayúscula \n· 1 minúscula \n· 1 número \n· 1 símbolo";
            document.getElementById("error_password_register").style.display = 'block';
        } 
    } catch (error) {
        console.error("Error creando usuario:", error);
    }
});
