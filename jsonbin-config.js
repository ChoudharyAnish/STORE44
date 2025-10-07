// JSONBin.io Configuration
// This file reads configuration from environment variables for security

const JSONBIN_CONFIG = {
    // Get API key from environment variable or fallback to placeholder
    API_KEY: process.env.JSONBIN_API_KEY || 'YOUR_JSONBIN_API_KEY_HERE',
    
    // Get Bin ID from environment variable or fallback to placeholder
    BIN_ID: process.env.JSONBIN_BIN_ID || 'YOUR_JSONBIN_BIN_ID_HERE'
};

// For browser environment, we need to pass these from the server
// The server will inject these values into the HTML
if (typeof window !== 'undefined') {
    // This will be set by the server-side template
    window.JSONBIN_CONFIG = JSONBIN_CONFIG;
}

// Export for Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JSONBIN_CONFIG;
}