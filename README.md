# FreshMart Grocery Shop Management System

A complete web application for managing a small grocery shop with three interfaces:
- **Customer Interface**: Browse products and place orders
- **Owner Dashboard**: Manage orders, assign deliveries, and view statistics
- **Delivery Boy Interface**: Accept orders and mark deliveries as complete

## Features

### Customer Interface
- Browse products by category
- Search functionality
- Shopping cart management
- Order placement with delivery details
- Real-time order tracking

### Owner Dashboard
- Real-time order management
- Delivery boy status monitoring
- Daily statistics and analytics
- Manual order assignment
- Auto-refresh every 30 seconds

### Delivery Boy Interface
- Available orders pickup system
- Order acceptance and delivery confirmation
- Online/offline status toggle
- Delivery history and statistics
- Real-time synchronization

## Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js with Express
- **Storage**: LocalStorage (for demo purposes)
- **Deployment**: Render.com

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. Open http://localhost:3000

## Deployment on Render

1. Push your code to GitHub
2. Connect your GitHub repository to Render
3. Deploy as a Web Service
4. Your app will be live at your Render URL

## Default Credentials

### Delivery Boys (for testing)
- **ID**: 1, **Password**: 1234 (Rajesh Kumar)
- **ID**: 2, **Password**: 1234 (Suresh Singh)
- **ID**: 3, **Password**: 1234 (Amit Patel)
- **ID**: 4, **Password**: 1234 (Vikram Sharma)
- **ID**: 5, **Password**: 1234 (Deepak Gupta)

## Usage Instructions

1. **Customers**: Visit the main page to browse and order products
2. **Owner**: Visit `/owner` to manage orders and delivery boys
3. **Delivery Boys**: Visit `/delivery` and login with credentials above

## License

MIT License - Feel free to use and modify for your grocery shop!
