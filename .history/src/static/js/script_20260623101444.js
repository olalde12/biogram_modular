const signIn = document.getElementById('sign-in')
const signUp = document.getElementById('sign-up')
const form = document.getElementById('form')

signIn.addEventListener('click',()=>{
    form.classList.remove('toggle')
})
signUp.addEventListener('click',()=>{
    form.classList.add('toggle')
})

const createForm = document.getElementById("CreatePostForm");

createForm.addEventListener("submit", async (event)) => {
    event.preventDefault();
    const formData = new FormData(createForm);
    const PostData = Object.fromEntries(formData.entries());
    try (
        const response = await fetch("/api/posts", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body
        })
    )
}