// Mobile Debug Helper
// This script helps debug mobile-specific issues

class MobileDebugger {
    constructor() {
        this.debugInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            localStorage: this.testLocalStorage(),
            sessionStorage: this.testSessionStorage(),
            screenSize: {
                width: screen.width,
                height: screen.height,
                availWidth: screen.availWidth,
                availHeight: screen.availHeight
            },
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            devicePixelRatio: window.devicePixelRatio,
            touchSupport: 'ontouchstart' in window,
            orientation: screen.orientation ? screen.orientation.type : 'unknown'
        };
        
        this.logDebugInfo();
    }

    testLocalStorage() {
        try {
            const testKey = '__mobile_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return { available: true, error: null };
        } catch (e) {
            return { available: false, error: e.message };
        }
    }

    testSessionStorage() {
        try {
            const testKey = '__mobile_test__';
            sessionStorage.setItem(testKey, 'test');
            sessionStorage.removeItem(testKey);
            return { available: true, error: null };
        } catch (e) {
            return { available: false, error: e.message };
        }
    }

    logDebugInfo() {
        console.log('🔍 MOBILE DEBUG INFO:');
        console.log('User Agent:', this.debugInfo.userAgent);
        console.log('Platform:', this.debugInfo.platform);
        console.log('Cookies Enabled:', this.debugInfo.cookieEnabled);
        console.log('LocalStorage:', this.debugInfo.localStorage);
        console.log('SessionStorage:', this.debugInfo.sessionStorage);
        console.log('Screen Size:', this.debugInfo.screenSize);
        console.log('Viewport:', this.debugInfo.viewport);
        console.log('Device Pixel Ratio:', this.debugInfo.devicePixelRatio);
        console.log('Touch Support:', this.debugInfo.touchSupport);
        console.log('Orientation:', this.debugInfo.orientation);
        
        // Check if we're on mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(this.debugInfo.userAgent);
        console.log('Is Mobile Device:', isMobile);
        
        // Check data manager status
        if (window.dataManager) {
            console.log('DataManager Status:', window.dataManager.getStorageStatus());
        } else {
            console.warn('DataManager not available!');
        }
    }

    testDataLoading() {
        console.log('🧪 TESTING DATA LOADING:');
        
        if (!window.dataManager) {
            console.error('DataManager not available!');
            return;
        }

        // Test orders
        const orders = window.dataManager.getOrders();
        console.log('Orders loaded:', orders.length);
        
        // Test delivery boys
        const deliveryBoys = window.dataManager.getDeliveryBoys();
        console.log('Delivery boys loaded:', deliveryBoys.length);
        
        // Test products
        const products = window.dataManager.getProducts();
        console.log('Products loaded:', products.length);
        
        // Test current delivery boy
        const currentDeliveryBoy = window.dataManager.getCurrentDeliveryBoy();
        console.log('Current delivery boy:', currentDeliveryBoy);
        
        return {
            orders: orders.length,
            deliveryBoys: deliveryBoys.length,
            products: products.length,
            currentDeliveryBoy: currentDeliveryBoy ? 'logged in' : 'not logged in'
        };
    }

    createTestData() {
        console.log('🔧 CREATING TEST DATA:');
        
        if (!window.dataManager) {
            console.error('DataManager not available!');
            return;
        }

        // No test orders will be created - only real customer orders
        console.log('⚠️ Test order creation disabled - only real customer orders allowed');
        
        // Only create products if needed
        const products = window.dataManager.getProducts();
        if (products.length === 0) {
            console.log('Creating test products...');
            const testProducts = [
                { id: 1, name: "Fresh Tomatoes", price: 40, category: "vegetables", image: "🍅", stock: 50 },
                { id: 2, name: "Onions", price: 30, category: "vegetables", image: "🧅", stock: 30 },
                { id: 3, name: "Potatoes", price: 25, category: "vegetables", image: "🥔", stock: 40 },
                { id: 4, name: "Milk", price: 60, category: "dairy", image: "🥛", stock: 20 },
                { id: 5, name: "Bread", price: 35, category: "bakery", image: "🍞", stock: 15 }
            ];
            window.dataManager.setProducts(testProducts);
            console.log('✅ Test products created');
        }
        
        console.log('✅ Test data creation complete');
    }

    showMobileAlert() {
        const message = `
Mobile Debug Info:
- Device: ${this.debugInfo.platform}
- Screen: ${this.debugInfo.screenSize.width}x${this.debugInfo.screenSize.height}
- Viewport: ${this.debugInfo.viewport.width}x${this.debugInfo.viewport.height}
- Touch: ${this.debugInfo.touchSupport}
- LocalStorage: ${this.debugInfo.localStorage.available ? 'OK' : 'FAILED'}
- DataManager: ${window.dataManager ? 'OK' : 'FAILED'}
        `;
        
        alert(message);
        console.log(message);
    }
}

// Create global instance
window.mobileDebugger = new MobileDebugger();

// Add mobile-specific event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mobile Debugger: DOM loaded');
    
    // Test data loading after a short delay
    setTimeout(() => {
        if (window.mobileDebugger) {
            window.mobileDebugger.testDataLoading();
        }
    }, 1000);
    
    // Add orientation change listener
    window.addEventListener('orientationchange', function() {
        console.log('Orientation changed');
        setTimeout(() => {
            if (window.mobileDebugger) {
                window.mobileDebugger.debugInfo.viewport = {
                    width: window.innerWidth,
                    height: window.innerHeight
                };
                console.log('New viewport:', window.mobileDebugger.debugInfo.viewport);
            }
        }, 100);
    });
    
    // Add visibility change listener
    document.addEventListener('visibilitychange', function() {
        console.log('Visibility changed:', document.hidden ? 'hidden' : 'visible');
    });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileDebugger;
}
