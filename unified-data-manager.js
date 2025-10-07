// Unified Mobile-Compatible Data Manager
// This replaces all other data managers and fixes mobile sync issues

class UnifiedDataManager {
    constructor() {
        this.storageKey = 'freshmart_data';
        this.jsonbinApiKey = null;
        this.jsonbinBinId = null;
        this.jsonbinBaseUrl = 'https://api.jsonbin.io/v3/b';
        this.jsonbinHeaders = null;
        
        // Storage availability
        this.isLocalStorageAvailable = this.checkLocalStorageAvailability();
        this.isSessionStorageAvailable = this.checkSessionStorageAvailability();
        
        // Fallback data
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
        
        // Memory fallback
        this.memoryData = { ...this.fallbackData };
        
        console.log('📱 Unified DataManager initialized:', {
            localStorage: this.isLocalStorageAvailable,
            sessionStorage: this.isSessionStorageAvailable,
            userAgent: navigator.userAgent,
            platform: navigator.platform
        });
        
        this.initialize();
    }

    // Check localStorage availability
    checkLocalStorageAvailability() {
        try {
            const testKey = '__unified_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            console.warn('localStorage not available:', e.message);
            return false;
        }
    }

    // Check sessionStorage availability
    checkSessionStorageAvailability() {
        try {
            const testKey = '__unified_test__';
            sessionStorage.setItem(testKey, 'test');
            sessionStorage.removeItem(testKey);
            return true;
        } catch (e) {
            console.warn('sessionStorage not available:', e.message);
            return false;
        }
    }

    // Initialize the data manager
    async initialize() {
        console.log('🚀 Initializing Unified DataManager...');
        
        // Load JSONBin.io configuration
        await this.loadConfiguration();
        
        // Initialize default data
        await this.initializeDefaultData();
        
        console.log('✅ Unified DataManager ready!');
    }

    // Load configuration from server
    async loadConfiguration() {
        try {
            const response = await fetch('/api/config');
            if (response.ok) {
                const config = await response.json();
                this.jsonbinApiKey = config.jsonbinApiKey;
                this.jsonbinBinId = config.jsonbinBinId;
                
                if (this.jsonbinApiKey && this.jsonbinApiKey !== 'YOUR_JSONBIN_API_KEY_HERE') {
                    this.jsonbinHeaders = {
                        'Content-Type': 'application/json',
                        'X-Master-Key': this.jsonbinApiKey
                    };
                    console.log('✅ JSONBin.io configuration loaded');
                } else {
                    console.log('⚠️ JSONBin.io not configured, using local storage');
                }
            }
        } catch (error) {
            console.warn('Failed to load configuration:', error);
        }
    }

    // Initialize default data
    async initializeDefaultData() {
        console.log('📊 Initializing default data...');
        
        // Check if we have any data
        const orders = this.getOrders();
        const deliveryBoys = this.getDeliveryBoys();
        const products = this.getProducts();

        // Initialize delivery boys if empty
        if (deliveryBoys.length === 0) {
            console.log('👥 Creating default delivery boys...');
            this.setDeliveryBoys(this.fallbackData.deliveryBoys);
        }

        // Initialize products if empty
        if (products.length === 0) {
            console.log('📦 Creating default products...');
            this.setProducts(this.fallbackData.products);
        }

        // Clean demo orders
        this.cleanDemoOrders();

        console.log('✅ Default data initialization complete');
    }

    // Clean demo/test orders
    cleanDemoOrders() {
        const orders = this.getOrders();
        const realOrders = orders.filter(order => 
            !order.orderId.startsWith('DEMO-') && 
            !order.orderId.startsWith('TEST-') && 
            !order.orderId.startsWith('MOBILE-TEST-') &&
            order.customerName !== 'Demo Customer' &&
            order.customerName !== 'Test Customer' &&
            order.customerName !== 'Mobile Test Customer'
        );
        
        if (orders.length !== realOrders.length) {
            console.log(`🧹 Removed ${orders.length - realOrders.length} demo/test orders`);
            this.setOrders(realOrders);
        }
    }

    // Get data with multiple fallback strategies
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
            this.memoryData[key] = data;
            
            console.log(`💾 Data saved for key ${key}:`, data.length || 'N/A');
            return true;
        } catch (e) {
            console.error(`Error setting data for key ${key}:`, e);
            // Store in fallback data even if storage fails
            this.fallbackData[key] = data;
            this.memoryData[key] = data;
            return false;
        }
    }

    // Convenience methods
    getOrders() {
        const orders = this.getData('orders');
        console.log('📋 Retrieved orders:', orders.length);
        return orders;
    }

    setOrders(orders) {
        console.log('📝 Setting orders:', orders.length);
        return this.setData('orders', orders);
    }

    getDeliveryBoys() {
        const deliveryBoys = this.getData('deliveryBoys');
        console.log('👥 Retrieved delivery boys:', deliveryBoys.length);
        return deliveryBoys;
    }

    setDeliveryBoys(deliveryBoys) {
        console.log('👥 Setting delivery boys:', deliveryBoys.length);
        return this.setData('deliveryBoys', deliveryBoys);
    }

    getProducts() {
        const products = this.getData('products');
        console.log('📦 Retrieved products:', products.length);
        return products;
    }

    setProducts(products) {
        console.log('📦 Setting products:', products.length);
        return this.setData('products', products);
    }

    getCurrentDeliveryBoy() {
        return this.getData('currentDeliveryBoy');
    }

    setCurrentDeliveryBoy(deliveryBoy) {
        return this.setData('currentDeliveryBoy', deliveryBoy);
    }

    // JSONBin.io sync methods
    async syncToJsonBin() {
        if (!this.jsonbinApiKey || this.jsonbinApiKey === 'YOUR_JSONBIN_API_KEY_HERE') {
            console.log('⚠️ JSONBin.io not configured, skipping sync');
            return false;
        }

        try {
            console.log('☁️ Syncing to JSONBin.io...');
            
            const allData = {
                orders: this.getOrders(),
                deliveryBoys: this.getDeliveryBoys(),
                products: this.getProducts(),
                currentDeliveryBoy: this.getCurrentDeliveryBoy(),
                lastSync: new Date().toISOString()
            };

            const response = await fetch(`${this.jsonbinBaseUrl}/${this.jsonbinBinId}`, {
                method: 'PUT',
                headers: this.jsonbinHeaders,
                body: JSON.stringify(allData)
            });

            if (response.ok) {
                console.log('✅ JSONBin.io sync successful');
                return true;
            } else {
                const errorText = await response.text();
                console.error(`❌ JSONBin.io sync failed: ${response.status} - ${errorText}`);
                return false;
            }
        } catch (error) {
            console.error('❌ JSONBin.io sync error:', error);
            return false;
        }
    }

    async loadFromJsonBin() {
        if (!this.jsonbinApiKey || this.jsonbinApiKey === 'YOUR_JSONBIN_API_KEY_HERE') {
            console.log('⚠️ JSONBin.io not configured, using local data');
            return false;
        }

        try {
            console.log('☁️ Loading from JSONBin.io...');
            
            const response = await fetch(`${this.jsonbinBaseUrl}/${this.jsonbinBinId}/latest`, {
                headers: {
                    'X-Master-Key': this.jsonbinApiKey
                }
            });

            if (response.ok) {
                const data = await response.json();
                const record = data.record;
                
                if (record.orders) this.setOrders(record.orders);
                if (record.deliveryBoys) this.setDeliveryBoys(record.deliveryBoys);
                if (record.products) this.setProducts(record.products);
                if (record.currentDeliveryBoy) this.setCurrentDeliveryBoy(record.currentDeliveryBoy);
                
                console.log('✅ JSONBin.io load successful');
                return true;
            } else if (response.status === 404) {
                console.warn('⚠️ JSONBin.io bin not found, creating new one...');
                return await this.createNewBin();
            } else {
                const errorText = await response.text();
                console.error(`❌ JSONBin.io load failed: ${response.status} - ${errorText}`);
                return false;
            }
        } catch (error) {
            console.error('❌ JSONBin.io load error:', error);
            return false;
        }
    }

    async createNewBin() {
        try {
            console.log('🆕 Creating new JSONBin.io bin...');
            
            const allData = {
                orders: this.getOrders(),
                deliveryBoys: this.getDeliveryBoys(),
                products: this.getProducts(),
                currentDeliveryBoy: this.getCurrentDeliveryBoy(),
                createdAt: new Date().toISOString()
            };

            const response = await fetch(this.jsonbinBaseUrl, {
                method: 'POST',
                headers: this.jsonbinHeaders,
                body: JSON.stringify(allData)
            });

            if (response.ok) {
                const result = await response.json();
                this.jsonbinBinId = result.metadata.id;
                console.log('✅ New bin created successfully!');
                console.log('🆔 New Bin ID:', this.jsonbinBinId);
                console.log('📝 Please update your JSONBIN_BIN_ID environment variable to:', this.jsonbinBinId);
                return true;
            } else {
                const errorText = await response.text();
                console.error(`❌ Failed to create new bin: ${response.status} - ${errorText}`);
                return false;
            }
        } catch (error) {
            console.error('❌ Create bin error:', error);
            return false;
        }
    }

    // Get storage status
    getStorageStatus() {
        return {
            localStorage: this.isLocalStorageAvailable,
            sessionStorage: this.isSessionStorageAvailable,
            jsonbinConfigured: this.jsonbinApiKey && this.jsonbinApiKey !== 'YOUR_JSONBIN_API_KEY_HERE',
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled
        };
    }

    // Clear all data
    clearAllData() {
        try {
            if (this.isLocalStorageAvailable) {
                localStorage.clear();
            }
            if (this.isSessionStorageAvailable) {
                sessionStorage.clear();
            }
            this.memoryData = { ...this.fallbackData };
            console.log('🗑️ All data cleared');
        } catch (e) {
            console.error('Error clearing data:', e);
        }
    }
}

// Create global instance
window.unifiedDataManager = new UnifiedDataManager();

// Backward compatibility - make it available as dataManager too
window.dataManager = window.unifiedDataManager;

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 Unified DataManager: DOM loaded');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnifiedDataManager;
}

console.log('📱 Unified Mobile-Compatible DataManager loaded successfully!');
