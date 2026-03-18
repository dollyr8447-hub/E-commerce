// Cart management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartCountEl = document.getElementById('cart-count');
const cartToggle = document.getElementById('cart-toggle');
const cartModal = document.getElementById('cart-modal');
const closeModal = document.querySelector('.close');
const cartItemsEl = document.getElementById('cart-items');
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutFormSection = document.getElementById('checkout-form');
const checkoutForm = document.getElementById('checkout');
const backToCartBtn = document.getElementById('back-to-cart');

// Update cart display
function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;

    if (totalItems === 0) {
        cartItemsEl.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        checkoutBtn.style.display = 'none';
    } else {
        renderCartItems();
        checkoutBtn.style.display = 'block';
    }

    updateTotals();
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Render cart items
function renderCartItems() {
    cartItemsEl.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-item" onclick="removeItem(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');
}

// Update totals
function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.10;
    const total = subtotal + tax;

    subtotalEl.textContent = subtotal.toFixed(2);
    taxEl.textContent = tax.toFixed(2);
    totalEl.textContent = total.toFixed(2);
}

// Add to cart
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        const product = btn.closest('.product');
        const id = parseInt(product.dataset.id);
        const name = product.dataset.name;
        const price = parseFloat(product.dataset.price);
        const image = product.querySelector('img').src;

        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1, image });
        }

        updateCartDisplay();
        btn.textContent = 'Added!';
        setTimeout(() => btn.textContent = 'Add to Cart', 1000);
    });
});

// Update quantity
function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeItem(id);
        } else {
            updateCartDisplay();
        }
    }
}

// Remove item
function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartDisplay();
}

// Event listeners
cartToggle.addEventListener('click', () => {
    cartModal.style.display = 'block';
    updateCartDisplay();
});

closeModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

checkoutBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
    checkoutFormSection.style.display = 'block';
});

backToCartBtn.addEventListener('click', () => {
    checkoutFormSection.style.display = 'none';
    cartModal.style.display = 'block';
});

// Checkout
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Order placed successfully! Thank you for shopping at ElectroMart.\\n(This is a demo - no real payment processed.)');
    cart = [];
    updateCartDisplay();
    checkoutFormSection.style.display = 'none';
    checkoutForm.reset();
});

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Initialize
updateCartDisplay();
