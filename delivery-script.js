// Dynamic delivery boys data - synchronized with owner dashboard
let deliveryBoys = [];

// Initialize delivery boys from localStorage
function initializeDeliveryBoys() {
    const savedDeliveryBoys = localStorage.getItem('deliveryBoys');
    if (savedDeliveryBoys) {
        deliveryBoys = JSON.parse(savedDeliveryBoys);
        console.log('Loaded delivery boys from localStorage:', deliveryBoys);
        // Ensure all delivery boys have online status set
        deliveryBoys.forEach(boy => {
            if (boy.online === undefined) {
                boy.online = true;
            }
        });
        localStorage.setItem('deliveryBoys', JSON.stringify(deliveryBoys));
    } else {
        // Create initial delivery boys if none exist
        deliveryBoys = [
            { id: 1, name: "Rajesh Kumar", phone: "+91 98765 43210", status: "available", ordersDelivered: 0, rating: 5.0, password: "1234", online: true },
            { id: 2, name: "Suresh Singh", phone: "+91 98765 43211", status: "available", ordersDelivered: 0, rating: 5.0, password: "1234", online: true },
            { id: 3, name: "Amit Patel", phone: "+91 98765 43212", status: "available", ordersDelivered: 0, rating: 5.0, password: "1234", online: true },
            { id: 4, name: "Vikram Sharma", phone: "+91 98765 43213", status: "available", ordersDelivered: 0, rating: 5.0, password: "1234", online: true },
            { id: 5, name: "Deepak Gupta", phone: "+91 98765 43214", status: "available", ordersDelivered: 0, rating: 5.0, password: "1234", online: true }
        ];
        localStorage.setItem('deliveryBoys', JSON.stringify(deliveryBoys));
        console.log('Created initial delivery boys:', deliveryBoys);
    }
}

// Global variables
let currentDeliveryBoy = null;
let currentView = 'available';
let autoRefreshInterval;
let selectedOrderId = null;

// Reset function for debugging (can be called from browser console)
function resetDeliveryData() {
    localStorage.removeItem('deliveryBoys');
    localStorage.removeItem('currentDeliveryBoy');
    console.log('Delivery data reset. Refreshing page...');
    location.reload();
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeDeliveryBoys();
    setupEventListeners();
    checkLoginStatus();
});

// Setup event listeners
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', handleLogin);
    
    // Auto-refresh every 30 seconds
    startAutoRefresh();
}

// Check if user is already logged in
function checkLoginStatus() {
    const savedDeliveryBoy = localStorage.getItem('currentDeliveryBoy');
    if (savedDeliveryBoy) {
        currentDeliveryBoy = JSON.parse(savedDeliveryBoy);
        showDashboard();
        loadDashboardData();
    }
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const deliveryBoyId = parseInt(document.getElementById('deliveryBoyId').value);
    const password = document.getElementById('deliveryPassword').value;
    
    console.log('Login attempt:', { deliveryBoyId, password });
    console.log('Available delivery boys:', deliveryBoys);
    
    const deliveryBoy = deliveryBoys.find(boy => boy.id === deliveryBoyId);
    
    console.log('Found delivery boy:', deliveryBoy);
    
    if (deliveryBoy && deliveryBoy.password === password) {
        currentDeliveryBoy = deliveryBoy;
        
        // Set delivery boy as online when logging in
        currentDeliveryBoy.online = true;
        
        // Update the delivery boys array in localStorage
        const savedDeliveryBoys = localStorage.getItem('deliveryBoys');
        if (savedDeliveryBoys) {
            const deliveryBoys = JSON.parse(savedDeliveryBoys);
            const boyIndex = deliveryBoys.findIndex(boy => boy.id === currentDeliveryBoy.id);
            if (boyIndex !== -1) {
                deliveryBoys[boyIndex].online = true;
                localStorage.setItem('deliveryBoys', JSON.stringify(deliveryBoys));
            }
        }
        
        localStorage.setItem('currentDeliveryBoy', JSON.stringify(currentDeliveryBoy));
        showDashboard();
        loadDashboardData();
        
        // Sync with owner dashboard
        syncWithOwnerDashboard();
        
        showNotification(`Welcome back, ${deliveryBoy.name}!`, 'success');
    } else {
        console.log('Login failed - invalid credentials');
        showNotification('Invalid credentials. Please try again.', 'error');
    }
}

// Show dashboard
function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    
    // Update header info
    document.getElementById('deliveryBoyName').textContent = currentDeliveryBoy.name;
    document.getElementById('deliveryStatus').textContent = 
        currentDeliveryBoy.status === 'available' ? 'Available' : 'Busy';
    
    // Update online status
    updateOnlineStatusDisplay();
}

// Toggle online/offline status
function toggleOnlineStatus() {
    currentDeliveryBoy.online = !currentDeliveryBoy.online;
    localStorage.setItem('currentDeliveryBoy', JSON.stringify(currentDeliveryBoy));
    
    // Update the delivery boys array in localStorage
    const savedDeliveryBoys = localStorage.getItem('deliveryBoys');
    if (savedDeliveryBoys) {
        const deliveryBoys = JSON.parse(savedDeliveryBoys);
        const boyIndex = deliveryBoys.findIndex(boy => boy.id === currentDeliveryBoy.id);
        if (boyIndex !== -1) {
            deliveryBoys[boyIndex].online = currentDeliveryBoy.online;
            localStorage.setItem('deliveryBoys', JSON.stringify(deliveryBoys));
        }
    }
    
    updateOnlineStatusDisplay();
    
    const status = currentDeliveryBoy.online ? 'online' : 'offline';
    showNotification(`You are now ${status}`, 'success');
    
    // Trigger immediate sync with owner dashboard
    syncWithOwnerDashboard();
}

// Update online status display
function updateOnlineStatusDisplay() {
    const toggleBtn = document.getElementById('onlineToggle');
    const statusText = document.getElementById('onlineStatusText');
    
    if (currentDeliveryBoy.online) {
        toggleBtn.classList.remove('offline');
        statusText.textContent = 'Online';
    } else {
        toggleBtn.classList.add('offline');
        statusText.textContent = 'Offline';
    }
}

// Sync delivery boy status with owner dashboard
function syncWithOwnerDashboard() {
    // This simulates real-time sync - in a real app, this would be WebSocket or API call
    console.log(`🔄 Syncing delivery boy ${currentDeliveryBoy.name} status: ${currentDeliveryBoy.online ? 'Online' : 'Offline'}`);
    
    // Update delivery boys data in localStorage for owner dashboard to read
    const savedDeliveryBoys = localStorage.getItem('deliveryBoys');
    if (savedDeliveryBoys) {
        const deliveryBoys = JSON.parse(savedDeliveryBoys);
        const boyIndex = deliveryBoys.findIndex(boy => boy.id === currentDeliveryBoy.id);
        if (boyIndex !== -1) {
            deliveryBoys[boyIndex].online = currentDeliveryBoy.online;
            deliveryBoys[boyIndex].status = currentDeliveryBoy.status;
            localStorage.setItem('deliveryBoys', JSON.stringify(deliveryBoys));
        }
    }
}

// Logout
function logout() {
    // Set delivery boy as offline before logging out
    if (currentDeliveryBoy) {
        currentDeliveryBoy.online = false;
        
        // Update the delivery boys array in localStorage
        const savedDeliveryBoys = localStorage.getItem('deliveryBoys');
        if (savedDeliveryBoys) {
            const deliveryBoys = JSON.parse(savedDeliveryBoys);
            const boyIndex = deliveryBoys.findIndex(boy => boy.id === currentDeliveryBoy.id);
            if (boyIndex !== -1) {
                deliveryBoys[boyIndex].online = false;
                localStorage.setItem('deliveryBoys', JSON.stringify(deliveryBoys));
            }
        }
        
        // Sync with owner dashboard
        syncWithOwnerDashboard();
        
        console.log(`🚪 ${currentDeliveryBoy.name} logged out - status set to offline`);
    }
    
    currentDeliveryBoy = null;
    localStorage.removeItem('currentDeliveryBoy');
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('loginForm').reset();
}

// Start auto-refresh
function startAutoRefresh() {
    autoRefreshInterval = setInterval(() => {
        if (currentDeliveryBoy) {
            showRefreshNotification();
            loadDashboardData();
        }
    }, 30000); // 30 seconds
}

// Show refresh notification
function showRefreshNotification() {
    const notification = document.getElementById('refreshNotification');
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Load all dashboard data
function loadDashboardData() {
    loadOrders();
    updateStats();
    updateCurrentOrder();
}

// Load orders based on current view
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    let filteredOrders = [];
    
    switch (currentView) {
        case 'available':
            // Show orders that are confirmed but not assigned to anyone
            // Also show pending orders that can be picked up
            filteredOrders = orders.filter(order => 
                (order.status === 'confirmed' && !order.assignedToId) ||
                (order.status === 'pending' && !order.assignedToId)
            );
            break;
        case 'assigned':
            // Show orders assigned to current delivery boy
            filteredOrders = orders.filter(order => 
                order.assignedToId === currentDeliveryBoy.id && 
                order.status === 'out-for-delivery'
            );
            break;
        case 'completed':
            // Show completed orders by current delivery boy
            filteredOrders = orders.filter(order => 
                order.assignedToId === currentDeliveryBoy.id && 
                order.status === 'delivered'
            );
            break;
    }
    
    renderOrders(filteredOrders);
}

// Render orders
function renderOrders(orders) {
    const container = document.getElementById('ordersContainer');
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <h3>No orders found</h3>
                <p>${getEmptyStateMessage()}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <div class="order-card ${currentView}">
            <div class="order-header">
                <span class="order-id">${order.orderId}</span>
                <span class="order-status status-${currentView}">${getStatusText(order.status)}</span>
            </div>
            
            <div class="order-info">
                <div class="customer-info">
                    <div class="customer-avatar">
                        ${order.customerName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div class="customer-details">
                        <h4>${order.customerName}</h4>
                        <div class="customer-phone">${order.customerPhone}</div>
                    </div>
                </div>
                
                <div class="order-summary">
                    <div class="order-items">${order.items.length} items</div>
                    <div class="order-total">₹${order.total}</div>
                </div>
                
                <div class="delivery-info">
                    <div class="delivery-address">
                        <i class="fas fa-map-marker-alt"></i>
                        ${order.deliveryAddress}
                    </div>
                    <div class="delivery-time">
                        <i class="fas fa-clock"></i>
                        ${getDeliveryTimeText(order.deliveryTime)}
                    </div>
                </div>
            </div>
            
            <div class="order-actions">
                ${getActionButtons(order)}
            </div>
        </div>
    `).join('');
}

// Get action buttons based on order status and view
function getActionButtons(order) {
    switch (currentView) {
        case 'available':
            return `
                <button class="action-btn btn-view" onclick="viewOrderDetails('${order.orderId}')">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="action-btn btn-accept" onclick="acceptOrder('${order.orderId}')">
                    <i class="fas fa-hand-paper"></i> Pick Up
                </button>
            `;
        case 'assigned':
            return `
                <button class="action-btn btn-view" onclick="viewOrderDetails('${order.orderId}')">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="action-btn btn-deliver" onclick="markAsDelivered('${order.orderId}')">
                    <i class="fas fa-check"></i> Deliver
                </button>
            `;
        case 'completed':
            return `
                <button class="action-btn btn-view" onclick="viewOrderDetails('${order.orderId}')">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="action-btn btn-completed" disabled>
                    <i class="fas fa-check-circle"></i> Completed
                </button>
            `;
        default:
            return '';
    }
}

// Get empty state message
function getEmptyStateMessage() {
    switch (currentView) {
        case 'available':
            return 'No available orders at the moment. New orders will appear here for pickup!';
        case 'assigned':
            return 'You have no assigned orders. Accept some orders to get started!';
        case 'completed':
            return 'You haven\'t completed any orders yet.';
        default:
            return 'No orders found.';
    }
}

// Toggle between order views
function toggleOrders(view) {
    currentView = view;
    
    // Update toggle buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadOrders();
}

// Accept order
function acceptOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = orders.findIndex(o => o.orderId === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = 'out-for-delivery';
        orders[orderIndex].assignedTo = currentDeliveryBoy.name;
        orders[orderIndex].assignedToId = currentDeliveryBoy.id;
        orders[orderIndex].assignedAt = new Date().toISOString();
        
        // Update delivery boy status to busy
        currentDeliveryBoy.status = 'busy';
        localStorage.setItem('currentDeliveryBoy', JSON.stringify(currentDeliveryBoy));
        
        // Update the delivery boys array in localStorage
        const savedDeliveryBoys = localStorage.getItem('deliveryBoys');
        if (savedDeliveryBoys) {
            const deliveryBoys = JSON.parse(savedDeliveryBoys);
            const boyIndex = deliveryBoys.findIndex(boy => boy.id === currentDeliveryBoy.id);
            if (boyIndex !== -1) {
                deliveryBoys[boyIndex].status = 'busy';
                localStorage.setItem('deliveryBoys', JSON.stringify(deliveryBoys));
            }
        }
        
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Sync with owner dashboard
        syncWithOwnerDashboard();
        
        showNotification('Order accepted successfully!', 'success');
        loadDashboardData();
    }
}

// Mark order as delivered
function markAsDelivered(orderId) {
    selectedOrderId = orderId;
    document.getElementById('deliveryConfirmationModal').classList.add('show');
}

// Confirm delivery
function confirmDelivery() {
    const notes = document.getElementById('deliveryNotes').value;
    const photo = document.getElementById('deliveryPhoto').files[0];
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = orders.findIndex(o => o.orderId === selectedOrderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = 'delivered';
        orders[orderIndex].deliveredAt = new Date().toISOString();
        orders[orderIndex].deliveryNotes = notes;
        orders[orderIndex].deliveryPhoto = photo ? photo.name : null;
        
        // Update delivery boy status to available
        currentDeliveryBoy.status = 'available';
        currentDeliveryBoy.ordersDelivered++;
        localStorage.setItem('currentDeliveryBoy', JSON.stringify(currentDeliveryBoy));
        
        // Update the delivery boys array in localStorage
        const savedDeliveryBoys = localStorage.getItem('deliveryBoys');
        if (savedDeliveryBoys) {
            const deliveryBoys = JSON.parse(savedDeliveryBoys);
            const boyIndex = deliveryBoys.findIndex(boy => boy.id === currentDeliveryBoy.id);
            if (boyIndex !== -1) {
                deliveryBoys[boyIndex].status = 'available';
                deliveryBoys[boyIndex].ordersDelivered++;
                localStorage.setItem('deliveryBoys', JSON.stringify(deliveryBoys));
            }
        }
        
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Sync with owner dashboard
        syncWithOwnerDashboard();
        
        showNotification('Order marked as delivered!', 'success');
        closeDeliveryConfirmation();
        loadDashboardData();
    }
}

// Close delivery confirmation modal
function closeDeliveryConfirmation() {
    document.getElementById('deliveryConfirmationModal').classList.remove('show');
    document.getElementById('deliveryNotes').value = '';
    document.getElementById('deliveryPhoto').value = '';
    selectedOrderId = null;
}

// View order details
function viewOrderDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.orderId === orderId);
    
    if (!order) return;
    
    const orderInfo = document.getElementById('orderInfo');
    orderInfo.innerHTML = `
        <div class="info-group">
            <h4>Order Information</h4>
            <div class="info-item">
                <span class="info-label">Order ID:</span>
                <span class="info-value">${order.orderId}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Status:</span>
                <span class="info-value">
                    <span class="order-status status-${order.status}">${getStatusText(order.status)}</span>
                </span>
            </div>
            <div class="info-item">
                <span class="info-label">Order Time:</span>
                <span class="info-value">${new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Total Amount:</span>
                <span class="info-value">₹${order.total}</span>
            </div>
        </div>
        
        <div class="info-group">
            <h4>Customer Information</h4>
            <div class="info-item">
                <span class="info-label">Name:</span>
                <span class="info-value">${order.customerName}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Phone:</span>
                <span class="info-value">${order.customerPhone}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Address:</span>
                <span class="info-value">${order.deliveryAddress}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Preferred Time:</span>
                <span class="info-value">${getDeliveryTimeText(order.deliveryTime)}</span>
            </div>
        </div>
        
        <div class="info-group">
            <h4>Order Items</h4>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span class="item-name">${item.name}</span>
                        <span class="item-quantity">x${item.quantity}</span>
                        <span class="item-price">₹${item.price * item.quantity}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    const orderActions = document.getElementById('orderActions');
    orderActions.innerHTML = getActionButtons(order);
    
    document.getElementById('orderDetailsModal').classList.add('show');
}

// Close order details modal
function closeOrderDetails() {
    document.getElementById('orderDetailsModal').classList.remove('show');
}

// Update statistics
function updateStats() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const today = new Date().toDateString();
    
    // Today's delivered orders by this delivery boy
    const todayDelivered = orders.filter(order => 
        order.assignedToId === currentDeliveryBoy.id &&
        order.status === 'delivered' &&
        new Date(order.deliveredAt).toDateString() === today
    );
    
    // Calculate earnings (assuming ₹20 per delivery)
    const earnings = todayDelivered.length * 20;
    
    // Current assigned orders
    const currentOrders = orders.filter(order => 
        order.assignedToId === currentDeliveryBoy.id &&
        order.status === 'out-for-delivery'
    );
    
    document.getElementById('ordersDelivered').textContent = todayDelivered.length;
    document.getElementById('earnings').textContent = `₹${earnings}`;
    document.getElementById('currentOrder').textContent = currentOrders.length;
    document.getElementById('rating').textContent = currentDeliveryBoy.rating;
}

// Update current order section
function updateCurrentOrder() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const currentOrders = orders.filter(order => 
        order.assignedToId === currentDeliveryBoy.id &&
        order.status === 'out-for-delivery'
    );
    
    const currentOrderSection = document.getElementById('currentOrderSection');
    const currentOrderCard = document.getElementById('currentOrderCard');
    
    if (currentOrders.length > 0) {
        currentOrderSection.style.display = 'block';
        
        const order = currentOrders[0]; // Show the first current order
        currentOrderCard.innerHTML = `
            <div class="order-header">
                <span class="order-id">${order.orderId}</span>
                <span class="order-status status-assigned">Out for Delivery</span>
            </div>
            
            <div class="order-info">
                <div class="customer-info">
                    <div class="customer-avatar">
                        ${order.customerName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div class="customer-details">
                        <h4>${order.customerName}</h4>
                        <div class="customer-phone">${order.customerPhone}</div>
                    </div>
                </div>
                
                <div class="order-summary">
                    <div class="order-items">${order.items.length} items • ₹${order.total}</div>
                </div>
                
                <div class="delivery-info">
                    <div class="delivery-address">
                        <i class="fas fa-map-marker-alt"></i>
                        ${order.deliveryAddress}
                    </div>
                    <div class="delivery-time">
                        <i class="fas fa-clock"></i>
                        ${getDeliveryTimeText(order.deliveryTime)}
                    </div>
                </div>
            </div>
            
            <div class="order-actions">
                <button class="action-btn btn-deliver" onclick="markAsDelivered('${order.orderId}')">
                    <i class="fas fa-check"></i> Mark as Delivered
                </button>
            </div>
        `;
    } else {
        currentOrderSection.style.display = 'none';
    }
}

// Utility functions
function getStatusText(status) {
    const statusMap = {
        'pending': 'Pending',
        'confirmed': 'Confirmed',
        'out-for-delivery': 'Out for Delivery',
        'delivered': 'Delivered'
    };
    return statusMap[status] || status;
}

function getDeliveryTimeText(deliveryTime) {
    const times = {
        'asap': 'ASAP (30-45 mins)',
        '1hour': 'Within 1 Hour',
        '2hours': 'Within 2 Hours',
        'evening': 'Evening (6-8 PM)'
    };
    return times[deliveryTime] || deliveryTime;
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    notificationText.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Clean up on page unload
window.addEventListener('beforeunload', function() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
});
