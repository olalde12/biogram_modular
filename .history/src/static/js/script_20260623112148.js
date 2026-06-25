const signIn = document.getElementById('sign-in')
const signUp = document.getElementById('sign-up')
const form = document.getElementById('form')

signIn.addEventListener('click',()=>{
    form.classList.remove('toggle')
})
signUp.addEventListener('click',()=>{
    form.classList.add('toggle')
})


//
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

