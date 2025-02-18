let users = JSON.parse(localStorage.getItem('users')) || [];

function register(username, password) {
  const userExists = users.some(u => u.username === username);
  if (userExists) {
    alert("El usuario ya existe. Por favor, inicia sesión.");
    window.location.href = "login.html"; // Redirigir al login
  } else {
    const newUser = { username, password, points: 0 };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert("Registro exitoso. Por favor, inicia sesión.");
    window.location.href = "login.html"; // Redirigir al login
  }
}

document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;
  register(username, password);
});