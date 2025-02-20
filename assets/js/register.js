let users = JSON.parse(localStorage.getItem('users')) || [];

function register(username, password) {
  const userExists = users.some(u => u.username === username);
  if (userExists) {
    alert("El usuario ya existe. Por favor, inicia sesión.");
    window.location.href = "login.html";
  } else {
    const newUser = { username, password, points: 0, inventory: [] }; // Añadir inventario vacío
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert("Registro exitoso. Por favor, inicia sesión.");
    window.location.href = "login.html";
  }
}

document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;
  register(username, password);
});