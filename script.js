/***********************
  SHOW FILE NAMES
  (For Custom Designs & STL Upload)
***********************/
function showCustomDesignFileName() {
  const fileInput = document.getElementById('customImage');
  const fileNameElem = document.getElementById('customImageFileName');
  if (fileInput && fileInput.files[0]) {
    fileNameElem.textContent = fileInput.files[0].name;
  } else if (fileNameElem) {
    fileNameElem.textContent = '';
  }
}

function showStlFileName() {
  const fileInput = document.getElementById('fileInput');
  const fileNameElem = document.getElementById('stlFileName');
  if (fileInput && fileInput.files[0]) {
    fileNameElem.textContent = fileInput.files[0].name;
  } else if (fileNameElem) {
    fileNameElem.textContent = '';
  }
}

/***********************
  TOGGLE CUSTOM FORM
  (If you ever reintroduce a button to show/hide)
***********************/
function toggleCustomForm() {
  const formContainer = document.getElementById('customForm');
  if (!formContainer) return;
  if (formContainer.style.display === 'none' || formContainer.style.display === '') {
    formContainer.style.display = 'block';
  } else {
    formContainer.style.display = 'none';
  }
}

/***********************
  CUSTOM DESIGN FORM
***********************/
const customDesignForm = document.getElementById('customDesignForm');
if (customDesignForm) {
  customDesignForm.addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('customFormMessage').textContent =
      'Thank you! We will contact you soon about your custom design request.';
    // Reset form
    customDesignForm.reset();
    // Also clear displayed file name
    const fileNameElem = document.getElementById('customImageFileName');
    if (fileNameElem) fileNameElem.textContent = '';
  });
}

/***********************
  STL UPLOAD FORM
***********************/
const stlForm = document.getElementById('stlForm');
if (stlForm) {
  stlForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput');
    if (!fileInput || !fileInput.files[0]) {
      alert('Please select an STL file to upload.');
      return;
    }
    document.getElementById('stlMessage').textContent =
      'Your STL file has been uploaded. We’ll get back to you with a quote shortly.';
    // Reset the form
    stlForm.reset();
    // Clear displayed file name
    const fileNameElem = document.getElementById('stlFileName');
    if (fileNameElem) fileNameElem.textContent = '';
  });
}

/***********************
  CART FUNCTIONALITY
***********************/
/**
 * addToCart(productName, price)
 * - Retrieves current cart from localStorage (or empty array if none).
 * - Checks if item already in cart; if yes, increments quantity; if no, pushes new.
 * - Saves cart back to localStorage.
 */
function addToCart(productName, price) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  // Check if item already in cart
  let existingItem = cart.find(item => item.product === productName);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      product: productName,
      price: parseFloat(price),
      quantity: 1
    });
  }
  // Save updated cart
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${productName} added to cart!`);
}

/**
 * loadCart()
 * - Called on cart.html. Loads cart data from localStorage, builds HTML table,
 *   calculates subtotal, and attaches remove-item event listeners.
 */
function loadCart() {
  const cartItemsContainer = document.getElementById('cartItems');
  const cartSubtotalElem = document.getElementById('cartSubtotal');

  if (!cartItemsContainer || !cartSubtotalElem) return; // Not on cart page, skip.

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    cartSubtotalElem.textContent = '0.00';
    return;
  }

  let cartHTML = `
    <table class="cart-table">
      <tr>
        <th>Product</th>
        <th>Price</th>
        <th>Qty</th>
        <th>Remove</th>
      </tr>
  `;
  let subtotal = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    cartHTML += `
      <tr>
        <td>${item.product}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>${item.quantity}</td>
        <td><button class="remove-item" data-index="${index}">X</button></td>
      </tr>
    `;
  });

  cartHTML += '</table>';
  cartItemsContainer.innerHTML = cartHTML;
  cartSubtotalElem.textContent = subtotal.toFixed(2);

  // Attach remove handlers
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', removeCartItem);
  });
}

/**
 * removeCartItem(e)
 * - Removes item from cart array by index, updates localStorage, reloads cart.
 */
function removeCartItem(e) {
  const index = e.target.getAttribute('data-index');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1); // remove the item
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart(); // re-render
}

/***********************
  CHECKOUT (Stripe) 
  Call your Node server
***********************/
const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', handleCheckout);
}

async function handleCheckout() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  let customerName = prompt("Please enter your name (for the order):") || "Guest";

  try {
    const response = await fetch('http://localhost:3001/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cartItems: cart,
        customerInfo: { name: customerName }
      })
    });

    const data = await response.json();
    if (data.id) {
      // data.id is your Stripe Session ID
      const stripe = Stripe('pk_test_51QtOM3KkgqnFD37lKojTnLFvcZwwtw4icyBSjRYOL0A2ZEHSGc1U428ec5VKJLXrMBnXfPINdB31MHNlkLjBJGNk00GuSjE89x');
      await stripe.redirectToCheckout({ sessionId: data.id });
    } else {
      alert('Error creating checkout session.');
    }
  } catch (err) {
    console.error(err);
    alert('Checkout failed. See console for details.');
  }
}

/***********************
  ADD EVENT LISTENERS
  FOR .add-to-cart BUTTONS
***********************/
document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const productName = btn.getAttribute('data-product');
    const price = btn.getAttribute('data-price');
    addToCart(productName, price);
  });
});

/***********************
  ON PAGE LOAD
***********************/
document.addEventListener('DOMContentLoaded', () => {
  // If on cart.html, load the cart
  loadCart();
});