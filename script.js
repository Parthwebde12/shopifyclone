document.addEventListener('DOMContentLoaded', function() {
  // User Account and Cart Logic
  let currentUser = localStorage.getItem('currentUser') || null;

  function showUserModal() {
    document.getElementById('userModal').classList.remove('hidden');
  }
  function hideUserModal() {
    document.getElementById('userModal').classList.add('hidden');
    document.getElementById('userError').textContent = '';
  }

  function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '{}');
  }
  function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  function loginOrRegister(username, password) {
    let users = getUsers();
    if (users[username]) {
      if (users[username].password === password) {
        currentUser = username;
        localStorage.setItem('currentUser', username);
        return true;
      } else {
        return false;
      }
    } else {
      users[username] = { password, cart: [] };
      saveUsers(users);
      currentUser = username;
      localStorage.setItem('currentUser', username);
      return true;
    }
  }

  function getCurrentCart() {
    let users = getUsers();
    if (currentUser && users[currentUser]) {
      return Array.isArray(users[currentUser].cart) ? users[currentUser].cart : [];
    }
    return [];
  }
  function saveCurrentCart(cart) {
    let users = getUsers();
    if (currentUser && users[currentUser]) {
      users[currentUser].cart = cart;
      saveUsers(users);
    }
  }

  window.addToCart = function(item) {
    if (!currentUser) {
      showUserModal();
      return;
    }
    let cart = getCurrentCart();
    cart.push(item);
    saveCurrentCart(cart);
    updateCartCount();
    showCartMessage('Added to cart!');
  }

  // Buy Now logic and order history
  window.buyNow = function(item, price) {
    if (!currentUser) {
      showUserModal();
      return;
    }
    let users = getUsers();
    if (!users[currentUser]) return;
    if (!Array.isArray(users[currentUser].orders)) users[currentUser].orders = [];
    const order = { item, price, date: new Date().toLocaleString() };
    users[currentUser].orders.push(order);
    saveUsers(users);
    showPurchaseModal(order);
    renderOrderHistory();
  };

  function showPurchaseModal(order) {
    const details = document.getElementById('purchaseDetails');
    const modal = document.getElementById('purchaseModal');
    if (details && modal) {
      details.innerHTML = `<strong>${order.item}</strong> for ₹${order.price}<br><span class='text-sm text-gray-500'>${order.date}</span>`;
      modal.classList.remove('hidden');
    }
  }
  const closePurchaseModalBtn = document.getElementById('closePurchaseModal');
  if (closePurchaseModalBtn) {
    closePurchaseModalBtn.onclick = function() {
      document.getElementById('purchaseModal').classList.add('hidden');
    };
  }

  function renderOrderHistory() {
    let users = getUsers();
    const section = document.getElementById('orderHistorySection');
    const list = document.getElementById('orderHistoryList');
    if (currentUser && users[currentUser] && Array.isArray(users[currentUser].orders) && users[currentUser].orders.length > 0) {
      if (section) section.classList.remove('hidden');
      if (list) {
        list.innerHTML = users[currentUser].orders.map(o => `<li class='bg-white rounded shadow p-3 flex justify-between items-center'><span>${o.item}</span><span class='text-green-600 font-bold'>₹${o.price}</span><span class='text-xs text-gray-400'>${o.date}</span></li>`).join('');
      }
    } else {
      if (section) section.classList.add('hidden');
      if (list) list.innerHTML = '';
    }
  }

  // Render order history on login
  document.getElementById('registerForm').addEventListener('submit', function() {
    setTimeout(renderOrderHistory, 300);
  });
  // Also render on page load
  renderOrderHistory();

  function updateCartCount() {
    let cart = getCurrentCart();
    const cartCountElem = document.getElementById('cartCount');
    if (cartCountElem && Array.isArray(cart)) {
      cartCountElem.textContent = cart.length;
    }
  }

  function showCartMessage(msg) {
    const cartMsg = document.getElementById('cartMessage');
    if (cartMsg) {
      cartMsg.textContent = msg;
      cartMsg.classList.remove('opacity-0');
      cartMsg.classList.add('opacity-100');
      setTimeout(() => {
        cartMsg.classList.remove('opacity-100');
        cartMsg.classList.add('opacity-0');
      }, 1500);
    }
  }

  function buyCart() {
    if (!currentUser) {
      showUserModal();
      return;
    }
    let cart = getCurrentCart();
    if (!Array.isArray(cart) || cart.length === 0) {
      showCartMessage('Cart is empty!');
      return;
    }
    saveCurrentCart([]);
    updateCartCount();
    showCartMessage('Purchase successful!');
  }

  // Modal event listeners
  document.getElementById('profileBtn').addEventListener('click', showUserModal);
  document.getElementById('closeModal').addEventListener('click', hideUserModal);
  document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    if (!username || !password) {
      document.getElementById('userError').textContent = 'Please enter username and password.';
      return;
    }
    if (loginOrRegister(username, password)) {
      hideUserModal();
      updateCartCount();
      showCartMessage('Logged in as ' + username);
    } else {
      document.getElementById('userError').textContent = 'Incorrect password.';
    }
  });

  document.getElementById('cartBtn').addEventListener('click', buyCart);

  // On page load, update cart count if user is logged in
  updateCartCount();
});