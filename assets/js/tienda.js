let cart = [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null; // Cargar usuario actual
let users = JSON.parse(localStorage.getItem('users')) || [];

// Verificar si hay un usuario logueado
if (!currentUser) {
  alert("Por favor, inicia sesión para acceder a la tienda.");
  window.location.href = "login.html"; // Redirigir al login si no hay usuario
} else {
  // Mostrar información del usuario
  document.getElementById('username').textContent = currentUser.username;
  document.getElementById('points').textContent = currentUser.points;
}

function addPoints(points) {
    if (currentUser) {
      currentUser.points += points;
      document.getElementById('points').textContent = currentUser.points;
      const userIndex = users.findIndex(u => u.username === currentUser.username);
      users[userIndex] = currentUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  }

function addToCart(product, price) {
  if (currentUser) {
    cart.push({ product, price });
    updateCart();
  } else {
    alert("Por favor, inicia sesión para agregar productos al carrito.");
    window.location.href = "login.html"; // Redirigir al login si no hay usuario
  }
}

function updateCart() {
  const cartList = document.getElementById("cart");
  const totalElement = document.getElementById("total");
  cartList.innerHTML = "";
  let totalPrice = 0;
  cart.forEach((item) => {
    let li = document.createElement("li");
    li.textContent = `${item.product} - $${item.price}`;
    cartList.appendChild(li);
    totalPrice += item.price;
  });
  totalElement.textContent = `$${totalPrice}`;
}

document.getElementById('checkout').addEventListener('click', function() {
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  if (currentUser.points >= totalPrice) {
    currentUser.points -= totalPrice;
    document.getElementById('points').textContent = currentUser.points;
    cart = [];
    updateCart();
    alert("Compra realizada con éxito.");
  } else {
    alert("No tienes suficientes puntos para realizar esta compra.");
  }
});


// Cerrar sesión
document.getElementById('logout').addEventListener('click', function() {
  localStorage.removeItem('currentUser'); // Eliminar usuario actual
  window.location.href = "login.html"; // Redirigir al login
});


