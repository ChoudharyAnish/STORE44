// Sample grocery products data
const products = [
    // Vegetables
    { id: 1, name: "Fresh Tomatoes", price: 40, category: "vegetables", image: "🍅", stock: 50 },
    { id: 2, name: "Onions", price: 30, category: "vegetables", image: "🧅", stock: 30 },
    { id: 3, name: "Potatoes", price: 25, category: "vegetables", image: "🥔", stock: 40 },
    { id: 4, name: "Carrots", price: 35, category: "vegetables", image: "🥕", stock: 25 },
    { id: 5, name: "Spinach", price: 20, category: "vegetables", image: "🥬", stock: 20 },
    { id: 6, name: "Bell Peppers", price: 60, category: "vegetables", image: "🫑", stock: 15 },
    
    // Fruits
    { id: 7, name: "Bananas", price: 50, category: "fruits", image: "🍌", stock: 30 },
    { id: 8, name: "Apples", price: 80, category: "fruits", image: "🍎", stock: 25 },
    { id: 9, name: "Oranges", price: 70, category: "fruits", image: "🍊", stock: 20 },
    { id: 10, name: "Grapes", price: 120, category: "fruits", image: "🍇", stock: 15 },
    { id: 11, name: "Mangoes", price: 100, category: "fruits", image: "🥭", stock: 18 },
    { id: 12, name: "Strawberries", price: 150, category: "fruits", image: "🍓", stock: 12 },
    
    // Dairy
    { id: 13, name: "Milk (1L)", price: 60, category: "dairy", image: "🥛", stock: 20 },
    { id: 14, name: "Cheese", price: 200, category: "dairy", image: "🧀", stock: 10 },
    { id: 15, name: "Yogurt", price: 45, category: "dairy", image: "🍶", stock: 25 },
    { id: 16, name: "Butter", price: 80, category: "dairy", image: "🧈", stock: 15 },
    { id: 17, name: "Eggs (12)", price: 90, category: "dairy", image: "🥚", stock: 30 },
    
    // Grains
    { id: 18, name: "Rice (1kg)", price: 80, category: "grains", image: "🍚", stock: 40 },
    { id: 19, name: "Wheat Flour", price: 50, category: "grains", image: "🌾", stock: 35 },
    { id: 20, name: "Lentils", price: 120, category: "grains", image: "🫘", stock: 25 },
    { id: 21, name: "Oats", price: 100, category: "grains", image: "🌾", stock: 20 },
    { id: 22, name: "Quinoa", price: 200, category: "grains", image: "🌾", stock: 15 },
    
    // Snacks
    { id: 23, name: "Biscuits", price: 30, category: "snacks", image: "🍪", stock: 50 },
    { id: 24, name: "Chips", price: 25, category: "snacks", image: "🍟", stock: 40 },
    { id: 25, name: "Nuts Mix", price: 150, category: "snacks", image: "🥜", stock: 20 },
    { id: 26, name: "Chocolate", price: 80, category: "snacks", image: "🍫", stock: 30 },
    { id: 27, name: "Candy", price: 20, category: "snacks", image: "🍬", stock: 60 }
];

// Global variables
let cart = [];
let currentFilter = 'all';
let filteredProducts = [...products];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    setupEventListeners();
    updateCartUI();
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);
    
    // Category filters
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            currentFilter = this.dataset.category;
            filterProducts();
        });
    });
    
    // Checkout form
    const checkoutForm = document.getElementById('checkoutForm');
    checkoutForm.addEventListener('submit', handleOrderSubmission);
}

// Handle search
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) &&
        (currentFilter === 'all' || product.category === currentFilter)
    );
    renderProducts();
}

// Filter products by category
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) &&
        (currentFilter === 'all' || product.category === currentFilter)
    );
    renderProducts();
}

// Render products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #6c757d;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                <h3>No products found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.image}
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">₹${product.price}</div>
                <div class="product-actions">
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="decreaseQuantity(${product.id})" 
                                ${getCartItemQuantity(product.id) <= 0 ? 'disabled' : ''}>-</button>
                        <span class="quantity">${getCartItemQuantity(product.id)}</span>
                        <button class="qty-btn" onclick="increaseQuantity(${product.id})"
                                ${getCartItemQuantity(product.id) >= product.stock ? 'disabled' : ''}>+</button>
                    </div>
                    <button class="add-to-cart" onclick="addToCart(${product.id})"
                            ${getCartItemQuantity(product.id) >= product.stock ? 'disabled' : ''}>
                        ${getCartItemQuantity(product.id) > 0 ? 'Update' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Cart functions
function getCartItemQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        }
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartUI();
    renderProducts(); // Re-render to update quantity controls
}

function increaseQuantity(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem && cartItem.quantity < product.stock) {
        cartItem.quantity++;
        updateCartUI();
        renderProducts();
    }
}

function decreaseQuantity(productId) {
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
        cartItem.quantity--;
        if (cartItem.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
        updateCartUI();
        renderProducts();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    renderProducts();
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">${item.image}</div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">₹${item.price}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="decreaseQuantity(${item.id})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="qty-btn" onclick="increaseQuantity(${item.id})">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total;
}

// Cart sidebar toggle
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('open');
}

// Checkout functions
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Update order summary
    updateOrderSummary();
    
    // Show checkout modal
    const checkoutModal = document.getElementById('checkoutModal');
    checkoutModal.classList.add('show');
    
    // Close cart sidebar
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.remove('open');
}

function updateOrderSummary() {
    const orderSummary = document.getElementById('orderSummary');
    const orderTotal = document.getElementById('orderTotal');
    
    const summaryHTML = cart.map(item => `
        <div class="summary-item">
            <span>${item.name} x${item.quantity}</span>
            <span>₹${item.price * item.quantity}</span>
        </div>
    `).join('');
    
    orderSummary.innerHTML = summaryHTML;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    orderTotal.textContent = total;
}

function closeCheckout() {
    const checkoutModal = document.getElementById('checkoutModal');
    checkoutModal.classList.remove('show');
}

function handleOrderSubmission(e) {
    e.preventDefault();
    
    const formData = {
        customerName: document.getElementById('customerName').value,
        customerPhone: document.getElementById('customerPhone').value,
        deliveryAddress: document.getElementById('deliveryAddress').value,
        deliveryTime: document.getElementById('deliveryTime').value,
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
    
    // Generate order ID
    const orderId = 'ORD' + Date.now();
    
    // Calculate estimated delivery time
    const deliveryTimes = {
        'asap': '30-45 minutes',
        '1hour': '1 hour',
        '2hours': '2 hours',
        'evening': '6-8 PM today'
    };
    
    const estimatedDelivery = deliveryTimes[formData.deliveryTime];
    
    // Store order in localStorage (in a real app, this would be sent to a server)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push({
        ...formData,
        orderId: orderId,
        status: 'pending',
        createdAt: new Date().toISOString()
    });
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Show confirmation modal
    document.getElementById('orderId').textContent = orderId;
    document.getElementById('estimatedDelivery').textContent = estimatedDelivery;
    
    const checkoutModal = document.getElementById('checkoutModal');
    const orderConfirmationModal = document.getElementById('orderConfirmationModal');
    
    checkoutModal.classList.remove('show');
    orderConfirmationModal.classList.add('show');
    
    // Clear cart and form
    cart = [];
    updateCartUI();
    renderProducts();
    document.getElementById('checkoutForm').reset();
    
    // Simulate real-time notification to owner and delivery boys
    simulateNotification(formData, orderId);
}

function closeOrderConfirmation() {
    const orderConfirmationModal = document.getElementById('orderConfirmationModal');
    orderConfirmationModal.classList.remove('show');
}

// Simulate real-time notifications (in a real app, this would use WebSockets or similar)
function simulateNotification(orderData, orderId) {
    console.log('📱 Notification sent to store owner and delivery boys:');
    console.log(`New Order #${orderId} from ${orderData.customerName}`);
    console.log(`Total: ₹${orderData.total}`);
    console.log(`Delivery Address: ${orderData.deliveryAddress}`);
    console.log(`Preferred Time: ${orderData.deliveryTime}`);
    
    // In a real application, this would trigger:
    // 1. WebSocket notification to owner dashboard
    // 2. Push notification to delivery boys' mobile apps
    // 3. Auto-assignment algorithm for delivery boys
    // 4. Real-time updates to all interfaces
}

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}
