// El eventListener
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const flagsLeft = document.querySelector("#flags-left");
  const result = document.querySelector("#result");
  const timer = document.querySelector("#timer");
  const emojiBtn = document.querySelector(".emoji-btn");

  let width = 10;
  let bombAmount = 5;
  let flags = 0;
  let squares = [];
  let count = 0; // para el temporizador
  let intervalRef = null; // para el temporizador
  let isGameOver = false;

  // Funcion que crea tablero
  function createBoard() {
    // Obtener array de juego mezclado con bombas aleatorias
    const bombsArray = Array(bombAmount).fill("bomb"); // crear array de bombas
    const emptyArray = Array(width * width - bombAmount).fill("valid"); // crear array vacío
    const gameArray = emptyArray.concat(bombsArray); // combinar ambos arrays
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5); // mezclar bombas por todo el array

    emojiBtn.innerHTML = "🙂";
    flagsLeft.innerHTML = bombAmount;

    //
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("id", i);
      square.classList.add(shuffledArray[i]);
      grid.appendChild(square);
      squares.push(square);

      // Click normal
      square.addEventListener("click", function (e) {
        if (isGameOver) {
          return;
        }
        emojiBtn.innerHTML = "😬";
        click(square);
      });

      // ctrl y click izquierdo
      square.oncontextmenu = function (e) {
        e.preventDefault();
        addFlag(square);
      };

      // Mouseover
      square.addEventListener("mouseover", function (e) {
        if (isGameOver) {
          return;
        }
        emojiBtn.innerHTML = "🤔";
      });
    }

    // Añadir números a las fichas
    for (let i = 0; i < squares.length; i++) {
      let total = 0;
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;

      if (squares[i].classList.contains("valid")) {
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb")) {
          total++;
        }
        if (
          i > 9 &&
          !isRightEdge &&
          squares[i + 1 - width].classList.contains("bomb")
        ) {
          total++;
        }
        if (i > 10 && squares[i - width].classList.contains("bomb")) {
          total++;
        }
        if (
          i > 11 &&
          !isLeftEdge &&
          squares[i - 1 - width].classList.contains("bomb")
        ) {
          total++;
        }
        if (
          i < 98 &&
          !isRightEdge &&
          squares[i + 1].classList.contains("bomb")
        ) {
          total++;
        }
        if (
          i < 90 &&
          !isLeftEdge &&
          squares[i - 1 + width].classList.contains("bomb")
        ) {
          total++;
        }
        if (
          i < 88 &&
          !isRightEdge &&
          squares[i + 1 + width].classList.contains("bomb")
        ) {
          total++;
        }
        if (i < 89 && squares[i + width].classList.contains("bomb")) {
          total++;
        }
        squares[i].setAttribute("data", total);
      }
    }
  }
  createBoard();

  // Añadir bandera con clic derecho
  function addFlag(square) {
    if (isGameOver) {
      return;
    }
    if (!square.classList.contains("checked") && flags < bombAmount) {
      if (!square.classList.contains("flag")) {
        square.classList.add("flag");
        square.innerHTML = "🚩";
        flags++;
        flagsLeft.innerHTML = bombAmount - flags;
        checkForWin();
      } else {
        square.classList.remove("flag");
        square.innerHTML = "";
        flags--;
        flagsLeft.innerHTML = bombAmount - flags; // arreglar para que se pueda desmarcar la bandera si se ha colocado la última bandera
      }
    }
  }

  // Acciones al hacer clic en una ficha
  function click(square) {
    let currentId = square.id;
    if (isGameOver) {
      return;
    }
    if (
      square.classList.contains("checked") ||
      square.classList.contains("flag")
    ) {
      return;
    }
    if (square.classList.contains("bomb")) {
      gameOver();
    } else {
      let total = square.getAttribute("data");
      if (total != 0) {
        square.classList.add("checked");
        if (total == 1) {
          square.classList.add("one");
        } // añadiendo clases para colores
        if (total == 2) {
          square.classList.add("two");
        }
        if (total == 3) {
          square.classList.add("three");
        }
        if (total == 4) {
          square.classList.add("four");
        }
        square.innerHTML = total;
        return;
      }
      checkSquare(square, currentId);
    }
    square.classList.add("checked");
  }

  // Comprobar fichas vecinas una vez que se hace clic en una ficha
  // Crea el efecto de expansión
  function checkSquare(square, currentId) {
    const isLeftEdge = currentId % width === 0;
    const isRightEdge = currentId % width === width - 1;

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1].id;
        //const newId = parseInt(currentId) - 1   ....refactor
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 - width].id;
        //const newId = parseInt(currentId) +1 -width   ....refactor
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId >= 10) {
        const newId = squares[parseInt(currentId - width)].id;
        //const newId = parseInt(currentId) -width   ....refactor
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId >= 11 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 - width].id;
        //const newId = parseInt(currentId) -1 -width   ....refactor
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId <= 98 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1].id;
        //const newId = parseInt(currentId) +1   ....refactor
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 + width].id;
        //const newId = parseInt(currentId) -1 +width   ....refactor
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId <= 88 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 + width].id;
        //const newId = parseInt(currentId) +1 +width   ....refactor
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId <= 89) {
        const newId = squares[parseInt(currentId) + width].id;
        //const newId = parseInt(currentId) +width   ....refactor
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
    }, 10);
  }

  // Temporizador
  let startTime = function () {
    intervalRef = setInterval(() => {
      count += 10;
      let s = Math.floor(count / 1000);
      timer.innerHTML = s;
      if (s >= 90) {
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
    emojiBtn.innerHTML = "😞";
    result.innerHTML = "¡Se acabó el tiempo!";
    isGameOver = "true";

    // Mostrar TODAS las bombas
    squares.forEach((square) => {
      if (square.classList.contains("bomb")) {
        square.innerHTML = "💣";
      }
    });
  }

  // Fin del juego
  function gameOver(square) {
    clearInterval(intervalRef);
    timer.innerHTML = "END";
    emojiBtn.innerHTML = "😵";
    result.innerHTML = "¡BOOM! ¡Fin del juego!";
    isGameOver = true;

    // Mostrar TODAS las bombas
    squares.forEach((square) => {
      if (square.classList.contains("bomb")) {
        square.innerHTML = "💣";
      }
    });
  }

  // Comprobar si se ha ganado
  function checkForWin() {
    let matches = 0;

    for (let i = 0; i < squares.length; i++) {
      if (
        squares[i].classList.contains("flag") &&
        squares[i].classList.contains("bomb")
      ) {
        matches++;
      }
      if (matches === bombAmount) {
        clearInterval(intervalRef);
        timer.innerHTML = "WIN";
        emojiBtn.innerHTML = "😎";
        result.innerHTML = "¡HAS GANADO!";
        isGameOver = true;
      }
    }
  }

  // Reiniciar juego
  emojiBtn.addEventListener("click", function (e) {
    emojiBtn.style.borderColor = "#F0B7A4 #FFEBCF #FFEBCF #F0B7A4";
    location.reload();
  });
});
