let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let users = JSON.parse(localStorage.getItem('users')) || [];
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

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
    let removeButton = document.createElement("button");
    removeButton.textContent = "x";
    removeButton.className = "buttonCarrito";
    removeButton.onclick = () => removeFromCart(index);
    li.appendChild(removeButton);

    cartList.appendChild(li);
    totalPrice += item.price * item.quantity;
  });
  totalElement.textContent = `$${totalPrice}`;
}

function removeFromCart(index) {
  if (cart[index].quantity > 1) {
    // Si hay más de una unidad, reducir la cantidad en 1
    cart[index].quantity -= 1;
  } else {
    // Si solo hay una unidad, eliminar el ítem del carrito
    cart.splice(index, 1);
  }
  updateCart();
  localStorage.setItem('cart', JSON.stringify(cart)); // Actualizar el carrito en localStorage
}

// Función para mostrar toast notifications
function showToast(message, isSuccess = true) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  // Establecer el mensaje y el color de fondo según el tipo de notificación
  toastMessage.textContent = message;
  toast.style.backgroundColor = isSuccess ? '#4CAF50' : '#f44336'; // Verde para éxito, rojo para error

  // Mostrar el toast
  toast.classList.add('show');

  // Ocultar el toast después de 3 segundos
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Hacer el inventario arrastrable
const inventoryDiv = document.getElementById('inventory');

let isDragging = false;
let offsetX, offsetY;

inventoryDiv.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - inventoryDiv.getBoundingClientRect().left;
  offsetY = e.clientY - inventoryDiv.getBoundingClientRect().top;
  inventoryDiv.style.cursor = 'grabbing'; // Cambiar el cursor al arrastrar
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    inventoryDiv.style.left = `${e.clientX - offsetX}px`;
    inventoryDiv.style.top = `${e.clientY - offsetY}px`;
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  inventoryDiv.style.cursor = 'grab'; // Restaurar el cursor
});

document.getElementById('checkout').addEventListener('click', function() {
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (currentUser.points >= totalPrice) {
    currentUser.points -= totalPrice;
    document.getElementById('points').textContent = currentUser.points;

    // Añadir los productos comprados al inventario
    cart.forEach(item => {
      const existingItem = inventory.find(i => i.product === item.product);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        inventory.push({ product: item.product, quantity: item.quantity });
      }
    });

    localStorage.setItem('inventory', JSON.stringify(inventory));
    cart = [];
    updateCart();
    showToast("Compra realizada con éxito.", true); // Toast de éxito
  } else {
    showToast("No tienes suficientes puntos para realizar esta compra.", false); // Toast de error
  }
});

document.getElementById('inventoryButton').addEventListener('click', function() {
  inventoryDiv.style.display = 'block';
  updateInventory();
});

document.getElementById('closeInventory').addEventListener('click', function() {
  document.getElementById('inventory').style.display = 'none';
});


function updateInventory() {
  const inventoryList = document.getElementById('inventoryList');
  inventoryList.innerHTML = "";
  inventory.forEach((item, index) => {
    let li = document.createElement("li");
    li.textContent = `${item.product} - Cantidad: ${item.quantity}`;
    inventoryList.appendChild(li);
  });
}

document.getElementById('logout').addEventListener('click', function() {
  localStorage.removeItem('currentUser');
  window.location.href = "login.html";
});