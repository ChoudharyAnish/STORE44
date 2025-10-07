// Global variables
let cart = [];
let currentFilter = 'all';
let filteredProducts = [];
let products = []; // Will be populated by customer inventory manager

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
async function initializeApp() {
    // Wait for customer inventory manager to load
    if (window.customerInventoryManager) {
        await waitForInventoryManager();
    } else {
        // Wait a bit and try again
        setTimeout(initializeApp, 100);
        return;
    }
    
    // Update products from inventory manager
    updateProductsFromInventory();
    
    // Setup the app
    renderProducts();
    setupEventListeners();
    updateCartUI();
    updateCategories();
}

// Wait for inventory manager to be ready
async function waitForInventoryManager() {
    return new Promise((resolve) => {
        const checkInventory = () => {
            if (window.customerInventoryManager && window.customerInventoryManager.products.length > 0) {
                resolve();
            } else {
                setTimeout(checkInventory, 100);
            }
        };
        checkInventory();
    });
}

// Update products from inventory manager
function updateProductsFromInventory() {
    if (window.customerInventoryManager) {
        products = window.customerInventoryManager.getProducts();
        filteredProducts = [...products];
        console.log(`Loaded ${products.length} products from inventory system`);
    }
}

// Update categories dynamically
function updateCategories() {
    if (window.customerInventoryManager) {
        const categories = window.customerInventoryManager.getCategories();
        const categoryContainer = document.querySelector('.categories');
        
        if (categoryContainer && categories.length > 0) {
            // Keep the "All" button
            const allButton = categoryContainer.querySelector('[data-category="all"]');
            categoryContainer.innerHTML = '';
            categoryContainer.appendChild(allButton);
            
            // Add dynamic categories
            categories.forEach(category => {
                const button = document.createElement('button');
                button.className = 'category-btn';
                button.setAttribute('data-category', category);
                button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                categoryContainer.appendChild(button);
            });
            
            // Re-setup event listeners for new buttons
            setupCategoryListeners();
        }
    }
}

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

// Setup category listeners (for dynamically added buttons)
function setupCategoryListeners() {
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
    
    productsGrid.innerHTML = filteredProducts.map(product => {
        const stockStatus = window.customerInventoryManager ? 
            window.customerInventoryManager.getStockStatus(product) : 
            { status: 'available', text: 'In Stock', class: 'in-stock' };
        
        const canOrder = window.customerInventoryManager ? 
            window.customerInventoryManager.canOrderProduct(product.id) : 
            true;
        
        const maxQuantity = Math.min(product.stock, 10); // Limit to 10 or available stock
        
        return `
            <div class="product-card ${stockStatus.class}">
                <div class="product-image">
                    ${product.image}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-price">₹${product.price}</div>
                    <div class="stock-info">
                        <span class="stock-status ${stockStatus.class}">
                            <i class="fas fa-${stockStatus.status === 'out' ? 'times-circle' : 
                                stockStatus.status === 'low' ? 'exclamation-triangle' : 'check-circle'}"></i>
                            ${stockStatus.text}
                        </span>
                    </div>
                    <div class="product-actions">
                        ${canOrder ? `
                            <div class="quantity-controls">
                                <button class="qty-btn" onclick="decreaseQuantity('${product.id}')" 
                                        ${getCartItemQuantity(product.id) <= 0 ? 'disabled' : ''}>-</button>
                                <span class="quantity">${getCartItemQuantity(product.id)}</span>
                                <button class="qty-btn" onclick="increaseQuantity('${product.id}')"
                                        ${getCartItemQuantity(product.id) >= maxQuantity ? 'disabled' : ''}>+</button>
                            </div>
                            <button class="add-to-cart" onclick="addToCart('${product.id}')"
                                    ${getCartItemQuantity(product.id) >= maxQuantity ? 'disabled' : ''}>
                                ${getCartItemQuantity(product.id) > 0 ? 'Update' : 'Add to Cart'}
                            </button>
                        ` : `
                            <div class="out-of-stock-message">
                                <i class="fas fa-times-circle"></i>
                                <span>Out of Stock</span>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Cart functions
function getCartItemQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Check if product can be ordered
    if (window.customerInventoryManager && !window.customerInventoryManager.canOrderProduct(productId)) {
        showNotification('This product is out of stock!', 'error');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            showNotification('Maximum quantity reached!', 'warning');
            return;
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
    
    // Update inventory for each ordered item
    if (window.customerInventoryManager) {
        for (const item of formData.items) {
            window.customerInventoryManager.updateProductStock(item.id, item.quantity);
        }
    }
    
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

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 
            type === 'error' ? 'times-circle' : 
            type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : 
            type === 'error' ? '#e74c3c' : 
            type === 'warning' ? '#f39c12' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
