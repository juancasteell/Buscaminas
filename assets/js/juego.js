// El eventListener
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid"); // Selecciona el contenedor de la cuadrícula
  const flagsLeft = document.querySelector("#flags-left"); // Selecciona el elemento que muestra las banderas restantes
  const resultado = document.querySelector("#resultado"); // Selecciona el elemento que muestra el resultado del juego
  const timer = document.querySelector("#timer"); // Selecciona el elemento que muestra el temporizador
  const botonCentral = document.querySelector(".botonCentral"); // Selecciona el botón central para reiniciar el juego

  let width = 10; // Ancho del tablero
  let cantidadBombas = 20; // Número de bombas en el tablero
  let flags = 0; // Contador de banderas colocadas
  let cuadrados = []; // Array que contiene todos los cuadrados del tablero
  let count = 0; // para el temporizador
  let intervalRef = null; // para el temporizador
  let isGameOver = false; // Estado del juego
  let isFirstClick = true; // Verifica si es el primer clic del jugador

  let estoyEn = document.body.dataset.page; // Comprueba en que archivo html estoy

  // Funcion que crea tablero
  function createBoard() {
    botonCentral.innerHTML = "▶"; // Establece el emoji inicial del botón central
    flagsLeft.innerHTML = cantidadBombas; // Muestra la cantidad de banderas restantes

    // Crear un tablero vacío (sin bombas)
    for (let i = 0; i < width * width; i++) {
      const cuadrado = document.createElement("div"); // Crea un nuevo div para cada cuadrado
      cuadrado.setAttribute("id", i); // Asigna un ID único a cada cuadrado
      cuadrado.classList.add("valid"); // Añade la clase "valid" a cada cuadrado
      grid.appendChild(cuadrado); // Añade el cuadrado a la cuadrícula
      cuadrados.push(cuadrado); // Añade el cuadrado al array de cuadrados

      // Click normal
      cuadrado.addEventListener("click", function (e) {
        if (isGameOver) return; // Si el juego ha terminado, no hacer nada
        botonCentral.innerHTML = "✅"; // Cambia el emoji del botón central al hacer clic

        if (isFirstClick) {
          placeBombs(i); // Ubica las bombas asegurando que el primer clic no sea una bomba
          addNumbers(); // Añade números a los cuadrados adyacentes a las bombas
          isFirstClick = false; // Marca que el primer clic ya se ha realizado
        }

        click(cuadrado); // Llama a la función click para manejar el clic en el cuadrado
      });

      // Click derecho (marcar bandera)
      cuadrado.oncontextmenu = function (e) {
        e.preventDefault(); // Previene el menú contextual del clic derecho
        addFlag(cuadrado); // Llama a la función addFlag para manejar la colocación de banderas
      };

      // Mouseover
      cuadrado.addEventListener("mouseover", function (e) {
        if (isGameOver) return; // Si el juego ha terminado, no hacer nada
        botonCentral.innerHTML = "🤔"; // Cambia el emoji del botón central al pasar el ratón por encima
      });
    }
  }

  function placeBombs(firstClickIndex) {
    let posicionesDisponibles = Array.from(
      { length: width * width },
      (_, i) => i
    ); // Crea un array con todas las posiciones disponibles
    posicionesDisponibles.splice(firstClickIndex, 1); // Evita que haya bomba en la celda inicial

    let bombasColocadas = 0; // Contador de bombas colocadas
    while (bombasColocadas < cantidadBombas) {
      let indexAleatorio = Math.floor(
        Math.random() * posicionesDisponibles.length
      ); // Selecciona una posición aleatoria
      let posicionBomba = posicionesDisponibles.splice(indexAleatorio, 1)[0]; // Remueve la posición seleccionada del array

      cuadrados[posicionBomba].classList.remove("valid"); // Marca el cuadrado como no válido
      cuadrados[posicionBomba].classList.add("bomb"); // Añade la clase "bomb" al cuadrado

      bombasColocadas++; // Incrementa el contador de bombas colocadas
    }
  }

  function addNumbers() {
    for (let i = 0; i < cuadrados.length; i++) {
      let total = 0; // Contador de bombas adyacentes
      const isLeftEdge = i % width === 0; // Verifica si el cuadrado está en el borde izquierdo
      const isRightEdge = i % width === width - 1; // Verifica si el cuadrado está en el borde derecho

      if (cuadrados[i].classList.contains("valid")) {
        const surroundingSquares = [
          i - 1,
          i + 1,
          i - width,
          i + width,
          i - width - 1,
          i - width + 1,
          i + width - 1,
          i + width + 1,
        ]; // Array con las posiciones de los cuadrados adyacentes

        surroundingSquares.forEach((pos) => {
          if (
            pos >= 0 &&
            pos < width * width &&
            !(
              (isLeftEdge &&
                [i - 1, i - width - 1, i + width - 1].includes(pos)) ||
              (isRightEdge &&
                [i + 1, i - width + 1, i + width + 1].includes(pos))
            )
          ) {
            if (cuadrados[pos].classList.contains("bomb")) {
              total++; // Incrementa el contador si el cuadrado adyacente contiene una bomba
            }
          }
        });

        cuadrados[i].setAttribute("data", total); // Establece el atributo "data" con el número de bombas adyacentes
      }
    }
  }

  createBoard();

  // Añadir bandera con clic derecho
  function addFlag(cuadrado) {
    if (isGameOver) {
      return; // Si el juego ha terminado, no hacer nada
    }
    if (!cuadrado.classList.contains("checked") && flags < cantidadBombas) {
      if (!cuadrado.classList.contains("flag")) {
        cuadrado.classList.add("flag"); // Añade la clase "flag" al cuadrado

        // A MISA GRACIAS DIOS POR ESTA BENDICION DE LINEA

        // let estoyEn = document.body.dataset.page;
        if (estoyEn == "pirate") {
          console.log("estoy en pirate");
          cuadrado.innerHTML = "🏴‍☠️";
        } else {
          console.log("estoy en alien");
          cuadrado.innerHTML = "👽";
        }

        flags++; // Incrementa el contador de banderas colocadas
        flagsLeft.innerHTML = cantidadBombas - flags; // Actualiza el contador de banderas restantes
        checkForWin(); // Verifica si el jugador ha ganado
      } else {
        cuadrado.classList.remove("flag"); // Remueve la clase "flag" del cuadrado
        cuadrado.innerHTML = ""; // Remueve el emoji de bandera del cuadrado
        flags--; // Decrementa el contador de banderas colocadas
        flagsLeft.innerHTML = cantidadBombas - flags; // Actualiza el contador de banderas restantes
      }
    }
  }

  // Acciones al hacer clic en una ficha
  function click(cuadrado) {
    let currentId = cuadrado.id; // Obtiene el ID del cuadrado actual
    if (isGameOver) {
      return; // Si el juego ha terminado, no hacer nada
    }
    if (
      cuadrado.classList.contains("checked") ||
      cuadrado.classList.contains("flag")
    ) {
      return; // Si el cuadrado ya ha sido revisado o tiene una bandera, no hacer nada
    }
    if (cuadrado.classList.contains("bomb")) {
      gameOver(); // Si el cuadrado contiene una bomba, termina el juego
    } else {
      let total = cuadrado.getAttribute("data"); // Obtiene el número de bombas adyacentes
      if (total != 0) {
        cuadrado.classList.add("checked"); // Marca el cuadrado como revisado
        if (total == 1) {
          cuadrado.classList.add("uno");
        } // Añade clases para colores
        if (total == 2) {
          cuadrado.classList.add("dos");
        }
        if (total == 3) {
          cuadrado.classList.add("tres");
        }
        if (total == 4) {
          cuadrado.classList.add("cuatro");
        }
        if (total == 5) {
          cuadrado.classList.add("cinco");
        }
        cuadrado.innerHTML = total; // Muestra el número de bombas adyacentes en el cuadrado
        return;
      }
      checkcuadrado(cuadrado, currentId); // Verifica los cuadrados adyacentes
    }
    cuadrado.classList.add("checked"); // Marca el cuadrado como revisado
  }

  // Comprobar cuadrados vecinos una vez que se hace clic en una cuadrado
  // Crea el efecto de expansión
  function checkcuadrado(cuadrado, currentId) {
    const isLeftEdge = currentId % width === 0; // Verifica si el cuadrado está en el borde izquierdo
    const isRightEdge = currentId % width === width - 1; // Verifica si el cuadrado está en el borde derecho

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = cuadrados[parseInt(currentId) - 1].id;
        //const newId = parseInt(currentId) - 1   ....refactor
        const newcuadrado = document.getElementById(newId);
        click(newcuadrado); // Llama a la función click para el cuadrado adyacente
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = cuadrados[parseInt(currentId) + 1 - width].id;
        //const newId = parseInt(currentId) +1 -width   ....refactor
        const newcuadrado = document.getElementById(newId);
        click(newcuadrado); // Llama a la función click para el cuadrado adyacente
      }
      if (currentId >= 10) {
        const newId = cuadrados[parseInt(currentId - width)].id;
        //const newId = parseInt(currentId) -width   ....refactor
        const newcuadrado = document.getElementById(newId);
        click(newcuadrado); // Llama a la función click para el cuadrado adyacente
      }
      if (currentId >= 11 && !isLeftEdge) {
        const newId = cuadrados[parseInt(currentId) - 1 - width].id;
        //const newId = parseInt(currentId) -1 -width   ....refactor
        const newcuadrado = document.getElementById(newId);
        click(newcuadrado); // Llama a la función click para el cuadrado adyacente
      }
      if (currentId <= 98 && !isRightEdge) {
        const newId = cuadrados[parseInt(currentId) + 1].id;
        //const newId = parseInt(currentId) +1   ....refactor
        const newcuadrado = document.getElementById(newId);
        click(newcuadrado); // Llama a la función click para el cuadrado adyacente
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = cuadrados[parseInt(currentId) - 1 + width].id;
        //const newId = parseInt(currentId) -1 +width   ....refactor
        const newcuadrado = document.getElementById(newId);
        click(newcuadrado); // Llama a la función click para el cuadrado adyacente
      }
      if (currentId <= 88 && !isRightEdge) {
        const newId = cuadrados[parseInt(currentId) + 1 + width].id;
        //const newId = parseInt(currentId) +1 +width   ....refactor
        const newcuadrado = document.getElementById(newId);
        click(newcuadrado); // Llama a la función click para el cuadrado adyacente
      }
      if (currentId <= 89) {
        const newId = cuadrados[parseInt(currentId) + width].id;
        //const newId = parseInt(currentId) +width   ....refactor
        const newcuadrado = document.getElementById(newId);
        click(newcuadrado); // Llama a la función click para el cuadrado adyacente
      }
    }, 10);
  }

  // Temporizador
  let startTime = function () {
    intervalRef = setInterval(() => {
      count += 10; // Incrementa el contador del temporizador
      let segundos = Math.floor(count / 1000); // Convierte el contador a segundos
      timer.innerHTML = segundos; // Muestra los segundos en el elemento del temporizador
      if (segundos >= 5) {
        clearInterval(intervalRef); // Detiene el temporizador si llega a 60 segundos
        timeUp(); // Llama a la función timeUp cuando se acaba el tiempo
      }
    }, 10);
    removeEventListener("click", startTime); // Remueve el event listener para evitar múltiples inicios del temporizador
  };
  // Iniciar el temporizador
  window.addEventListener("click", startTime); // Inicia el temporizador al hacer clic en cualquier parte de la ventana

  // Tiempo agotado
  function timeUp() {
    timer.innerHTML = "FIN."; // Muestra "END" en el temporizador
    botonCentral.innerHTML = "❌"; // Cambia el emoji del botón central
    resultado.innerHTML = "¡Se acabó el tiempo!"; // Muestra el mensaje de tiempo agotado
    isGameOver = "true"; // Marca el juego como terminado

    // Mostrar TODAS las bombas
    cuadrados.forEach((cuadrado) => {
      if (cuadrado.classList.contains("bomb")) {
        if (estoyEn == "pirate") {
          console.log("estoy en pirate");
          cuadrado.innerHTML = "🧨";
        } else {
          console.log("estoy en alien");
          cuadrado.innerHTML = "💣";
        }
      }
    });
  }

  // Fin del juego
  function gameOver(cuadrado) {
    clearInterval(intervalRef); // Detiene el temporizador
    timer.innerHTML = "FIN"; // Muestra "END" en el temporizador
    botonCentral.innerHTML = "💥"; // Cambia el emoji del botón central
    resultado.innerHTML = "¡ALLAHUAKBAR!"; // Muestra el mensaje de fin del juego
    isGameOver = true; // Marca el juego como terminado

    // Mostrar TODAS las bombas
    cuadrados.forEach((cuadrado) => {
      if (cuadrado.classList.contains("bomb")) {
        if (estoyEn == "pirate") {
          console.log("estoy en pirate");
          cuadrado.innerHTML = "🧨";
        } else {
          console.log("estoy en alien");
          cuadrado.innerHTML = "💣";
        }
      }
    });
  }

  // Comprobar si se ha ganado
  function checkForWin() {
    let matches = 0; // Contador de coincidencias entre banderas y bombas

    for (let i = 0; i < cuadrados.length; i++) {
      if (
        cuadrados[i].classList.contains("flag") &&
        cuadrados[i].classList.contains("bomb")
      ) {
        matches++; // Incrementa el contador si una bandera coincide con una bomba
      }
      if (matches === cantidadBombas) {
        clearInterval(intervalRef); // Detiene el temporizador
        timer.innerHTML = "GG"; // Muestra "WIN" en el temporizador
        botonCentral.innerHTML = "🎉"; // Cambia el emoji del botón central
        resultado.innerHTML = "¡BUEENAAA!"; // Muestra el mensaje de victoria
        isGameOver = true; // Marca el juego como terminado
      }
    }
  }

  // Reiniciar juego
  botonCentral.addEventListener("click", function (e) {
    botonCentral.style.borderColor = "#F0B7A4 #FFEBCF #FFEBCF #F0B7A4"; // Cambia el color del borde del botón central
    location.reload(); // Recarga la página para reiniciar el juego
  });
});
