# FreshMart Grocery Shop - Deployment Guide

## 🚀 Deploying to Render.com

### Prerequisites
1. GitHub repository with your code
2. Render.com account
3. JSONBin.io account and credentials

### Step 1: Prepare Your Repository

1. **Create `.env` file locally** (don't commit this):
   ```bash
   JSONBIN_API_KEY=your_actual_api_key_here
   JSONBIN_BIN_ID=your_actual_bin_id_here
   PORT=3001
   NODE_ENV=production
   ```

2. **Test locally**:
   ```bash
   npm install
   npm start
   ```

### Step 2: Deploy to Render

1. **Connect GitHub Repository**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Build Settings**:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

3. **Set Environment Variables**:
   In Render dashboard, go to Environment tab and add:
   ```
   JSONBIN_API_KEY = your_actual_jsonbin_api_key
   JSONBIN_BIN_ID = your_actual_jsonbin_bin_id
   NODE_ENV = production
   ```

4. **Deploy**:
   - Click "Create Web Service"
   - Render will automatically build and deploy

### Step 3: Get JSONBin.io Credentials

1. **Go to [JSONBin.io](https://jsonbin.io)**
2. **Create Account** (free tier available)
3. **Create a New Bin**:
   - Click "Create Bin"
   - Copy the Bin ID
4. **Get API Key**:
   - Go to Account Settings
   - Copy your Master Key

### Step 4: Configure Environment Variables

In your Render dashboard:
1. Go to your web service
2. Click "Environment" tab
3. Add these variables:
   ```
   JSONBIN_API_KEY = $2a$10$your_actual_master_key_here
   JSONBIN_BIN_ID = your_bin_id_here
   NODE_ENV = production
   ```

### Step 5: Test Your Deployment

1. **Visit your Render URL**
2. **Test all features**:
   - Customer interface: `https://your-app.onrender.com`
   - Owner dashboard: `https://your-app.onrender.com/owner`
   - Inventory management: `https://your-app.onrender.com/inventory`
   - Delivery dashboard: `https://your-app.onrender.com/delivery`

### 🔒 Security Features

✅ **Environment Variables**: All sensitive data is stored securely
✅ **No Hardcoded Secrets**: No API keys in source code
✅ **GitHub Safe**: Repository can be public without exposing secrets
✅ **Production Ready**: Proper environment configuration

### 📱 Features Available After Deployment

- **Customer Interface**: Browse 1000+ products
- **Stock Management**: Real-time inventory updates
- **Owner Dashboard**: Order and delivery management
- **Inventory Management**: Add/edit/delete products
- **Delivery Interface**: Order fulfillment
- **Real-time Sync**: JSONBin.io integration

### 🛠️ Troubleshooting

**If deployment fails**:
1. Check build logs in Render dashboard
2. Ensure all dependencies are in `package.json`
3. Verify environment variables are set correctly

**If JSONBin.io sync fails**:
1. Verify API key and Bin ID are correct
2. Check JSONBin.io account limits
3. System will fallback to local storage

### 📞 Support

- **Render Documentation**: https://render.com/docs
- **JSONBin.io Documentation**: https://jsonbin.io/docs
- **GitHub Issues**: Create issue in your repository

---

**Your FreshMart Grocery Shop is now ready for production! 🎉**
