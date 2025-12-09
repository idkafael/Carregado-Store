// ===== PÁGINA DE DETALHES DO PRODUTO =====

// Variáveis globais
let currentProduct = null;
let currentQuantity = 1;

// Inicialização da página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌸 Bloom: Iniciando página de detalhes do produto...');
    
    // Obter ID do produto da URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        loadProductDetails(parseInt(productId));
        loadSimilarProducts(parseInt(productId));
    } else {
        console.error('❌ ID do produto não encontrado na URL');
        showError('Produto não encontrado');
    }
    
    // Configurar eventos
    setupEventListeners();
    
    // Mostrar notificação social proof
    showSocialProof();
});

// Carregar detalhes do produto
function loadProductDetails(productId) {
    console.log(`🔍 Carregando detalhes do produto ID: ${productId}`);
    
    // Buscar produto na lista (usando a mesma lista do script.js)
    const product = findProductById(productId);
    
    if (!product) {
        console.error('❌ Produto não encontrado');
        showError('Produto não encontrado');
        return;
    }
    
    currentProduct = product;
    console.log('✅ Produto encontrado:', product.title);
    
    // Atualizar breadcrumb
    updateBreadcrumb(product.title);
    
    // Atualizar mídia do produto
    updateProductMedia(product);
    
    // Atualizar informações do produto
    updateProductInfo(product);
    
    // Atualizar sidebar de compra
    updatePurchaseSidebar(product);
    
    // Atualizar descrição
    updateProductDescription(product);
}

// Buscar produto por ID (função auxiliar)
function findProductById(id) {
    // Usar a lista de produtos do script.js principal
    if (typeof products !== 'undefined') {
        return products.find(p => p.id === id);
    }
    
    // Fallback para lista local se script.js não estiver carregado
    const testProducts = [
        {
            id: 1,
            title: "Fluxo Modelo Manychat",
            price: "R$ 147,00",
            originalPrice: "R$ 349,00",
            category: "all",
            newCategory: "ferramentas",
            image: "../assets/imagens/modelos-escaladas.jpg",
            type: "image",
            autoDelivery: true,
            description: "🤖 Fluxo Completo de Manychat\n📱 Interface profissional para WhatsApp\n✅ Sistema de automação avançado\n🎯 Ideal para marketing digital\n💼 Fácil implementação e personalização",
            salesCount: 164
        },
        {
            id: 2,
            title: "Fluxo Vazados Manychat",
            price: "R$ 147,00",
            originalPrice: "R$ 349,00",
            category: "all",
            newCategory: "ferramentas",
            image: "emoji",
            emoji: "🤖",
            autoDelivery: true,
            description: "🔥 Fluxos Vazados de Manychat\n📱 Templates prontos para usar\n✅ Sistema de automação testado\n🎯 Economize tempo na criação\n💼 Implementação imediata",
            salesCount: 164
        },
        {
            id: 3,
            title: "Fluxo N8N x1 WhatsApp",
            price: "R$ 297,00",
            originalPrice: "R$ 589,00",
            category: "all",
            newCategory: "ferramentas",
            image: "emoji",
            emoji: "⚡",
            autoDelivery: true,
            description: "⚡ Fluxo N8N para WhatsApp\n🔧 Automação avançada com N8N\n✅ Integração completa\n🎯 Workflow profissional\n💼 Sistema escalável",
            salesCount: 164
        }
    ];
    
    return testProducts.find(p => p.id === id);
}

// Atualizar breadcrumb
function updateBreadcrumb(productTitle) {
    const breadcrumbElement = document.getElementById('breadcrumbProduct');
    if (breadcrumbElement) {
        breadcrumbElement.textContent = productTitle;
    }
}

// Atualizar mídia do produto
function updateProductMedia(product) {
    const mediaContainer = document.getElementById('productMedia');
    
    if (!mediaContainer) return;
    
    let mediaHTML = '';
    
    if (product.videoUrl) {
        mediaHTML = `
            <video autoplay muted loop>
                <source src="${product.videoUrl}" type="video/mp4">
            </video>
        `;
    } else if (product.image === 'emoji' && product.emoji) {
        mediaHTML = `
            <div class="emoji-display">
                ${product.emoji}
            </div>
        `;
    } else if (product.image) {
        mediaHTML = `
            <img src="${product.image}" alt="${product.title}">
        `;
    } else {
        mediaHTML = `
            <div class="emoji-display">
                📦
            </div>
        `;
    }
    
    mediaContainer.innerHTML = mediaHTML;
    
}

// Atualizar informações do produto
function updateProductInfo(product) {
    // Título
    const titleElement = document.getElementById('productTitle');
    if (titleElement) {
        titleElement.textContent = product.title;
    }
    
    // Preços
    const originalPriceElement = document.getElementById('priceOriginal');
    const originalPriceTextElement = document.getElementById('originalPriceText');
    const discountBadgeElement = document.getElementById('discountBadge');
    const currentPriceTextElement = document.getElementById('currentPriceText');
    
    if (product.originalPrice && originalPriceElement) {
        originalPriceElement.style.display = 'flex';
        if (originalPriceTextElement) {
            originalPriceTextElement.textContent = product.originalPrice;
        }
        
        // Calcular desconto
        if (discountBadgeElement) {
            const originalPrice = parseFloat(product.originalPrice.replace('R$ ', '').replace(',', '.'));
            const currentPrice = parseFloat(product.price.replace('R$ ', '').replace(',', '.'));
            const discount = Math.round((1 - currentPrice / originalPrice) * 100);
            discountBadgeElement.textContent = `-${discount}%`;
        }
    }
    
    if (currentPriceTextElement) {
        currentPriceTextElement.textContent = product.price;
    }
    
    // Contagem de vendas
    const salesCountElement = document.getElementById('salesCount');
    const salesCountTextElement = document.getElementById('salesCountText');
    
    if (product.salesCount && salesCountElement) {
        salesCountElement.style.display = 'flex';
        if (salesCountTextElement) {
            salesCountTextElement.textContent = `+${product.salesCount} Vendidos`;
        }
    }
}

// Atualizar sidebar de compra
function updatePurchaseSidebar(product) {
    const sidebarPriceElement = document.getElementById('sidebarPrice');
    const stockCountElement = document.getElementById('stockCount');
    
    if (sidebarPriceElement) {
        sidebarPriceElement.textContent = product.price;
    }
    
    if (stockCountElement) {
        stockCountElement.textContent = '72 Disponível';
    }
}

// Atualizar descrição do produto
function updateProductDescription(product) {
    const descriptionElement = document.getElementById('productDescription');
    
    if (!descriptionElement || !product.description) return;
    
    // Converter quebras de linha em HTML
    const formattedDescription = product.description
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    descriptionElement.innerHTML = `
        <h3>${product.title}</h3>
        <p>${formattedDescription}</p>
        
        <h3>Acesso</h3>
        <p>📋 Template/blueprint pronto para importar + passo a passo rápido.</p>
        
        <h3>Recursos</h3>
        <p>🎯 Sistema completo e profissional com todas as funcionalidades necessárias para seu negócio.</p>
    `;
}

// Carregar produtos similares
function loadSimilarProducts(currentProductId) {
    console.log('🔄 Carregando produtos similares...');
    
    const carouselElement = document.getElementById('similarProductsCarousel');
    if (!carouselElement) return;
    
    // Buscar produtos da mesma categoria (excluindo o atual)
    const similarProducts = getSimilarProducts(currentProductId);
    
    if (similarProducts.length === 0) {
        carouselElement.innerHTML = '<p style="color: #666; text-align: center;">Nenhum produto similar encontrado.</p>';
        return;
    }
    
    // Renderizar produtos similares
    carouselElement.innerHTML = similarProducts.map(product => createSimilarProductCard(product)).join('');
    
    console.log(`✅ ${similarProducts.length} produtos similares carregados`);
}

// Obter produtos similares
function getSimilarProducts(currentProductId) {
    // Usar a lista de produtos do script.js principal
    if (typeof products !== 'undefined') {
        // Retornar produtos da mesma categoria, excluindo o atual
        return products.filter(p => p.id !== currentProductId).slice(0, 5);
    }
    
    // Fallback para lista local se script.js não estiver carregado
    const allProducts = [
        {
            id: 1,
            title: "Fluxo Modelo Manychat",
            price: "R$ 147,00",
            originalPrice: "R$ 349,00",
            category: "ferramentas",
            image: "../assets/imagens/modelos-escaladas.jpg",
            type: "image",
            autoDelivery: true,
            salesCount: 164
        },
        {
            id: 2,
            title: "Fluxo Vazados Manychat",
            price: "R$ 147,00",
            originalPrice: "R$ 349,00",
            category: "ferramentas",
            image: "emoji",
            emoji: "🤖",
            autoDelivery: true,
            salesCount: 164
        },
        {
            id: 3,
            title: "Fluxo N8N x1 WhatsApp",
            price: "R$ 297,00",
            originalPrice: "R$ 589,00",
            category: "ferramentas",
            image: "emoji",
            emoji: "⚡",
            autoDelivery: true,
            salesCount: 164
        },
        {
            id: 4,
            title: "Fluxo N8N Threads",
            price: "R$ 297,00",
            originalPrice: "R$ 589,00",
            category: "ferramentas",
            image: "emoji",
            emoji: "⚡",
            autoDelivery: true,
            salesCount: 164
        },
        {
            id: 5,
            title: "Fluxo N8N Postagem Reels e Instagram e Facebook",
            price: "R$ 297,00",
            originalPrice: "R$ 589,00",
            category: "ferramentas",
            image: "emoji",
            emoji: "⚡",
            autoDelivery: true,
            salesCount: 164
        }
    ];
    
    // Retornar produtos da mesma categoria, excluindo o atual
    return allProducts.filter(p => p.id !== currentProductId).slice(0, 5);
}

// Criar card de produto similar
function createSimilarProductCard(product) {
    const discount = product.originalPrice ?
        Math.round((1 - parseFloat(product.price.replace('R$ ', '').replace(',', '.')) /
        parseFloat(product.originalPrice.replace('R$ ', '').replace(',', '.'))) * 100) : 0;
    
    return `
        <div class="product-card" onclick="goToProduct(${product.id})">
            <div class="product-card-image">
                ${product.image === 'emoji' ? `
                    <div class="emoji-display" style="font-size: 60px; padding: 20px;">
                        ${product.emoji || '📦'}
                    </div>
                ` : `
                    <img src="${product.image}" alt="${product.title}">
                `}
            </div>
            <div class="product-card-content">
                <div class="product-card-main">
                    <h4 class="product-card-title">${product.title}</h4>
                    <div class="product-price-section">
                        ${product.originalPrice ? `
                            <span class="product-price-original">${product.originalPrice}</span>
                            <span class="product-price-discount">✓ ${discount}%</span>
                        ` : ''}
                    </div>
                    ${product.price ? `
                        <div class="product-price-current">
                            ${product.price}
                            <i class="fas fa-truck" style="font-size: 16px;"></i>
                        </div>
                        <div class="product-price-pix">
                            <i class="fas fa-diamond" style="color: var(--secondary-orange);"></i>
                            À vista no PIX
                        </div>
                    ` : ''}
                    ${product.salesCount ? `
                        <div class="sales-count" style="margin-top: 10px;">
                            <i class="fas fa-fire"></i>
                            <span>+${product.salesCount} Vendidos</span>
                        </div>
                    ` : ''}
                </div>
                ${product.price ? `
                    <button class="product-card-button">
                        <i class="fas fa-plus"></i>
                        Comprar Agora
                    </button>
                ` : `
                    <button class="product-card-button" onclick="event.stopPropagation(); contactWhatsApp();">
                        Entrar em Contato
                    </button>
                `}
            </div>
        </div>
    `;
}

// Configurar event listeners
function setupEventListeners() {
    // Input de quantidade
    const quantityInput = document.getElementById('quantityInput');
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            currentQuantity = Math.max(1, Math.min(99, parseInt(this.value) || 1));
            this.value = currentQuantity;
        });
    }
}

// Alterar quantidade
function changeQuantity(delta) {
    currentQuantity = Math.max(1, Math.min(99, currentQuantity + delta));
    const quantityInput = document.getElementById('quantityInput');
    if (quantityInput) {
        quantityInput.value = currentQuantity;
    }
}

// Comprar agora
function buyNow() {
    if (!currentProduct) {
        console.error('❌ Nenhum produto selecionado');
        return;
    }
    
    console.log(`🛒 Comprando ${currentQuantity}x ${currentProduct.title}`);
    
    // Abrir modal de pagamento
    showPaymentModal(currentProduct, currentQuantity);
}

// Adicionar ao carrinho
function addToCart() {
    if (!currentProduct) {
        console.error('❌ Nenhum produto selecionado');
        return;
    }
    
    console.log(`🛒 Adicionando ${currentQuantity}x ${currentProduct.title} ao carrinho`);
    
    // Implementar lógica do carrinho
    // Por enquanto, apenas mostrar notificação
    showNotification(`${currentProduct.title} adicionado ao carrinho!`);
}

// Ir para produto
function goToProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// Mostrar notificação social proof
function showSocialProof() {
    const notifications = [
        "Lucas M. Comprou Pack de audios",
        "Maria S. Comprou Fluxo Manychat",
        "João P. Comprou Template N8N",
        "Ana L. Comprou Modelos Prontas"
    ];
    
    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
    const notificationElement = document.getElementById('socialProofNotification');
    const textElement = document.getElementById('socialProofText');
    
    if (notificationElement && textElement) {
        textElement.textContent = randomNotification;
        notificationElement.style.display = 'flex';
        
        // Esconder após 5 segundos
        setTimeout(() => {
            notificationElement.style.display = 'none';
        }, 5000);
    }
}

// Mostrar notificação
function showNotification(message) {
    // Implementar sistema de notificações
    console.log('📢 Notificação:', message);
}

// Mostrar erro
function showError(message) {
    console.error('❌ Erro:', message);
    // Implementar exibição de erro na UI
}

// Contatar WhatsApp
function contactWhatsApp() {
    const message = encodeURIComponent('Olá! Gostaria de saber mais sobre os produtos da Bloom.');
    window.open(`https://wa.me/5571992926937?text=${message}`, '_blank');
}

// Funções do modal de pagamento (reutilizadas do script.js)
function showPaymentModal(product, quantity = 1) {
    // Implementar abertura do modal de pagamento
    console.log('💳 Abrindo modal de pagamento para:', product.title);
}

function closePaymentModal() {
    // Implementar fechamento do modal
    console.log('❌ Fechando modal de pagamento');
}

function switchTab(tabName) {
    // Implementar troca de abas
    console.log('🔄 Trocando para aba:', tabName);
}

function selectPaymentMethod(method) {
    // Implementar seleção de método de pagamento
    console.log('💳 Método de pagamento selecionado:', method);
}

function createPayment() {
    // Implementar criação de pagamento
    console.log('💳 Criando pagamento...');
}

function copyPixCode() {
    // Implementar cópia do código PIX
    console.log('📋 Copiando código PIX...');
}

// Funções de autenticação (reutilizadas do script.js)
function showLoginModal() {
    console.log('🔐 Abrindo modal de login');
}

function toggleCart() {
    console.log('🛒 Alternando carrinho');
}
