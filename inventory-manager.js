// Inventory Manager with JSONBin.io Integration
// This module handles inventory data synchronization with JSONBin.io for real-time updates

class InventoryManager {
    constructor() {
        // JSONBin.io configuration - will be loaded from server
        this.jsonbinApiKey = null;
        this.jsonbinBinId = null;
        this.jsonbinBaseUrl = 'https://api.jsonbin.io/v3/b';
        this.jsonbinHeaders = null;
        
        // Local storage fallback
        this.localStorageKey = 'inventory_data';
        this.syncInterval = 30000; // 30 seconds
        this.syncTimeout = null;
        
        // Inventory data structure
        this.inventory = {
            products: [],
            categories: [],
            lastUpdated: null,
            version: 1
        };
        
        // Initialize with sample data for 1000 SKUs
        this.initializeSampleInventory();
        
        console.log('InventoryManager initialized');
    }
    
    // Initialize sample inventory with 1000 SKUs
    initializeSampleInventory() {
        const categories = [
            'Vegetables', 'Fruits', 'Dairy', 'Grains', 'Snacks', 'Beverages', 
            'Spices', 'Frozen Foods', 'Bakery', 'Meat & Poultry', 'Seafood', 
            'Health & Wellness', 'Household', 'Personal Care', 'Pet Supplies'
        ];
        
        const sampleProducts = [
            // Vegetables (100 SKUs)
            ...this.generateVegetables(100),
            // Fruits (100 SKUs)
            ...this.generateFruits(100),
            // Dairy (80 SKUs)
            ...this.generateDairy(80),
            // Grains (80 SKUs)
            ...this.generateGrains(80),
            // Snacks (100 SKUs)
            ...this.generateSnacks(100),
            // Beverages (80 SKUs)
            ...this.generateBeverages(80),
            // Spices (60 SKUs)
            ...this.generateSpices(60),
            // Frozen Foods (60 SKUs)
            ...this.generateFrozenFoods(60),
            // Bakery (60 SKUs)
            ...this.generateBakery(60),
            // Meat & Poultry (60 SKUs)
            ...this.generateMeatPoultry(60),
            // Seafood (40 SKUs)
            ...this.generateSeafood(40),
            // Health & Wellness (60 SKUs)
            ...this.generateHealthWellness(60),
            // Household (60 SKUs)
            ...this.generateHousehold(60),
            // Personal Care (60 SKUs)
            ...this.generatePersonalCare(60),
            // Pet Supplies (40 SKUs)
            ...this.generatePetSupplies(40)
        ];
        
        this.inventory.products = sampleProducts;
        this.inventory.categories = categories;
        this.inventory.lastUpdated = new Date().toISOString();
        
        console.log(`Initialized inventory with ${this.inventory.products.length} products`);
    }
    
    // Generate vegetable products
    generateVegetables(count) {
        const vegetables = [
            'Tomatoes', 'Onions', 'Potatoes', 'Carrots', 'Spinach', 'Bell Peppers', 
            'Cabbage', 'Cauliflower', 'Broccoli', 'Cucumber', 'Radish', 'Beetroot',
            'Okra', 'Brinjal', 'Bottle Gourd', 'Ridge Gourd', 'Snake Gourd', 'Pumpkin',
            'Green Beans', 'Peas', 'Corn', 'Mushrooms', 'Ginger', 'Garlic', 'Green Chilies',
            'Red Chilies', 'Coriander Leaves', 'Mint Leaves', 'Curry Leaves', 'Fenugreek Leaves'
        ];
        
        return this.generateProducts(vegetables, 'Vegetables', count);
    }
    
    // Generate fruit products
    generateFruits(count) {
        const fruits = [
            'Bananas', 'Apples', 'Oranges', 'Grapes', 'Mangoes', 'Strawberries',
            'Pineapple', 'Papaya', 'Watermelon', 'Muskmelon', 'Pomegranate', 'Guava',
            'Kiwi', 'Peach', 'Pear', 'Plum', 'Cherry', 'Blueberry', 'Raspberry',
            'Blackberry', 'Coconut', 'Dates', 'Figs', 'Custard Apple', 'Sapota',
            'Jackfruit', 'Dragon Fruit', 'Passion Fruit', 'Lychee', 'Rambutan'
        ];
        
        return this.generateProducts(fruits, 'Fruits', count);
    }
    
    // Generate dairy products
    generateDairy(count) {
        const dairy = [
            'Milk', 'Cheese', 'Yogurt', 'Butter', 'Ghee', 'Paneer', 'Cream',
            'Ice Cream', 'Cottage Cheese', 'Sour Cream', 'Buttermilk', 'Condensed Milk',
            'Powdered Milk', 'Fresh Cream', 'Ricotta Cheese', 'Mozzarella', 'Cheddar',
            'Processed Cheese', 'Cream Cheese', 'Milk Powder', 'Whey Protein', 'Curd',
            'Lassi', 'Kefir', 'Goat Milk', 'Sheep Milk', 'Almond Milk', 'Soy Milk',
            'Coconut Milk', 'Oat Milk'
        ];
        
        return this.generateProducts(dairy, 'Dairy', count);
    }
    
    // Generate grain products
    generateGrains(count) {
        const grains = [
            'Rice', 'Wheat Flour', 'Lentils', 'Oats', 'Quinoa', 'Barley', 'Corn Flour',
            'Semolina', 'Besan', 'Ragi', 'Jowar', 'Bajra', 'Millet', 'Buckwheat',
            'Brown Rice', 'Basmati Rice', 'Red Rice', 'Black Rice', 'Wild Rice',
            'Toor Dal', 'Moong Dal', 'Chana Dal', 'Urad Dal', 'Masoor Dal', 'Rajma',
            'Chickpeas', 'Black Beans', 'Kidney Beans', 'Soybeans', 'Green Gram'
        ];
        
        return this.generateProducts(grains, 'Grains', count);
    }
    
    // Generate snack products
    generateSnacks(count) {
        const snacks = [
            'Biscuits', 'Chips', 'Nuts', 'Chocolate', 'Candy', 'Cookies', 'Crackers',
            'Popcorn', 'Trail Mix', 'Granola Bars', 'Energy Bars', 'Protein Bars',
            'Dried Fruits', 'Roasted Nuts', 'Seeds', 'Pretzels', 'Pita Chips',
            'Rice Cakes', 'Crackers', 'Wafers', 'Muffins', 'Cupcakes', 'Donuts',
            'Pastries', 'Croissants', 'Bagels', 'Sandwich Cookies', 'Cream Biscuits',
            'Salt Biscuits', 'Sweet Biscuits'
        ];
        
        return this.generateProducts(snacks, 'Snacks', count);
    }
    
    // Generate beverage products
    generateBeverages(count) {
        const beverages = [
            'Tea', 'Coffee', 'Juice', 'Soft Drinks', 'Energy Drinks', 'Water',
            'Coconut Water', 'Lemonade', 'Iced Tea', 'Hot Chocolate', 'Milk Shake',
            'Smoothie', 'Sports Drink', 'Herbal Tea', 'Green Tea', 'Black Tea',
            'White Tea', 'Oolong Tea', 'Chai', 'Espresso', 'Cappuccino', 'Latte',
            'Mocha', 'Americano', 'Frappuccino', 'Cold Brew', 'Nitro Coffee',
            'Matcha', 'Turmeric Latte', 'Golden Milk'
        ];
        
        return this.generateProducts(beverages, 'Beverages', count);
    }
    
    // Generate spice products
    generateSpices(count) {
        const spices = [
            'Turmeric', 'Cumin', 'Coriander', 'Red Chili Powder', 'Garam Masala',
            'Black Pepper', 'Cardamom', 'Cinnamon', 'Cloves', 'Bay Leaves', 'Fenugreek',
            'Mustard Seeds', 'Fennel Seeds', 'Cumin Seeds', 'Coriander Seeds',
            'Star Anise', 'Nutmeg', 'Mace', 'Saffron', 'Asafoetida', 'Tamarind',
            'Dry Ginger', 'Dry Garlic', 'Onion Powder', 'Garlic Powder', 'Paprika',
            'Oregano', 'Thyme', 'Basil', 'Rosemary', 'Sage'
        ];
        
        return this.generateProducts(spices, 'Spices', count);
    }
    
    // Generate frozen food products
    generateFrozenFoods(count) {
        const frozen = [
            'Frozen Vegetables', 'Frozen Fruits', 'Ice Cream', 'Frozen Pizza',
            'Frozen Meals', 'Frozen Snacks', 'Frozen Desserts', 'Frozen Bread',
            'Frozen Parathas', 'Frozen Samosas', 'Frozen Cutlets', 'Frozen Fish',
            'Frozen Chicken', 'Frozen Prawns', 'Frozen Corn', 'Frozen Peas',
            'Frozen Mixed Vegetables', 'Frozen Berries', 'Frozen Mango',
            'Frozen Strawberries', 'Frozen Yogurt', 'Frozen Waffles',
            'Frozen Pancakes', 'Frozen French Fries', 'Frozen Nuggets',
            'Frozen Burgers', 'Frozen Sausages', 'Frozen Meatballs',
            'Frozen Dumplings', 'Frozen Spring Rolls'
        ];
        
        return this.generateProducts(frozen, 'Frozen Foods', count);
    }
    
    // Generate bakery products
    generateBakery(count) {
        const bakery = [
            'Bread', 'Buns', 'Rolls', 'Croissants', 'Muffins', 'Cupcakes',
            'Cakes', 'Cookies', 'Pastries', 'Donuts', 'Bagels', 'Pretzels',
            'Crackers', 'Biscuits', 'Tarts', 'Pies', 'Eclairs', 'Profiteroles',
            'Macarons', 'Brownies', 'Cheesecake', 'Tiramisu', 'Pudding',
            'Custard', 'Flan', 'Creme Brulee', 'Souffle', 'Mousse', 'Gelato',
            'Sorbet', 'Frozen Yogurt'
        ];
        
        return this.generateProducts(bakery, 'Bakery', count);
    }
    
    // Generate meat and poultry products
    generateMeatPoultry(count) {
        const meat = [
            'Chicken', 'Mutton', 'Beef', 'Pork', 'Turkey', 'Duck', 'Goose',
            'Chicken Breast', 'Chicken Thighs', 'Chicken Wings', 'Chicken Legs',
            'Mutton Chops', 'Mutton Curry Cut', 'Beef Steak', 'Pork Chops',
            'Ground Meat', 'Sausages', 'Bacon', 'Ham', 'Salami', 'Pepperoni',
            'Chicken Sausages', 'Mutton Sausages', 'Beef Sausages', 'Pork Sausages',
            'Chicken Nuggets', 'Chicken Cutlets', 'Mutton Cutlets', 'Beef Cutlets',
            'Chicken Tikka', 'Mutton Tikka', 'Beef Tikka', 'Pork Tikka'
        ];
        
        return this.generateProducts(meat, 'Meat & Poultry', count);
    }
    
    // Generate seafood products
    generateSeafood(count) {
        const seafood = [
            'Fish', 'Prawns', 'Crab', 'Lobster', 'Shrimp', 'Squid', 'Octopus',
            'Salmon', 'Tuna', 'Cod', 'Mackerel', 'Sardines', 'Anchovies',
            'Red Snapper', 'Sea Bass', 'Trout', 'Carp', 'Rohu', 'Katla',
            'King Fish', 'Pomfret', 'Bombay Duck', 'Hilsa', 'Tilapia',
            'Catfish', 'Eel', 'Crayfish', 'Mussels', 'Oysters', 'Clams'
        ];
        
        return this.generateProducts(seafood, 'Seafood', count);
    }
    
    // Generate health and wellness products
    generateHealthWellness(count) {
        const health = [
            'Protein Powder', 'Vitamins', 'Supplements', 'Herbal Tea', 'Green Tea',
            'Turmeric Powder', 'Ashwagandha', 'Ginseng', 'Multivitamins', 'Omega-3',
            'Probiotics', 'Prebiotics', 'Collagen', 'Glutamine', 'Creatine',
            'BCAA', 'Whey Protein', 'Casein Protein', 'Plant Protein', 'Hemp Protein',
            'Chia Seeds', 'Flax Seeds', 'Pumpkin Seeds', 'Sunflower Seeds',
            'Almonds', 'Walnuts', 'Cashews', 'Pistachios', 'Brazil Nuts',
            'Macadamia Nuts', 'Hazelnuts'
        ];
        
        return this.generateProducts(health, 'Health & Wellness', count);
    }
    
    // Generate household products
    generateHousehold(count) {
        const household = [
            'Detergent', 'Soap', 'Shampoo', 'Conditioner', 'Body Wash', 'Toothpaste',
            'Toothbrush', 'Toilet Paper', 'Tissue Paper', 'Paper Towels', 'Napkins',
            'Dish Soap', 'Floor Cleaner', 'Glass Cleaner', 'Air Freshener',
            'Laundry Detergent', 'Fabric Softener', 'Bleach', 'Disinfectant',
            'Hand Sanitizer', 'Moisturizer', 'Sunscreen', 'Lip Balm', 'Face Wash',
            'Face Cream', 'Body Lotion', 'Hand Cream', 'Foot Cream', 'Eye Cream',
            'Serum', 'Toner'
        ];
        
        return this.generateProducts(household, 'Household', count);
    }
    
    // Generate personal care products
    generatePersonalCare(count) {
        const personalCare = [
            'Shampoo', 'Conditioner', 'Body Wash', 'Face Wash', 'Moisturizer',
            'Sunscreen', 'Lip Balm', 'Hand Cream', 'Body Lotion', 'Face Cream',
            'Eye Cream', 'Serum', 'Toner', 'Exfoliator', 'Cleanser', 'Makeup Remover',
            'Face Mask', 'Hair Oil', 'Hair Serum', 'Hair Mask', 'Deodorant',
            'Perfume', 'Cologne', 'Body Spray', 'Hair Spray', 'Gel', 'Wax',
            'Pomade', 'Hair Color', 'Hair Dye', 'Bleach'
        ];
        
        return this.generateProducts(personalCare, 'Personal Care', count);
    }
    
    // Generate pet supplies
    generatePetSupplies(count) {
        const petSupplies = [
            'Dog Food', 'Cat Food', 'Bird Food', 'Fish Food', 'Pet Treats',
            'Pet Toys', 'Pet Bed', 'Pet Collar', 'Pet Leash', 'Pet Bowl',
            'Pet Carrier', 'Pet Grooming', 'Pet Shampoo', 'Pet Brush',
            'Pet Comb', 'Pet Nail Clipper', 'Pet Toothbrush', 'Pet Toothpaste',
            'Pet Litter', 'Pet Litter Box', 'Pet Cage', 'Pet Aquarium',
            'Pet Filter', 'Pet Heater', 'Pet Decorations', 'Pet Plants',
            'Pet Medicine', 'Pet Vitamins', 'Pet Supplements', 'Pet First Aid',
            'Pet Training', 'Pet Behavior'
        ];
        
        return this.generateProducts(petSupplies, 'Pet Supplies', count);
    }
    
    // Generate products for a category
    generateProducts(baseNames, category, count) {
        const products = [];
        const basePrice = this.getCategoryBasePrice(category);
        
        for (let i = 0; i < count; i++) {
            const baseName = baseNames[i % baseNames.length];
            const variant = Math.floor(i / baseNames.length) + 1;
            const productName = variant > 1 ? `${baseName} ${variant}` : baseName;
            
            products.push({
                id: this.generateProductId(category, i),
                name: productName,
                category: category,
                price: this.generatePrice(basePrice),
                cost: this.generateCost(basePrice),
                stock: this.generateStock(),
                minStock: this.generateMinStock(),
                maxStock: this.generateMaxStock(),
                unit: this.generateUnit(category),
                sku: this.generateSKU(category, i),
                barcode: this.generateBarcode(),
                supplier: this.generateSupplier(),
                description: `${productName} - Fresh and high quality`,
                image: this.generateImage(category),
                tags: this.generateTags(category),
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }
        
        return products;
    }
    
    // Generate product ID
    generateProductId(category, index) {
        const categoryCode = category.replace(/\s+/g, '').substring(0, 3).toUpperCase();
        return `${categoryCode}${String(index + 1).padStart(4, '0')}`;
    }
    
    // Generate SKU
    generateSKU(category, index) {
        const categoryCode = category.replace(/\s+/g, '').substring(0, 3).toUpperCase();
        return `SKU-${categoryCode}-${String(index + 1).padStart(4, '0')}`;
    }
    
    // Generate barcode
    generateBarcode() {
        return Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
    }
    
    // Generate price based on category
    generatePrice(basePrice) {
        const variation = 0.8 + Math.random() * 0.4; // ±20% variation
        return Math.round(basePrice * variation);
    }
    
    // Generate cost (70-80% of price)
    generateCost(basePrice) {
        const costRatio = 0.7 + Math.random() * 0.1;
        return Math.round(basePrice * costRatio);
    }
    
    // Generate stock quantity
    generateStock() {
        return Math.floor(Math.random() * 100) + 1;
    }
    
    // Generate minimum stock
    generateMinStock() {
        return Math.floor(Math.random() * 10) + 1;
    }
    
    // Generate maximum stock
    generateMaxStock() {
        return Math.floor(Math.random() * 200) + 100;
    }
    
    // Generate unit based on category
    generateUnit(category) {
        const units = {
            'Vegetables': ['kg', 'packet', 'bunch', 'piece'],
            'Fruits': ['kg', 'packet', 'piece', 'dozen'],
            'Dairy': ['liter', 'packet', 'piece', 'kg'],
            'Grains': ['kg', 'packet', 'bag'],
            'Snacks': ['packet', 'piece', 'box'],
            'Beverages': ['bottle', 'can', 'packet', 'liter'],
            'Spices': ['kg', 'packet', 'bottle'],
            'Frozen Foods': ['packet', 'kg', 'piece'],
            'Bakery': ['piece', 'packet', 'kg'],
            'Meat & Poultry': ['kg', 'piece'],
            'Seafood': ['kg', 'piece'],
            'Health & Wellness': ['bottle', 'packet', 'kg'],
            'Household': ['bottle', 'packet', 'piece'],
            'Personal Care': ['bottle', 'tube', 'packet'],
            'Pet Supplies': ['packet', 'piece', 'bottle']
        };
        
        const categoryUnits = units[category] || ['piece'];
        return categoryUnits[Math.floor(Math.random() * categoryUnits.length)];
    }
    
    // Generate supplier
    generateSupplier() {
        const suppliers = [
            'Fresh Foods Ltd', 'Green Valley Suppliers', 'Premium Products Co',
            'Nature\'s Best', 'Quality Foods Inc', 'Organic Suppliers',
            'Farm Fresh Co', 'Healthy Living Ltd', 'Natural Products',
            'Eco Foods', 'Sustainable Supplies', 'Local Farmers Co-op'
        ];
        
        return suppliers[Math.floor(Math.random() * suppliers.length)];
    }
    
    // Generate image emoji based on category
    generateImage(category) {
        const images = {
            'Vegetables': '🥬',
            'Fruits': '🍎',
            'Dairy': '🥛',
            'Grains': '🌾',
            'Snacks': '🍪',
            'Beverages': '🥤',
            'Spices': '🌶️',
            'Frozen Foods': '🧊',
            'Bakery': '🥖',
            'Meat & Poultry': '🍗',
            'Seafood': '🐟',
            'Health & Wellness': '💊',
            'Household': '🧽',
            'Personal Care': '🧴',
            'Pet Supplies': '🐕'
        };
        
        return images[category] || '📦';
    }
    
    // Generate tags based on category
    generateTags(category) {
        const tagMap = {
            'Vegetables': ['fresh', 'organic', 'local'],
            'Fruits': ['fresh', 'seasonal', 'organic'],
            'Dairy': ['fresh', 'pasteurized', 'local'],
            'Grains': ['organic', 'whole grain', 'gluten-free'],
            'Snacks': ['crunchy', 'delicious', 'popular'],
            'Beverages': ['refreshing', 'natural', 'healthy'],
            'Spices': ['aromatic', 'authentic', 'premium'],
            'Frozen Foods': ['convenient', 'quick', 'frozen'],
            'Bakery': ['fresh', 'artisan', 'delicious'],
            'Meat & Poultry': ['fresh', 'premium', 'tender'],
            'Seafood': ['fresh', 'ocean-caught', 'premium'],
            'Health & Wellness': ['natural', 'organic', 'supplement'],
            'Household': ['effective', 'safe', 'eco-friendly'],
            'Personal Care': ['gentle', 'natural', 'premium'],
            'Pet Supplies': ['safe', 'nutritious', 'premium']
        };
        
        return tagMap[category] || ['quality', 'fresh'];
    }
    
    // Get base price for category
    getCategoryBasePrice(category) {
        const prices = {
            'Vegetables': 30,
            'Fruits': 50,
            'Dairy': 60,
            'Grains': 80,
            'Snacks': 40,
            'Beverages': 35,
            'Spices': 100,
            'Frozen Foods': 120,
            'Bakery': 45,
            'Meat & Poultry': 200,
            'Seafood': 250,
            'Health & Wellness': 300,
            'Household': 80,
            'Personal Care': 150,
            'Pet Supplies': 200
        };
        
        return prices[category] || 50;
    }
    
    // Sync with JSONBin.io
    async syncWithJsonBin() {
        try {
            console.log('Syncing inventory with JSONBin.io...');
            
            // Check if credentials are properly configured
            if (this.jsonbinApiKey === 'YOUR_JSONBIN_API_KEY' || this.jsonbinBinId === 'YOUR_BIN_ID' || 
                this.jsonbinApiKey === 'YOUR_ACTUAL_API_KEY_HERE' || this.jsonbinBinId === 'YOUR_ACTUAL_BIN_ID_HERE') {
                console.log('JSONBin.io credentials not properly configured, using local storage only');
                this.saveToLocalStorage();
                return false;
            }
            
            // Update version and timestamp
            this.inventory.version += 1;
            this.inventory.lastUpdated = new Date().toISOString();
            
            // Upload to JSONBin.io
            const response = await fetch(`${this.jsonbinBaseUrl}/${this.jsonbinBinId}`, {
                method: 'PUT',
                headers: this.jsonbinHeaders,
                body: JSON.stringify(this.inventory)
            });
            
            if (response.ok) {
                console.log('Inventory synced successfully to JSONBin.io');
                this.saveToLocalStorage();
                return true;
            } else {
                const errorText = await response.text();
                console.error(`JSONBin.io sync failed: ${response.status} - ${errorText}`);
                this.saveToLocalStorage();
                return false;
            }
        } catch (error) {
            console.error('Failed to sync with JSONBin.io:', error);
            // Fallback to local storage
            this.saveToLocalStorage();
            return false;
        }
    }
    
    // Load from JSONBin.io
    async loadFromJsonBin() {
        try {
            console.log('Loading inventory from JSONBin.io...');
            
            // Check if credentials are properly configured
            if (this.jsonbinApiKey === 'YOUR_JSONBIN_API_KEY' || this.jsonbinBinId === 'YOUR_BIN_ID' || 
                this.jsonbinApiKey === 'YOUR_ACTUAL_API_KEY_HERE' || this.jsonbinBinId === 'YOUR_ACTUAL_BIN_ID_HERE') {
                console.log('JSONBin.io credentials not properly configured, using local storage');
                this.loadFromLocalStorage();
                return false;
            }
            
            const response = await fetch(`${this.jsonbinBaseUrl}/${this.jsonbinBinId}/latest`, {
                headers: {
                    'X-Master-Key': this.jsonbinApiKey
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.inventory = data.record;
                this.saveToLocalStorage();
                console.log('Inventory loaded successfully from JSONBin.io');
                return true;
            } else if (response.status === 404) {
                console.warn('JSONBin.io bin not found (404). This might be a new deployment or the bin was deleted.');
                console.log('Attempting to create a new bin...');
                
                // Try to create a new bin
                const newBinCreated = await this.createNewBin();
                if (newBinCreated) {
                    console.log('✅ New bin created! Please update your JSONBIN_BIN_ID environment variable.');
                    this.loadFromLocalStorage();
                    return false;
                } else {
                    console.log('Failed to create new bin, using local storage');
                    this.loadFromLocalStorage();
                    return false;
                }
            } else {
                const errorText = await response.text();
                console.error(`JSONBin.io load failed: ${response.status} - ${errorText}`);
                this.loadFromLocalStorage();
                return false;
            }
        } catch (error) {
            console.error('Failed to load from JSONBin.io:', error);
            // Fallback to local storage
            this.loadFromLocalStorage();
            return false;
        }
    }
    
    // Save to local storage
    saveToLocalStorage() {
        try {
            localStorage.setItem(this.localStorageKey, JSON.stringify(this.inventory));
            console.log('Inventory saved to local storage');
        } catch (error) {
            console.error('Failed to save to local storage:', error);
        }
    }
    
    // Load from local storage
    loadFromLocalStorage() {
        try {
            const data = localStorage.getItem(this.localStorageKey);
            if (data) {
                this.inventory = JSON.parse(data);
                console.log('Inventory loaded from local storage');
            } else {
                console.log('No local inventory data found, using default');
            }
        } catch (error) {
            console.error('Failed to load from local storage:', error);
        }
    }
    
    // Start auto-sync
    startAutoSync() {
        if (this.syncTimeout) {
            clearInterval(this.syncTimeout);
        }
        
        this.syncTimeout = setInterval(() => {
            this.syncWithJsonBin();
        }, this.syncInterval);
        
        console.log('Auto-sync started');
    }
    
    // Stop auto-sync
    stopAutoSync() {
        if (this.syncTimeout) {
            clearInterval(this.syncTimeout);
            this.syncTimeout = null;
        }
        
        console.log('Auto-sync stopped');
    }
    
    // Get all products
    getProducts() {
        return this.inventory.products;
    }
    
    // Get products by category
    getProductsByCategory(category) {
        return this.inventory.products.filter(product => product.category === category);
    }
    
    // Get product by ID
    getProductById(id) {
        return this.inventory.products.find(product => product.id === id);
    }
    
    // Add new product
    async addProduct(productData) {
        const newProduct = {
            id: this.generateProductId(productData.category, this.inventory.products.length),
            sku: this.generateSKU(productData.category, this.inventory.products.length),
            barcode: this.generateBarcode(),
            ...productData,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.inventory.products.push(newProduct);
        await this.syncWithJsonBin();
        
        console.log('Product added:', newProduct.name);
        return newProduct;
    }
    
    // Update product
    async updateProduct(id, productData) {
        const index = this.inventory.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.inventory.products[index] = {
                ...this.inventory.products[index],
                ...productData,
                updatedAt: new Date().toISOString()
            };
            
            await this.syncWithJsonBin();
            console.log('Product updated:', this.inventory.products[index].name);
            return this.inventory.products[index];
        }
        
        throw new Error('Product not found');
    }
    
    // Delete product
    async deleteProduct(id) {
        const index = this.inventory.products.findIndex(product => product.id === id);
        if (index !== -1) {
            const deletedProduct = this.inventory.products.splice(index, 1)[0];
            await this.syncWithJsonBin();
            console.log('Product deleted:', deletedProduct.name);
            return deletedProduct;
        }
        
        throw new Error('Product not found');
    }
    
    // Search products
    searchProducts(query) {
        const lowercaseQuery = query.toLowerCase();
        return this.inventory.products.filter(product => 
            product.name.toLowerCase().includes(lowercaseQuery) ||
            product.category.toLowerCase().includes(lowercaseQuery) ||
            product.sku.toLowerCase().includes(lowercaseQuery) ||
            product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
        );
    }
    
    // Get low stock products
    getLowStockProducts() {
        return this.inventory.products.filter(product => 
            product.stock <= product.minStock
        );
    }
    
    // Get out of stock products
    getOutOfStockProducts() {
        return this.inventory.products.filter(product => product.stock === 0);
    }
    
    // Get categories
    getCategories() {
        return this.inventory.categories;
    }
    
    // Get inventory statistics
    getInventoryStats() {
        const totalProducts = this.inventory.products.length;
        const activeProducts = this.inventory.products.filter(p => p.isActive).length;
        const lowStockProducts = this.getLowStockProducts().length;
        const outOfStockProducts = this.getOutOfStockProducts().length;
        const totalValue = this.inventory.products.reduce((sum, product) => 
            sum + (product.stock * product.cost), 0
        );
        
        return {
            totalProducts,
            activeProducts,
            lowStockProducts,
            outOfStockProducts,
            totalValue: Math.round(totalValue),
            lastUpdated: this.inventory.lastUpdated
        };
    }
    
    // Create a new JSONBin.io bin
    async createNewBin() {
        try {
            console.log('Creating new JSONBin.io bin...');
            
            const response = await fetch(this.jsonbinBaseUrl, {
                method: 'POST',
                headers: this.jsonbinHeaders,
                body: JSON.stringify(this.inventory)
            });
            
            if (response.ok) {
                const result = await response.json();
                this.jsonbinBinId = result.metadata.id;
                console.log('✅ New bin created successfully!');
                console.log('🆔 New Bin ID:', this.jsonbinBinId);
                console.log('📝 Please update your JSONBIN_BIN_ID environment variable to:', this.jsonbinBinId);
                return true;
            } else {
                const errorText = await response.text();
                console.error(`Failed to create new bin: ${response.status} - ${errorText}`);
                return false;
            }
        } catch (error) {
            console.error('Failed to create new bin:', error);
            return false;
        }
    }

    // Load configuration from server
    async loadConfiguration() {
        try {
            const response = await fetch('/api/config');
            if (response.ok) {
                const config = await response.json();
                this.jsonbinApiKey = config.jsonbinApiKey;
                this.jsonbinBinId = config.jsonbinBinId;
                this.jsonbinHeaders = {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.jsonbinApiKey
                };
                console.log('Configuration loaded from server');
                return true;
            }
        } catch (error) {
            console.error('Failed to load configuration:', error);
        }
        return false;
    }
    
    // Initialize the inventory manager
    async initialize() {
        console.log('Initializing InventoryManager...');
        
        // Load configuration from server first
        await this.loadConfiguration();
        
        // Try to load from JSONBin.io first
        const loaded = await this.loadFromJsonBin();
        
        if (!loaded) {
            // If failed, load from local storage
            this.loadFromLocalStorage();
        }
        
        // Start auto-sync
        this.startAutoSync();
        
        console.log('InventoryManager initialized successfully');
    }
}

// Create global instance
window.inventoryManager = new InventoryManager();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.inventoryManager.initialize();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InventoryManager;
}
