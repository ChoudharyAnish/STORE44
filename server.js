const express = require('express');
const path = require('path');

const app = express();

// Environment Variables
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const APP_NAME = process.env.APP_NAME || 'FreshMart Grocery Shop';
const SHOP_NAME = process.env.SHOP_NAME || 'FreshMart';
const SHOP_ADDRESS = process.env.SHOP_ADDRESS || '123 Main Street, City, State';
const SHOP_PHONE = process.env.SHOP_PHONE || '+1-555-0123';
const SHOP_EMAIL = process.env.SHOP_EMAIL || 'info@freshmart.com';

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

// Start the server
app.listen(PORT, () => {
    console.log(`${APP_NAME} is running on port ${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
    console.log(`Shop: ${SHOP_NAME}`);
    console.log(`Visit: http://localhost:${PORT}`);
    console.log(`Owner Dashboard: http://localhost:${PORT}/owner`);
    console.log(`Delivery Dashboard: http://localhost:${PORT}/delivery`);
});
