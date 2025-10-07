const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

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
    console.log(`FreshMart Grocery Shop is running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
    console.log(`Owner Dashboard: http://localhost:${PORT}/owner`);
    console.log(`Delivery Dashboard: http://localhost:${PORT}/delivery`);
});
