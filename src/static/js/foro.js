async function cargarPublicaciones() {
  const response = await fetch("/publicaciones");
  const data = await response.json();
  console.log(data);

  const contenedor = document.getElementById("foro"); 
  contenedor.innerHTML = "";

  data.forEach(pub => {
    const article = document.createElement("article");
    article.classList.add("foro-card");

    article.innerHTML = `
      <div class="foro-card-contenido">
        <div class="foro-card-categoria">
          <i class="fa-solid fa-bacterium"></i>
          ${pub.categoria}
        </div>
        <h3>${pub.titulo}</h3>
        <p class="foro-card-descripcion">${pub.contenido}</p>
        <div class="foro-card-etiquetas">
        </div>
      </div>
      <div class="foro-card-footer">
        <div class="foro-autor">
          <div class="foro-avatar">
            <img src="${pub.avatar || 'default.png'}" alt="Avatar">
          </div>
          <div>
            <strong>${pub.autor.charAt(0).toUpperCase() + pub.autor.slice(1)}</strong>
            <span>${pub.fecha_creacion}</span>
          </div>
        </div>
        <div class="foro-respuestas">
          <i class="fa-regular fa-comment"></i>
          <span>${pub.respuestas} respuestas</span>
        </div>
      </div>
    `;

    contenedor.appendChild(article);
  });
}

document.addEventListener("DOMContentLoaded", () => {
    cargarPublicaciones();
});
