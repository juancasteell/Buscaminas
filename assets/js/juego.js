// EventListener
document.addEventListener("DOMContentLoaded", () => {
  // Variables declaradas -----------------------------------------------------
  const grid = document.querySelector(".grid");
  const resetButton = document.querySelector(".reset");
  const flagsLeft = document.querySelector(".flags-left");
  const result = document.querySelector(".result");
  const timer = document.querySelector(".timer");

  let width = 10;
  let bombAmount = 20;
  let flags = 0;
  let squares = [];
  let count = 0; // Contador para el timer
  let intervalRed = 0;
  let isGameOver = false;

  // Funciones-----------------------------------------------------------------
  function crateBoard() {}
  // Funcion para que al hacer click izquierdo se destapen los cuadrados
  function click() {}
  // Funcion para que al hacer click derecho se ponga una bandera
  function addFlag() {}
  // Funcion para verificar si hay bombas alrededor
  function checkSquare() {}
});
