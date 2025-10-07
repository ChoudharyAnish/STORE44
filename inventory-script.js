// Inventory Management Script
// Handles all inventory management functionality

class InventoryController {
    constructor() {
        this.currentView = 'table';
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.currentFilter = {
            category: '',
            stock: '',
            search: ''
        };
        this.selectedProduct = null;
        this.products = [];
        this.filteredProducts = [];
        
        this.initialize();
    }
    
    async initialize() {
        console.log('Initializing InventoryController...');
        
        // Wait for inventory manager to be ready
        if (window.inventoryManager) {
            await this.loadInventoryData();
        } else {
            // Wait for inventory manager to load
            setTimeout(() => this.initialize(), 100);
            return;
        }
        
        this.setupEventListeners();
        this.populateCategories();
        this.renderProducts();
        this.updateStats();
        this.startAutoSync();
        
        console.log('InventoryController initialized successfully');
    }
    
    async loadInventoryData() {
        try {
            this.products = window.inventoryManager.getProducts();
            this.filteredProducts = [...this.products];
            console.log(`Loaded ${this.products.length} products`);
        } catch (error) {
            console.error('Failed to load inventory data:', error);
            this.showNotification('Failed to load inventory data', 'error');
        }
    }
    
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilter.search = e.target.value;
                this.applyFilters();
            });
        }
        
        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilter.category = e.target.value;
                this.applyFilters();
            });
        }
        
        // Stock filter
        const stockFilter = document.getElementById('stockFilter');
        if (stockFilter) {
            stockFilter.addEventListener('change', (e) => {
                this.currentFilter.stock = e.target.value;
                this.applyFilters();
            });
        }
        
        // View controls
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
            });
        });
        
        // Add product form
        const addProductForm = document.getElementById('addProductForm');
        if (addProductForm) {
            addProductForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddProduct();
            });
        }
        
        // Edit product form
        const editProductForm = document.getElementById('editProductForm');
        if (editProductForm) {
            editProductForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleEditProduct();
            });
        }
        
        // Close modals on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });
    }
    
    populateCategories() {
        const categories = window.inventoryManager.getCategories();
        const categorySelects = document.querySelectorAll('#productCategory, #editProductCategory');
        
        categorySelects.forEach(select => {
            select.innerHTML = '<option value="">Select Category</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                select.appendChild(option);
            });
        });
        
        // Populate category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.innerHTML = '<option value="">All Categories</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
        }
    }
    
    applyFilters() {
        let filtered = [...this.products];
        
        // Search filter
        if (this.currentFilter.search) {
            const searchTerm = this.currentFilter.search.toLowerCase();
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm) ||
                product.sku.toLowerCase().includes(searchTerm) ||
                product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }
        
        // Category filter
        if (this.currentFilter.category) {
            filtered = filtered.filter(product => 
                product.category === this.currentFilter.category
            );
        }
        
        // Stock filter
        if (this.currentFilter.stock) {
            switch (this.currentFilter.stock) {
                case 'low':
                    filtered = filtered.filter(product => 
                        product.stock <= product.minStock && product.stock > 0
                    );
                    break;
                case 'out':
                    filtered = filtered.filter(product => product.stock === 0);
                    break;
                case 'normal':
                    filtered = filtered.filter(product => 
                        product.stock > product.minStock
                    );
                    break;
            }
        }
        
        this.filteredProducts = filtered;
        this.currentPage = 1;
        this.renderProducts();
    }
    
    switchView(view) {
        this.currentView = view;
        
        // Update view buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        // Show/hide views
        const tableView = document.getElementById('tableView');
        const gridView = document.getElementById('gridView');
        
        if (view === 'table') {
            tableView.style.display = 'block';
            gridView.style.display = 'none';
        } else {
            tableView.style.display = 'none';
            gridView.style.display = 'block';
        }
        
        this.renderProducts();
    }
    
    renderProducts() {
        if (this.currentView === 'table') {
            this.renderTableView();
        } else {
            this.renderGridView();
        }
        
        this.renderPagination();
    }
    
    renderTableView() {
        const tbody = document.getElementById('productsTableBody');
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageProducts = this.filteredProducts.slice(startIndex, endIndex);
        
        if (pageProducts.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="11" class="empty-state">
                        <i class="fas fa-boxes"></i>
                        <h3>No products found</h3>
                        <p>Try adjusting your search or filters</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = pageProducts.map(product => `
            <tr>
                <td class="product-image">${product.image}</td>
                <td class="product-name">${product.name}</td>
                <td>
                    <span class="product-category">${product.category}</span>
                </td>
                <td class="product-sku">${product.sku}</td>
                <td class="product-price">₹${product.price}</td>
                <td class="product-cost">₹${product.cost}</td>
                <td>
                    <div class="stock-info">
                        <div class="stock-quantity">${product.stock} ${product.unit}</div>
                        <div class="stock-level ${this.getStockLevel(product)}">
                            ${this.getStockLevelText(product)}
                        </div>
                    </div>
                </td>
                <td>${product.minStock} ${product.unit}</td>
                <td class="supplier-name">${product.supplier}</td>
                <td>
                    <span class="status-badge ${product.isActive ? 'active' : 'inactive'}">
                        ${product.isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td class="action-buttons">
                    <button class="action-btn view" onclick="inventoryController.viewProduct('${product.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="inventoryController.editProduct('${product.id}')" title="Edit Product">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="inventoryController.deleteProduct('${product.id}')" title="Delete Product">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    renderGridView() {
        const grid = document.getElementById('productsGrid');
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageProducts = this.filteredProducts.slice(startIndex, endIndex);
        
        if (pageProducts.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-boxes"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = pageProducts.map(product => `
            <div class="product-card">
                <div class="product-card-header">
                    <div class="product-card-image">${product.image}</div>
                    <div class="product-card-info">
                        <h3>${product.name}</h3>
                        <span class="category">${product.category}</span>
                    </div>
                </div>
                <div class="product-card-body">
                    <div class="product-card-row">
                        <span class="label">SKU:</span>
                        <span class="value">${product.sku}</span>
                    </div>
                    <div class="product-card-row">
                        <span class="label">Price:</span>
                        <span class="value">₹${product.price}</span>
                    </div>
                    <div class="product-card-row">
                        <span class="label">Cost:</span>
                        <span class="value">₹${product.cost}</span>
                    </div>
                    <div class="product-card-row">
                        <span class="label">Stock:</span>
                        <span class="value">${product.stock} ${product.unit}</span>
                    </div>
                    <div class="product-card-row">
                        <span class="label">Min Stock:</span>
                        <span class="value">${product.minStock} ${product.unit}</span>
                    </div>
                    <div class="product-card-row">
                        <span class="label">Supplier:</span>
                        <span class="value">${product.supplier}</span>
                    </div>
                    <div class="product-card-row">
                        <span class="label">Status:</span>
                        <span class="value">
                            <span class="status-badge ${product.isActive ? 'active' : 'inactive'}">
                                ${product.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </span>
                    </div>
                </div>
                <div class="product-card-footer">
                    <button class="btn btn-secondary" onclick="inventoryController.viewProduct('${product.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-primary" onclick="inventoryController.editProduct('${product.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="inventoryController.deleteProduct('${product.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    renderPagination() {
        const pagination = document.getElementById('pagination');
        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} 
                    onclick="inventoryController.goToPage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);
        
        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="inventoryController.goToPage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" 
                        onclick="inventoryController.goToPage(${i})">
                    ${i}
                </button>
            `;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
            paginationHTML += `<button class="pagination-btn" onclick="inventoryController.goToPage(${totalPages})">${totalPages}</button>`;
        }
        
        // Next button
        paginationHTML += `
            <button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} 
                    onclick="inventoryController.goToPage(${this.currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        pagination.innerHTML = paginationHTML;
    }
    
    goToPage(page) {
        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderProducts();
        }
    }
    
    getStockLevel(product) {
        if (product.stock === 0) return 'out';
        if (product.stock <= product.minStock) return 'low';
        return 'normal';
    }
    
    getStockLevelText(product) {
        if (product.stock === 0) return 'Out of Stock';
        if (product.stock <= product.minStock) return 'Low Stock';
        return 'Normal';
    }
    
    updateStats() {
        const stats = window.inventoryManager.getInventoryStats();
        
        document.getElementById('totalProducts').textContent = stats.totalProducts;
        document.getElementById('totalValue').textContent = `₹${stats.totalValue.toLocaleString()}`;
        document.getElementById('lowStockProducts').textContent = stats.lowStockProducts;
        document.getElementById('outOfStockProducts').textContent = stats.outOfStockProducts;
        
        // Update last updated time
        const lastUpdated = document.getElementById('lastUpdated');
        if (lastUpdated && stats.lastUpdated) {
            const date = new Date(stats.lastUpdated);
            lastUpdated.textContent = `Last updated: ${date.toLocaleString()}`;
        }
    }
    
    // Product Management Functions
    async handleAddProduct() {
        try {
            const formData = this.getFormData('addProductForm');
            
            // Debug: Log form data
            console.log('Form data:', formData);
            
            // Validate required fields
            if (!formData.name || !formData.category || !formData.price || !formData.cost || !formData.stock || !formData.minStock) {
                console.log('Missing fields:', {
                    name: formData.name,
                    category: formData.category,
                    price: formData.price,
                    cost: formData.cost,
                    stock: formData.stock,
                    minStock: formData.minStock
                });
                this.showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Convert tags string to array
            if (formData.tags) {
                formData.tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            }
            
            // Add product
            const newProduct = await window.inventoryManager.addProduct(formData);
            
            // Refresh data
            await this.loadInventoryData();
            this.applyFilters();
            this.updateStats();
            
            // Close modal and show success
            this.closeAddProductModal();
            this.showNotification('Product added successfully!', 'success');
            
        } catch (error) {
            console.error('Failed to add product:', error);
            this.showNotification('Failed to add product', 'error');
        }
    }
    
    async handleEditProduct() {
        try {
            const formData = this.getFormData('editProductForm');
            const productId = document.getElementById('editProductId').value;
            
            // Debug: Log form data
            console.log('Edit form data:', formData);
            console.log('Product ID:', productId);
            
            // Validate required fields
            if (!formData.name || !formData.category || !formData.price || !formData.cost || !formData.stock || !formData.minStock) {
                console.log('Missing fields:', {
                    name: formData.name,
                    category: formData.category,
                    price: formData.price,
                    cost: formData.cost,
                    stock: formData.stock,
                    minStock: formData.minStock
                });
                this.showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Convert tags string to array
            if (formData.tags) {
                formData.tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            }
            
            // Update product
            const updatedProduct = await window.inventoryManager.updateProduct(productId, formData);
            
            // Refresh data
            await this.loadInventoryData();
            this.applyFilters();
            this.updateStats();
            
            // Close modal and show success
            this.closeEditProductModal();
            this.showNotification('Product updated successfully!', 'success');
            
        } catch (error) {
            console.error('Failed to update product:', error);
            this.showNotification('Failed to update product', 'error');
        }
    }
    
    getFormData(formId) {
        const form = document.getElementById(formId);
        const data = {};
        
        // Field mapping from ID to data property
        const fieldMapping = {
            'productName': 'name',
            'productCategory': 'category',
            'productPrice': 'price',
            'productCost': 'cost',
            'productStock': 'stock',
            'productMinStock': 'minStock',
            'productMaxStock': 'maxStock',
            'productUnit': 'unit',
            'productSupplier': 'supplier',
            'productImage': 'image',
            'productDescription': 'description',
            'productTags': 'tags',
            'editProductName': 'name',
            'editProductCategory': 'category',
            'editProductPrice': 'price',
            'editProductCost': 'cost',
            'editProductStock': 'stock',
            'editProductMinStock': 'minStock',
            'editProductMaxStock': 'maxStock',
            'editProductUnit': 'unit',
            'editProductSupplier': 'supplier',
            'editProductImage': 'image',
            'editProductDescription': 'description',
            'editProductTags': 'tags'
        };
        
        // Get all input, select, and textarea elements
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input.id && fieldMapping[input.id]) {
                data[fieldMapping[input.id]] = input.value;
            }
        });
        
        // Convert numeric fields
        const numericFields = ['price', 'cost', 'stock', 'minStock', 'maxStock'];
        numericFields.forEach(field => {
            if (data[field]) {
                data[field] = parseFloat(data[field]);
            }
        });
        
        return data;
    }
    
    viewProduct(productId) {
        const product = window.inventoryManager.getProductById(productId);
        if (!product) return;
        
        // Create a simple view modal (you can enhance this)
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Product Details</h3>
                    <button class="close-modal" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="product-details">
                        <div class="product-header">
                            <div class="product-image-large">${product.image}</div>
                            <div class="product-info">
                                <h2>${product.name}</h2>
                                <span class="category">${product.category}</span>
                                <p class="description">${product.description}</p>
                            </div>
                        </div>
                        <div class="product-stats">
                            <div class="stat-item">
                                <span class="label">SKU:</span>
                                <span class="value">${product.sku}</span>
                            </div>
                            <div class="stat-item">
                                <span class="label">Price:</span>
                                <span class="value">₹${product.price}</span>
                            </div>
                            <div class="stat-item">
                                <span class="label">Cost:</span>
                                <span class="value">₹${product.cost}</span>
                            </div>
                            <div class="stat-item">
                                <span class="label">Stock:</span>
                                <span class="value">${product.stock} ${product.unit}</span>
                            </div>
                            <div class="stat-item">
                                <span class="label">Min Stock:</span>
                                <span class="value">${product.minStock} ${product.unit}</span>
                            </div>
                            <div class="stat-item">
                                <span class="label">Max Stock:</span>
                                <span class="value">${product.maxStock} ${product.unit}</span>
                            </div>
                            <div class="stat-item">
                                <span class="label">Supplier:</span>
                                <span class="value">${product.supplier}</span>
                            </div>
                            <div class="stat-item">
                                <span class="label">Status:</span>
                                <span class="value">
                                    <span class="status-badge ${product.isActive ? 'active' : 'inactive'}">
                                        ${product.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div class="product-tags">
                            <h4>Tags:</h4>
                            <div class="tags-list">
                                ${product.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    editProduct(productId) {
        const product = window.inventoryManager.getProductById(productId);
        if (!product) return;
        
        this.selectedProduct = product;
        
        // Populate form
        document.getElementById('editProductId').value = product.id;
        document.getElementById('editProductName').value = product.name;
        document.getElementById('editProductCategory').value = product.category;
        document.getElementById('editProductPrice').value = product.price;
        document.getElementById('editProductCost').value = product.cost;
        document.getElementById('editProductStock').value = product.stock;
        document.getElementById('editProductMinStock').value = product.minStock;
        document.getElementById('editProductMaxStock').value = product.maxStock || '';
        document.getElementById('editProductUnit').value = product.unit;
        document.getElementById('editProductSupplier').value = product.supplier;
        document.getElementById('editProductImage').value = product.image;
        document.getElementById('editProductDescription').value = product.description || '';
        document.getElementById('editProductTags').value = product.tags.join(', ');
        
        // Show modal
        document.getElementById('editProductModal').classList.add('show');
    }
    
    deleteProduct(productId) {
        const product = window.inventoryManager.getProductById(productId);
        if (!product) return;
        
        this.selectedProduct = product;
        
        // Update delete confirmation modal
        document.getElementById('deleteProductName').textContent = product.name;
        
        // Show modal
        document.getElementById('deleteConfirmModal').classList.add('show');
    }
    
    async confirmDeleteProduct() {
        try {
            if (!this.selectedProduct) return;
            
            await window.inventoryManager.deleteProduct(this.selectedProduct.id);
            
            // Refresh data
            await this.loadInventoryData();
            this.applyFilters();
            this.updateStats();
            
            // Close modal and show success
            this.closeDeleteConfirmModal();
            this.showNotification('Product deleted successfully!', 'success');
            
        } catch (error) {
            console.error('Failed to delete product:', error);
            this.showNotification('Failed to delete product', 'error');
        }
    }
    
    // Modal Functions
    openAddProductModal() {
        document.getElementById('addProductForm').reset();
        document.getElementById('addProductModal').classList.add('show');
    }
    
    closeAddProductModal() {
        document.getElementById('addProductModal').classList.remove('show');
    }
    
    closeEditProductModal() {
        document.getElementById('editProductModal').classList.remove('show');
        this.selectedProduct = null;
    }
    
    closeDeleteConfirmModal() {
        document.getElementById('deleteConfirmModal').classList.remove('show');
        this.selectedProduct = null;
    }
    
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
        this.selectedProduct = null;
    }
    
    // Utility Functions
    async syncInventory() {
        try {
            this.showLoading(true);
            const success = await window.inventoryManager.syncWithJsonBin();
            
            if (success) {
                await this.loadInventoryData();
                this.applyFilters();
                this.updateStats();
                this.showNotification('Inventory synced successfully!', 'success');
            } else {
                this.showNotification('Sync failed, using local data', 'warning');
            }
        } catch (error) {
            console.error('Sync error:', error);
            this.showNotification('Sync failed', 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    exportInventory() {
        try {
            const data = {
                products: this.products,
                categories: window.inventoryManager.getCategories(),
                stats: window.inventoryManager.getInventoryStats(),
                exportedAt: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `inventory-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification('Inventory exported successfully!', 'success');
        } catch (error) {
            console.error('Export error:', error);
            this.showNotification('Export failed', 'error');
        }
    }
    
    startAutoSync() {
        // Update sync status
        const syncStatus = document.getElementById('syncStatus');
        if (syncStatus) {
            syncStatus.innerHTML = '<i class="fas fa-sync-alt"></i><span>Auto-sync enabled</span>';
        }
        
        // Auto-sync every 30 seconds
        setInterval(async () => {
            try {
                await window.inventoryManager.syncWithJsonBin();
                await this.loadInventoryData();
                this.updateStats();
            } catch (error) {
                console.error('Auto-sync error:', error);
            }
        }, 30000);
    }
    
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            if (show) {
                overlay.classList.add('show');
            } else {
                overlay.classList.remove('show');
            }
        }
    }
    
    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const messageEl = document.getElementById('notificationMessage');
        
        if (notification && messageEl) {
            messageEl.textContent = message;
            notification.className = `notification ${type} show`;
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    }
}

// Global functions for HTML onclick handlers
function openAddProductModal() {
    window.inventoryController.openAddProductModal();
}

function closeAddProductModal() {
    window.inventoryController.closeAddProductModal();
}

function closeEditProductModal() {
    window.inventoryController.closeEditProductModal();
}

function closeDeleteConfirmModal() {
    window.inventoryController.closeDeleteConfirmModal();
}

function confirmDeleteProduct() {
    window.inventoryController.confirmDeleteProduct();
}

function syncInventory() {
    window.inventoryController.syncInventory();
}

function exportInventory() {
    window.inventoryController.exportInventory();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.inventoryController = new InventoryController();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InventoryController;
}
