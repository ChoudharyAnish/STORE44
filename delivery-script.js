// Dynamic delivery boys data - synchronized with owner dashboard
let deliveryBoys = [];

// Initialize delivery boys from localStorage
function initializeDeliveryBoys() {
    console.log('Initializing delivery boys...');
    
    const savedDeliveryBoys = localStorage.getItem('deliveryBoys');
    if (savedDeliveryBoys) {
        try {
            deliveryBoys = JSON.parse(savedDeliveryBoys);
            console.log('Loaded delivery boys from localStorage:', deliveryBoys);
            
            // Validate that we have the correct data structure
            if (!Array.isArray(deliveryBoys) || deliveryBoys.length === 0) {
                throw new Error('Invalid delivery boys data');
            }
            
            // Ensure all delivery boys have required fields
            let needsUpdate = false;
            deliveryBoys.forEach(boy => {
                if (!boy.password || boy.password !== '1234') {
                    boy.password = '1234';
                    needsUpdate = true;
                }
                if (boy.online === undefined) {
                    boy.online = true;
                    needsUpdate = true;
                }
            });
            
            if (needsUpdate) {
                localStorage.setItem('deliveryBoys', JSON.stringify(deliveryBoys));
                console.log('Updated delivery boys data');
            }
        } catch (error) {
            console.log('Error loading delivery boys, creating fresh data:', error);
            createFreshDeliveryBoys();
        }
    } else {
        console.log('No delivery boys found in localStorage, creating fresh data');
        createFreshDeliveryBoys();
    }
}

// Create fresh delivery boys data
function createFreshDeliveryBoys() {
    deliveryBoys = [
        { id: 1, name: "Rajesh Kumar", phone: "+91 98765 43210", status: "available", ordersDelivered: 0, rating: 5.0, password: "1234", online: true },
        { id: 2, name: "Suresh Singh", phone: "+91 98765 43211", status: "available", ordersDelivered: 0, rating: 5.0, password: "1234", online: true },
        { id: 3, name: "Amit Patel", phone: "+91 98765 43212", status: "available", ordersDelivered: 0, rating: 5.0, password: "1234", online: true },
        { id: 4, name: "Vikram Sharma", phone: "+91 98765 43213", status: "available", ordersDelivered: 0, rating: 5.0, password: "1234", online: true },
        { id: 5, name: "Deepak Gupta", phone: "+91 98765 43214", status: "available", ordersDelivered: 0, rating: 5.0, password: "1234", online: true }
    ];
    localStorage.setItem('deliveryBoys', JSON.stringify(deliveryBoys));
    console.log('Created fresh delivery boys:', deliveryBoys);
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

// Quick fix function to reset passwords
function fixPasswords() {
    console.log('Fixing delivery boy passwords...');
    deliveryBoys.forEach(boy => {
        boy.password = '1234';
        console.log(`Fixed password for ${boy.name}: ${boy.password}`);
    });
    localStorage.setItem('deliveryBoys', JSON.stringify(deliveryBoys));
    console.log('All passwords fixed to "1234"');
}

// Test function for deployed version
function testDeployedLogin() {
    console.log('=== DEPLOYED LOGIN TEST ===');
    console.log('1. Delivery boys array:', deliveryBoys);
    console.log('2. Array length:', deliveryBoys ? deliveryBoys.length : 'UNDEFINED');
    
    if (!deliveryBoys || deliveryBoys.length === 0) {
        console.log('❌ No delivery boys found! Running initialization...');
        initializeDeliveryBoys();
    }
    
    const testBoy = deliveryBoys.find(boy => boy.id === 1);
    console.log('3. Test boy (ID 1):', testBoy);
    
    if (testBoy) {
        console.log('4. Password:', testBoy.password);
        console.log('5. Password type:', typeof testBoy.password);
        console.log('6. Password === "1234":', testBoy.password === '1234');
    }
    
    console.log('=== END TEST ===');
}

// Mobile debug function
function debugMobileData() {
    console.log('=== MOBILE DEBUG ===');
    console.log('1. Current delivery boys:', deliveryBoys);
    console.log('2. Current delivery boy:', currentDeliveryBoy);
    console.log('3. Current view:', currentView);
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    console.log('4. All orders:', orders);
    console.log('5. Orders count:', orders.length);
    
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    console.log('6. All products:', products);
    console.log('7. Products count:', products.length);
    
    // Test filtering
    if (currentDeliveryBoy) {
        const availableOrders = orders.filter(order => 
            (order.status === 'confirmed' && !order.assignedToId) ||
            (order.status === 'pending' && !order.assignedToId)
        );
        console.log('8. Available orders for pickup:', availableOrders);
    }
    
    console.log('=== END MOBILE DEBUG ===');
}

// Check and create test data if needed
function ensureTestData() {
    console.log('Checking for test data...');
    
    // Check if there are any orders
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    console.log('Current orders count:', orders.length);
    
    if (orders.length === 0) {
        console.log('No orders found, creating test order...');
        const testOrder = {
            orderId: 'TEST-001',
            customerName: 'Test Customer',
            customerPhone: '+91 98765 43210',
            deliveryAddress: '123 Test Street, Test City',
            deliveryTime: 'asap',
            items: [
                { name: 'Fresh Tomatoes', quantity: 2, price: 40 },
                { name: 'Onions', quantity: 1, price: 30 }
            ],
            total: 110,
            status: 'pending',
            createdAt: new Date().toISOString(),
            assignedTo: null,
            assignedToId: null
        };
        
        orders.push(testOrder);
        localStorage.setItem('orders', JSON.stringify(orders));
        console.log('Test order created:', testOrder);
    }
    
    // Check if there are any products
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    console.log('Current products count:', products.length);
    
    if (products.length === 0) {
        console.log('No products found, creating test products...');
        const testProducts = [
            { id: 1, name: "Fresh Tomatoes", price: 40, category: "vegetables", image: "🍅", stock: 50 },
            { id: 2, name: "Onions", price: 30, category: "vegetables", image: "🧅", stock: 30 },
            { id: 3, name: "Potatoes", price: 25, category: "vegetables", image: "🥔", stock: 40 },
            { id: 4, name: "Milk", price: 60, category: "dairy", image: "🥛", stock: 20 },
            { id: 5, name: "Bread", price: 35, category: "bakery", image: "🍞", stock: 15 }
        ];
        
        localStorage.setItem('products', JSON.stringify(testProducts));
        console.log('Test products created:', testProducts);
    }
}

// Manual refresh function for mobile users
function manualRefresh() {
    console.log('Manual refresh triggered');
    showNotification('Refreshing data...', 'info');
    
    // Ensure test data exists
    ensureTestData();
    
    // Force reinitialize everything
    console.log('Reinitializing delivery boys...');
    initializeDeliveryBoys();
    
    console.log('Loading fresh data...');
    loadDashboardData();
    
    // Also try to sync with owner dashboard data
    console.log('Syncing with owner dashboard...');
    syncWithOwnerDashboard();
    
    setTimeout(() => {
        showNotification('Data refreshed successfully!', 'success');
    }, 1000);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing delivery app...');
    
    // Ensure test data exists first
    ensureTestData();
    
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
    
    // Ensure delivery boys are initialized (fallback for deployment issues)
    if (!deliveryBoys || deliveryBoys.length === 0) {
        console.log('No delivery boys found, initializing...');
        initializeDeliveryBoys();
    }
    
    const deliveryBoy = deliveryBoys.find(boy => boy.id === deliveryBoyId);
    
    console.log('Found delivery boy:', deliveryBoy);
    console.log('Password comparison details:');
    console.log('- Input password:', `"${password}"`, 'Type:', typeof password);
    console.log('- Stored password:', `"${deliveryBoy ? deliveryBoy.password : 'NOT FOUND'}"`, 'Type:', typeof (deliveryBoy ? deliveryBoy.password : 'undefined'));
    console.log('- Are they equal?', deliveryBoy ? deliveryBoy.password === password : false);
    console.log('- Are they strictly equal?', deliveryBoy ? deliveryBoy.password === password : false);
    
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
    // Clear any existing interval
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    autoRefreshInterval = setInterval(() => {
        if (currentDeliveryBoy) {
            console.log('Auto-refreshing dashboard data...');
            showRefreshNotification();
            loadDashboardData();
        }
    }, 30000); // 30 seconds
    
    // Also refresh when page becomes visible (mobile optimization)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && currentDeliveryBoy) {
            console.log('Page became visible, refreshing data...');
            loadDashboardData();
        }
    });
    
    // Refresh when page regains focus (mobile optimization)
    window.addEventListener('focus', function() {
        if (currentDeliveryBoy) {
            console.log('Page regained focus, refreshing data...');
            loadDashboardData();
        }
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
    console.log('Loading dashboard data...');
    
    try {
        // Ensure delivery boys are loaded
        if (!deliveryBoys || deliveryBoys.length === 0) {
            console.log('Re-initializing delivery boys...');
            initializeDeliveryBoys();
        }
        
        loadOrders();
        updateStats();
        updateCurrentOrder();
        
        console.log('Dashboard data loaded successfully');
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Try to recover by reinitializing
        initializeDeliveryBoys();
        loadOrders();
        updateStats();
        updateCurrentOrder();
    }
}

// Load orders based on current view
function loadOrders() {
    try {
        const ordersData = localStorage.getItem('orders');
        console.log('Raw orders data from localStorage:', ordersData);
        
        const orders = ordersData ? JSON.parse(ordersData) : [];
        console.log('Parsed orders:', orders);
        
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
        
        console.log(`Filtered orders for view '${currentView}':`, filteredOrders);
        renderOrders(filteredOrders);
    } catch (error) {
        console.error('Error loading orders:', error);
        // Fallback: show empty state
        renderOrders([]);
    }
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
