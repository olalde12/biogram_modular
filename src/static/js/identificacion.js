window.onload = function(){
    setTimeout(()=>{
        document.getElementById("pantallaCarga").style.opacity="0";
        setTimeout(()=>{
            document.getElementById("pantallaCarga").style.display="none";
            document.getElementById("contenido").style.display="block";
        },800);
    },2000);
}

document.querySelectorAll(".btn-principal").forEach(boton => {
    boton.addEventListener("click", ()=>{
        if(boton.dataset.url){
            window.location.href = boton.database.url;
        }    
    });
});        

//clase pendiente de estudiar y completar
let respuestas = {
    gram: null,
    forma: null,
    oxidasa: null

};