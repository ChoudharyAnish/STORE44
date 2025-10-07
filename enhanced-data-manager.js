// Enhanced Data Manager with Multiple Free Storage Options
// This provides robust data persistence using free services

class EnhancedDataManager {
    constructor() {
        this.storageMethods = ['jsonbin', 'firebase', 'localStorage', 'sessionStorage', 'memory'];
        this.currentMethod = 'localStorage'; // Default fallback
        this.jsonbinApiKey = 'YOUR_JSONBIN_API_KEY'; // You'll get this free
        this.jsonbinBinId = 'YOUR_BIN_ID'; // Auto-generated
        this.firebaseConfig = null; // Firebase config
        
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
        
        this.memoryData = { ...this.fallbackData };
        this.isLocalStorageAvailable = this.checkLocalStorageAvailability();
        this.isSessionStorageAvailable = this.checkSessionStorageAvailability();
        
        console.log('Enhanced DataManager initialized:', {
            localStorage: this.isLocalStorageAvailable,
            sessionStorage: this.isSessionStorageAvailable,
            userAgent: navigator.userAgent,
            platform: navigator.platform
        });
        
        this.initializeStorage();
    }

    // Initialize storage method
    async initializeStorage() {
        console.log('Initializing storage method...');
        
        // Try JSONBin.io first (if configured)
        if (this.jsonbinApiKey && this.jsonbinApiKey !== 'YOUR_JSONBIN_API_KEY') {
            try {
                await this.testJsonbinConnection();
                this.currentMethod = 'jsonbin';
                console.log('✅ Using JSONBin.io for data storage');
                return;
            } catch (error) {
                console.warn('JSONBin.io not available:', error.message);
            }
        }
        
        // Try Firebase (if configured)
        if (this.firebaseConfig) {
            try {
                await this.testFirebaseConnection();
                this.currentMethod = 'firebase';
                console.log('✅ Using Firebase for data storage');
                return;
            } catch (error) {
                console.warn('Firebase not available:', error.message);
            }
        }
        
        // Fallback to localStorage
        if (this.isLocalStorageAvailable) {
            this.currentMethod = 'localStorage';
            console.log('✅ Using localStorage for data storage');
        } else if (this.isSessionStorageAvailable) {
            this.currentMethod = 'sessionStorage';
            console.log('✅ Using sessionStorage for data storage');
        } else {
            this.currentMethod = 'memory';
            console.log('⚠️ Using memory storage (data will not persist)');
        }
    }

    // Check localStorage availability
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

    // Check sessionStorage availability
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

    // Test JSONBin.io connection
    async testJsonbinConnection() {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${this.jsonbinBinId}/latest`, {
            headers: {
                'X-Master-Key': this.jsonbinApiKey
            }
        });
        
        if (!response.ok) {
            throw new Error(`JSONBin.io connection failed: ${response.status}`);
        }
        
        return true;
    }

    // Test Firebase connection
    async testFirebaseConnection() {
        // This would test Firebase connection
        // For now, we'll assume it works if config is provided
        return true;
    }

    // Get data with multiple fallback strategies
    async getData(key) {
        try {
            switch (this.currentMethod) {
                case 'jsonbin':
                    return await this.getDataFromJsonbin(key);
                case 'firebase':
                    return await this.getDataFromFirebase(key);
                case 'localStorage':
                    return this.getDataFromLocalStorage(key);
                case 'sessionStorage':
                    return this.getDataFromSessionStorage(key);
                case 'memory':
                    return this.memoryData[key] || [];
                default:
                    return this.fallbackData[key] || [];
            }
        } catch (error) {
            console.error(`Error getting data for key ${key}:`, error);
            // Fallback to next method
            return this.getDataFallback(key);
        }
    }

    // Set data with multiple storage strategies
    async setData(key, data) {
        try {
            switch (this.currentMethod) {
                case 'jsonbin':
                    await this.setDataToJsonbin(key, data);
                    break;
                case 'firebase':
                    await this.setDataToFirebase(key, data);
                    break;
                case 'localStorage':
                    this.setDataToLocalStorage(key, data);
                    break;
                case 'sessionStorage':
                    this.setDataToSessionStorage(key, data);
                    break;
                case 'memory':
                    this.memoryData[key] = data;
                    break;
            }
            
            console.log(`Data saved for key ${key} using ${this.currentMethod}:`, data.length || 'N/A');
            return true;
        } catch (error) {
            console.error(`Error setting data for key ${key}:`, error);
            // Fallback to next method
            return this.setDataFallback(key, data);
        }
    }

    // JSONBin.io methods
    async getDataFromJsonbin(key) {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${this.jsonbinBinId}/latest`, {
            headers: {
                'X-Master-Key': this.jsonbinApiKey
            }
        });
        
        if (!response.ok) {
            throw new Error(`JSONBin.io GET failed: ${response.status}`);
        }
        
        const result = await response.json();
        return result.record[key] || this.fallbackData[key] || [];
    }

    async setDataToJsonbin(key, data) {
        // First get current data
        const currentData = await this.getDataFromJsonbin('all');
        currentData[key] = data;
        
        const response = await fetch(`https://api.jsonbin.io/v3/b/${this.jsonbinBinId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': this.jsonbinApiKey
            },
            body: JSON.stringify(currentData)
        });
        
        if (!response.ok) {
            throw new Error(`JSONBin.io PUT failed: ${response.status}`);
        }
    }

    // localStorage methods
    getDataFromLocalStorage(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : (this.fallbackData[key] || []);
    }

    setDataToLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // sessionStorage methods
    getDataFromSessionStorage(key) {
        const data = sessionStorage.getItem(key);
        return data ? JSON.parse(data) : (this.fallbackData[key] || []);
    }

    setDataToSessionStorage(key, data) {
        sessionStorage.setItem(key, JSON.stringify(data));
    }

    // Fallback methods
    getDataFallback(key) {
        // Try localStorage
        if (this.isLocalStorageAvailable) {
            try {
                return this.getDataFromLocalStorage(key);
            } catch (e) {
                console.warn('localStorage fallback failed:', e);
            }
        }
        
        // Try sessionStorage
        if (this.isSessionStorageAvailable) {
            try {
                return this.getDataFromSessionStorage(key);
            } catch (e) {
                console.warn('sessionStorage fallback failed:', e);
            }
        }
        
        // Return fallback data
        return this.fallbackData[key] || [];
    }

    setDataFallback(key, data) {
        // Try localStorage
        if (this.isLocalStorageAvailable) {
            try {
                this.setDataToLocalStorage(key, data);
                return true;
            } catch (e) {
                console.warn('localStorage fallback failed:', e);
            }
        }
        
        // Try sessionStorage
        if (this.isSessionStorageAvailable) {
            try {
                this.setDataToSessionStorage(key, data);
                return true;
            } catch (e) {
                console.warn('sessionStorage fallback failed:', e);
            }
        }
        
        // Store in memory
        this.memoryData[key] = data;
        return false;
    }

    // Convenience methods
    async getOrders() {
        const orders = await this.getData('orders');
        console.log('Retrieved orders:', orders.length);
        return orders;
    }

    async setOrders(orders) {
        console.log('Setting orders:', orders.length);
        return await this.setData('orders', orders);
    }

    async getDeliveryBoys() {
        const deliveryBoys = await this.getData('deliveryBoys');
        console.log('Retrieved delivery boys:', deliveryBoys.length);
        return deliveryBoys;
    }

    async setDeliveryBoys(deliveryBoys) {
        console.log('Setting delivery boys:', deliveryBoys.length);
        return await this.setData('deliveryBoys', deliveryBoys);
    }

    async getProducts() {
        const products = await this.getData('products');
        console.log('Retrieved products:', products.length);
        return products;
    }

    async setProducts(products) {
        console.log('Setting products:', products.length);
        return await this.setData('products', products);
    }

    async getCurrentDeliveryBoy() {
        return await this.getData('currentDeliveryBoy');
    }

    async setCurrentDeliveryBoy(deliveryBoy) {
        return await this.setData('currentDeliveryBoy', deliveryBoy);
    }

    // Initialize default data
    async initializeDefaultData() {
        console.log('Initializing default data...');
        
        // Check if we have any data
        const orders = await this.getOrders();
        const deliveryBoys = await this.getDeliveryBoys();
        const products = await this.getProducts();

        // Initialize delivery boys if empty
        if (deliveryBoys.length === 0) {
            console.log('Initializing delivery boys...');
            await this.setDeliveryBoys(this.fallbackData.deliveryBoys);
        }

        // Initialize products if empty
        if (products.length === 0) {
            console.log('Initializing products...');
            await this.setProducts(this.fallbackData.products);
        }

        console.log('Default data initialization complete');
    }

    // Setup JSONBin.io (call this to enable cloud storage)
    async setupJsonbin() {
        console.log('Setting up JSONBin.io...');
        
        // Create a new bin
        const response = await fetch('https://api.jsonbin.io/v3/b', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': this.jsonbinApiKey
            },
            body: JSON.stringify(this.fallbackData)
        });
        
        if (response.ok) {
            const result = await response.json();
            this.jsonbinBinId = result.metadata.id;
            console.log('✅ JSONBin.io setup complete! Bin ID:', this.jsonbinBinId);
            return true;
        } else {
            console.error('❌ JSONBin.io setup failed:', response.status);
            return false;
        }
    }

    // Get storage status
    getStorageStatus() {
        return {
            currentMethod: this.currentMethod,
            localStorage: this.isLocalStorageAvailable,
            sessionStorage: this.isSessionStorageAvailable,
            jsonbinConfigured: this.jsonbinApiKey !== 'YOUR_JSONBIN_API_KEY',
            firebaseConfigured: this.firebaseConfig !== null,
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled
        };
    }
}

// Create global instance
window.enhancedDataManager = new EnhancedDataManager();

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Enhanced DataManager: DOM loaded, initializing...');
    await window.enhancedDataManager.initializeDefaultData();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedDataManager;
}
