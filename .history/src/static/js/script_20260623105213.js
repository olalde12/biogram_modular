const signIn = document.getElementById('sign-in')
const signUp = document.getElementById('sign-up')
const form = document.getElementById('form')

signIn.addEventListener('click',()=>{
    form.classList.remove('toggle')
})
signUp.addEventListener('click',()=>{
    form.classList.add('toggle')
})



const createUser = document.getElementById("CreateUser");
const nombre = document.getElementById("nombre")
const apellido = document.getElementById("nombre")
const nombre = document.getElementById("nombre")
const nombre = document.getElementById("nombre")

createUser.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(createUser);
    const PostData = Object.fromEntries(formData.entries());
    try {
        const response = await fetch("http//127.0.0.1:8000/docs/usuarios/create", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(PostData),
        });
        if (response.ok) {
            console.log("Creado 200!");
        }
    } catch (error) {
        console.error("Error creando usuario:", error);
    }
});
