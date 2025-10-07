// Dynamic delivery boys data - starts empty, populated by actual users
let deliveryBoys = [];

// Initialize delivery boys using DataManager
function initializeDeliveryBoys() {
    console.log('Owner: Initializing delivery boys...');
    deliveryBoys = window.dataManager.getDeliveryBoys();
    
    // Ensure all delivery boys have online status set
    let needsUpdate = false;
    deliveryBoys.forEach(boy => {
        if (boy.online === undefined) {
            boy.online = true;
            needsUpdate = true;
        }
    });
    
    if (needsUpdate) {
        window.dataManager.setDeliveryBoys(deliveryBoys);
    }
    
    console.log('Owner: Delivery boys initialized:', deliveryBoys.length);
}

// Global variables
let currentFilter = 'all';
let selectedOrderId = null;
let selectedDeliveryBoyId = null;
let autoRefreshInterval;

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDeliveryBoys();
    setupEventListeners();
    loadDashboardData();
    startAutoRefresh();
});

// Setup event listeners
function setupEventListeners() {
    // Order filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            currentFilter = this.dataset.status;
            loadOrders();
        });
    });
}

// Start auto-refresh every 30 seconds
function startAutoRefresh() {
    // Clear any existing interval
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    autoRefreshInterval = setInterval(() => {
        showRefreshNotification();
        loadDashboardData();
    }, 30000); // 30 seconds
    
    // Also refresh when page becomes visible (mobile optimization)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            console.log('Owner dashboard: Page became visible, refreshing data...');
            loadDashboardData();
        }
    });
    
    // Refresh when page regains focus (mobile optimization)
    window.addEventListener('focus', function() {
        console.log('Owner dashboard: Page regained focus, refreshing data...');
        loadDashboardData();
    });
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
    loadDeliveryBoys();
    updateStats();
    updateLastUpdatedTime();
}

// Load orders using DataManager
function loadOrders() {
    console.log('Owner: Loading orders...');
    const orders = window.dataManager.getOrders();
    const filteredOrders = currentFilter === 'all' 
        ? orders 
        : orders.filter(order => order.status === currentFilter);
    
    // Sort orders by creation date (newest first)
    const sortedOrders = filteredOrders.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    console.log('Owner: Loaded orders:', sortedOrders.length);
    renderOrders(sortedOrders);
}

// Render orders table
function renderOrders(orders) {
    const tbody = document.getElementById('ordersTableBody');
    
    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>No orders found</h3>
                    <p>Orders will appear here when customers place them</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td class="order-id">${order.orderId}</td>
            <td class="customer-info">
                <div class="customer-name">${order.customerName}</div>
                <div class="customer-phone">${order.customerPhone}</div>
            </td>
            <td>
                <span class="items-count">${order.items.length} items</span>
            </td>
            <td class="order-total">₹${order.total}</td>
            <td>
                <span class="status-badge status-${order.status}">${order.status.replace('-', ' ')}</span>
                ${order.status === 'out-for-delivery' && order.assignedTo ? `
                    <div class="assigned-delivery-boy">
                        <i class="fas fa-motorcycle"></i>
                        <span>${order.assignedTo}</span>
                    </div>
                ` : ''}
            </td>
            <td class="order-time">${new Date(order.createdAt).toLocaleString()}</td>
            <td class="delivery-time">${getDeliveryTimeText(order.deliveryTime)}</td>
            <td class="action-buttons">
                <button class="action-btn btn-view" onclick="viewOrderDetails('${order.orderId}')">
                    <i class="fas fa-eye"></i> View
                </button>
                ${order.status === 'pending' ? `
                    <button class="action-btn btn-confirm" onclick="confirmOrder('${order.orderId}')">
                        <i class="fas fa-check"></i> Confirm
                    </button>
                ` : ''}
                ${order.status === 'confirmed' ? `
                    <button class="action-btn btn-assign" onclick="assignDelivery('${order.orderId}')">
                        <i class="fas fa-motorcycle"></i> Assign
                    </button>
                ` : ''}
                ${order.status === 'pending' ? `
                    <button class="action-btn btn-assign" onclick="quickAssignOrder('${order.orderId}')" style="background: #f39c12;">
                        <i class="fas fa-motorcycle"></i> Quick Assign
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

// Update delivery boy status based on actual orders
function updateDeliveryBoyStatus() {
    const orders = window.dataManager.getOrders();
    
    // Load delivery boys from DataManager to get latest online status
    const savedDeliveryBoys = window.dataManager.getDeliveryBoys();
    if (savedDeliveryBoys && savedDeliveryBoys.length > 0) {
        // Update online status from saved data
        savedDeliveryBoys.forEach(savedBoy => {
            const boy = deliveryBoys.find(b => b.id === savedBoy.id);
            if (boy) {
                boy.online = savedBoy.online;
            }
        });
    }
    
    // Reset all delivery boys to available
    deliveryBoys.forEach(boy => {
        boy.status = 'available';
    });
    
    // Check for active orders (out-for-delivery)
    const activeOrders = orders.filter(order => order.status === 'out-for-delivery');
    
    // Mark delivery boys as busy if they have active orders
    activeOrders.forEach(order => {
        if (order.assignedToId) {
            const deliveryBoy = deliveryBoys.find(boy => boy.id === order.assignedToId);
            if (deliveryBoy) {
                deliveryBoy.status = 'busy';
            }
        }
    });
}

// Load delivery boys
function loadDeliveryBoys() {
    // Update status based on actual orders
    updateDeliveryBoyStatus();
    
    const grid = document.getElementById('deliveryBoysGrid');
    
    grid.innerHTML = deliveryBoys.map(boy => `
        <div class="delivery-boy-card">
            <div class="delivery-boy-header">
                <div class="delivery-boy-avatar">
                    ${boy.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div class="delivery-boy-info">
                    <h3>${boy.name}</h3>
                    <div class="status-container">
                        <span class="delivery-boy-status status-${boy.status}">
                            ${boy.status === 'available' ? 'Available' : 'Busy'}
                        </span>
                        <span class="online-status ${boy.online ? 'online' : 'offline'}">
                            <i class="fas fa-circle"></i>
                            ${boy.online ? 'Online' : 'Offline'}
                        </span>
                    </div>
                </div>
            </div>
            <div class="delivery-boy-stats">
                <div class="stat-item">
                    <div class="stat-number">${boy.ordersDelivered}</div>
                    <div class="stat-label">Orders Delivered</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${boy.rating}</div>
                    <div class="stat-label">Rating</div>
                </div>
            </div>
            <div style="margin-top: 1rem; font-size: 0.9rem; color: #7f8c8d;">
                <i class="fas fa-phone"></i> ${boy.phone}
            </div>
        </div>
    `).join('');
}

// Update statistics using DataManager
function updateStats() {
    const orders = window.dataManager.getOrders();
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => 
        new Date(order.createdAt).toDateString() === today
    );
    
    const totalOrders = todayOrders.length;
    const totalRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = todayOrders.filter(order => order.status === 'pending').length;
    const availableDeliveryBoys = deliveryBoys.filter(boy => boy.status === 'available').length;
    
    console.log('Owner: Stats updated:', { totalOrders, totalRevenue, pendingOrders, availableDeliveryBoys });
    
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('totalRevenue').textContent = `₹${totalRevenue}`;
    document.getElementById('pendingOrders').textContent = pendingOrders;
    document.getElementById('availableDeliveryBoys').textContent = availableDeliveryBoys;
}

// Update last updated time
function updateLastUpdatedTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('lastUpdated').textContent = `Last updated: ${timeString}`;
}

// Get delivery time text
function getDeliveryTimeText(deliveryTime) {
    const times = {
        'asap': 'ASAP (30-45 mins)',
        '1hour': 'Within 1 Hour',
        '2hours': 'Within 2 Hours',
        'evening': 'Evening (6-8 PM)'
    };
    return times[deliveryTime] || deliveryTime;
}

// View order details using DataManager
function viewOrderDetails(orderId) {
    const orders = window.dataManager.getOrders();
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
                    <span class="status-badge status-${order.status}">${order.status.replace('-', ' ')}</span>
                    ${order.status === 'out-for-delivery' && order.assignedTo ? `
                        <div class="assigned-delivery-boy" style="margin-top: 0.5rem;">
                            <i class="fas fa-motorcycle"></i>
                            <span>Assigned to: ${order.assignedTo}</span>
                        </div>
                    ` : ''}
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
            ${order.assignedAt ? `
                <div class="info-item">
                    <span class="info-label">Assigned At:</span>
                    <span class="info-value">${new Date(order.assignedAt).toLocaleString()}</span>
                </div>
            ` : ''}
            ${order.deliveredAt ? `
                <div class="info-item">
                    <span class="info-label">Delivered At:</span>
                    <span class="info-value">${new Date(order.deliveredAt).toLocaleString()}</span>
                </div>
            ` : ''}
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
    
    document.getElementById('orderDetailsModal').classList.add('show');
}

// Close order details modal
function closeOrderDetails() {
    document.getElementById('orderDetailsModal').classList.remove('show');
}

// Confirm order using DataManager
function confirmOrder(orderId) {
    const orders = window.dataManager.getOrders();
    const orderIndex = orders.findIndex(o => o.orderId === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = 'confirmed';
        orders[orderIndex].confirmedAt = new Date().toISOString();
        window.dataManager.setOrders(orders);
        
        // Show notification
        showNotification('Order confirmed successfully!', 'success');
        
        // Refresh data
        loadDashboardData();
    }
}

// Assign delivery using DataManager
function assignDelivery(orderId) {
    selectedOrderId = orderId;
    const orders = window.dataManager.getOrders();
    const order = orders.find(o => o.orderId === orderId);
    
    if (!order) return;
    
    // Update order summary
    const orderSummary = document.getElementById('assignOrderSummary');
    orderSummary.innerHTML = `
        <div class="info-group">
            <h4>Order Summary</h4>
            <div class="info-item">
                <span class="info-label">Order ID:</span>
                <span class="info-value">${order.orderId}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Customer:</span>
                <span class="info-value">${order.customerName}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Total:</span>
                <span class="info-value">₹${order.total}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Address:</span>
                <span class="info-value">${order.deliveryAddress}</span>
            </div>
        </div>
    `;
    
    // Update delivery boys list
    const deliveryBoysList = document.getElementById('deliveryBoysList');
    deliveryBoysList.innerHTML = `
        <h4>Select Delivery Boy</h4>
        ${deliveryBoys.map(boy => `
            <div class="delivery-boy-option" onclick="selectDeliveryBoy(${boy.id})">
                <div>
                    <strong>${boy.name}</strong>
                    <div style="font-size: 0.9rem; color: #7f8c8d;">
                        ${boy.phone} • ${boy.ordersDelivered} orders • Rating: ${boy.rating}
                    </div>
                </div>
                <div>
                    <span class="status-badge status-${boy.status}">
                        ${boy.status === 'available' ? 'Available' : 'Busy'}
                    </span>
                </div>
            </div>
        `).join('')}
        <button class="assign-btn" onclick="assignOrderToDeliveryBoy()" disabled>
            <i class="fas fa-motorcycle"></i>
            Assign Delivery
        </button>
    `;
    
    document.getElementById('assignDeliveryModal').classList.add('show');
}

// Select delivery boy
function selectDeliveryBoy(boyId) {
    selectedDeliveryBoyId = boyId;
    
    // Remove previous selection
    document.querySelectorAll('.delivery-boy-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to clicked option
    event.currentTarget.classList.add('selected');
    
    // Enable assign button
    const assignBtn = document.querySelector('.assign-btn');
    if (assignBtn) {
        assignBtn.disabled = false;
        assignBtn.textContent = 'Assign Delivery';
    }
}

// Close assign delivery modal
function closeAssignDelivery() {
    document.getElementById('assignDeliveryModal').classList.remove('show');
    selectedOrderId = null;
    selectedDeliveryBoyId = null;
}

// Assign order to delivery boy using DataManager
function assignOrderToDeliveryBoy() {
    if (!selectedOrderId || !selectedDeliveryBoyId) return;
    
    const orders = window.dataManager.getOrders();
    const orderIndex = orders.findIndex(o => o.orderId === selectedOrderId);
    const deliveryBoy = deliveryBoys.find(boy => boy.id === selectedDeliveryBoyId);
    
    if (orderIndex !== -1 && deliveryBoy) {
        // Update order status
        orders[orderIndex].status = 'out-for-delivery';
        orders[orderIndex].assignedTo = deliveryBoy.name;
        orders[orderIndex].assignedToId = deliveryBoy.id;
        orders[orderIndex].assignedAt = new Date().toISOString();
        
        // Update delivery boy status to busy
        deliveryBoy.status = 'busy';
        
        window.dataManager.setOrders(orders);
        window.dataManager.setDeliveryBoys(deliveryBoys);
        
        // Show notification
        showNotification(`Order assigned to ${deliveryBoy.name}`, 'success');
        
        // Close modal and refresh data
        closeAssignDelivery();
        loadDashboardData();
    }
}

// Quick assign function for pending orders using DataManager
function quickAssignOrder(orderId) {
    const availableBoys = deliveryBoys.filter(boy => boy.status === 'available');
    
    if (availableBoys.length === 0) {
        showNotification('No delivery boys available. Please assign manually.', 'warning');
        return;
    }
    
    // Find the best available delivery boy (highest rating)
    const bestBoy = availableBoys.reduce((prev, current) => 
        (prev.rating > current.rating) ? prev : current
    );
    
    const orders = window.dataManager.getOrders();
    const orderIndex = orders.findIndex(o => o.orderId === orderId);
    
    if (orderIndex !== -1) {
        // Update order status
        orders[orderIndex].status = 'out-for-delivery';
        orders[orderIndex].assignedTo = bestBoy.name;
        orders[orderIndex].assignedToId = bestBoy.id;
        orders[orderIndex].assignedAt = new Date().toISOString();
        
        // Update delivery boy status to busy
        bestBoy.status = 'busy';
        
        window.dataManager.setOrders(orders);
        window.dataManager.setDeliveryBoys(deliveryBoys);
        
        // Show notification
        showNotification(`Order quickly assigned to ${bestBoy.name}`, 'success');
        
        // Refresh data
        loadDashboardData();
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#27ae60' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 25px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        z-index: 3000;
        animation: slideDown 0.3s ease;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideDown {
                from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Auto-assign delivery boy (simulation)
function autoAssignDeliveryBoy(orderId) {
    const availableBoys = deliveryBoys.filter(boy => boy.status === 'available');
    
    if (availableBoys.length > 0) {
        // Assign to the boy with highest rating
        const bestBoy = availableBoys.reduce((prev, current) => 
            (prev.rating > current.rating) ? prev : current
        );
        
        selectedOrderId = orderId;
        selectedDeliveryBoyId = bestBoy.id;
        assignOrderToDeliveryBoy();
        
        showNotification(`Order auto-assigned to ${bestBoy.name}`, 'success');
    } else {
        showNotification('No delivery boys available. Please assign manually.', 'warning');
    }
}

// Simulate real-time updates
function simulateRealTimeUpdates() {
    // This would be replaced with actual WebSocket connections in a real app
    console.log('🔄 Simulating real-time updates...');
    
    // Simulate new orders occasionally
    if (Math.random() < 0.1) { // 10% chance every refresh
        console.log('📱 Simulating new order notification...');
    }
    
    // Simulate delivery boy status changes
    if (Math.random() < 0.2) { // 20% chance every refresh
        const randomBoy = deliveryBoys[Math.floor(Math.random() * deliveryBoys.length)];
        randomBoy.status = randomBoy.status === 'available' ? 'busy' : 'available';
        console.log(`🚚 ${randomBoy.name} status changed to ${randomBoy.status}`);
    }
}

// Call simulation on each refresh
function loadDashboardData() {
    loadOrders();
    loadDeliveryBoys();
    updateStats();
    updateLastUpdatedTime();
    simulateRealTimeUpdates();
}

// Clean up on page unload
window.addEventListener('beforeunload', function() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
});
