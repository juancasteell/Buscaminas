let imagen = document.getElementById("imagen");

let audio = document.getElementById("audio");

// Evento para el botón de Login
document.getElementById("boton").addEventListener("click", (event) => {
  event.preventDefault(); // Evita que se envíe el formulario
  alert(
    "No se ha detectado cuenta en la Base de datos, create una en el apartado 'Registrate'."
  );
});

// Evento para el link de Registrate
document.getElementById("jumpscare").addEventListener("click", (event) => {
  event.preventDefault(); // Evita que el enlace navegue a otra página
  imagen.style.display = "block";
  audio.play(); // Reproducimos el audio
  imagen.classList.add("fullscreen"); // Añade la clase fullscreen para pantalla completa
});
document.getElementById("").addEventListener("");
