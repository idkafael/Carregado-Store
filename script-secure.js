// ========================================
// SCRIPT PRINCIPAL SEGURO - CARREGADO STORE
// ========================================

// Inicializar API segura
const apiClient = new SecureAPIClient();
const authManager = new SecureAuthManager();
const paymentManager = new SecurePaymentManager();

// ========================================
// VARIÁVEIS GLOBAIS
// ========================================
let currentUser = null;
let cart = [];
let products = [];

// ========================================
// INICIALIZAÇÃO
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Inicializando Carregado Store...');
    
    // Verificar autenticação
    await checkAuthStatus();
    
    // Carregar produtos
    await loadProducts();
    
    // Configurar event listeners
    setupEventListeners();
    
    console.log('✅ Carregado Store inicializado com sucesso!');
});

// ========================================
// AUTENTICAÇÃO
// ========================================
async function checkAuthStatus() {
    try {
        const user = await authManager.getCurrentUser();
        if (user) {
            currentUser = user;
            showUserInfo();
        } else {
            showLoginButton();
        }
    } catch (error) {
        console.error('❌ Erro ao verificar autenticação:', error);
        showLoginButton();
    }
}

function showUserInfo() {
    const loginBtn = document.getElementById('loginBtn');
    const userInfo = document.getElementById('userInfo');
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (userInfo) {
        userInfo.style.display = 'block';
        userInfo.innerHTML = `
            <span>Olá, ${currentUser.name}!</span>
            <button onclick="logout()" class="logout-btn">Sair</button>
        `;
    }
}

function showLoginButton() {
    const loginBtn = document.getElementById('loginBtn');
    const userInfo = document.getElementById('userInfo');
    
    if (loginBtn) loginBtn.style.display = 'block';
    if (userInfo) userInfo.style.display = 'none';
}

// ========================================
// PRODUTOS
// ========================================
async function loadProducts() {
    try {
        const response = await apiClient.getProducts();
        if (response.success) {
            products = response.data;
            renderProducts();
        } else {
            console.error('❌ Erro ao carregar produtos:', response.error);
        }
    } catch (error) {
        console.error('❌ Erro ao carregar produtos:', error);
    }
}

function renderProducts() {
    const productsContainer = document.getElementById('products');
    if (!productsContainer) return;
    
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image_url || 'imagens/produto-padrao.jpg'}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <span class="price">R$ ${product.price.toFixed(2)}</span>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i>
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `).join('');
}

// ========================================
// CARRINHO
// ========================================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
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
// CHECKOUT E PAGAMENTO
// ========================================
async function checkout() {
    if (!currentUser) {
        showLoginModal();
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Carrinho vazio!', 'error');
        return;
    }
    
    try {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const response = await paymentManager.createPixPayment({
            amount: total,
            description: `Compra na Carregado Store - ${cart.length} item(s)`
        });
        
        if (response.success) {
            showPixModal(response.data);
        } else {
            showNotification('Erro ao criar pagamento: ' + response.error, 'error');
        }
    } catch (error) {
        console.error('❌ Erro no checkout:', error);
        showNotification('Erro no checkout', 'error');
    }
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

function showPixModal(pixData) {
    const modal = document.getElementById('pixModal');
    if (!modal) return;
    
    modal.style.display = 'block';
    
    const qrCodeImg = document.getElementById('qrCodeImg');
    const pixCode = document.getElementById('pixCode');
    
    if (qrCodeImg) qrCodeImg.src = pixData.qrCode;
    if (pixCode) pixCode.value = pixData.code;
    
    // Iniciar verificação de pagamento
    checkPaymentStatus(pixData.transactionId);
}

function hidePixModal() {
    const modal = document.getElementById('pixModal');
    if (modal) modal.style.display = 'none';
}

// ========================================
// VERIFICAÇÃO DE PAGAMENTO
// ========================================
async function checkPaymentStatus(transactionId) {
    try {
        const response = await paymentManager.checkPaymentStatus(transactionId);
        
        if (response.success && response.data.status === 'paid') {
            showNotification('Pagamento confirmado!', 'success');
            hidePixModal();
            cart = [];
            updateCartDisplay();
        } else {
            // Continuar verificando
            setTimeout(() => checkPaymentStatus(transactionId), 5000);
        }
    } catch (error) {
        console.error('❌ Erro ao verificar pagamento:', error);
    }
}

// ========================================
// EVENT LISTENERS
// ========================================
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Close modals
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// ========================================
// HANDLERS
// ========================================
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await authManager.login(email, password);
        
        if (response.success) {
            currentUser = response.user;
            showUserInfo();
            hideLoginModal();
            showNotification('Login realizado com sucesso!');
        } else {
            showNotification('Erro no login: ' + response.error, 'error');
        }
    } catch (error) {
        console.error('❌ Erro no login:', error);
        showNotification('Erro no login', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
        const response = await authManager.register(email, password, { name });
        
        if (response.success) {
            showNotification('Conta criada com sucesso!');
            // Trocar para aba de login
            document.getElementById('loginTab').click();
        } else {
            showNotification('Erro no registro: ' + response.error, 'error');
        }
    } catch (error) {
        console.error('❌ Erro no registro:', error);
        showNotification('Erro no registro', 'error');
    }
}

async function logout() {
    try {
        await authManager.logout();
        currentUser = null;
        showLoginButton();
        showNotification('Logout realizado!');
    } catch (error) {
        console.error('❌ Erro no logout:', error);
    }
}

// ========================================
// UTILITÁRIOS
// ========================================
function showNotification(message, type = 'info') {
    // Implementar sistema de notificações
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
}

function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
    }
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
window.hidePixModal = hidePixModal;
window.logout = logout;
