// Mobile-Compatible localStorage Wrapper
// This fixes mobile localStorage issues without changing your existing code

class MobileLocalStorage {
    constructor() {
        this.isLocalStorageAvailable = this.checkLocalStorageAvailability();
        this.isSessionStorageAvailable = this.checkSessionStorageAvailability();
        this.memoryStorage = {};
        
        console.log('Mobile LocalStorage initialized:', {
            localStorage: this.isLocalStorageAvailable,
            sessionStorage: this.isSessionStorageAvailable,
            userAgent: navigator.userAgent
        });
    }

    checkLocalStorageAvailability() {
        try {
            const testKey = '__mobile_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            console.warn('localStorage not available:', e.message);
            return false;
        }
    }

    checkSessionStorageAvailability() {
        try {
            const testKey = '__mobile_test__';
            sessionStorage.setItem(testKey, 'test');
            sessionStorage.removeItem(testKey);
            return true;
        } catch (e) {
            console.warn('sessionStorage not available:', e.message);
            return false;
        }
    }

    getItem(key) {
        try {
            // Try localStorage first
            if (this.isLocalStorageAvailable) {
                return localStorage.getItem(key);
            }
            
            // Try sessionStorage as fallback
            if (this.isSessionStorageAvailable) {
                return sessionStorage.getItem(key);
            }
            
            // Return from memory
            return this.memoryStorage[key] || null;
        } catch (e) {
            console.warn(`Error getting ${key}:`, e);
            return this.memoryStorage[key] || null;
        }
    }

    setItem(key, value) {
        try {
            // Try localStorage first
            if (this.isLocalStorageAvailable) {
                localStorage.setItem(key, value);
                return;
            }
            
            // Try sessionStorage as fallback
            if (this.isSessionStorageAvailable) {
                sessionStorage.setItem(key, value);
                return;
            }
            
            // Store in memory
            this.memoryStorage[key] = value;
        } catch (e) {
            console.warn(`Error setting ${key}:`, e);
            this.memoryStorage[key] = value;
        }
    }

    removeItem(key) {
        try {
            if (this.isLocalStorageAvailable) {
                localStorage.removeItem(key);
            }
            if (this.isSessionStorageAvailable) {
                sessionStorage.removeItem(key);
            }
            delete this.memoryStorage[key];
        } catch (e) {
            console.warn(`Error removing ${key}:`, e);
            delete this.memoryStorage[key];
        }
    }

    clear() {
        try {
            if (this.isLocalStorageAvailable) {
                localStorage.clear();
            }
            if (this.isSessionStorageAvailable) {
                sessionStorage.clear();
            }
            this.memoryStorage = {};
        } catch (e) {
            console.warn('Error clearing storage:', e);
            this.memoryStorage = {};
        }
    }
}

// Create global instance
window.mobileStorage = new MobileLocalStorage();

// Override localStorage with mobile-compatible version
if (!window.mobileStorage.isLocalStorageAvailable) {
    console.log('🔄 Replacing localStorage with mobile-compatible version');
    
    // Override localStorage methods
    window.localStorage = {
        getItem: (key) => window.mobileStorage.getItem(key),
        setItem: (key, value) => window.mobileStorage.setItem(key, value),
        removeItem: (key) => window.mobileStorage.removeItem(key),
        clear: () => window.mobileStorage.clear(),
        length: 0,
        key: (index) => null
    };
}

// Initialize default data if needed
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mobile Storage: DOM loaded, checking for default data...');
    
    // Check if we have any orders
    const orders = JSON.parse(window.mobileStorage.getItem('orders') || '[]');
    console.log('Current orders count:', orders.length);
    
    // Check if we have delivery boys
    const deliveryBoys = JSON.parse(window.mobileStorage.getItem('deliveryBoys') || '[]');
    console.log('Current delivery boys count:', deliveryBoys.length);
    
    // If no delivery boys, create them
    if (deliveryBoys.length === 0) {
        console.log('Creating default delivery boys...');
        const defaultDeliveryBoys = [
            { id: 1, name: "Rajesh Kumar", phone: "+91 98765 43210", status: "available", ordersDelivered: 0, rating: 5.0, online: true, password: "1234" },
            { id: 2, name: "Suresh Singh", phone: "+91 98765 43211", status: "available", ordersDelivered: 0, rating: 5.0, online: true, password: "1234" },
            { id: 3, name: "Amit Patel", phone: "+91 98765 43212", status: "available", ordersDelivered: 0, rating: 5.0, online: true, password: "1234" },
            { id: 4, name: "Vikram Sharma", phone: "+91 98765 43213", status: "available", ordersDelivered: 0, rating: 5.0, online: true, password: "1234" },
            { id: 5, name: "Deepak Gupta", phone: "+91 98765 43214", status: "available", ordersDelivered: 0, rating: 5.0, online: true, password: "1234" }
        ];
        window.mobileStorage.setItem('deliveryBoys', JSON.stringify(defaultDeliveryBoys));
        console.log('✅ Default delivery boys created');
    }
    
    // If no orders, create a demo order (only if this is the first visit)
    if (orders.length === 0) {
        console.log('Creating demo order for first-time visitors...');
        const demoOrder = {
            orderId: 'DEMO-' + Date.now(),
            customerName: 'Demo Customer',
            customerPhone: '+91 98765 43210',
            deliveryAddress: '123 Demo Street, Demo City',
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
        
        orders.push(demoOrder);
        window.mobileStorage.setItem('orders', JSON.stringify(orders));
        console.log('✅ Demo order created');
    }
    
    console.log('Mobile Storage initialization complete');
});

// Debug functions for mobile testing
window.debugMobileStorage = function() {
    console.log('🔍 MOBILE STORAGE DEBUG:');
    console.log('localStorage available:', window.mobileStorage.isLocalStorageAvailable);
    console.log('sessionStorage available:', window.mobileStorage.isSessionStorageAvailable);
    console.log('Memory storage:', window.mobileStorage.memoryStorage);
    
    const orders = JSON.parse(window.mobileStorage.getItem('orders') || '[]');
    const deliveryBoys = JSON.parse(window.mobileStorage.getItem('deliveryBoys') || '[]');
    
    console.log('Orders count:', orders.length);
    console.log('Delivery boys count:', deliveryBoys.length);
    console.log('Orders:', orders);
    console.log('Delivery boys:', deliveryBoys);
};

window.clearMobileStorage = function() {
    console.log('🗑️ Clearing all mobile storage...');
    window.mobileStorage.clear();
    console.log('✅ Storage cleared');
};

window.createTestOrder = function() {
    console.log('📝 Creating test order...');
    const orders = JSON.parse(window.mobileStorage.getItem('orders') || '[]');
    
    const testOrder = {
        orderId: 'TEST-' + Date.now(),
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
    window.mobileStorage.setItem('orders', JSON.stringify(orders));
    console.log('✅ Test order created:', testOrder);
    
    // Refresh the page to show the new order
    setTimeout(() => {
        location.reload();
    }, 1000);
};

console.log('📱 Mobile Storage Wrapper loaded successfully!');
