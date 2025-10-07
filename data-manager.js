// Enhanced Data Manager for Cross-Platform Compatibility
// This module provides robust data persistence that works on both desktop and mobile

class DataManager {
    constructor() {
        this.storageKey = 'freshmart_data';
        this.fallbackData = {
            orders: [],
            deliveryBoys: [
                { id: 1, name: "Rajesh Kumar", phone: "+91 98765 43210", status: "available", ordersDelivered: 0, rating: 5.0, online: true, password: "1234" },
                { id: 2, name: "Suresh Singh", phone: "+91 98765 43211", status: "available", ordersDelivered: 0, rating: 5.0, online: true, password: "1234" },
                { id: 3, name: "Amit Patel", phone: "+91 98765 43212", status: "available", ordersDelivered: 0, rating: 5.0, online: true, password: "1234" },
                { id: 4, name: "Vikram Sharma", phone: "+91 98765 43213", status: "available", ordersDelivered: 0, rating: 5.0, online: true, password: "1234" },
                { id: 5, name: "Deepak Gupta", phone: "+91 98765 43214", status: "available", ordersDelivered: 0, rating: 5.0, online: true, password: "1234" }
            ],
            products: [
                { id: 1, name: "Fresh Tomatoes", price: 40, category: "vegetables", image: "🍅", stock: 50 },
                { id: 2, name: "Onions", price: 30, category: "vegetables", image: "🧅", stock: 30 },
                { id: 3, name: "Potatoes", price: 25, category: "vegetables", image: "🥔", stock: 40 },
                { id: 4, name: "Carrots", price: 35, category: "vegetables", image: "🥕", stock: 25 },
                { id: 5, name: "Spinach", price: 20, category: "vegetables", image: "🥬", stock: 20 },
                { id: 6, name: "Bell Peppers", price: 60, category: "vegetables", image: "🫑", stock: 15 },
                { id: 7, name: "Bananas", price: 50, category: "fruits", image: "🍌", stock: 30 },
                { id: 8, name: "Apples", price: 80, category: "fruits", image: "🍎", stock: 25 },
                { id: 9, name: "Oranges", price: 70, category: "fruits", image: "🍊", stock: 20 },
                { id: 10, name: "Grapes", price: 120, category: "fruits", image: "🍇", stock: 15 },
                { id: 11, name: "Mangoes", price: 100, category: "fruits", image: "🥭", stock: 18 },
                { id: 12, name: "Strawberries", price: 150, category: "fruits", image: "🍓", stock: 12 },
                { id: 13, name: "Milk (1L)", price: 60, category: "dairy", image: "🥛", stock: 20 },
                { id: 14, name: "Cheese", price: 200, category: "dairy", image: "🧀", stock: 10 },
                { id: 15, name: "Yogurt", price: 45, category: "dairy", image: "🍶", stock: 25 },
                { id: 16, name: "Butter", price: 80, category: "dairy", image: "🧈", stock: 15 },
                { id: 17, name: "Eggs (12)", price: 90, category: "dairy", image: "🥚", stock: 30 },
                { id: 18, name: "Rice (1kg)", price: 80, category: "grains", image: "🍚", stock: 40 },
                { id: 19, name: "Wheat Flour", price: 50, category: "grains", image: "🌾", stock: 35 },
                { id: 20, name: "Lentils", price: 120, category: "grains", image: "🫘", stock: 25 },
                { id: 21, name: "Oats", price: 100, category: "grains", image: "🌾", stock: 20 },
                { id: 22, name: "Quinoa", price: 200, category: "grains", image: "🌾", stock: 15 },
                { id: 23, name: "Biscuits", price: 30, category: "snacks", image: "🍪", stock: 50 },
                { id: 24, name: "Chips", price: 25, category: "snacks", image: "🍟", stock: 40 },
                { id: 25, name: "Nuts Mix", price: 150, category: "snacks", image: "🥜", stock: 20 },
                { id: 26, name: "Chocolate", price: 80, category: "snacks", image: "🍫", stock: 30 },
                { id: 27, name: "Candy", price: 20, category: "snacks", image: "🍬", stock: 60 }
            ],
            currentDeliveryBoy: null
        };
        
        this.isLocalStorageAvailable = this.checkLocalStorageAvailability();
        this.isSessionStorageAvailable = this.checkSessionStorageAvailability();
        
        console.log('DataManager initialized:', {
            localStorage: this.isLocalStorageAvailable,
            sessionStorage: this.isSessionStorageAvailable,
            userAgent: navigator.userAgent
        });
    }

    // Check if localStorage is available and working
    checkLocalStorageAvailability() {
        try {
            const testKey = '__localStorage_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            console.warn('localStorage not available:', e.message);
            return false;
        }
    }

    // Check if sessionStorage is available and working
    checkSessionStorageAvailability() {
        try {
            const testKey = '__sessionStorage_test__';
            sessionStorage.setItem(testKey, 'test');
            sessionStorage.removeItem(testKey);
            return true;
        } catch (e) {
            console.warn('sessionStorage not available:', e.message);
            return false;
        }
    }

    // Get data with fallback strategy
    getData(key) {
        try {
            // Try localStorage first
            if (this.isLocalStorageAvailable) {
                const data = localStorage.getItem(key);
                if (data) {
                    return JSON.parse(data);
                }
            }

            // Try sessionStorage as fallback
            if (this.isSessionStorageAvailable) {
                const data = sessionStorage.getItem(key);
                if (data) {
                    return JSON.parse(data);
                }
            }

            // Return fallback data
            return this.fallbackData[key] || [];
        } catch (e) {
            console.error(`Error getting data for key ${key}:`, e);
            return this.fallbackData[key] || [];
        }
    }

    // Set data with multiple storage strategies
    setData(key, data) {
        try {
            const jsonData = JSON.stringify(data);
            
            // Try localStorage first
            if (this.isLocalStorageAvailable) {
                localStorage.setItem(key, jsonData);
            }

            // Also store in sessionStorage as backup
            if (this.isSessionStorageAvailable) {
                sessionStorage.setItem(key, jsonData);
            }

            // Update fallback data
            this.fallbackData[key] = data;
            
            console.log(`Data saved for key ${key}:`, data);
            return true;
        } catch (e) {
            console.error(`Error setting data for key ${key}:`, e);
            // Store in fallback data even if storage fails
            this.fallbackData[key] = data;
            return false;
        }
    }

    // Get orders with enhanced error handling
    getOrders() {
        const orders = this.getData('orders');
        console.log('Retrieved orders:', orders.length);
        return orders;
    }

    // Set orders with enhanced error handling
    setOrders(orders) {
        console.log('Setting orders:', orders.length);
        return this.setData('orders', orders);
    }

    // Get delivery boys with enhanced error handling
    getDeliveryBoys() {
        const deliveryBoys = this.getData('deliveryBoys');
        console.log('Retrieved delivery boys:', deliveryBoys.length);
        return deliveryBoys;
    }

    // Set delivery boys with enhanced error handling
    setDeliveryBoys(deliveryBoys) {
        console.log('Setting delivery boys:', deliveryBoys.length);
        return this.setData('deliveryBoys', deliveryBoys);
    }

    // Get products with enhanced error handling
    getProducts() {
        const products = this.getData('products');
        console.log('Retrieved products:', products.length);
        return products;
    }

    // Set products with enhanced error handling
    setProducts(products) {
        console.log('Setting products:', products.length);
        return this.setData('products', products);
    }

    // Get current delivery boy
    getCurrentDeliveryBoy() {
        return this.getData('currentDeliveryBoy');
    }

    // Set current delivery boy
    setCurrentDeliveryBoy(deliveryBoy) {
        return this.setData('currentDeliveryBoy', deliveryBoy);
    }

    // Initialize default data if needed
    initializeDefaultData() {
        console.log('Initializing default data...');
        
        // Check if we have any data
        const orders = this.getOrders();
        const deliveryBoys = this.getDeliveryBoys();
        const products = this.getProducts();

        // Initialize delivery boys if empty
        if (deliveryBoys.length === 0) {
            console.log('Initializing delivery boys...');
            this.setDeliveryBoys(this.fallbackData.deliveryBoys);
        }

        // Initialize products if empty
        if (products.length === 0) {
            console.log('Initializing products...');
            this.setProducts(this.fallbackData.products);
        }

        // Create a test order if no orders exist (for demo purposes)
        if (orders.length === 0) {
            console.log('Creating test order for demo...');
            const testOrder = {
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
            
            orders.push(testOrder);
            this.setOrders(orders);
        }

        console.log('Default data initialization complete');
    }

    // Clear all data (useful for testing)
    clearAllData() {
        try {
            if (this.isLocalStorageAvailable) {
                localStorage.clear();
            }
            if (this.isSessionStorageAvailable) {
                sessionStorage.clear();
            }
            this.fallbackData = { ...this.fallbackData };
            console.log('All data cleared');
        } catch (e) {
            console.error('Error clearing data:', e);
        }
    }

    // Get storage status for debugging
    getStorageStatus() {
        return {
            localStorage: this.isLocalStorageAvailable,
            sessionStorage: this.isSessionStorageAvailable,
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled
        };
    }
}

// Create global instance
window.dataManager = new DataManager();

// Initialize default data when the script loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DataManager: DOM loaded, initializing...');
    window.dataManager.initializeDefaultData();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}
