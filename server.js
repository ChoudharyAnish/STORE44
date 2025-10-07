const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for owner dashboard
app.get('/owner', (req, res) => {
    res.sendFile(path.join(__dirname, 'owner.html'));
});

// Route for delivery dashboard
app.get('/delivery', (req, res) => {
    res.sendFile(path.join(__dirname, 'delivery.html'));
});

// Route for inventory management with environment variables
app.get('/inventory', (req, res) => {
    res.sendFile(path.join(__dirname, 'inventory.html'));
});

// API route to get JSONBin configuration (secure)
app.get('/api/config', (req, res) => {
    // Debug: Log environment variables
    console.log('Environment variables check:');
    console.log('JSONBIN_API_KEY:', process.env.JSONBIN_API_KEY ? 'SET' : 'NOT SET');
    console.log('JSONBIN_BIN_ID:', process.env.JSONBIN_BIN_ID ? 'SET' : 'NOT SET');
    
    res.json({
        jsonbinApiKey: process.env.JSONBIN_API_KEY || 'YOUR_JSONBIN_API_KEY_HERE',
        jsonbinBinId: process.env.JSONBIN_BIN_ID || 'YOUR_JSONBIN_BIN_ID_HERE'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`FreshMart Grocery Shop is running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
    console.log(`Owner Dashboard: http://localhost:${PORT}/owner`);
    console.log(`Delivery Dashboard: http://localhost:${PORT}/delivery`);
    console.log(`Inventory Management: http://localhost:${PORT}/inventory`);
});
