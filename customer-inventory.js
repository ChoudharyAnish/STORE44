// Customer Inventory Integration
// This module integrates the inventory system with the customer interface

class CustomerInventoryManager {
    constructor() {
        this.products = [];
        this.categories = [];
        this.isInventoryLoaded = false;
        this.fallbackProducts = this.getFallbackProducts();
        
        this.initialize();
    }
    
    async initialize() {
        console.log('Initializing CustomerInventoryManager...');
        
        // Try to load from inventory manager
        if (window.inventoryManager) {
            await this.loadFromInventoryManager();
        } else {
            // Wait for inventory manager to load
            setTimeout(() => this.initialize(), 100);
            return;
        }
        
        // Update the global products array
        this.updateGlobalProducts();
        
        console.log(`CustomerInventoryManager initialized with ${this.products.length} products`);
    }
    
    async loadFromInventoryManager() {
        try {
            // Get all products from inventory manager
            const inventoryProducts = window.inventoryManager.getProducts();
            const categories = window.inventoryManager.getCategories();
            
            // Convert inventory products to customer format
            this.products = inventoryProducts.map(product => ({
                id: product.id,
                name: product.name,
                price: product.price,
                category: product.category.toLowerCase().replace(/\s+/g, ''),
                image: product.image,
                stock: product.stock,
                minStock: product.minStock,
                unit: product.unit,
                sku: product.sku,
                supplier: product.supplier,
                description: product.description,
                tags: product.tags,
                isActive: product.isActive,
                isOutOfStock: product.stock === 0,
                isLowStock: product.stock <= product.minStock && product.stock > 0
            }));
            
            // Convert categories to lowercase for consistency
            this.categories = categories.map(cat => cat.toLowerCase().replace(/\s+/g, ''));
            
            this.isInventoryLoaded = true;
            console.log(`Loaded ${this.products.length} products from inventory manager`);
            
        } catch (error) {
            console.error('Failed to load from inventory manager:', error);
            this.useFallbackProducts();
        }
    }
    
    useFallbackProducts() {
        console.log('Using fallback products');
        this.products = this.fallbackProducts;
        this.categories = ['vegetables', 'fruits', 'dairy', 'grains', 'snacks'];
        this.isInventoryLoaded = false;
    }
    
    getFallbackProducts() {
        // Return the original hardcoded products as fallback
        return [
            // Vegetables
            { id: 1, name: "Fresh Tomatoes", price: 40, category: "vegetables", image: "🍅", stock: 50, isOutOfStock: false, isLowStock: false },
            { id: 2, name: "Onions", price: 30, category: "vegetables", image: "🧅", stock: 30, isOutOfStock: false, isLowStock: false },
            { id: 3, name: "Potatoes", price: 25, category: "vegetables", image: "🥔", stock: 40, isOutOfStock: false, isLowStock: false },
            { id: 4, name: "Carrots", price: 35, category: "vegetables", image: "🥕", stock: 25, isOutOfStock: false, isLowStock: false },
            { id: 5, name: "Spinach", price: 20, category: "vegetables", image: "🥬", stock: 20, isOutOfStock: false, isLowStock: false },
            { id: 6, name: "Bell Peppers", price: 60, category: "vegetables", image: "🫑", stock: 15, isOutOfStock: false, isLowStock: false },
            
            // Fruits
            { id: 7, name: "Bananas", price: 50, category: "fruits", image: "🍌", stock: 30, isOutOfStock: false, isLowStock: false },
            { id: 8, name: "Apples", price: 80, category: "fruits", image: "🍎", stock: 25, isOutOfStock: false, isLowStock: false },
            { id: 9, name: "Oranges", price: 70, category: "fruits", image: "🍊", stock: 20, isOutOfStock: false, isLowStock: false },
            { id: 10, name: "Grapes", price: 120, category: "fruits", image: "🍇", stock: 15, isOutOfStock: false, isLowStock: false },
            { id: 11, name: "Mangoes", price: 100, category: "fruits", image: "🥭", stock: 18, isOutOfStock: false, isLowStock: false },
            { id: 12, name: "Strawberries", price: 150, category: "fruits", image: "🍓", stock: 12, isOutOfStock: false, isLowStock: false },
            
            // Dairy
            { id: 13, name: "Milk (1L)", price: 60, category: "dairy", image: "🥛", stock: 20, isOutOfStock: false, isLowStock: false },
            { id: 14, name: "Cheese", price: 200, category: "dairy", image: "🧀", stock: 10, isOutOfStock: false, isLowStock: false },
            { id: 15, name: "Yogurt", price: 45, category: "dairy", image: "🍶", stock: 25, isOutOfStock: false, isLowStock: false },
            { id: 16, name: "Butter", price: 80, category: "dairy", image: "🧈", stock: 15, isOutOfStock: false, isLowStock: false },
            { id: 17, name: "Eggs (12)", price: 90, category: "dairy", image: "🥚", stock: 30, isOutOfStock: false, isLowStock: false },
            
            // Grains
            { id: 18, name: "Rice (1kg)", price: 80, category: "grains", image: "🍚", stock: 40, isOutOfStock: false, isLowStock: false },
            { id: 19, name: "Wheat Flour", price: 50, category: "grains", image: "🌾", stock: 35, isOutOfStock: false, isLowStock: false },
            { id: 20, name: "Lentils", price: 120, category: "grains", image: "🫘", stock: 25, isOutOfStock: false, isLowStock: false },
            { id: 21, name: "Oats", price: 100, category: "grains", image: "🌾", stock: 20, isOutOfStock: false, isLowStock: false },
            { id: 22, name: "Quinoa", price: 200, category: "grains", image: "🌾", stock: 15, isOutOfStock: false, isLowStock: false },
            
            // Snacks
            { id: 23, name: "Biscuits", price: 30, category: "snacks", image: "🍪", stock: 50, isOutOfStock: false, isLowStock: false },
            { id: 24, name: "Chips", price: 25, category: "snacks", image: "🍟", stock: 40, isOutOfStock: false, isLowStock: false },
            { id: 25, name: "Nuts Mix", price: 150, category: "snacks", image: "🥜", stock: 20, isOutOfStock: false, isLowStock: false },
            { id: 26, name: "Chocolate", price: 80, category: "snacks", image: "🍫", stock: 30, isOutOfStock: false, isLowStock: false },
            { id: 27, name: "Candy", price: 20, category: "snacks", image: "🍬", stock: 60, isOutOfStock: false, isLowStock: false }
        ];
    }
    
    updateGlobalProducts() {
        // Update the global products array used by the customer interface
        if (typeof window !== 'undefined') {
            window.products = this.products;
            window.customerInventoryManager = this;
        }
    }
    
    getProducts() {
        return this.products;
    }
    
    getCategories() {
        return this.categories;
    }
    
    getProductById(id) {
        return this.products.find(product => product.id === id);
    }
    
    getProductsByCategory(category) {
        return this.products.filter(product => product.category === category);
    }
    
    searchProducts(query) {
        const lowercaseQuery = query.toLowerCase();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(lowercaseQuery) ||
            product.category.toLowerCase().includes(lowercaseQuery) ||
            (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
        );
    }
    
    getAvailableProducts() {
        return this.products.filter(product => product.stock > 0 && product.isActive);
    }
    
    getOutOfStockProducts() {
        return this.products.filter(product => product.stock === 0);
    }
    
    getLowStockProducts() {
        return this.products.filter(product => product.stock <= product.minStock && product.stock > 0);
    }
    
    // Update product stock after order
    async updateProductStock(productId, quantityOrdered) {
        try {
            if (window.inventoryManager) {
                const product = window.inventoryManager.getProductById(productId);
                if (product) {
                    const newStock = Math.max(0, product.stock - quantityOrdered);
                    await window.inventoryManager.updateProduct(productId, { stock: newStock });
                    
                    // Update local products array
                    const localProduct = this.products.find(p => p.id === productId);
                    if (localProduct) {
                        localProduct.stock = newStock;
                        localProduct.isOutOfStock = newStock === 0;
                        localProduct.isLowStock = newStock <= localProduct.minStock && newStock > 0;
                    }
                    
                    console.log(`Updated stock for ${product.name}: ${newStock}`);
                    return true;
                }
            }
        } catch (error) {
            console.error('Failed to update product stock:', error);
        }
        return false;
    }
    
    // Check if product can be ordered
    canOrderProduct(productId, quantity = 1) {
        const product = this.getProductById(productId);
        if (!product) return false;
        
        return product.stock >= quantity && product.isActive;
    }
    
    // Get stock status for display
    getStockStatus(product) {
        if (product.stock === 0) {
            return { status: 'out', text: 'Out of Stock', class: 'out-of-stock' };
        } else {
            return { status: 'available', text: 'In Stock', class: 'in-stock' };
        }
    }
    
    // Refresh data from inventory manager
    async refreshData() {
        if (window.inventoryManager) {
            await this.loadFromInventoryManager();
            this.updateGlobalProducts();
            return true;
        }
        return false;
    }
}

// Create global instance
window.customerInventoryManager = new CustomerInventoryManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CustomerInventoryManager;
}
