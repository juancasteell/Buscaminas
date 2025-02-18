let users = JSON.parse(localStorage.getItem('users')) || [];

function login(username, password) {
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user)); // Guardar usuario actual
    window.location.href = "tienda.html"; // Redirigir a la tienda
  } else {
    alert("Usuario o contraseña incorrectos. Serás redirigido al registro.");
    window.location.href = "register.html"; // Redirigir al registro
  }
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  login(username, password);
});