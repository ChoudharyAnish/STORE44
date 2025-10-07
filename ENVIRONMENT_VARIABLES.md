# Environment Variables Configuration for FreshMart Grocery Shop

## Current Environment Variables

### Server Configuration
- **PORT**: Server port (default: 3000, Render sets this automatically)
- **NODE_ENV**: Environment mode (development/production)

### App Configuration  
- **APP_NAME**: Application name (default: "FreshMart Grocery Shop")
- **SHOP_NAME**: Shop name (default: "FreshMart")
- **SHOP_ADDRESS**: Shop address (default: "123 Main Street, City, State")
- **SHOP_PHONE**: Shop phone number (default: "+1-555-0123")
- **SHOP_EMAIL**: Shop email (default: "info@freshmart.com")

## How to Set Environment Variables

### For Local Development
Create a `.env` file in your project root:
```
PORT=3000
NODE_ENV=development
APP_NAME=Store 44 Grocery Shop
SHOP_NAME=Store 44
SHOP_ADDRESS=Your Shop Address
SHOP_PHONE=Your Phone Number
SHOP_EMAIL=your-email@store44.com
```

### For Render Deployment
1. Go to your Render dashboard
2. Select your web service
3. Go to "Environment" tab
4. Add environment variables:
   - **NODE_ENV**: `production`
   - **APP_NAME**: `Store 44 Grocery Shop`
   - **SHOP_NAME**: `Store 44`
   - **SHOP_ADDRESS**: `Your actual shop address`
   - **SHOP_PHONE**: `Your actual phone number`
   - **SHOP_EMAIL**: `your-email@store44.com`

## Benefits of Environment Variables

1. **Easy Configuration**: Change settings without code changes
2. **Environment-Specific**: Different settings for dev/production
3. **Security**: Keep sensitive data out of code
4. **Deployment Flexibility**: Easy to configure for different deployments

## Future Environment Variables (Optional)

You can add these later for enhanced functionality:
- **DATABASE_URL**: For database connection
- **JWT_SECRET**: For authentication
- **EMAIL_SERVICE**: For email notifications
- **PAYMENT_GATEWAY**: For payment processing
- **GOOGLE_MAPS_API**: For location services
