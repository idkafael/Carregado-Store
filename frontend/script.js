// ========================================
// FUNÇÕES DE FORMATAÇÃO DE TELEFONE
// ========================================

/**
 * Formata um número de telefone brasileiro
 * @param {string} phone - Número de telefone (pode conter ou não formatação)
 * @returns {string} - Número formatado como (11) 9 9999-9999
 */
function formatPhoneNumber(phone) {
    if (!phone) return '';
    
    // Remove tudo que não é número
    const numbers = phone.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos (padrão brasileiro com DDD)
    if (numbers.length === 11) {
        return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 3)} ${numbers.substring(3, 7)}-${numbers.substring(7, 11)}`;
    }
    // Se tiver 10 dígitos (telefone fixo)
    else if (numbers.length === 10) {
        return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 6)}-${numbers.substring(6, 10)}`;
    }
    // Retorna o número original se não se encaixar nos padrões
    return phone;
}

/**
 * Aplica máscara de telefone enquanto o usuário digita
 * @param {string} value - Valor atual do input
 * @returns {string} - Valor formatado
 */
function applyPhoneMask(value) {
    if (!value) return '';
    
    // Remove tudo que não é número
    let numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    numbers = numbers.substring(0, 11);
    
    // Aplica a máscara conforme o usuário digita
    if (numbers.length <= 2) {
        return numbers;
    } else if (numbers.length <= 3) {
        return `(${numbers.substring(0, 2)}) ${numbers.substring(2)}`;
    } else if (numbers.length <= 7) {
        return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 3)} ${numbers.substring(3)}`;
    } else {
        return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 3)} ${numbers.substring(3, 7)}-${numbers.substring(7)}`;
    }
}

/**
 * Remove formatação do telefone, deixando apenas números
 * @param {string} phone - Telefone formatado
 * @returns {string} - Apenas números
 */
function unformatPhoneNumber(phone) {
    if (!phone) return '';
    return phone.replace(/\D/g, '');
}

// Categorias Bloom
const categories = [
    { id: 'all', name: 'Todos', icon: 'fas fa-th' },
    { id: 'destaques', name: 'Destaques', icon: 'fas fa-star' },
    { id: 'social', name: 'Social', icon: 'fas fa-hashtag' },
    { id: 'ferramentas', name: 'Ferramentas', icon: 'fas fa-tools' },
    { id: 'modelo', name: 'Modelo', icon: 'fas fa-user' },
    { id: 'outros', name: 'Outros', icon: 'fas fa-box' }
];

// Dados dos produtos
const products = [
    {
        id: 1,
        title: "Tela Privacy Nova",
        price: "R$ 90,00",
        originalPrice: "R$ 150,00",
        category: "all",
        newCategory: "destaques",
        image: "video",
        videoUrl: "../assets/imagens/New Privacy.mp4",
        autoDelivery: true,
        description: "✅ Tela Atualizada 2025 Quase Idêntica\n✅ Sistema de Entregável após confirmação de compra + Coleta de dados pra LTV\n✅ Dashboard própria com track de onde veio o Lead (Orgânico ou Tráfego Pago)\n✅ Sistema de pagamento PIX integrado SEM SAIR DA LANDING PAGE com QR Code automático e verificação em tempo real\n✅ Galeria interativa com blur effects, hover autoplay nos vídeos e marca d'água personalizada\n✅ Facebook Pixel configurado + lead tracking + UTM parameters para máxima conversão\n✅ ENTREGA IMEDIATA: código fonte completo + assets + documentação\n✅ Fácil Personalização: só trocar fotos/vídeos/pixel está pronto para vender",
        downloadLinks: {
            main: "https://drive.google.com/drive/folders/1emzV8VdfoskXkJiIKOj9Re3mkJAzwEpS?usp=sharing",
            backup: "https://drive.google.com/drive/folders/1emzV8VdfoskXkJiIKOj9Re3mkJAzwEpS?usp=sharing",
            instructions: "📋 Tela Privacy Nova completa: código fonte, assets, documentação, configuração de pixel e notificações"
        }
    },
    {
        id: 2,
        title: "Tela OnlyFans",
        price: "R$ 90,00",
        originalPrice: "R$ 150,00",
        category: "hot",
        newCategory: "destaques",
        image: "video",
        videoUrl: "../assets/imagens/new onlyfans.mp4",
        autoDelivery: true,
        description: "✅ Tela Atualizada 2025 Quase Idêntica\n✅ Sistema de Entregável após confirmação de compra + Coleta de dados pra LTV\n✅ Dashboard própria com track de onde veio o Lead (Orgânico ou Tráfego Pago)\n✅ Sistema de pagamento PIX integrado SEM SAIR DA LANDING PAGE com QR Code automático e verificação em tempo real\n✅ Galeria interativa com blur effects, hover autoplay nos vídeos e marca d'água personalizada\n✅ Facebook Pixel configurado + lead tracking + UTM parameters para máxima conversão\n✅ ENTREGA IMEDIATA: código fonte completo + assets + documentação\n✅ Fácil Personalização: só trocar fotos/vídeos/pixel está pronto para vender",
        downloadLinks: {
            main: "https://drive.google.com/drive/folders/1Fpz7hWKFSsjV_SkARftrqunFBMMzotzs?usp=sharing",
            backup: "https://drive.google.com/drive/folders/1Fpz7hWKFSsjV_SkARftrqunFBMMzotzs?usp=sharing",
            instructions: "📋 Tela OnlyFans completa: código fonte, assets, documentação, configuração de pixel e notificações"
        }
    },
    {
        id: 3,
        title: "Tela Privacy Antiga",
        price: "R$ 65,00",
        originalPrice: "R$ 120,00",
        category: "hot",
        newCategory: "destaques",
        image: "video",
        videoUrl: "../assets/imagens/old privacy.mp4",
        autoDelivery: true,
        description: "✅ Tela Escalada, Funcional mas no modelo Antigo\n✅ Sistema de Entregável após confirmação de compra + Coleta de dados pra LTV\n✅ Dashboard própria com track de onde veio o Lead (Orgânico ou Tráfego Pago)\n✅ Sistema de pagamento PIX integrado SEM SAIR DA LANDING PAGE com QR Code automático e verificação em tempo real\n✅ Galeria interativa com blur effects, hover autoplay nos vídeos e marca d'água personalizada\n✅ Facebook Pixel configurado + lead tracking + UTM parameters para máxima conversão\n✅ ENTREGA IMEDIATA: código fonte completo + assets + documentação\n✅ Fácil Personalização: só trocar fotos/vídeos/pixel está pronto para vender",
        downloadLinks: {
            main: "https://drive.google.com/drive/folders/1SDH-yXJqEgyMCpgGmNXwqgHvc2yyiJL2?usp=sharing",
            backup: "https://drive.google.com/drive/folders/1SDH-yXJqEgyMCpgGmNXwqgHvc2yyiJL2?usp=sharing",
            instructions: "📋 Tela Privacy Antiga completa: código fonte, assets, documentação, configuração de pixel e notificações"
        }
    },
    {
        id: 4,
        title: "Landing Page [Modelo a km de você]",
        price: "R$ 12,90",
        category: "ferramentas",
        newCategory: "ferramentas",
        image: "video",
        videoUrl: "../assets/imagens/lp editada.mp4",
        autoDelivery: true,
        description: "🚀 Landing Page Modelo Está a 5km de você\n🎯 Autohover e autoplay no fundo\n🔗 Redirect pra onde quiser\n💥 Alta conversão",
        downloadLinks: {
            main: "https://drive.google.com/drive/folders/1eCGFe2ATW5vIDInr5AYRxf5PYPDs9hkU?usp=sharing",
            backup: "https://drive.google.com/drive/folders/1eCGFe2ATW5vIDInr5AYRxf5PYPDs9hkU?usp=sharing",
            instructions: "📋 Landing Page completa com código fonte, assets e documentação"
        }
    },
    {
        id: 5,
        title: "Corte de Fotos/Vídeos em Massa",
        price: "R$ 19,90",
        category: "all",
        newCategory: "ferramentas",
        image: "../assets/imagens/corte em massa.jpg",
        type: "image",
        autoDelivery: true,
        description: "🖼️ Corte Automático de Fotos e Vídeos\n✂️ Processa múltiplos arquivos de uma vez\n🎯 Ferramentas profissionais: crop_tool.py e video_crop_tool.py\n⚡ Executável .bat para facilitar o uso\n💾 Scripts Python prontos para usar",
        downloadLinks: {
            main: "https://drive.google.com/drive/folders/1wOxLQcvK1thkPuLNWbmDwN4HzOoGPgUx?usp=drive_link",
            backup: "https://drive.google.com/drive/folders/1wOxLQcvK1thkPuLNWbmDwN4HzOoGPgUx?usp=drive_link",
            instructions: "📋 Ferramentas de corte em massa: crop_tool.py, video_crop_tool.py e executar.bat"
        }
    },
    {
        id: 6,
        title: "Encomenda Pessoal",
        price: "",
        category: "all",
        newCategory: "outros",
        image: "../assets/imagens/encomenda-pessoal.jpg",
        type: "image",
        description: "🎯 Solução Personalizada para Sua Operação\n💬 Conte-nos o que você precisa\n🚀 Desenvolvemos exatamente o que falta\n📱 Entre em contato: (71) 99292-6937"
    },
    {
        id: 7,
        title: "Modelos Pra Escalar",
        price: "R$ 100,00",
        originalPrice: "R$ 180,00",
        category: "all",
        newCategory: "modelo",
        image: "../assets/imagens/modelos-escaladas.jpg",
        type: "background",
        autoDelivery: true,
        hasModelSelection: true,
        description: "👥 Modelos Profissionais para Escalar Seu Negócio\n📸 Fotos em alta qualidade para usar em suas campanhas\n🎯 Múltiplos modelos disponíveis (Catgirl, Paola Rosalina, Latoxicasz, Liiias)\n✅ Sistema de seleção interativo com carrossel\n💼 Ideal para e-commerce, marketing e produtos",
        models: (typeof CARROSSEL_MODELOS_CONFIG !== 'undefined' && CARROSSEL_MODELOS_CONFIG) ? CARROSSEL_MODELOS_CONFIG.modelos : [
            {
                id: 1,
                name: "Modelo Feminino 1",
                image: "../assets/modelos/modelo1.jpg",
                description: "Modelo profissional feminino para campanhas"
            },
            {
                id: 2,
                name: "Modelo Feminino 2", 
                image: "../assets/modelos/modelo2.jpg",
                description: "Modelo elegante para produtos de beleza"
            },
            {
                id: 3,
                name: "Modelo Masculino 1",
                image: "../assets/modelos/modelo3.jpg", 
                description: "Modelo masculino para produtos masculinos"
            },
            {
                id: 4,
                name: "Modelo Feminino 3",
                image: "../assets/modelos/modelo4.jpg",
                description: "Modelo jovem para produtos fashion"
            },
            {
                id: 5,
                name: "Modelo Masculino 2",
                image: "../assets/modelos/modelo5.jpg",
                description: "Modelo fitness para produtos esportivos"
            },
            {
                id: 6,
                name: "Modelo Feminino 4",
                image: "../assets/modelos/modelo6.jpg",
                description: "Modelo plus size para inclusividade"
            }
        ],
        downloadLinks: {
            main: "https://drive.google.com/drive/folders/1eCGFe2ATW5vIDInr5AYRxf5PYPDs9hkU?usp=drive_link",
            backup: "https://drive.google.com/drive/folders/1eCGFe2ATW5vIDInr5AYRxf5PYPDs9hkU?usp=drive_link",
            instructions: "📋 Modelos profissionais para escalar seu negócio"
        }
    },
    {
        id: 8,
        title: "Tela Fake Privacy",
        price: "R$ 147,90",
        originalPrice: "R$ 250,00",
        category: "destaques",
        newCategory: "destaques",
        image: "../assets/imagens/modelos-escaladas.jpg",
        type: "image",
        autoDelivery: true,
        description: "⭐ Tela Privacy Atualizada 2025\n✅ Sistema de pagamento PIX integrado\n🔥 Entrega automática após pagamento\n📊 Dashboard com tracking completo\n🎯 Galeria interativa profissional"
    },
    {
        id: 9,
        title: "Verificado Modelo Black",
        price: "R$ 197,00",
        originalPrice: "R$ 297,00",
        category: "destaques",
        newCategory: "destaques",
        image: "../assets/imagens/modelos-escaladas.jpg",
        type: "image",
        autoDelivery: true,
        description: "✅ Verificado Azul Instantâneo\n🔥 Sistema Black Premium\n⚡ Entrega rápida garantida\n💎 Modelo exclusivo 2025\n🎯 Suporte prioritário incluído"
    },
    {
        id: 10,
        title: "Copys Validadas Oliveira",
        price: "R$ 50,00",
        originalPrice: "R$ 297,00",
        category: "destaques",
        newCategory: "destaques",
        image: "../assets/imagens/modelos-escaladas.jpg",
        type: "image",
        autoDelivery: true,
        description: "📝 Copys testadas e aprovadas\n💰 Alta taxa de conversão\n🚀 Metodologia Oliveira exclusiva\n✅ Mais de 500 copys prontas\n🎯 Ideais para anúncios e vendas"
    },
    {
        id: 11,
        title: "Pack de Áudios x1",
        price: "R$ 30,00",
        originalPrice: "R$ 97,00",
        category: "destaques",
        newCategory: "destaques",
        image: "../assets/imagens/modelos-escaladas.jpg",
        type: "image",
        autoDelivery: true,
        description: "🎤 Pacote completo de áudios\n✅ Prontos para usar em anúncios\n🔥 Vozes profissionais\n⚡ Entrega automática\n📊 Formato otimizado para todas as plataformas"
    },
    {
        id: 12,
        title: "Zap Voice Vitalício",
        price: "R$ 49,90",
        originalPrice: "R$ 79,90",
        category: "destaques",
        newCategory: "destaques",
        image: "../assets/imagens/modelos-escaladas.jpg",
        type: "image",
        autoDelivery: true,
        description: "🎙️ Sistema de voz para WhatsApp\n♾️ Acesso vitalício\n✅ Vozes ultra realistas\n🚀 Economia de tempo garantida\n🎯 Suporte técnico incluído"
    },
    {
        id: 13,
        title: "Contas Instagram Antigas",
        price: "R$ 25,00",
        originalPrice: "R$ 55,00",
        category: "social",
        newCategory: "social",
        image: "../assets/imagens/modelos-escaladas.jpg",
        type: "image",
        autoDelivery: true,
        description: "📱 Contas do Instagram com histórico\n✅ Contas antigas e verificadas\n🔒 Seguras e prontas para uso\n⚡ Entrega imediata após pagamento\n📊 Ideais para marketing e divulgação"
    },
    {
        id: 14,
        title: "Contas Telegram Premium",
        price: "R$ 15,00",
        originalPrice: "R$ 35,00",
        category: "social",
        newCategory: "social",
        image: "../assets/imagens/modelos-escaladas.jpg",
        type: "image",
        autoDelivery: true,
        description: "💬 Contas Telegram prontas para uso\n⭐ Acesso Premium incluído\n🚀 Ideal para grupos e canais\n✅ Entrega automática\n🔐 Seguras e verificadas"
    },
    {
        id: 15,
        title: "Contas TikTok",
        price: "R$ 20,00",
        originalPrice: "R$ 47,00",
        category: "social",
        newCategory: "social",
        image: "../assets/imagens/modelos-escaladas.jpg",
        type: "image",
        autoDelivery: true,
        description: "🎵 Contas TikTok prontas\n✅ Com histórico de uso\n📈 Ideais para marketing viral\n⚡ Entrega imediata\n🎯 Alta taxa de engajamento"
    },
    {
        id: 16,
        title: "Grupo VIP Telegram",
        price: "R$ 50,00",
        category: "social",
        newCategory: "social",
        image: "../assets/imagens/modelos-escaladas.jpg",
        type: "image",
        autoDelivery: true,
        description: "🔥 Acesso ao Grupo VIP\n💎 Conteúdo exclusivo diário\n🚀 Estratégias de crescimento\n👥 Networking com profissionais\n📚 Materiais exclusivos"
    },
    {
        id: 17,
        title: "Pacote Divulgação Completa",
        price: "R$ 249,00",
        originalPrice: "R$ 529,00",
        category: "social",
        newCategory: "social",
        image: "../assets/imagens/modelos-escaladas.jpg",
        type: "image",
        autoDelivery: true,
        description: "📢 Pacote completo de divulgação\n🎯 Posts programados para todas as redes\n📊 Analytics e relatórios\n🚀 Alcance máximo garantido\n✅ Suporte especializado incluído"
    }
];

// Variáveis globais
let cartCount = 0;
let currentCategory = 'all';
let currentPurchase = null;
// currentUser agora vem de auth-supabase.js
let pendingPurchase = null;
let deliverySystem = {
    isActive: false,
    pendingDeliveries: [],
    deliveredProducts: []
};

// Sistema de Login e LTV
let userDatabase = {
    users: [],
    purchases: [],
    ltvData: {}
};

// Elementos DOM - serão obtidos dinamicamente quando necessário

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    setupEventListeners();
    initializeDeliverySystem();
    initializeUserDatabase();
    initializePurchaseCounter();
    initializeSocialProofNotifications();

    // Aplicar animações aos elementos quando carregados
    const animatedElements = document.querySelectorAll('.stat-card, .product-card, .step');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});


// Configurar event listeners
function setupEventListeners() {
    // Dropdown de categorias
    const categorySelect = document.getElementById('categorySelect');
    if (categorySelect) {
        categorySelect.addEventListener('change', function(e) {
            currentCategory = e.target.value;
            renderProducts();
        });
    }

    // Botão "Navegar produtos!" no hero
    const heroBtn = document.querySelector('.hero-btn');
    heroBtn.addEventListener('click', function() {
        document.querySelector('.products').scrollIntoView({
            behavior: 'smooth'
        });
    });
}

// Renderizar produtos em esteiras (Bloom Style)
function renderProducts() {
    console.log('🌸 Bloom: Iniciando renderização de produtos em esteiras...');
    
    const carouselsContainer = document.getElementById('categoryCarousels');
    if (!carouselsContainer) {
        console.error('❌ Container de carrosséis não encontrado');
        return;
    }
    
    carouselsContainer.innerHTML = '';
    
    // Renderizar cada categoria como uma esteira
    categories.forEach(category => {
        if (category.id === 'all') return; // Pular "Todos"
        
        const categoryProducts = products.filter(p => p.newCategory === category.id);
        if (categoryProducts.length === 0) return;
        
        const sectionHTML = `
            <div class="category-section">
                <div class="category-header">
                    <i class="${category.icon}" style="font-size: 32px; color: var(--primary-orange);"></i>
                    <h3 class="category-title">${category.name}</h3>
                </div>
                <div class="products-carousel" id="carousel-${category.id}">
                    ${categoryProducts.map(product => createProductCard(product)).join('')}
                </div>
            </div>
        `;
        
        carouselsContainer.innerHTML += sectionHTML;
    });
    
    console.log('✅ Esteiras renderizadas com sucesso');
}

// Criar card de produto (Bloom Style)
function createProductCard(product) {
    const discount = product.originalPrice ? 
        Math.round((1 - parseFloat(product.price.replace('R$ ', '').replace(',', '.')) / 
        parseFloat(product.originalPrice.replace('R$ ', '').replace(',', '.'))) * 100) : 0;
    
    return `
        <div class="product-card" data-product-id="${product.id}" onclick="addToCart(${product.id})">
            <div class="product-card-image">
                ${product.videoUrl ? `
                    <video autoplay muted loop>
                        <source src="${product.videoUrl}" type="video/mp4">
                    </video>
                ` : `
                    <img src="${product.image}" alt="${product.title}">
                `}
                ${product.autoDelivery ? `
                    <div class="product-badge">
                        <i class="fas fa-truck"></i>
                        ENTREGA AUTOMÁTICA
                    </div>
                ` : ''}
            </div>
            <div class="product-card-content">
                <h4 class="product-card-title">${product.title}</h4>
                <div class="product-price-section">
                    ${product.originalPrice ? `
                        <span class="product-price-original">${product.originalPrice}</span>
                        <span class="product-price-discount">↓ ${discount}%</span>
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
                    <button class="product-card-button">
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

// ========================================
// ESTILOS DE PREÇOS
// ========================================
function addPriceStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .product-price {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            flex-wrap: wrap;
        }
        
        .price {
            font-size: 18px;
            font-weight: 700;
            color: #f28625;
        }
        
        .original-price {
            font-size: 14px;
            color: #999;
            text-decoration: line-through;
            opacity: 0.7;
        }
        
        .product-image video {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            object-position: center !important;
            max-width: 100% !important;
            max-height: 100% !important;
            transform: scale(1) !important;
            zoom: 1 !important;
        }
        
        .product-image img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            object-position: center !important;
            max-width: 100% !important;
            max-height: 100% !important;
            transform: scale(1) !important;
            zoom: 1 !important;
        }
        
        .product-image {
            overflow: hidden !important;
            position: relative !important;
        }
    `;
    document.head.appendChild(style);
}

// Função createProductCard antiga removida - usando a nova versão Bloom acima

// Adicionar produto ao carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        // Se for o produto WhatsApp, abrir WhatsApp (não precisa de login)
        if (product.image === 'whatsapp') {
            window.open(product.whatsappUrl, '_blank');
            return;
        }
        
        // Se for produto com seleção de modelos, abrir carrossel
        if (product.hasModelSelection) {
            showModelSelectionModal(product);
            return;
        }
        
        // Verificar se usuário está logado
        if (!window.currentUser) {
            // Salvar produto pendente para compra após login
            pendingPurchase = {
                productId: productId,
                product: product,
                timestamp: new Date()
            };
            
            // Mostrar modal de login obrigatório
            showLoginRequiredModal(product);
            return;
        }
        
        // Usuário logado - prosseguir com compra normal
        cartCount++;
        updateCartCount();
        openPaymentModal(product);
    }
}

// Atualizar contador do carrinho
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

// Mostrar animação do carrinho
function showCartAnimation() {
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
    }, 200);
}

// Efeito de scroll suave para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animações de entrada para elementos
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animações aplicadas no primeiro DOMContentLoaded acima

// Funcionalidade de busca (para futuras implementações)
function searchProducts(query) {
    const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    return filteredProducts;
}

// Validação de formulários (para futuras implementações)
function validateForm(formData) {
    const errors = [];
    
    if (!formData.name || formData.name.trim().length < 2) {
        errors.push('Nome deve ter pelo menos 2 caracteres');
    }
    
    if (!formData.email || !isValidEmail(formData.email)) {
        errors.push('Email inválido');
    }
    
    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Gerenciamento de estado local
const state = {
    cart: [],
    user: null,
    filters: {
        category: 'all',
        priceRange: [0, 1000],
        sortBy: 'name'
    }
};

// Funções utilitárias
const utils = {
    formatPrice: (price) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    },
    
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Funções do Modal de Privacy
function openPreview() {
    const modal = document.getElementById('privacyModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Previne scroll da página
}

function closeModal() {
    const modal = document.getElementById('privacyModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaura scroll da página
}

// Fechar modal clicando fora dele
window.onclick = function(event) {
    const modal = document.getElementById('privacyModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Fechar modal com tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Função de teste para vídeos
function testVideo() {
    console.log('Testando vídeos...');
    const videos = document.querySelectorAll('.product-video');
    console.log('Vídeos encontrados:', videos.length);
    
    videos.forEach((video, index) => {
        console.log(`Vídeo ${index + 1}:`, {
            src: video.src || video.querySelector('source')?.src,
            readyState: video.readyState,
            paused: video.paused,
            currentTime: video.currentTime
        });
    });
}

// Funções do Modal de Pagamento
function openPaymentModal(product) {
    const modal = document.getElementById('paymentModal');
    const productName = document.getElementById('productName');
    const productPrice = document.getElementById('productPrice');
    const productNameDesc = document.getElementById('productNameDesc');
    const productPriceDesc = document.getElementById('productPriceDesc');
    const productDescriptionText = document.getElementById('productDescriptionText');
    const productFeaturesList = document.getElementById('productFeaturesList');
    
    if (modal && productName && productPrice) {
        // DEFINIR PRODUTO ATUAL GLOBALMENTE - CORREÇÃO CRÍTICA
        window.currentProduct = product;
        console.log('🎯 Produto atual definido:', product.title, product.id);
        
        // Atualizar informações básicas
        productName.textContent = product.title;
        productPrice.textContent = product.price;
        
        // Atualizar informações da aba descrição
        if (productNameDesc) productNameDesc.textContent = product.title;
        if (productPriceDesc) productPriceDesc.textContent = product.price;
        
        // Preencher descrição detalhada
        if (productDescriptionText) {
            productDescriptionText.innerHTML = getProductDescription(product);
        }
        
        // Hide the separate features section since it's now integrated in the description
        const featuresSection = document.querySelector('.product-features');
        if (featuresSection) {
            featuresSection.style.display = 'none';
        }
        
        // Atualizar valor no PushinPay
        const valor = parseFloat(product.price.replace('R$ ', '').replace(',', '.'));
        PushinPayReal.atualizarValorPlano(valor, product.title);
        
        // Mostrar aba de descrição por padrão
        switchTab('description');
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Parar verificação de pagamento
        PushinPayReal.pararVerificacao();
    }
}

function selectPaymentMethod(method) {
    // Remover classe active de todos os botões
    document.querySelectorAll('.payment-method-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Adicionar classe active ao botão clicado
    event.target.closest('.payment-method-btn').classList.add('active');
}

async function createPayment() {
    try {
        // Validar se usuário está logado ANTES de criar PIX
        if (!window.currentUser || !window.currentUser.id) {
            console.error('❌ Usuário não está logado!');
            alert('Você precisa estar logado para fazer uma compra. Faça login e tente novamente.');
            closePaymentModal();
            showLoginModal();
            return;
        }
        
        const btn = document.getElementById('createPaymentBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando PIX...';
        
        // Criar PIX
        const pixData = await PushinPayReal.criarPix();
        
        // Extrair transaction_id
        const transactionId = pixData.id || pixData.transaction_id || (pixData.data && pixData.data.id);
        
        // PRIMEIRO: Criar registro de compra no Supabase
        let purchaseId = null;
        if (window.currentUser && window.currentProduct && typeof SupabasePurchases !== 'undefined') {
            try {
                const purchaseResult = await SupabasePurchases.createPurchase({
                    userId: window.currentUser.id,
                    productId: window.currentProduct.id,
                    productName: window.currentProduct.title,
                    amount: window.currentProduct.priceNumeric || (PushinPayReal.estado.valorAtual / 100),
                    status: 'pending',
                    pixTransactionId: transactionId,
                    modelId: selectedModel?.id || null,
                    modelName: selectedModel?.name || null
                });
                
                if (purchaseResult.success) {
                    purchaseId = purchaseResult.data.id;
                    console.log('✅ Compra salva no Supabase:', purchaseId);
                }
            } catch (error) {
                console.error('❌ Erro ao salvar compra:', error);
            }
        }
        
        // DEPOIS: Salvar transação PIX no Supabase (com purchase_id já definido)
        if (window.currentUser && transactionId && purchaseId && typeof SupabasePixTransactions !== 'undefined') {
            try {
                const pixAmount = PushinPayReal.estado.valorAtual / 100; // Converter centavos para reais
                const qrCodeText = (
                    pixData.qr_code || pixData.pix_code || pixData.emv ||
                    (pixData.data && (pixData.data.qr_code || pixData.data.pix_code || pixData.data.emv))
                );
                const qrBase64 = (
                    pixData.qr_code_base64 || pixData.qrcode_base64 || pixData.qrcode || pixData.qr_code_image ||
                    (pixData.data && (pixData.data.qr_code_base64 || pixData.data.qrcode_base64 || pixData.data.qr_code_image))
                );
                
                const result = await SupabasePixTransactions.createPixTransaction({
                    purchaseId: purchaseId, // Agora temos o ID da compra
                    transactionId: transactionId,
                    qrCodeBase64: qrBase64,
                    emvCode: qrCodeText,
                    amount: pixAmount,
                    status: 'pending',
                    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutos
                });
                
                if (result.success) {
                    console.log('✅ Transação PIX salva no Supabase:', result.data.id);
                }
            } catch (error) {
                console.error('❌ Erro ao salvar transação PIX:', error);
            }
        }
        
        // Resolver propriedades possíveis de QR Code (diferentes respostas de API)
        const qrBase64 = (
            pixData.qr_code_base64 || pixData.qrcode_base64 || pixData.qrcode || pixData.qr_code_image ||
            (pixData.data && (pixData.data.qr_code_base64 || pixData.data.qrcode_base64 || pixData.data.qr_code_image))
        );
        const qrCodeText = (
            pixData.qr_code || pixData.pix_code || pixData.emv ||
            (pixData.data && (pixData.data.qr_code || pixData.data.pix_code || pixData.data.emv))
        );

        // Exibir QR Code (preferir base64, senão usar imagem/código alternativo)
        if (qrBase64) {
            PushinPayReal.exibirQRCode(qrBase64);
        } else if (qrCodeText) {
            // Alguns provedores retornam apenas o código EMV; continuará exibido no campo de cópia
            console.warn('QR base64 não encontrado; usando apenas código EMV/PIX');
        }
        
        // Exibir código PIX copiável
        if (qrCodeText) {
            PushinPayReal.exibirCodigoPix(qrCodeText);
        }
        
        // Iniciar verificação
        PushinPayReal.iniciarVerificacao();
        
        // Abrir automaticamente a aba de pagamento
        switchTab('payment');
        
        btn.innerHTML = '<i class="fas fa-check"></i> PIX Gerado';
        
    } catch (error) {
        console.error('Erro ao criar pagamento:', error);
        alert('Erro ao gerar PIX. Tente novamente.');
        
        const btn = document.getElementById('createPaymentBtn');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-credit-card"></i> Gerar PIX';
    }
}

function copyPixCode() {
    const input = document.getElementById('pixCodeInput');
    if (input && input.value) {
        input.select();
        input.setSelectionRange(0, 99999); // Para mobile
        
        try {
            document.execCommand('copy');
            
            // Feedback visual melhorado
            const btn = event.target.closest('.copy-btn');
            const originalText = btn.innerHTML;
            const originalBg = btn.style.backgroundColor;
            
            // Mudar para sucesso
            btn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
            btn.style.backgroundColor = '#28a745';
            btn.style.transform = 'scale(1.05)';
            
            // Mostrar notificação
            showCopyNotification();
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = originalBg;
                btn.style.transform = 'scale(1)';
            }, 3000);
            
        } catch (err) {
            console.error('Erro ao copiar:', err);
            // Feedback de erro
            const btn = event.target.closest('.copy-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-times"></i> Erro';
            btn.style.backgroundColor = '#dc3545';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = '#f28625';
            }, 2000);
        }
    } else {
        // Se não há código para copiar
        const btn = event.target.closest('.copy-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-exclamation"></i> Vazio';
        btn.style.backgroundColor = '#ffc107';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.backgroundColor = '#f28625';
        }, 2000);
    }
}

// Função para mostrar notificação de cópia
function showCopyNotification() {
    // Criar notificação
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
    `;
    notification.innerHTML = '<i class="fas fa-check-circle"></i> Código PIX copiado!';
    
    // Adicionar ao body
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Fechar modal clicando fora dele
window.onclick = function(event) {
    const privacyModal = document.getElementById('privacyModal');
    const paymentModal = document.getElementById('paymentModal');
    const modelSelectionModal = document.getElementById('modelSelectionModal');
    
    if (event.target === privacyModal) {
        closeModal();
    }
    
    if (event.target === paymentModal) {
        closePaymentModal();
    }
    
    if (event.target === modelSelectionModal) {
        closeModelSelectionModal();
    }
}



// Função para trocar entre abas
function switchTab(tabName) {
    // Remover classe active de todas as abas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Remover classe active de todo conteúdo
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Ativar aba clicada
    const activeTab = document.getElementById(tabName + 'Tab');
    const activeContent = document.getElementById(tabName + 'Content');
    
    if (activeTab) activeTab.classList.add('active');
    if (activeContent) activeContent.classList.add('active');
}

// Sistema de Entrega de Produtos
function initializeDeliverySystem() {
    deliverySystem.isActive = true;
    console.log('🚀 Sistema de entrega inicializado');
}

function addToDeliveryQueue(product, purchaseId) {
    if (product.autoDelivery) {
        const deliveryItem = {
            id: Date.now(),
            productId: product.id,
            productName: product.title,
            purchaseId: purchaseId,
            timestamp: new Date(),
            status: 'pending'
        };
        
        deliverySystem.pendingDeliveries.push(deliveryItem);
        console.log('📦 Produto adicionado à fila de entrega:', deliveryItem);
        
        // Simular entrega automática após 3 segundos
        setTimeout(() => {
            deliverProduct(deliveryItem);
        }, 3000);
    }
}

function deliverProduct(deliveryItem) {
    deliveryItem.status = 'delivered';
    deliveryItem.deliveredAt = new Date();
    
    // Mover da fila de pendentes para entregues
    const index = deliverySystem.pendingDeliveries.findIndex(item => item.id === deliveryItem.id);
    if (index > -1) {
        deliverySystem.pendingDeliveries.splice(index, 1);
    }
    
    deliverySystem.deliveredProducts.push(deliveryItem);
    
    console.log('✅ Produto entregue:', deliveryItem);
    
    // Mostrar modal de entrega
    showDeliveryModal(deliveryItem);
}

function showDeliveryModal(deliveryItem) {
    const modal = document.getElementById('deliveryModal');
    if (!modal) {
        createDeliveryModal();
    }
    
    const product = products.find(p => p.id === deliveryItem.productId);
    if (!product) return;
    
    // Atualizar conteúdo do modal
    document.getElementById('deliveredProductName').textContent = product.title;
    document.getElementById('deliveryTime').textContent = new Date().toLocaleString('pt-BR');
    
    // Mostrar modal
    document.getElementById('deliveryModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Auto-fechar após 10 segundos
    setTimeout(() => {
        closeDeliveryModal();
    }, 10000);
}

function createDeliveryModal() {
    const modalHTML = `
        <div id="deliveryModal" class="modal">
            <div class="modal-content delivery-modal">
                <div class="delivery-header">
                    <div class="delivery-icon">📦</div>
                    <h2>Produto Entregue!</h2>
                </div>
                <div class="delivery-body">
                    <p><strong>Produto:</strong> <span id="deliveredProductName"></span></p>
                    <p><strong>Entregue em:</strong> <span id="deliveryTime"></span></p>
                    <div class="delivery-message">
                        <p>🎉 Seu produto foi entregue automaticamente!</p>
                        <p>Verifique seus downloads ou acesse o link enviado por email.</p>
                    </div>
                </div>
                <div class="delivery-footer">
                    <button class="modal-btn primary" onclick="closeDeliveryModal()">
                        <i class="fas fa-check"></i>
                        Entendi
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeDeliveryModal() {
    const modal = document.getElementById('deliveryModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Simular confirmação de pagamento
function simulatePaymentConfirmation(productId) {
    console.log('💳 simulatePaymentConfirmation chamado para produto ID:', productId);
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('❌ ERRO: Produto não encontrado para ID:', productId);
        return;
    }
    
    console.log('✅ Produto encontrado:', product.title);
    
    const purchaseId = 'PURCHASE_' + Date.now();
    currentPurchase = {
        id: purchaseId,
        productId: productId,
        product: product,
        timestamp: new Date(),
        status: 'confirmed'
    };
    
    console.log('💳 Pagamento confirmado:', currentPurchase);
    
    // Atualizar LTV se usuário estiver logado
    if (window.currentUser) {
        console.log('👤 Usuário logado, atualizando LTV...');
        const purchaseAmount = parseFloat(product.price.replace('R$ ', '').replace(',', '.'));
        updateUserLTV(window.currentUser.id, purchaseAmount);
        
        // Registrar compra
        const purchase = {
            id: purchaseId,
            userId: window.currentUser.id,
            productId: product.id,
            productName: product.title,
            amount: purchaseAmount,
            date: new Date(),
            status: 'confirmed',
            selectedModel: product.selectedModel || null
        };
        
        userDatabase.purchases.push(purchase);
        saveUserDatabase();
        
        console.log('💰 Compra registrada no banco de dados:', purchase);
    } else {
        console.warn('⚠️ Usuário não está logado, compra não será registrada no banco de dados');
    }
    
    // Adicionar à fila de entrega se for produto automático
    if (product.autoDelivery) {
        console.log('📦 Produto tem entrega automática, adicionando à fila...');
        addToDeliveryQueue(product, purchaseId);
    } else {
        console.log('📦 Produto não tem entrega automática');
    }
    
    // Adicionar botão de download se produto tiver links de download
    if (product.downloadLinks) {
        console.log('🔗 Produto tem links de download, adicionando botão...');
        setTimeout(() => {
            // Verificar se o usuário realmente comprou este produto
            if (window.currentUser && hasUserPurchasedProduct(window.currentUser.id, product.id)) {
                console.log('✅ Adicionando botão de download para produto:', product.title);
                addDownloadButtonToProduct(product.id);
            } else {
                console.warn('⚠️ Usuário não está logado ou não comprou o produto, botão de download não será adicionado');
            }
        }, 2000);
    } else {
        console.log('🔗 Produto não tem links de download');
    }
    
    // Mostrar notificação de confirmação
    console.log('🔔 Mostrando notificação de confirmação...');
    showPaymentConfirmation(product);
    
    // Forçar atualização dos cards de produtos
    setTimeout(() => {
        console.log('🔄 Forçando atualização dos cards de produtos...');
        updateProductCardsForUser();
    }, 3000);
}

function showPaymentConfirmation(product) {
    const notification = document.createElement('div');
    notification.className = 'payment-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">✅</div>
            <div class="notification-text">
                <h4>Pagamento Confirmado!</h4>
                <p>${product.title}</p>
                ${product.autoDelivery ? '<span class="auto-delivery-badge">Entrega Automática</span>' : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 5 segundos
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Sistema de Login e LTV
function initializeUserDatabase() {
    // Carregar dados do localStorage
    const savedData = localStorage.getItem('userDatabase');
    if (savedData) {
        userDatabase = JSON.parse(savedData);
    }
    
    // Verificar se usuário está logado
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        window.currentUser = JSON.parse(savedUser);
        updateUserInterface();
    }
    
    
    console.log('🗄️ Sistema de usuários inicializado');
}


function saveUserDatabase() {
    localStorage.setItem('userDatabase', JSON.stringify(userDatabase));
}

function saveCurrentUser() {
    if (window.currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(window.currentUser));
    }
}

function registerUser(userData) {
    const user = {
        id: Date.now(),
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        createdAt: new Date(),
        totalSpent: 0,
        purchaseCount: 0,
        lastPurchase: null,
        ltv: 0
    };
    
    userDatabase.users.push(user);
    saveUserDatabase();
    
    console.log('👤 Usuário registrado:', user);
    return user;
}

function loginUser(email, password) {
    const user = userDatabase.users.find(u => u.email === email);
    if (user) {
        window.currentUser = user;
        saveCurrentUser();
        updateUserInterface();
        console.log('🔐 Usuário logado:', user);
        return user;
    }
    return null;
}

function logoutUser() {
    window.currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserInterface();
    console.log('🚪 Usuário deslogado');
}

function updateUserLTV(userId, purchaseAmount) {
    const user = userDatabase.users.find(u => u.id === userId);
    if (user) {
        user.totalSpent += purchaseAmount;
        user.purchaseCount += 1;
        user.lastPurchase = new Date();
        user.ltv = user.totalSpent;
        
        // Atualizar dados de LTV
        if (!userDatabase.ltvData[userId]) {
            userDatabase.ltvData[userId] = {
                totalSpent: 0,
                purchaseHistory: [],
                averageOrderValue: 0,
                customerLifetime: 0
            };
        }
        
        userDatabase.ltvData[userId].totalSpent = user.totalSpent;
        userDatabase.ltvData[userId].purchaseHistory.push({
            amount: purchaseAmount,
            date: new Date(),
            productId: currentPurchase ? currentPurchase.productId : null
        });
        
        userDatabase.ltvData[userId].averageOrderValue = 
            user.totalSpent / user.purchaseCount;
        
        userDatabase.ltvData[userId].customerLifetime = 
            Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24));
        
        saveUserDatabase();
        console.log('💰 LTV atualizado:', userDatabase.ltvData[userId]);
    }
}

function updateUserInterface() {
    const loginBtn = document.getElementById('loginBtn');
    const userInfo = document.getElementById('userInfo');
    
    if (window.currentUser) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'block';
            userInfo.innerHTML = `
                <div class="user-profile">
                    <div class="user-avatar">👤</div>
                    <div class="user-details">
                        <span class="user-name">${window.currentUser.name}</span>
                        <span class="user-ltv">LTV: R$ ${window.currentUser.ltv.toFixed(2)}</span>
                    </div>
                    <button onclick="logoutUser()" class="logout-btn">Sair</button>
                </div>
            `;
        }
        
        // Atualizar botões de download para produtos comprados
        updateProductCardsForUser();
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
    }
}

function showLoginModal() {
    let modal = document.getElementById('loginModal');
    if (!modal) {
        createLoginModal();
        modal = document.getElementById('loginModal');
    }
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    } else {
        console.error('❌ Modal de login não encontrado');
    }
}

function showLoginRequiredModal(product) {
    const modal = document.getElementById('loginRequiredModal');
    if (!modal) {
        createLoginRequiredModal();
    }
    
    // Atualizar informações do produto no modal
    document.getElementById('requiredProductName').textContent = product.title;
    document.getElementById('requiredProductPrice').textContent = product.price;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeLoginRequiredModal() {
    const modal = document.getElementById('loginRequiredModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function createLoginRequiredModal() {
    const modalHTML = `
        <div id="loginRequiredModal" class="modal">
            <div class="modal-content login-required-modal">
                <div class="login-required-header">
                    <div class="required-icon">🔐</div>
                    <h2>Login Necessário</h2>
                    <p>Para continuar com sua compra, você precisa fazer login ou criar uma conta</p>
                </div>
                <div class="login-required-body">
                    <div class="product-preview">
                        <h3>Produto Selecionado:</h3>
                        <div class="product-info">
                            <span class="product-name" id="requiredProductName">Produto</span>
                            <span class="product-price" id="requiredProductPrice">R$ 0,00</span>
                        </div>
                    </div>
                    
                    <div class="login-required-tabs">
                        <button class="tab-btn active" onclick="switchLoginRequiredTab('login')">Login</button>
                        <button class="tab-btn" onclick="switchLoginRequiredTab('register')">Cadastro</button>
                    </div>
                    
                    <div id="loginRequiredForm" class="login-required-form active">
                        <div class="form-group">
                            <label>Email:</label>
                            <input type="email" id="loginRequiredEmail" placeholder="seu@email.com" required>
                        </div>
                        <div class="form-group">
                            <label>Senha:</label>
                            <input type="password" id="loginRequiredPassword" placeholder="Sua senha" required>
                        </div>
                        <button onclick="handleLoginRequired()" class="modal-btn primary">
                            <i class="fas fa-sign-in-alt"></i>
                            Entrar e Comprar
                        </button>
                    </div>
                    
                    <div id="registerRequiredForm" class="login-required-form">
                        <div class="form-group">
                            <label>Nome:</label>
                            <input type="text" id="registerRequiredName" placeholder="Seu nome completo" required>
                        </div>
                        <div class="form-group">
                            <label>Email:</label>
                            <input type="email" id="registerRequiredEmail" placeholder="seu@email.com" required>
                        </div>
                        <div class="form-group">
                            <label>Telefone:</label>
                            <input type="tel" id="registerRequiredPhone" placeholder="(11) 99999-9999" required>
                        </div>
                        <div class="form-group">
                            <label>Senha:</label>
                            <input type="password" id="registerRequiredPassword" placeholder="Sua senha" required>
                        </div>
                        <button onclick="handleRegisterRequired()" class="modal-btn primary">
                            <i class="fas fa-user-plus"></i>
                            Cadastrar e Comprar
                        </button>
                    </div>
                    
                    <div class="login-required-message">
                        <p>🎯 <strong>Por que fazer login?</strong></p>
                        <ul>
                            <li>✅ Acompanhar suas compras</li>
                            <li>✅ Receber produtos automaticamente</li>
                            <li>✅ Histórico de compras</li>
                            <li>✅ Suporte personalizado</li>
                        </ul>
                    </div>
                </div>
                <div class="login-required-footer">
                    <button onclick="closeLoginRequiredModal()" class="modal-btn secondary">
                        <i class="fas fa-times"></i>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Adicionar formatação automática ao campo de telefone
    const phoneInput = document.getElementById('registerRequiredPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            const cursorPosition = e.target.selectionStart;
            const oldValue = e.target.value;
            const newValue = applyPhoneMask(oldValue);
            
            e.target.value = newValue;
            
            // Ajustar posição do cursor após formatação
            if (newValue.length > oldValue.length) {
                e.target.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
            } else {
                e.target.setSelectionRange(cursorPosition, cursorPosition);
            }
        });
    }
}

function switchLoginRequiredTab(tabName) {
    document.querySelectorAll('.login-required-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.login-required-form').forEach(form => {
        form.classList.remove('active');
    });
    
    document.querySelector(`[onclick="switchLoginRequiredTab('${tabName}')"]`).classList.add('active');
    document.getElementById(tabName + 'RequiredForm').classList.add('active');
}

function handleLoginRequired() {
    const email = document.getElementById('loginRequiredEmail').value;
    const password = document.getElementById('loginRequiredPassword').value;
    
    if (!email || !password) {
        showNotification('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    const user = loginUser(email, password);
    if (user) {
        closeLoginRequiredModal();
        showNotification('Login realizado com sucesso!', 'success');
        
        // Finalizar compra pendente se existir
        if (pendingPurchase) {
            setTimeout(() => {
                finalizePendingPurchase();
            }, 1000);
        }
    } else {
        showNotification('Email ou senha incorretos', 'error');
    }
}

function handleRegisterRequired() {
    const name = document.getElementById('registerRequiredName').value;
    const email = document.getElementById('registerRequiredEmail').value;
    const phoneRaw = document.getElementById('registerRequiredPhone').value;
    // Remover formatação do telefone antes de salvar
    const phone = unformatPhoneNumber(phoneRaw);
    const password = document.getElementById('registerRequiredPassword').value;
    
    if (!name || !email || !phone || !password) {
        showNotification('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    // Verificar se email já existe
    const existingUser = userDatabase.users.find(u => u.email === email);
    if (existingUser) {
        showNotification('Email já cadastrado', 'error');
        return;
    }
    
    const user = registerUser({ name, email, phone, password });
    window.currentUser = user;
    saveCurrentUser();
    updateUserInterface();
    closeLoginRequiredModal();
    showNotification('Cadastro realizado com sucesso!', 'success');
    
    // Finalizar compra pendente se existir
    if (pendingPurchase) {
        setTimeout(() => {
            finalizePendingPurchase();
        }, 1000);
    }
}

function finalizePendingPurchase() {
    if (pendingPurchase && window.currentUser) {
        const product = pendingPurchase.product;
        
        // Mostrar notificação de compra pendente
        showNotification(`Finalizando compra de ${product.title}...`, 'info');
        
        // Adicionar ao carrinho e abrir modal de pagamento
        cartCount++;
        updateCartCount();
        openPaymentModal(product);
        
        // Limpar compra pendente
        pendingPurchase = null;
        
        console.log('✅ Compra pendente finalizada:', product.title);
    }
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function createLoginModal() {
    // Verificar se o modal já existe
    if (document.getElementById('loginModal')) {
        console.log('⚠️ Modal de login já existe');
        return;
    }
    
    const modalHTML = `
        <div id="loginModal" class="modal">
            <div class="modal-content login-modal">
                <div class="login-header">
                    <h2>🔐 Login / Cadastro</h2>
                    <button onclick="closeLoginModal()" class="close-btn">&times;</button>
                </div>
                <div class="login-body">
                    <div class="login-tabs">
                        <button class="tab-btn active" onclick="switchLoginTab('login')">Login</button>
                        <button class="tab-btn" onclick="switchLoginTab('register')">Cadastro</button>
                    </div>
                    
                    <form id="loginForm" class="login-form active" novalidate>
                        <div class="form-group">
                            <label>Email:</label>
                            <input type="email" id="loginEmail" placeholder="seu@email.com">
                        </div>
                        <div class="form-group">
                            <label>Senha:</label>
                            <input type="password" id="loginPassword" placeholder="Sua senha">
                        </div>
                        <button type="submit" class="modal-btn primary">
                            <i class="fas fa-sign-in-alt"></i>
                            Entrar
                        </button>
                    </form>
                    
                    <form id="registerForm" class="login-form register-form" novalidate>
                        <div class="form-group">
                            <label>Nome:</label>
                            <input type="text" id="registerName" placeholder="Seu nome completo">
                        </div>
                        <div class="form-group">
                            <label>Email:</label>
                            <input type="email" id="registerEmail" placeholder="seu@email.com">
                        </div>
                        <div class="form-group">
                            <label>Telefone:</label>
                            <input type="tel" id="registerPhone" placeholder="(11) 99999-9999">
                        </div>
                        <div class="form-group">
                            <label>Senha:</label>
                            <input type="password" id="registerPassword" placeholder="Mínimo 6 caracteres">
                        </div>
                        <div class="form-group">
                            <label>Confirmar Senha:</label>
                            <input type="password" id="registerConfirmPassword" placeholder="Digite a senha novamente">
                        </div>
                        <button type="submit" class="modal-btn primary">
                            <i class="fas fa-user-plus"></i>
                            Cadastrar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Adicionar event listeners após criar o modal
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (typeof handleLoginSupabase === 'function') {
                handleLoginSupabase();
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (typeof handleRegisterSupabase === 'function') {
                handleRegisterSupabase();
            }
        });
    }
    
    // Adicionar formatação automática ao campo de telefone
    const phoneInput = document.getElementById('registerPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            const cursorPosition = e.target.selectionStart;
            const oldValue = e.target.value;
            const newValue = applyPhoneMask(oldValue);
            
            e.target.value = newValue;
            
            // Ajustar posição do cursor após formatação
            if (newValue.length > oldValue.length) {
                e.target.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
            } else {
                e.target.setSelectionRange(cursorPosition, cursorPosition);
            }
        });
    }
}

function switchLoginTab(tabName) {
    document.querySelectorAll('.login-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.login-form').forEach(form => {
        form.classList.remove('active');
    });
    
    document.querySelector(`[onclick="switchLoginTab('${tabName}')"]`).classList.add('active');
    document.getElementById(tabName + 'Form').classList.add('active');
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Por favor, preencha todos os campos');
        return;
    }
    
    const user = loginUser(email, password);
    if (user) {
        closeLoginModal();
        showNotification('Login realizado com sucesso!', 'success');
        
        // Finalizar compra pendente se existir
        if (pendingPurchase) {
            setTimeout(() => {
                finalizePendingPurchase();
            }, 1000);
        }
    } else {
        showNotification('Email ou senha incorretos', 'error');
    }
}

function handleRegister() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phoneRaw = document.getElementById('registerPhone').value;
    // Remover formatação do telefone antes de salvar
    const phone = unformatPhoneNumber(phoneRaw);
    const password = document.getElementById('registerPassword').value;
    
    if (!name || !email || !phone || !password) {
        alert('Por favor, preencha todos os campos');
        return;
    }
    
    // Verificar se email já existe
    const existingUser = userDatabase.users.find(u => u.email === email);
    if (existingUser) {
        showNotification('Email já cadastrado', 'error');
        return;
    }
    
    const user = registerUser({ name, email, phone, password });
    window.currentUser = user;
    saveCurrentUser();
    updateUserInterface();
    closeLoginModal();
    showNotification('Cadastro realizado com sucesso!', 'success');
    
    // Finalizar compra pendente se existir
    if (pendingPurchase) {
        setTimeout(() => {
            finalizePendingPurchase();
        }, 1000);
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</div>
            <div class="notification-text">${message}</div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}


// Sistema de Download
function hasUserPurchasedProduct(userId, productId) {
    if (!userId) return false;
    
    const purchase = userDatabase.purchases.find(p => 
        p.userId === userId && 
        p.productId === productId && 
        p.status === 'confirmed'
    );
    
    return !!purchase;
}

function showDownloadModal(product) {
    const modal = document.getElementById('downloadModal');
    if (!modal) {
        createDownloadModal();
    }
    
    // Verificar se é produto com modelo selecionado e se é Latoxicasz
    let downloadMain = product.downloadLinks?.main || '#';
    let downloadBackup = product.downloadLinks?.backup || '#';
    let productName = product.title;
    let instructions = product.downloadLinks?.instructions || 'Faça o download do seu produto';
    
    if (product.selectedModel) {
        const modelName = product.selectedModel.nome || product.selectedModel.name || '';
        
        // Se for Latoxicasz, usar link específico
        if (modelName.toLowerCase().includes('latoxicasz')) {
            downloadMain = 'https://drive.google.com/drive/folders/18_5x8WAeClrsIY_GYQZ9WcnFD_jb9DW0?usp=sharing';
            downloadBackup = 'https://drive.google.com/drive/folders/18_5x8WAeClrsIY_GYQZ9WcnFD_jb9DW0?usp=sharing';
            productName = `${product.title} - ${modelName}`;
            instructions = `📋 Conteúdo completo da modelo ${modelName}: fotos, vídeos e materiais exclusivos`;
        }
    }
    
    // Atualizar conteúdo do modal
    document.getElementById('downloadProductName').textContent = productName;
    document.getElementById('downloadInstructions').textContent = instructions;
    
    // Atualizar links de download
    const mainLink = document.getElementById('mainDownloadLink');
    const backupLink = document.getElementById('backupDownloadLink');
    
    mainLink.href = downloadMain;
    backupLink.href = downloadBackup;
    
    // Mostrar modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeDownloadModal() {
    const modal = document.getElementById('downloadModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function createDownloadModal() {
    const modalHTML = `
        <div id="downloadModal" class="modal">
            <div class="modal-content download-modal">
                <div class="download-header">
                    <div class="download-icon">📥</div>
                    <h2>Download Disponível</h2>
                    <p>Seu produto está pronto para download!</p>
                </div>
                <div class="download-body">
                    <div class="product-info">
                        <h3 id="downloadProductName">Produto</h3>
                        <p id="downloadInstructions">Instruções de download</p>
                    </div>
                    
                    <div class="download-links">
                        <div class="download-link-item">
                            <h4>🔗 Link Principal</h4>
                            <a id="mainDownloadLink" href="#" target="_blank" class="download-btn primary">
                                <i class="fas fa-download"></i>
                                Baixar do Google Drive
                            </a>
                        </div>
                        
                        <div class="download-link-item">
                            <h4>🔗 Link Alternativo</h4>
                            <a id="backupDownloadLink" href="#" target="_blank" class="download-btn secondary">
                                <i class="fas fa-download"></i>
                                Baixar do Google Drive
                            </a>
                        </div>
                    </div>
                    
                    <div class="download-tips">
                        <h4>💡 Dicas Importantes:</h4>
                        <ul>
                            <li>✅ Clique no link para acessar a pasta do Google Drive</li>
                            <li>✅ Baixe todos os arquivos da pasta</li>
                            <li>✅ Mantenha os arquivos em local seguro</li>
                            <li>✅ Você pode baixar quantas vezes quiser</li>
                        </ul>
                    </div>
                </div>
                <div class="download-footer">
                    <button onclick="closeDownloadModal()" class="modal-btn secondary">
                        <i class="fas fa-times"></i>
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function addDownloadButtonToProduct(productId) {
    // Verificar se o usuário realmente comprou este produto
    if (!window.currentUser || !hasUserPurchasedProduct(window.currentUser.id, productId)) {
        return;
    }
    
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    if (!productCard) return;
    
    const buttonsContainer = productCard.querySelector('.product-buttons');
    if (!buttonsContainer) return;
    
    // Verificar se já existe botão de download
    if (buttonsContainer.querySelector('.download-btn')) return;
    
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'product-btn download-btn';
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> Baixar';
    downloadBtn.onclick = () => {
        const product = products.find(p => p.id === productId);
        if (product) {
            // Recuperar o modelo selecionado da compra do usuário
            const purchase = userDatabase.purchases.find(p => 
                p.userId === window.currentUser.id && 
                p.productId === productId && 
                p.status === 'confirmed'
            );
            
            // Anexar o modelo selecionado ao produto
            if (purchase && purchase.selectedModel) {
                product.selectedModel = purchase.selectedModel;
            }
            
            showDownloadModal(product);
        }
    };
    
    // Adicionar botão de download antes do botão de compra
    const buyBtn = buttonsContainer.querySelector('.buy-btn');
    if (buyBtn) {
        buttonsContainer.insertBefore(downloadBtn, buyBtn);
    } else {
        buttonsContainer.appendChild(downloadBtn);
    }
}

function updateProductCardsForUser() {
    if (!window.currentUser) return;
    
    // Atualizar todos os produtos comprados
    userDatabase.purchases.forEach(purchase => {
        if (purchase.userId === window.currentUser.id && purchase.status === 'confirmed') {
            addDownloadButtonToProduct(purchase.productId);
        }
    });
}


// Função para gerar descrição do produto
function getProductDescription(product) {
    const descriptions = {
        1: `<h4 style="color: #f28625; margin-top: 0; margin-bottom: 15px;">🎯 O que você recebe:</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Tela Privacy Nova - Versão 2025 Quase Idêntica</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Sistema de Entregável após confirmação de compra</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Coleta de dados para LTV (Lifetime Value)</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Dashboard própria com tracking de leads</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Sistema PIX integrado sem sair da landing page</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ QR Code automático e verificação em tempo real</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Galeria interativa com blur effects</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Hover autoplay nos vídeos</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Marca d'água personalizada</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Facebook Pixel configurado</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Lead tracking + UTM parameters</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Entrega imediata do código fonte</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Assets + documentação completa</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Fácil personalização (só trocar fotos/vídeos)</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px;">✅ Pronto para vender imediatamente</li>
            </ul>`,
        
        2: `<h4 style="color: #f28625; margin-top: 0; margin-bottom: 15px;">🎯 O que você recebe:</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Tela OnlyFans - Versão 2025 Quase Idêntica</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Sistema de Entregável após confirmação de compra</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Coleta de dados para LTV (Lifetime Value)</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Dashboard própria com tracking de leads</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Sistema PIX integrado sem sair da landing page</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ QR Code automático e verificação em tempo real</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Galeria interativa com blur effects</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Hover autoplay nos vídeos</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Marca d'água personalizada</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Facebook Pixel configurado</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Lead tracking + UTM parameters</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Entrega imediata do código fonte</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Assets + documentação completa</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Fácil personalização (só trocar fotos/vídeos)</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px;">✅ Pronto para vender imediatamente</li>
            </ul>`,
        
        3: `<h4 style="color: #f28625; margin-top: 0; margin-bottom: 15px;">🎯 O que você recebe:</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Tela Privacy Antiga - Tela Escalada, Funcional mas no modelo Antigo</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Sistema de Entregável após confirmação de compra</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Coleta de dados para LTV (Lifetime Value)</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Dashboard própria com tracking de leads</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Sistema PIX integrado sem sair da landing page</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ QR Code automático e verificação em tempo real</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Galeria interativa com blur effects</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Hover autoplay nos vídeos</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Marca d'água personalizada</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Facebook Pixel configurado</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Lead tracking + UTM parameters</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Entrega imediata do código fonte</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Assets + documentação completa</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Fácil personalização (só trocar fotos/vídeos)</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px;">✅ Pronto para vender imediatamente</li>
            </ul>`,
        
        3: `<h4 style="color: #f28625; margin-top: 0; margin-bottom: 15px;">🎯 O que você recebe:</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">🚀 Landing Page "Está a 5km de você" completa</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">🎯 Sistema de autohover e autoplay no fundo</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">🔗 Redirect personalizado para onde quiser</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">💥 Design otimizado para alta conversão</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">📱 Layout responsivo (mobile + desktop)</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">⚡ Carregamento ultra-rápido</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">🎨 Visual impactante e profissional</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">📊 Elementos de alta conversão</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">🔧 Fácil personalização</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">📈 Pronto para campanhas de marketing</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">🎯 Otimizado para vendas online</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">💻 Código fonte completo</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">📚 Documentação detalhada</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">🚀 Entrega imediata</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px;">✅ Suporte técnico incluso</li>
            </ul>`,
        
        4: `<h4 style="color: #f28625; margin-top: 0; margin-bottom: 15px;">🎯 O que você recebe:</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ App de Corte em Massa Profissional</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Remove logomarcas automaticamente</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Processa centenas de arquivos simultaneamente</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Interface super intuitiva e fácil</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Suporte completo a fotos e vídeos</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Economia de horas de trabalho</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Qualidade original preservada</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Processamento em lote inteligente</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Algoritmo de detecção avançado</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Múltiplos formatos suportados</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Resultados profissionais garantidos</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Entrega imediata do app</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Tutorial completo incluído</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Suporte técnico especializado</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px;">✅ Garantia de funcionamento 100%</li>
            </ul>`,
        
        5: `<h4 style="color: #f28625; margin-top: 0; margin-bottom: 15px;">🎯 O que você recebe:</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Solução personalizada para sua operação</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Desenvolvimento sob medida</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Ferramentas, sites e landing pages</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Consultoria especializada</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Atendimento via WhatsApp</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Análise completa da sua necessidade</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Proposta customizada</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Desenvolvimento exclusivo</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Suporte durante todo o processo</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Entrega personalizada</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Treinamento e documentação</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Garantia de funcionamento</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Manutenção e suporte contínuo</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Resultado exatamente como você precisa</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px;">✅ Parceria de longo prazo</li>
            </ul>`,
        
        6: `<h4 style="color: #f28625; margin-top: 0; margin-bottom: 15px;">🎯 O que você recebe:</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Coleção completa de modelos profissionais</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Mais de 100 templates exclusivos</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Designs testados e aprovados</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Maximizar conversões e vendas</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Escalar seu negócio</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Templates profissionais</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Modelos exclusivos</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Designs otimizados</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Alta conversão</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Pronto para usar</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Fácil personalização</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Entrega imediata</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Documentação completa</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333333;">✅ Suporte técnico</li>
                <li style="padding: 8px 0; color: #cccccc; font-size: 15px; display: flex; align-items: center; gap: 10px;">✅ Garantia de qualidade</li>
            </ul>`
    };
    
    return descriptions[product.id] || `<p>${product.description}</p>`;
}

// Função para gerar lista de features do produto
function getProductFeatures(product) {
    const features = {
        1: [
            'Tela Privacy Nova - Versão 2025 Quase Idêntica',
            'Sistema de Entregável após confirmação de compra',
            'Coleta de dados para LTV (Lifetime Value)',
            'Dashboard própria com tracking de leads',
            'Sistema PIX integrado sem sair da landing page',
            'QR Code automático e verificação em tempo real',
            'Galeria interativa com blur effects',
            'Hover autoplay nos vídeos',
            'Marca d\'água personalizada',
            'Facebook Pixel configurado',
            'Lead tracking + UTM parameters',
            'Entrega imediata do código fonte',
            'Assets + documentação completa',
            'Fácil personalização (só trocar fotos/vídeos)',
            'Pronto para vender imediatamente'
        ],
        
        2: [
            'Tela Privacy Antiga - Tela Escalada, Funcional mas no modelo Antigo',
            'Sistema de Entregável após confirmação de compra',
            'Coleta de dados para LTV (Lifetime Value)',
            'Dashboard própria com tracking de leads',
            'Sistema PIX integrado sem sair da landing page',
            'QR Code automático e verificação em tempo real',
            'Galeria interativa com blur effects',
            'Hover autoplay nos vídeos',
            'Marca d\'água personalizada',
            'Facebook Pixel configurado',
            'Lead tracking + UTM parameters',
            'Entrega imediata do código fonte',
            'Assets + documentação completa',
            'Fácil personalização (só trocar fotos/vídeos)',
            'Pronto para vender imediatamente'
        ],
        
        3: [
            'Landing Page "Está a 5km de você" completa',
            'Sistema de autohover e autoplay no fundo',
            'Redirect personalizado para onde quiser',
            'Design otimizado para alta conversão',
            'Layout responsivo (mobile + desktop)',
            'Carregamento ultra-rápido',
            'Visual impactante e profissional',
            'Elementos de alta conversão',
            'Fácil personalização',
            'Pronto para campanhas de marketing',
            'Otimizado para vendas online',
            'Código fonte completo',
            'Documentação detalhada',
            'Entrega imediata',
            'Suporte técnico incluso'
        ],
        
        4: [
            'App de Corte em Massa Profissional',
            'Remove logomarcas automaticamente',
            'Processa centenas de arquivos simultaneamente',
            'Interface super intuitiva e fácil',
            'Suporte completo a fotos e vídeos',
            'Economia de horas de trabalho',
            'Qualidade original preservada',
            'Processamento em lote inteligente',
            'Algoritmo de detecção avançado',
            'Múltiplos formatos suportados',
            'Resultados profissionais garantidos',
            'Entrega imediata do app',
            'Tutorial completo incluído',
            'Suporte técnico especializado',
            'Garantia de funcionamento 100%'
        ],
        
        5: [
            'Solução personalizada para sua operação',
            'Desenvolvimento sob medida',
            'Ferramentas, sites e landing pages',
            'Consultoria especializada',
            'Atendimento via WhatsApp',
            'Análise completa da sua necessidade',
            'Proposta customizada',
            'Desenvolvimento exclusivo',
            'Suporte durante todo o processo',
            'Entrega personalizada',
            'Treinamento e documentação',
            'Garantia de funcionamento',
            'Manutenção e suporte contínuo',
            'Resultado exatamente como você precisa',
            'Parceria de longo prazo'
        ],
        
        6: [
            '100+ Templates Profissionais',
            'Modelos de Landing Pages',
            'Templates de E-mail Marketing',
            'Designs para Redes Sociais',
            'Modelos de Apresentações',
            'Templates de Documentos',
            'Arquivos editáveis (PSD, AI, Figma)',
            'Suporte técnico incluso'
        ]
    };
    
    const productFeatures = features[product.id] || [
        'Produto de alta qualidade',
        'Entrega automática',
        'Suporte técnico',
        'Garantia de 30 dias'
    ];
    
    return productFeatures.map(feature => `<li>${feature}</li>`).join('');
}

// Sistema de Seleção de Modelos
let selectedModel = null;
let currentProductForModels = null;

async function showModelSelectionModal(product) {
    currentProductForModels = product;
    const modal = document.getElementById('modelSelectionModal');
    if (!modal) {
        createModelSelectionModal();
    }
    
    // Atualizar título e preço
    document.getElementById('modelProductName').textContent = product.title;
    document.getElementById('modelProductPrice').textContent = product.price;
    
    // Usar modelos únicos (sem duplicatas)
    let modelosParaRenderizar = product.models;
    
    // Se temos CARROSSEL_MODELOS_CONFIG, usar os modelos únicos de lá
    if (typeof CARROSSEL_MODELOS_CONFIG !== 'undefined' && CARROSSEL_MODELOS_CONFIG && CARROSSEL_MODELOS_CONFIG.modelos) {
        // Remover duplicatas se a função estiver disponível
        if (typeof removerModelosDuplicados === 'function') {
            modelosParaRenderizar = removerModelosDuplicados(CARROSSEL_MODELOS_CONFIG.modelos);
        } else {
            modelosParaRenderizar = CARROSSEL_MODELOS_CONFIG.modelos;
        }
        console.log('Usando modelos únicos da configuração:', modelosParaRenderizar);
    } else {
        console.log('Usando modelos do produto:', product.models);
    }
    
    // Renderizar modelos
    renderModels(modelosParaRenderizar);
    
    // Mostrar modal
    document.getElementById('modelSelectionModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function createModelSelectionModal() {
    const modalHTML = `
        <div id="modelSelectionModal" class="modal">
            <div class="modal-content model-selection-modal">
                <div class="model-selection-header">
                    <div class="model-selection-icon">👥</div>
                    <h2>Selecione um Modelo</h2>
                    <p>Escolha o modelo que melhor se adequa ao seu produto</p>
                </div>
                <div class="model-selection-body">
                    <div class="product-info">
                        <h3 id="modelProductName">Produto</h3>
                        <p class="product-price" id="modelProductPrice">R$ 0,00</p>
                    </div>
                    
                    <div class="models-carousel-container">
                        <div class="models-carousel" id="modelsCarousel">
                            <!-- Modelos serão renderizados aqui -->
                        </div>
                        <div class="carousel-controls">
                            <button class="carousel-btn prev-btn" onclick="previousModel()">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <button class="carousel-btn next-btn" onclick="nextModel()">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="selected-model-info" id="selectedModelInfo" style="display: none;">
                        <h4>Modelo Selecionado:</h4>
                        <div class="selected-model-details">
                            <img id="selectedModelImage" src="" alt="Modelo selecionado" class="selected-model-img">
                            <div class="selected-model-text">
                                <h5 id="selectedModelName"></h5>
                                <p id="selectedModelDescription"></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="model-selection-footer">
                    <button onclick="closeModelSelectionModal()" class="modal-btn secondary">
                        <i class="fas fa-times"></i>
                        Cancelar
                    </button>
                    <button onclick="confirmModelSelection()" class="modal-btn primary" id="confirmModelBtn" disabled>
                        <i class="fas fa-check"></i>
                        Confirmar Modelo
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function renderModels(models) {
    const carousel = document.getElementById('modelsCarousel');
    carousel.innerHTML = '';
    
    // Remover duplicatas antes de renderizar
    const modelosUnicos = removerDuplicatasLocais(models);
    
    // Garantir que cada modelo seja renderizado como um quadradinho separado
    modelosUnicos.forEach((model, index) => {
        const modelCard = document.createElement('div');
        modelCard.className = 'model-card';
        modelCard.setAttribute('data-model-id', model.id);
        modelCard.style.flex = '0 0 300px'; // Garantir tamanho fixo
        modelCard.style.minWidth = '300px'; // Garantir largura mínima
        modelCard.style.maxWidth = '300px'; // Garantir largura máxima
        
        const modelImage = model.imagem || model.image;
        const modelName = model.nome || model.name;
        const modelDescription = model.descricao || model.description;
        
        // Verificar se é a modelo Latoxicasz para adicionar a badge
        const videoBadge = (modelName.toLowerCase().includes('latoxicasz')) ? `
            <div class="video-call-badge">
                <i class="fas fa-video"></i>
                Tem Chamada de Vídeo
            </div>
        ` : '';
        
        modelCard.innerHTML = `
            <div class="model-image-container">
                ${videoBadge}
                <img src="${modelImage}" alt="${modelName}" class="model-image" 
                     onerror="this.src='../assets/imagens/modelos-escaladas.jpg'">
                <div class="model-overlay">
                    <button onclick="selectModel(${model.id})" class="select-model-btn">
                        <i class="fas fa-eye"></i>
                        Visualizar
                    </button>
                    <button onclick="selectModelAndBuy(${model.id})" class="select-and-buy-btn">
                        <i class="fas fa-shopping-cart"></i>
                        Selecionar e Comprar
                    </button>
                </div>
            </div>
            <div class="model-info">
                <h4 class="model-name">${modelName}</h4>
                <p class="model-description">${modelDescription}</p>
            </div>
        `;
        
        carousel.appendChild(modelCard);
    });
    
    console.log(`Renderizados ${modelosUnicos.length} modelos únicos (${models.length - modelosUnicos.length} duplicatas removidas)`);
    
    // Inicializar carrossel
    initializeCarousel();
}

// Função local para remover duplicatas
function removerDuplicatasLocais(models) {
    const modelosUnicos = [];
    const nomesUsados = new Set();
    const imagensUsadas = new Set();
    
    for (const modelo of models) {
        const nomeModelo = modelo.nome || modelo.name;
        const imagemModelo = modelo.imagem || modelo.image;
        
        // Verificar se o nome ou a imagem já foram usados
        if (!nomesUsados.has(nomeModelo) && !imagensUsadas.has(imagemModelo)) {
            modelosUnicos.push(modelo);
            nomesUsados.add(nomeModelo);
            imagensUsadas.add(imagemModelo);
        }
    }
    
    return modelosUnicos;
}

function selectModel(modelId) {
    const product = currentProductForModels;
    
    // Buscar modelo tanto em product.models quanto em CARROSSEL_MODELOS_CONFIG.modelos
    let modelsList = product.models;
    if (typeof CARROSSEL_MODELOS_CONFIG !== 'undefined' && CARROSSEL_MODELOS_CONFIG && CARROSSEL_MODELOS_CONFIG.modelos) {
        modelsList = CARROSSEL_MODELOS_CONFIG.modelos;
    }
    
    const model = modelsList.find(m => m.id === modelId);
    
    if (model) {
        selectedModel = model;
        
        // Atualizar UI
        const previewImage = model.imagemPreview || model.imagem || model.image;
        document.getElementById('selectedModelImage').src = previewImage;
        document.getElementById('selectedModelName').textContent = model.nome || model.name;
        document.getElementById('selectedModelDescription').textContent = model.descricao || model.description;
        document.getElementById('selectedModelInfo').style.display = 'block';
        
        // Mostrar todas as imagens de preview disponíveis
        showAllPreviewImages();
        
        // Habilitar botão de confirmação
        document.getElementById('confirmModelBtn').disabled = false;
        
        // Destacar modelo selecionado
        document.querySelectorAll('.model-card').forEach(card => {
            card.classList.remove('selected');
        });
        const selectedCard = document.querySelector(`[data-model-id="${modelId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
            
            // Scroll para o modelo selecionado
            selectedCard.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
        
        console.log('✅ Modelo selecionado:', model);
    } else {
        console.error('❌ Modelo não encontrado com ID:', modelId);
    }
}

// Utilitário: normalizar nome do modelo para slug usado nos arquivos
function slugifyModelName(name) {
    if (!name) return '';
    return name
        .normalize('NFD').replace(/\p{Diacritic}/gu, '') // remover acentos
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '');
}

// Obter previews da modelo usando padrão de nome de arquivo (nomemodelo (1).jpg, (2).jpg, etc.)
function obterPreviewsDaModelo(modelName, maxImagens = 24) {
    const slug = slugifyModelName(modelName);
    const previews = [];
    
    // Gerar caminhos para as imagens numeradas da modelo
    // Ex: catgirl (1).jpg, catgirl (2).jpg, etc.
    for (let i = 1; i <= maxImagens; i++) {
        const caminhos = [
            `../assets/modelos/modelos - preview/${slug} (${i}).jpg`,
            `../assets/modelos/Modelos - Preview/${slug} (${i}).jpg`
        ];
        
        // Usa o primeiro caminho por padrão (a validação será feita no onerror da img)
        previews.push({
            index: i,
            src: caminhos[1] // usa o caminho com maiúscula primeiro
        });
    }
    
    return previews;
}

function showAllPreviewImages() {
    // Criar container para todas as imagens de preview
    const selectedModelInfo = document.getElementById('selectedModelInfo');
    if (!selectedModelInfo) {
        console.warn('selectedModelInfo não encontrado');
        return;
    }
    
    // Verificar se já existe o container de previews
    let previewContainer = document.getElementById('allPreviewImages');
    if (!previewContainer) {
        previewContainer = document.createElement('div');
        previewContainer.id = 'allPreviewImages';
        previewContainer.className = 'all-preview-images';
        previewContainer.style.marginTop = '20px';
        previewContainer.style.padding = '15px';
        previewContainer.style.background = 'rgba(242, 134, 37, 0.1)';
        previewContainer.style.borderRadius = '10px';
        previewContainer.style.border = '1px solid rgba(242, 134, 37, 0.2)';
        selectedModelInfo.appendChild(previewContainer);
    }
    
    // Limpar container anterior
    previewContainer.innerHTML = '';
    
    // Adicionar título
    const title = document.createElement('h4');
    title.textContent = 'Todas as Versões Disponíveis:';
    title.style.color = '#f28625';
    title.style.marginBottom = '15px';
    title.style.fontSize = '16px';
    title.style.fontWeight = '600';
    previewContainer.appendChild(title);
    
    // Criar grid de imagens (6 por linha, miniaturas pequenas)
    const imageGrid = document.createElement('div');
    imageGrid.className = 'preview-images-grid';
    imageGrid.style.display = 'grid';
    imageGrid.style.gridTemplateColumns = 'repeat(6, 1fr)';
    imageGrid.style.gap = '8px';
    imageGrid.style.marginTop = '10px';
    imageGrid.style.maxHeight = '300px';
    imageGrid.style.overflowY = 'auto';

    // Buscar apenas as imagens da modelo selecionada (Catgirl 1..N, etc.)
    const nomeModelo = selectedModel ? (selectedModel.nome || selectedModel.name) : null;
    let previews = [];
    if (nomeModelo) {
        previews = obterPreviewsDaModelo(nomeModelo);
    }

    // Fallback: se não encontrar variações, mostrar ao menos a imagem principal do modelo
    if (!previews.length && selectedModel) {
        const fallback = selectedModel.imagemPreview || selectedModel.image;
        if (fallback) {
            previews = [{ index: 1, src: fallback }];
        }
    }

    // Se ainda não tiver previews, mostrar mensagem
    if (!previews.length) {
        const noImages = document.createElement('p');
        noImages.textContent = 'Nenhuma versão disponível para visualização.';
        noImages.style.color = '#999';
        noImages.style.textAlign = 'center';
        noImages.style.padding = '20px';
        previewContainer.appendChild(noImages);
        return;
    }

    previews.forEach(item => {
        if (!item.src) return; // pular se não tiver src válido
        
        const imageContainer = document.createElement('div');
        imageContainer.className = 'preview-image-item';
        imageContainer.style.position = 'relative';
        imageContainer.style.borderRadius = '8px';
        imageContainer.style.overflow = 'hidden';
        imageContainer.style.border = '2px solid transparent';
        imageContainer.style.cursor = 'pointer';
        imageContainer.style.transition = 'all 0.3s ease';
        imageContainer.style.background = '#2a2a2a';

        const img = document.createElement('img');
        img.src = item.src;
        img.alt = nomeModelo || 'preview';
        img.style.width = '100%';
        img.style.height = '80px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '6px';
        img.onerror = function() {
            // Se a imagem não existir, esconde o container (não mostra fallback)
            imageContainer.style.display = 'none';
        };

        imageContainer.appendChild(img);

        imageContainer.onmouseenter = function() {
            this.style.borderColor = 'rgba(242, 134, 37, 0.5)';
            this.style.transform = 'scale(1.02)';
        };
        
        imageContainer.onmouseleave = function() {
            this.style.borderColor = 'transparent';
            this.style.transform = 'scale(1)';
        };

        imageGrid.appendChild(imageContainer);
    });

    previewContainer.appendChild(imageGrid);
}

// Nova função: selecionar modelo e ir direto para compra
function selectModelAndBuy(modelId) {
    console.log('🛒 selectModelAndBuy chamado para modelo ID:', modelId);
    
    const product = currentProductForModels;
    
    if (!product) {
        console.error('❌ currentProductForModels não está definido');
        return;
    }
    
    // Buscar modelo
    let modelsList = product.models;
    if (typeof CARROSSEL_MODELOS_CONFIG !== 'undefined' && CARROSSEL_MODELOS_CONFIG && CARROSSEL_MODELOS_CONFIG.modelos) {
        modelsList = CARROSSEL_MODELOS_CONFIG.modelos;
    }
    
    const model = modelsList.find(m => m.id === modelId);
    
    if (!model) {
        console.error('❌ Modelo não encontrado com ID:', modelId);
        return;
    }
    
    console.log('✅ Modelo encontrado:', model.nome || model.name);
    
    // Definir modelo selecionado
    selectedModel = model;
    
    // Verificar se usuário está logado
    if (!window.currentUser) {
        // Salvar produto pendente para compra após login
        pendingPurchase = {
            productId: currentProductForModels.id,
            product: currentProductForModels,
            selectedModel: selectedModel,
            timestamp: new Date()
        };
        
        console.log('⚠️ Usuário não logado, fechando modal e mostrando login...');
        // Fechar modal de seleção
        closeModelSelectionModal();
        
        // Pequeno delay antes de mostrar o modal de login
        setTimeout(() => {
            showLoginRequiredModal(currentProductForModels);
        }, 300);
        return;
    }
    
    // Usuário logado - prosseguir com compra
    console.log('✅ Usuário logado, prosseguindo com compra...');
    
    cartCount++;
    updateCartCount();
    
    // Adicionar modelo selecionado ao produto
    product.selectedModel = selectedModel;
    
    console.log('🎯 Preparando para abrir modal de pagamento...');
    console.log('📦 Produto:', product.title);
    console.log('💰 Valor:', product.price);
    console.log('👤 Modelo:', selectedModel.nome || selectedModel.name);
    console.log('🔑 ID do produto:', product.id);
    
    // Fechar modal de seleção mas manter os dados
    closeModelSelectionModal(true);
    
    // Aguardar um pouco para garantir que o modal fechou
    setTimeout(() => {
        console.log('🚀 Abrindo modal de pagamento agora...');
        openPaymentModal(product);
        
        // Verificar se o modal foi aberto
        setTimeout(() => {
            const paymentModal = document.getElementById('paymentModal');
            if (paymentModal && paymentModal.style.display === 'block') {
                console.log('✅ Modal de pagamento aberto com sucesso!');
            } else {
                console.error('❌ Modal de pagamento NÃO foi aberto. Estado:', paymentModal?.style.display);
                console.error('📋 Elementos do modal:', {
                    modal: !!paymentModal,
                    productName: !!document.getElementById('productName'),
                    productPrice: !!document.getElementById('productPrice')
                });
            }
        }, 100);
    }, 400);
}

function confirmModelSelection() {
    if (selectedModel && currentProductForModels) {
        // Fechar modal de seleção mas manter os dados
        closeModelSelectionModal(true);
        
        // Verificar se usuário está logado
        if (!window.currentUser) {
            // Salvar produto pendente para compra após login
            pendingPurchase = {
                productId: currentProductForModels.id,
                product: currentProductForModels,
                selectedModel: selectedModel,
                timestamp: new Date()
            };
            
            // Mostrar modal de login obrigatório
            showLoginRequiredModal(currentProductForModels);
            return;
        }
        
        // Usuário logado - prosseguir com compra
        cartCount++;
        updateCartCount();
        
        // Adicionar modelo selecionado ao produto
        currentProductForModels.selectedModel = selectedModel;
        
        console.log('🎯 Abrindo modal de pagamento para:', currentProductForModels.title);
        console.log('💰 Valor:', currentProductForModels.price);
        console.log('👤 Modelo selecionado:', selectedModel.nome || selectedModel.name);
        
        openPaymentModal(currentProductForModels);
    }
}

function closeModelSelectionModal(keepData = false) {
    const modal = document.getElementById('modelSelectionModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Só limpar dados se não for para manter (keepData = false)
        if (!keepData) {
            selectedModel = null;
            currentProductForModels = null;
        }
    }
}

// Controles do carrossel
let currentSlide = 0;

function initializeCarousel() {
    const carousel = document.getElementById('modelsCarousel');
    const totalSlides = carousel.children.length;
    
    // Garantir que o carrossel tenha largura suficiente para todos os modelos
    const cardWidth = 300; // Largura de cada card
    const gap = 20; // Gap entre os cards
    const totalWidth = (cardWidth + gap) * totalSlides - gap;
    
    // Ajustar largura do carrossel baseado no número de slides
    if (totalSlides <= 3) {
        carousel.style.justifyContent = 'center';
        carousel.style.width = '100%';
        // Se há 3 ou menos modelos, esconder controles
        document.querySelector('.carousel-controls').style.display = 'none';
    } else {
        carousel.style.justifyContent = 'flex-start';
        carousel.style.width = `${totalWidth}px`;
        document.querySelector('.carousel-controls').style.display = 'flex';
    }
    
    // Garantir que cada card tenha o tamanho correto
    const cards = carousel.children;
    for (let i = 0; i < cards.length; i++) {
        cards[i].style.flex = '0 0 300px';
        cards[i].style.minWidth = '300px';
        cards[i].style.maxWidth = '300px';
    }
    
    currentSlide = 0;
    updateCarouselPosition();
}

function nextModel() {
    const carousel = document.getElementById('modelsCarousel');
    const models = currentProductForModels.models;
    const maxSlide = Math.max(0, models.length - 3);
    
    if (currentSlide < maxSlide) {
        currentSlide++;
        updateCarouselPosition();
    }
}

function previousModel() {
    if (currentSlide > 0) {
        currentSlide--;
        updateCarouselPosition();
    }
}

function updateCarouselPosition() {
    const carousel = document.getElementById('modelsCarousel');
    const config = (typeof CARROSSEL_MODELOS_CONFIG !== 'undefined' && CARROSSEL_MODELOS_CONFIG) ? CARROSSEL_MODELOS_CONFIG.carrossel : { larguraSlide: 320 };
    const slideWidth = config.larguraSlide;
    carousel.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
}

// Sistema de Contador de Compras
function initializePurchaseCounter() {
    try {
        // Carregar total de compras do localStorage
        const totalComprasSalvo = localStorage.getItem('totalCompras');
        
        if (totalComprasSalvo) {
            const statNumber = document.querySelector('.stat-card .stat-number');
            if (statNumber) {
                statNumber.textContent = totalComprasSalvo;
                console.log('📊 Contador de compras carregado:', totalComprasSalvo);
            }
        }
        
        console.log('📊 Sistema de contador de compras inicializado');
    } catch (error) {
        console.error('❌ Erro ao inicializar contador de compras:', error);
    }
}

// Função para incrementar contador manualmente (para testes)
function incrementarContadorManual() {
    const statNumber = document.querySelector('.stat-card .stat-number');
    if (statNumber) {
        const valorAtual = parseInt(statNumber.textContent) || 388;
        const novoValor = valorAtual + 1;
        statNumber.textContent = novoValor;
        localStorage.setItem('totalCompras', novoValor.toString());
        
        // Adicionar animação
        statNumber.style.transform = 'scale(1.1)';
        statNumber.style.color = '#f28625';
        statNumber.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            statNumber.style.transform = 'scale(1)';
            statNumber.style.color = '';
        }, 1000);
        
        console.log('📊 Contador incrementado manualmente:', valorAtual, '→', novoValor);
    }
}

// Sistema de Notificações de Prova Social
function initializeSocialProofNotifications() {
    const nomes = [
        'João P.', 'Maria S.', 'Pedro L.', 'Ana C.', 'Carlos R.', 'Juliana M.',
        'Rafael T.', 'Beatriz F.', 'Lucas O.', 'Camila N.', 'Fernando D.', 'Patricia V.',
        'Gabriel A.', 'Larissa B.', 'Ricardo H.', 'Amanda K.', 'Thiago W.', 'Mariana E.',
        'Bruno Q.', 'Isabela G.', 'Rodrigo X.', 'Fernanda Y.', 'Diego Z.', 'Leticia J.'
    ];
    
    const produtosPopulares = [
        'Tela Privacy Nova',
        'Tela OnlyFans',
        'Tela Privacy Antiga',
        'Modelos Pra Escalar',
        'Landing Page',
        'Corte de Mídias'
    ];
    
    function mostrarNotificacaoCliente() {
        const nome = nomes[Math.floor(Math.random() * nomes.length)];
        const produto = produtosPopulares[Math.floor(Math.random() * produtosPopulares.length)];
        
        const notification = document.createElement('div');
        notification.className = 'social-proof-notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
            z-index: 9999;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            min-width: 280px;
            border: 1px solid rgba(242, 134, 37, 0.3);
            animation: slideInLeft 0.5s ease-out, slideOutLeft 0.5s ease-in 4.5s;
            display: flex;
            align-items: center;
            gap: 12px;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 28px;">🛒</div>
            <div style="flex: 1;">
                <div style="font-weight: 600; font-size: 14px; margin-bottom: 3px;">
                    ${nome} <span style="color: #f28625;">se tornou cliente</span>
                </div>
                <div style="font-size: 12px; color: #aaa;">
                    Comprou: ${produto}
                </div>
            </div>
        `;
        
        // Adicionar CSS de animação se não existir
        if (!document.getElementById('socialProofStyles')) {
            const style = document.createElement('style');
            style.id = 'socialProofStyles';
            style.textContent = `
                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes slideOutLeft {
                    from {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(-100%);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Remover após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
    
    // Mostrar primeira notificação após 5 segundos
    setTimeout(() => {
        mostrarNotificacaoCliente();
    }, 5000);
    
    // Mostrar notificações a cada 15-25 segundos (aleatório)
    setInterval(() => {
        const delay = 15000 + Math.random() * 10000; // 15-25 segundos
        setTimeout(() => {
            mostrarNotificacaoCliente();
        }, delay);
    }, 25000);
}

// ========================================
// WHATSAPP
// ========================================
function contactWhatsApp() {
    const message = "Olá! Gostaria de fazer uma encomenda personalizada.";
    const phone = "5571992926937";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Exportar funções para uso global
window.addToCart = addToCart;
window.searchProducts = searchProducts;
window.validateForm = validateForm;
window.openPreview = openPreview;
window.closeModal = closeModal;
window.testVideo = testVideo;
window.openPaymentModal = openPaymentModal;
window.closePaymentModal = closePaymentModal;
window.selectPaymentMethod = selectPaymentMethod;
window.createPayment = createPayment;
window.copyPixCode = copyPixCode;
window.showCopyNotification = showCopyNotification;
window.switchTab = switchTab;
window.showModelSelectionModal = showModelSelectionModal;
window.selectModel = selectModel;
window.selectModelAndBuy = selectModelAndBuy;
window.confirmModelSelection = confirmModelSelection;
window.closeModelSelectionModal = closeModelSelectionModal;
window.nextModel = nextModel;
window.previousModel = previousModel;
window.incrementarContadorManual = incrementarContadorManual;
window.simulatePaymentConfirmation = simulatePaymentConfirmation;
window.updateProductCardsForUser = updateProductCardsForUser;
window.hasUserPurchasedProduct = hasUserPurchasedProduct;
window.addDownloadButtonToProduct = addDownloadButtonToProduct;
window.contactWhatsApp = contactWhatsApp;
window.products = products; // TORNA O ARRAY DE PRODUTOS GLOBALMENTE ACESSÍVEL
// Exportar funções de formatação de telefone
window.formatPhoneNumber = formatPhoneNumber;
window.applyPhoneMask = applyPhoneMask;
window.unformatPhoneNumber = unformatPhoneNumber;

