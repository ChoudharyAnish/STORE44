// JSONBin.io Diagnostic Tool
// This script helps diagnose JSONBin.io connection issues

class JSONBinDiagnostic {
    constructor() {
        this.apiKey = null;
        this.binId = null;
        this.baseUrl = 'https://api.jsonbin.io/v3/b';
    }

    // Load configuration from server
    async loadConfig() {
        try {
            console.log('🔍 Loading JSONBin.io configuration...');
            const response = await fetch('/api/config');
            const config = await response.json();
            
            this.apiKey = config.jsonbinApiKey;
            this.binId = config.jsonbinBinId;
            
            console.log('📋 Configuration loaded:');
            console.log('API Key:', this.apiKey ? 'SET' : 'NOT SET');
            console.log('Bin ID:', this.binId ? 'SET' : 'NOT SET');
            
            if (this.apiKey === 'YOUR_JSONBIN_API_KEY_HERE' || this.binId === 'YOUR_JSONBIN_BIN_ID_HERE') {
                console.error('❌ Configuration not properly set!');
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('❌ Failed to load configuration:', error);
            return false;
        }
    }

    // Test API key validity
    async testApiKey() {
        try {
            console.log('🔑 Testing API key...');
            const response = await fetch('https://api.jsonbin.io/v3/b', {
                method: 'GET',
                headers: {
                    'X-Master-Key': this.apiKey
                }
            });
            
            if (response.ok) {
                console.log('✅ API key is valid');
                return true;
            } else {
                console.error('❌ API key is invalid:', response.status);
                return false;
            }
        } catch (error) {
            console.error('❌ API key test failed:', error);
            return false;
        }
    }

    // Test bin access
    async testBinAccess() {
        try {
            console.log('📦 Testing bin access...');
            const response = await fetch(`${this.baseUrl}/${this.binId}/latest`, {
                headers: {
                    'X-Master-Key': this.apiKey
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Bin is accessible');
                console.log('📊 Bin data:', data);
                return true;
            } else {
                const errorText = await response.text();
                console.error('❌ Bin access failed:', response.status, errorText);
                return false;
            }
        } catch (error) {
            console.error('❌ Bin access test failed:', error);
            return false;
        }
    }

    // Create a new bin
    async createNewBin() {
        try {
            console.log('🆕 Creating new bin...');
            const testData = {
                orders: [],
                products: [],
                deliveryBoys: [],
                createdAt: new Date().toISOString(),
                test: true
            };
            
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.apiKey
                },
                body: JSON.stringify(testData)
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ New bin created successfully!');
                console.log('🆔 New Bin ID:', result.metadata.id);
                console.log('📝 Update your environment variable JSONBIN_BIN_ID with this new ID');
                return result.metadata.id;
            } else {
                const errorText = await response.text();
                console.error('❌ Failed to create new bin:', response.status, errorText);
                return false;
            }
        } catch (error) {
            console.error('❌ Create bin failed:', error);
            return false;
        }
    }

    // Run full diagnostic
    async runDiagnostic() {
        console.log('🚀 Starting JSONBin.io Diagnostic...');
        console.log('=====================================');
        
        // Step 1: Load configuration
        const configLoaded = await this.loadConfig();
        if (!configLoaded) {
            console.log('❌ Configuration not loaded. Please check your environment variables.');
            return;
        }
        
        // Step 2: Test API key
        const apiKeyValid = await this.testApiKey();
        if (!apiKeyValid) {
            console.log('❌ API key is invalid. Please check your JSONBIN_API_KEY.');
            return;
        }
        
        // Step 3: Test bin access
        const binAccessible = await this.testBinAccess();
        if (!binAccessible) {
            console.log('❌ Bin is not accessible. Attempting to create new bin...');
            const newBinId = await this.createNewBin();
            if (newBinId) {
                console.log('✅ Please update your JSONBIN_BIN_ID environment variable to:', newBinId);
            }
            return;
        }
        
        console.log('✅ All tests passed! JSONBin.io is working correctly.');
    }
}

// Create and run diagnostic
const diagnostic = new JSONBinDiagnostic();

// Run diagnostic when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 JSONBin.io Diagnostic Tool loaded');
    console.log('Run diagnostic.runDiagnostic() in console to test your setup');
    
    // Auto-run diagnostic
    diagnostic.runDiagnostic();
});

// Make diagnostic available globally
window.jsonbinDiagnostic = diagnostic;
