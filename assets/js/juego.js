// El eventListener
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const flagsLeft = document.querySelector("#flags-left");
  const resultado = document.querySelector("#resultado");
  const timer = document.querySelector("#timer");
  const botonCentral = document.querySelector(".botonCentral");

  let width = 10;
  let cantidadBombas = 30;
  let flags = 0;
  let cuadrados = [];
  let count = 0; // para el temporizador
  let intervalRef = null; // para el temporizador
  let isGameOver = false;

  // Funcion que crea tablero
  function createBoard() {
    // Arrays
    const arrayBombas = Array(cantidadBombas).fill("bomb"); // crear array de bombas
    const arrayVacio = Array(width * width - cantidadBombas).fill("valid"); // crear array vacío
    const arrayJuego = arrayVacio.concat(arrayBombas); // combinar ambos arrays
    const arrayMezclado = arrayJuego.sort(() => Math.random() - 0.5); // mezclar bombas por todo el array

    botonCentral.innerHTML = "🙂";
    flagsLeft.innerHTML = cantidadBombas;

    //
    for (let i = 0; i < width * width; i++) {
      const cuadrado = document.createElement("div");
      cuadrado.setAttribute("id", i);
      cuadrado.classList.add(arrayMezclado[i]);
      grid.appendChild(cuadrado);
      cuadrados.push(cuadrado);

      // Click normal
      cuadrado.addEventListener("click", function (e) {
        if (isGameOver) {
          return;
        }
        botonCentral.innerHTML = "😬";
        click(cuadrado);
      });

      // ctrl y click izquierdo
      cuadrado.oncontextmenu = function (e) {
        e.preventDefault();
        addFlag(cuadrado);
      };

      // Mouseover
      cuadrado.addEventListener("mouseover", function (e) {
        if (isGameOver) {
          return;
        }
        botonCentral.innerHTML = "🤔";
      });
    }

    // Añadir números a las fichas
    for (let i = 0; i < cuadrados.length; i++) {
      let total = 0;
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;

      if (cuadrados[i].classList.contains("valid")) {
        const surroundingSquares = [
          i - 1, // izquierda
          i + 1, // derecha
          i - width, // arriba
          i + width, // abajo
          i - width - 1, // arriba izquierda
          i - width + 1, // arriba derecha
          i + width - 1, // abajo izquierda
          i + width + 1, // abajo derecha
        ];

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
              total++;
            }
          }
        });

        cuadrados[i].setAttribute("data", total);
      }
    }
  }
  createBoard();

  // Añadir bandera con clic derecho
  function addFlag(cuadrado) {
    if (isGameOver) {
      return;
    }
    if (!cuadrado.classList.contains("checked") && flags < cantidadBombas) {
      if (!cuadrado.classList.contains("flag")) {
        cuadrado.classList.add("flag");
        cuadrado.innerHTML = "🚩";
        flags++;
        flagsLeft.innerHTML = cantidadBombas - flags;
        checkForWin();
      } else {
        cuadrado.classList.remove("flag");
        cuadrado.innerHTML = "";
        flags--;
        flagsLeft.innerHTML = cantidadBombas - flags; // arreglar para que se pueda desmarcar la bandera si se ha colocado la última bandera
      }
    }
  }

  // Acciones al hacer clic en una ficha
  function click(cuadrado) {
    let currentId = cuadrado.id;
    if (isGameOver) {
      return;
    }
    if (
      cuadrado.classList.contains("checked") ||
      cuadrado.classList.contains("flag")
    ) {
      return;
    }
    if (cuadrado.classList.contains("bomb")) {
      gameOver();
    } else {
      let total = cuadrado.getAttribute("data");
      if (total != 0) {
        cuadrado.classList.add("checked");
        if (total == 1) {
          cuadrado.classList.add("one");
        } // añadiendo clases para colores
        if (total == 2) {
          cuadrado.classList.add("two");
        }
        if (total == 3) {
          cuadrado.classList.add("three");
        }
        if (total == 4) {
          cuadrado.classList.add("four");
        }
        cuadrado.innerHTML = total;
        return;
      }
      checkcuadrado(cuadrado, currentId);
    }
    cuadrado.classList.add("checked");
  }

  // Comprobar cuadrados vecinos una vez que se hace clic en una cuadrado
  // Crea el efecto de expansión
  function checkcuadrado(cuadrado, currentId) {
    const isLeftEdge = currentId % width === 0;
    const isRightEdge = currentId % width === width - 1;

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = cuadrados[parseInt(currentId) - 1].id;
        //const newId = parseInt(currentId) - 1   ....refactor
        const newcuadrado = document.getElementById(newId);
        click(newcuadrado);
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = cuadrados[parseInt(currentId) + 1 - width].id;
        //const newId = parseInt(currentId) +1 -width   ....refactor
        const newcuadrado = document.getElementById(newId);
        click(newcuadrado);
      }
      if (currentId >= 10) {
        const newId = cuadrados[parseInt(currentId - width)].id;
        //const newId = parseInt(currentId) -width   ....refactor
        const newcuadrado = document.getElementById(newId);
        click(newcuadrado);
      }
      if (currentId >= 11 && !isLeftEdge) {
        const newId = cuadrados[parseInt(currentId) - 1 - width].id;
        //const newId = parseInt(currentId) -1 -width   ....refactor
        const newcuadrado = document.getElementById(newId);
        click(newcuadrado);
      }
      if (currentId <= 98 && !isRightEdge) {
        const newId = cuadrados[parseInt(currentId) + 1].id;
        //const newId = parseInt(currentId) +1   ....refactor
        const newcuadrado = document.getElementById(newId);
        click(newcuadrado);
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = cuadrados[parseInt(currentId) - 1 + width].id;
        //const newId = parseInt(currentId) -1 +width   ....refactor
        const newcuadrado = document.getElementById(newId);
        click(newcuadrado);
      }
      if (currentId <= 88 && !isRightEdge) {
        const newId = cuadrados[parseInt(currentId) + 1 + width].id;
        //const newId = parseInt(currentId) +1 +width   ....refactor
        const newcuadrado = document.getElementById(newId);
        click(newcuadrado);
      }
      if (currentId <= 89) {
        const newId = cuadrados[parseInt(currentId) + width].id;
        //const newId = parseInt(currentId) +width   ....refactor
        const newcuadrado = document.getElementById(newId);
        click(newcuadrado);
      }
    }, 10);
  }

  // Temporizador
  let startTime = function () {
    intervalRef = setInterval(() => {
      count += 10;
      let segundos = Math.floor(count / 1000);
      timer.innerHTML = segundos;
      if (segundos >= 60) {
        clearInterval(intervalRef);
        timeUp();
      }
    }, 10);
    removeEventListener("click", startTime);
  };
  // Iniciar el temporizador
  window.addEventListener("click", startTime);

  // Tiempo agotado
  function timeUp() {
    timer.innerHTML = "END";
    botonCentral.innerHTML = "😞";
    resultado.innerHTML = "¡Se acabó el tiempo!";
    isGameOver = "true";

    // Mostrar TODAS las bombas
    cuadrados.forEach((cuadrado) => {
      if (cuadrado.classList.contains("bomb")) {
        cuadrado.innerHTML = "💣";
      }
    });
  }

  // Fin del juego
  function gameOver(cuadrado) {
    clearInterval(intervalRef);
    timer.innerHTML = "END";
    botonCentral.innerHTML = "😵";
    resultado.innerHTML = "¡BOOM! ¡Fin del juego!";
    isGameOver = true;

    // Mostrar TODAS las bombas
    cuadrados.forEach((cuadrado) => {
      if (cuadrado.classList.contains("bomb")) {
        cuadrado.innerHTML = "💣";
      }
    });
  }

  // Comprobar si se ha ganado
  function checkForWin() {
    let matches = 0;

    for (let i = 0; i < cuadrados.length; i++) {
      if (
        cuadrados[i].classList.contains("flag") &&
        cuadrados[i].classList.contains("bomb")
      ) {
        matches++;
      }
      if (matches === cantidadBombas) {
        clearInterval(intervalRef);
        timer.innerHTML = "WIN";
        botonCentral.innerHTML = "😎";
        resultado.innerHTML = "¡HAS GANADO!";
        isGameOver = true;
      }
    }
  }

  // Reiniciar juego
  botonCentral.addEventListener("click", function (e) {
    botonCentral.style.borderColor = "#F0B7A4 #FFEBCF #FFEBCF #F0B7A4";
    location.reload();
  });
});
