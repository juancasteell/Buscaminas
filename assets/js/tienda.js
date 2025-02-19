let cart = [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let users = JSON.parse(localStorage.getItem('users')) || [];

if (!currentUser) {
  alert("Por favor, inicia sesión para acceder a la tienda.");
  window.location.href = "login.html";
} else {
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
  if (!currentUser) {
    alert("Por favor, inicia sesión para agregar productos al carrito.");
    window.location.href = "login.html";
    return;
  }

  const existingProduct = cart.find(item => item.product === product);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ product, price, quantity: 1 });
  }

  updateCart();
  localStorage.setItem('cart', JSON.stringify(cart)); // Persistir el carrito en localStorage
}

function updateCart() {
  const cartList = document.getElementById("cart");
  const totalElement = document.getElementById("total");
  cartList.innerHTML = "";
  let totalPrice = 0;
  cart.forEach((item, index) => {
    let li = document.createElement("li");
    li.textContent = `${item.product} - $${item.price} x${item.quantity}`;
    
    // Botón para eliminar el producto
    let removeButton = document.createElement("buttonCarrito");
    removeButton.textContent = "x";
    removeButton.onclick = () => removeFromCart(index);
    li.appendChild(removeButton);
    
    cartList.appendChild(li);
    totalPrice += item.price * item.quantity;
  });
  totalElement.textContent = `$${totalPrice}`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

document.getElementById('checkout').addEventListener('click', function() {
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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

document.getElementById('logout').addEventListener('click', function() {
  localStorage.removeItem('currentUser');
  window.location.href = "login.html";
});