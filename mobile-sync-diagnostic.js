// Mobile Sync Diagnostic Tool
// This helps debug mobile data synchronization issues

class MobileSyncDiagnostic {
    constructor() {
        this.isMobile = this.detectMobile();
        this.debugInfo = {
            device: this.getDeviceInfo(),
            storage: this.getStorageInfo(),
            data: this.getDataInfo(),
            sync: this.getSyncInfo()
        };
        
        this.logDiagnosticInfo();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            touchSupport: 'ontouchstart' in window,
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
            orientation: screen.orientation ? screen.orientation.type : 'unknown'
        };
    }

    getStorageInfo() {
        const storage = {
            localStorage: { available: false, error: null },
            sessionStorage: { available: false, error: null },
            unifiedDataManager: { available: false, status: null }
        };

        // Test localStorage
        try {
            const testKey = '__mobile_sync_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            storage.localStorage.available = true;
        } catch (e) {
            storage.localStorage.error = e.message;
        }

        // Test sessionStorage
        try {
            const testKey = '__mobile_sync_test__';
            sessionStorage.setItem(testKey, 'test');
            sessionStorage.removeItem(testKey);
            storage.sessionStorage.available = true;
        } catch (e) {
            storage.sessionStorage.error = e.message;
        }

        // Check unified data manager
        if (window.unifiedDataManager) {
            storage.unifiedDataManager.available = true;
            storage.unifiedDataManager.status = window.unifiedDataManager.getStorageStatus();
        }

        return storage;
    }

    getDataInfo() {
        const data = {
            orders: { count: 0, sample: null },
            deliveryBoys: { count: 0, sample: null },
            products: { count: 0, sample: null },
            currentDeliveryBoy: null
        };

        if (window.unifiedDataManager) {
            const orders = window.unifiedDataManager.getOrders();
            const deliveryBoys = window.unifiedDataManager.getDeliveryBoys();
            const products = window.unifiedDataManager.getProducts();
            const currentDeliveryBoy = window.unifiedDataManager.getCurrentDeliveryBoy();

            data.orders.count = orders.length;
            data.orders.sample = orders.length > 0 ? orders[0] : null;
            
            data.deliveryBoys.count = deliveryBoys.length;
            data.deliveryBoys.sample = deliveryBoys.length > 0 ? deliveryBoys[0] : null;
            
            data.products.count = products.length;
            data.products.sample = products.length > 0 ? products[0] : null;
            
            data.currentDeliveryBoy = currentDeliveryBoy;
        }

        return data;
    }

    getSyncInfo() {
        return {
            jsonbinConfigured: window.unifiedDataManager && 
                window.unifiedDataManager.jsonbinApiKey && 
                window.unifiedDataManager.jsonbinApiKey !== 'YOUR_JSONBIN_API_KEY_HERE',
            lastSync: null, // Will be updated if sync happens
            syncErrors: []
        };
    }

    logDiagnosticInfo() {
        console.log('🔍 MOBILE SYNC DIAGNOSTIC REPORT');
        console.log('=====================================');
        console.log('📱 Device Info:', this.debugInfo.device);
        console.log('💾 Storage Info:', this.debugInfo.storage);
        console.log('📊 Data Info:', this.debugInfo.data);
        console.log('☁️ Sync Info:', this.debugInfo.sync);
        
        // Check for issues
        this.checkForIssues();
    }

    checkForIssues() {
        const issues = [];
        
        if (!this.debugInfo.storage.localStorage.available) {
            issues.push('❌ localStorage not available');
        }
        
        if (!this.debugInfo.storage.sessionStorage.available) {
            issues.push('❌ sessionStorage not available');
        }
        
        if (!this.debugInfo.storage.unifiedDataManager.available) {
            issues.push('❌ UnifiedDataManager not loaded');
        }
        
        if (this.debugInfo.data.orders.count === 0) {
            issues.push('⚠️ No orders found');
        }
        
        if (this.debugInfo.data.deliveryBoys.count === 0) {
            issues.push('⚠️ No delivery boys found');
        }
        
        if (this.debugInfo.data.products.count === 0) {
            issues.push('⚠️ No products found');
        }
        
        if (!this.debugInfo.sync.jsonbinConfigured) {
            issues.push('⚠️ JSONBin.io not configured');
        }
        
        if (issues.length > 0) {
            console.log('🚨 ISSUES FOUND:');
            issues.forEach(issue => console.log(issue));
        } else {
            console.log('✅ No issues found - mobile sync should work!');
        }
        
        return issues;
    }

    // Test data synchronization
    async testSync() {
        console.log('🧪 Testing data synchronization...');
        
        if (!window.unifiedDataManager) {
            console.error('❌ UnifiedDataManager not available');
            return false;
        }

        try {
            // Test local data access
            const orders = window.unifiedDataManager.getOrders();
            const deliveryBoys = window.unifiedDataManager.getDeliveryBoys();
            const products = window.unifiedDataManager.getProducts();
            
            console.log('📊 Local data:');
            console.log(`  - Orders: ${orders.length}`);
            console.log(`  - Delivery Boys: ${deliveryBoys.length}`);
            console.log(`  - Products: ${products.length}`);
            
            // Test JSONBin.io sync if configured
            if (this.debugInfo.sync.jsonbinConfigured) {
                console.log('☁️ Testing JSONBin.io sync...');
                const syncResult = await window.unifiedDataManager.syncToJsonBin();
                if (syncResult) {
                    console.log('✅ JSONBin.io sync successful');
                } else {
                    console.log('❌ JSONBin.io sync failed');
                }
            }
            
            return true;
        } catch (error) {
            console.error('❌ Sync test failed:', error);
            return false;
        }
    }

    // Create test order for mobile testing
    createTestOrder() {
        console.log('📝 Creating test order for mobile sync testing...');
        
        if (!window.unifiedDataManager) {
            console.error('❌ UnifiedDataManager not available');
            return false;
        }

        const testOrder = {
            orderId: 'MOBILE-TEST-' + Date.now(),
            customerName: 'Mobile Test Customer',
            customerPhone: '+91 99999 99999',
            deliveryAddress: 'Test Address, Mobile City',
            deliveryTime: 'asap',
            items: [
                { id: 1, name: 'Fresh Tomatoes', price: 40, quantity: 2 },
                { id: 2, name: 'Onions', price: 30, quantity: 1 }
            ],
            total: 110,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        const orders = window.unifiedDataManager.getOrders();
        orders.push(testOrder);
        window.unifiedDataManager.setOrders(orders);
        
        console.log('✅ Test order created:', testOrder.orderId);
        return testOrder;
    }

    // Clear test data
    clearTestData() {
        console.log('🗑️ Clearing test data...');
        
        if (!window.unifiedDataManager) {
            console.error('❌ UnifiedDataManager not available');
            return false;
        }

        const orders = window.unifiedDataManager.getOrders();
        const realOrders = orders.filter(order => 
            !order.orderId.startsWith('MOBILE-TEST-') &&
            order.customerName !== 'Mobile Test Customer'
        );
        
        window.unifiedDataManager.setOrders(realOrders);
        console.log(`✅ Removed ${orders.length - realOrders.length} test orders`);
        return true;
    }

    // Show mobile alert with diagnostic info
    showMobileAlert() {
        const issues = this.checkForIssues();
        const message = `
Mobile Sync Diagnostic:
- Device: ${this.debugInfo.device.platform}
- Screen: ${this.debugInfo.device.screenSize.width}x${this.debugInfo.device.screenSize.height}
- LocalStorage: ${this.debugInfo.storage.localStorage.available ? 'OK' : 'FAILED'}
- SessionStorage: ${this.debugInfo.storage.sessionStorage.available ? 'OK' : 'FAILED'}
- DataManager: ${this.debugInfo.storage.unifiedDataManager.available ? 'OK' : 'FAILED'}
- Orders: ${this.debugInfo.data.orders.count}
- Delivery Boys: ${this.debugInfo.data.deliveryBoys.count}
- Products: ${this.debugInfo.data.products.count}
- JSONBin.io: ${this.debugInfo.sync.jsonbinConfigured ? 'Configured' : 'Not Configured'}
- Issues: ${issues.length}
        `;
        
        alert(message);
        console.log(message);
    }
}

// Create global instance
window.mobileSyncDiagnostic = new MobileSyncDiagnostic();

// Add mobile-specific event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 Mobile Sync Diagnostic: DOM loaded');
    
    // Re-run diagnostic after a short delay to ensure all scripts are loaded
    setTimeout(() => {
        if (window.mobileSyncDiagnostic) {
            window.mobileSyncDiagnostic.logDiagnosticInfo();
        }
    }, 2000);
    
    // Add orientation change listener
    window.addEventListener('orientationchange', function() {
        console.log('📱 Orientation changed - re-running diagnostic...');
        setTimeout(() => {
            if (window.mobileSyncDiagnostic) {
                window.mobileSyncDiagnostic.debugInfo.device.viewport = {
                    width: window.innerWidth,
                    height: window.innerHeight
                };
                window.mobileSyncDiagnostic.logDiagnosticInfo();
            }
        }, 100);
    });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileSyncDiagnostic;
}

console.log('📱 Mobile Sync Diagnostic Tool loaded successfully!');
