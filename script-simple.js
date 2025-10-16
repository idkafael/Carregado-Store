// ========================================
// SCRIPT SIMPLES - CARREGADO STORE
// ========================================

// Variáveis globais
let products = [];
let cart = [];

// ========================================
// INICIALIZAÇÃO
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Inicializando Carregado Store...');
    
    // Carregar produtos
    await loadProducts();
    
    // Configurar event listeners
    setupEventListeners();
    
    console.log('✅ Carregado Store inicializado com sucesso!');
});

// ========================================
// PRODUTOS
// ========================================
async function loadProducts() {
    console.log('🔍 Carregando produtos...');
    
    // Produtos estáticos (sem API por enquanto)
    products = [
        {
            id: 1,
            name: "Produto Exemplo 1",
            description: "Descrição do produto exemplo 1",
            price: 29.90,
            image_url: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Produto+1",
            active: true
        },
        {
            id: 2,
            name: "Produto Exemplo 2", 
            description: "Descrição do produto exemplo 2",
            price: 49.90,
            image_url: "https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Produto+2",
            active: true
        },
        {
            id: 3,
            name: "Produto Exemplo 3",
            description: "Descrição do produto exemplo 3", 
            price: 79.90,
            image_url: "https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Produto+3",
            active: true
        }
    ];
    
    console.log('✅ Produtos carregados:', products.length);
    renderProducts();
}

function renderProducts() {
    console.log('🎨 Renderizando produtos:', products);
    
    const productsContainer = document.getElementById('productsGrid');
    if (!productsContainer) {
        console.error('❌ Container de produtos não encontrado');
        return;
    }
    
    if (products.length === 0) {
        productsContainer.innerHTML = '<p>Nenhum produto encontrado</p>';
        return;
    }
    
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}" style="
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            overflow: hidden;
            transition: transform 0.3s ease;
            margin-bottom: 20px;
        ">
            <div class="product-image" style="
                width: 100%;
                height: 200px;
                overflow: hidden;
                background: #f5f5f5;
            ">
                <img src="${product.image_url}" alt="${product.name}" style="
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                ">
            </div>
            <div class="product-info" style="
                padding: 20px;
            ">
                <h3 class="product-name" style="
                    font-size: 18px;
                    font-weight: 600;
                    margin: 0 0 10px 0;
                    color: #333;
                ">${product.name}</h3>
                <p class="product-description" style="
                    color: #666;
                    font-size: 14px;
                    margin: 0 0 15px 0;
                    line-height: 1.4;
                ">${product.description}</p>
                <div class="product-price" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                ">
                    <span class="price" style="
                        font-size: 20px;
                        font-weight: 700;
                        color: #2E7D32;
                    ">R$ ${product.price.toFixed(2)}</span>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})" style="
                    width: 100%;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.3s ease;
                " onmouseover="this.style.background='#45a049'" onmouseout="this.style.background='#4CAF50'">
                    <i class="fas fa-cart-plus"></i>
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `).join('');
    
    console.log('✅ Produtos renderizados com sucesso');
}

// ========================================
// CARRINHO
// ========================================
function addToCart(productId) {
    console.log('🛒 Adicionando produto ao carrinho:', productId);
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('❌ Produto não encontrado:', productId);
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showNotification('Produto adicionado ao carrinho!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
        }
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
    
    renderCartModal();
}

function renderCartModal() {
    const cartModal = document.getElementById('cartModal');
    if (!cartModal) return;
    
    const cartContent = document.getElementById('cartContent');
    if (!cartContent) return;
    
    if (cart.length === 0) {
        cartContent.innerHTML = '<p>Carrinho vazio</p>';
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartContent.innerHTML = `
        <div class="cart-items">
            ${cart.map(item => `
                <div class="cart-item">
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <p>R$ ${item.price.toFixed(2)}</p>
                    </div>
                    <div class="item-controls">
                        <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        <button onclick="removeFromCart(${item.id})" class="remove-btn">×</button>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="cart-total">
            <h3>Total: R$ ${total.toFixed(2)}</h3>
            <button class="checkout-btn" onclick="checkout()">
                Finalizar Compra
            </button>
        </div>
    `;
}

// ========================================
// CHECKOUT
// ========================================
function checkout() {
    if (cart.length === 0) {
        showNotification('Carrinho vazio!', 'error');
        return;
    }
    
    showNotification('Funcionalidade de checkout em desenvolvimento', 'info');
}

// ========================================
// MODAIS
// ========================================
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'block';
}

function hideLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'none';
}

function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
    }
}

// ========================================
// EVENT LISTENERS
// ========================================
function setupEventListeners() {
    // Close modals
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// ========================================
// UTILITÁRIOS
// ========================================
function showNotification(message, type = 'info') {
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
    
    // Criar notificação visual simples
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ff4444' : type === 'success' ? '#44ff44' : '#4444ff'};
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 10000;
        font-family: Arial, sans-serif;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// ========================================
// FUNÇÕES GLOBAIS
// ========================================
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.checkout = checkout;
window.toggleCart = toggleCart;
window.showLoginModal = showLoginModal;
window.hideLoginModal = hideLoginModal;
