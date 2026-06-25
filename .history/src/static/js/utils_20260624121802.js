// Expresiones regulares
const expresiones = {
    nombre: /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+$/, // Solo se permiten letras 
    email: /^[\w.-]+@[\w.-]+\.\w{2,}$/, // Tiene un @ y un .algo
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/ // Contraseña válida
}

// Validación para crear un usuario
const createUser = document.getElementById("CreateUser");

createUser.addEventListener("submit", async (event) => {
    event.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const correo = document.getElementById("email").value;
    const contrasena = document.getElementById("password").value;

    email.addEventListener("input", function() {
        if (!expresiones.nombre.test(nombre)) {
            document.getElementById("error_nombre").innerText = "El nombre solo debe contener letras";
            document.getElementById("error_nombre").style = 'display: block';
        } else {
            document.getElementById("error_nombre").style = 'display: none';
    }});

    email.addEventListener("input", function() {
        if (!expresiones.nombre.test(apellido)) {
            document.getElementById("error_apellido").innerText = "El apellido solo debe contener letras";
            document.getElementById("error_apellido").style = 'display: block';
        } else {
            document.getElementById("error_apellido").style = 'display: none';
    }});

    email.addEventListener("input", function() {
        if (!expresiones.email.test(correo)) {
            document.getElementById("error_email").innerText = "Formato de correo inválido";
            document.getElementById("error_email").style.display = 'block';
        } else {
            document.getElementById("error_email").style.display = 'none';
    }});

    contrasena.addEventListener("input", function(){ 
    if (!expresiones.password.test(password)) {
        document.getElementById("error_password").innerText = "La contraseña debe contener 8 caracteres, mayúscula, minúscula, número y símbolo";
        document.getElementById("error_password").style.display = 'block';
    } else {
        document.getElementById("error_password").style.display = 'none';
    }});

    const userData = {nombre: nombre, apellido: apellido, correo: correo, contraseña: contrasena};

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