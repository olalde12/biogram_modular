// Expresiones regulares
const expresiones = {
    nombre: /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+$/, // Solo se permiten letras 
    email: /^[\w.-]+@[\w.-]+\.\w{2,}$/, // Tiene un @ y un .algo
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ // Contraseña válida
}

// Validación para crear un usuario
const createUser = document.getElementById("CreateUser");

createUser.addEventListener("submit", async (event) => {
    event.preventDefault();
    const campos = {
        nombre: document.getElementById("nombre").value.trim(),
        apellido: document.getElementById("apellido").value.trim(),
        correo: document.getElementById("email").value,
        contrasena: document.getElementById("password").value.trim()
    };
    let valido = true;

    if (!campos.nombre) {
        document.getElementById("error_nombre").innerText = "Campo obligatorio";
        document.getElementById("error_nombre").style.display = 'block';
        valido = false;
    } else if (!expresiones.nombre.test(campos.nombre)) {
        document.getElementById("error_nombre").innerText = "El nombre solo debe contener letras";
        document.getElementById("error_nombre").style = 'display: block';
    } else {
        document.getElementById("error_nombre").style = 'display: none';
    }

    if (!campos.apellido) {
        document.getElementById("error_apellido").innerText = "Campo obligatorio";
        document.getElementById("error_apellido").style.display = 'block';
        valido = false;
    } else if (!expresiones.nombre.test(campos.apellido)) {
        document.getElementById("error_apellido").innerText = "El apellido solo debe contener letras";
        document.getElementById("error_apellido").style = 'display: block';
    } else {
        document.getElementById("error_apellido").style = 'display: none';
    }

    if (!campos.correo) {
        document.getElementById("error_email").innerText = "Campo obligatorio";
        document.getElementById("error_email").style.display = 'block';
        valido = false;
    } else if (!expresiones.email.test(campos.correo)) {
        document.getElementById("error_email").innerText = "Formato de correo inválido";
        document.getElementById("error_email").style.display = 'block';
        valido = false;
    } else {
        document.getElementById("error_email").style.display = 'none';
    }

    if (!campos.contrasena) {
        document.getElementById("error_password").innerText = "Campo obligatorio";
        document.getElementById("error_password").style.display = 'block';
        valido = false;
    } else if (!expresiones.password.test(campos.contrasena)) {
        document.getElementById("error_password").innerText = "La contraseña debe contener 8 caracteres, mayúscula, minúscula, número y símbolo";
        document.getElementById("error_password").style.display = 'block';
    } else {
        document.getElementById("error_password").style.display = 'none';
    }

    if (!valido) {
        return;
    }

    const userData = {nombre: campos.nombre, apellido: campos.apellido, correo: campos.correo, contraseña: campos.contrasena};

    try {
        const response = await fetch("http://127.0.0.1:8000/usuarios/create", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });
        if (response.ok) {
            window.location.replace("cuestionarios.html");
            document.getElementById("bienvenida").value = "Inicia sesión con la cuenta que creaste!";
        } else if (response.status === 400) {
            document.getElementById("error_email").innerText = "Ese correo ya existe";
            document.getElementById("error_email").style.display = 'block';
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
    const contrasena = document.getElementById("passwordL").value;
    let valid = true;
    if (correo === "") {
        document.getElementById("error_correo").innerText = "Campo obligatorio";
        document.getElementById("error_correo").style = 'display: block';
        valid = false;
    } else {
        document.getElementById("error_correo").style = 'display: none';
    } 
    if (contrasena === "") {
        document.getElementById("error_contrasena").innerText = "Campo obligatorio";
        document.getElementById("error_contrasena").style = 'display: block';
        valid = false;
    } else {
        document.getElementById("error_contrasena").style = 'display: none';
    } 
    if (!valid) {
        return;
    }
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
            if (user.contraseña === contrasena) {
                document.getElementById("error_contrasena").style = 'display: none';
                window.location.replace("index.html");
            } else {
                document.getElementById("error_contrasena").innerText = "Contraseña incorrecta";
                document.getElementById("error_contrasena").style = 'display: block';
            }
        } else if (response.status === 404) {
            document.getElementById("error_correo").innerText = "Ese correo no es válido";
            document.getElementById("error_correo").style = 'display: block';
        }
    } catch (error) {
        console.error("Error al encontrar usuario:", error);
    }
});