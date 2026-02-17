document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart count
    updateCartCount();

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.pages');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle icon
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.pages li a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // Check if we are on the cart page
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
    }
});

// Add to Cart Function
function addToCart(id) {
    const productElement = document.querySelector(`.p-box[data-id="${id}"]`);
    if (!productElement) return;

    const product = {
        id: id,
        name: productElement.dataset.name,
        price: parseInt(productElement.dataset.price),
        image: productElement.dataset.img,
        quantity: 1
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if item already exists
    const existingItemIndex = cart.findIndex(item => item.id === id);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // Show feedback
    alert(`${product.name} added to cart!`);
}

// Buy Now Function
function buyNow(id) {
    addToCart(id);
    window.location.href = 'cart.html';
}

// Update Cart Count in Navbar
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalCount;
    }
}

// Render Cart Items
function renderCart() {
    const cartContent = document.getElementById('cart-content');
    const cartSummary = document.getElementById('cart-summary');
    const cartTotalElement = document.getElementById('cart-total');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartContent.innerHTML = '<div class="empty-cart-msg">Your cart is empty. <br><a href="index.html" style="color: #e95454; text-decoration: none; margin-top: 20px; display: inline-block;">Start Shopping</a></div>';
        cartSummary.style.display = 'none';
        return;
    }

    cartSummary.style.display = 'block';

    let html = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        html += `
            <tr>
                <td style="display: flex; align-items: center; gap: 15px;">
                    <img src="${item.image}" class="cart-item-img" alt="${item.name}">
                    ${item.name}
                </td>
                <td>₹${item.price.toLocaleString()}</td>
                <td style="display: flex; align-items: center; gap: 10px;">
                    <button onclick="updateQuantity(${index}, -1)" style="padding: 5px 10px; background: #ddd; border: none; cursor: pointer;">-</button>
                    ${item.quantity}
                    <button onclick="updateQuantity(${index}, 1)" style="padding: 5px 10px; background: #ddd; border: none; cursor: pointer;">+</button>
                </td>
                <td>₹${itemTotal.toLocaleString()}</td>
                <td><button class="btn-remove" onclick="removeFromCart(${index})"><i class="fa-solid fa-trash"></i></button></td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    cartContent.innerHTML = html;
    cartTotalElement.textContent = total.toLocaleString();
}

// Remove from Cart
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// Update Quantity
function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart[index].quantity + change > 0) {
        cart[index].quantity += change;
    } else {
        // If quantity becomes 0, ask to confirm removal
        if (confirm('Remove item from cart?')) {
            cart.splice(index, 1);
        } else {
            return; // user cancelled logic
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}
