// ============================================
// CONFIGURAÇÃO DO LINK DE ENTREGA
// ============================================
// Altere o link abaixo para o seu produto/conteúdo
const DELIVERY_CONFIG = {
    // Link padrão para todos os planos
    defaultLink: 'https://www.example.com/seu-conteudo',
    
    // Ou links diferentes por plano (opcional)
    planLinks: {
        'Mensal': 'https://www.example.com/mensal',
        'Trimestral': 'https://www.example.com/trimestral',
        'Anual': 'https://www.example.com/anual'
    },
    
    // Usar links específicos por plano? (true/false)
    usePlanSpecificLinks: false
};

// Toggle de pacotes de assinatura
document.addEventListener('DOMContentLoaded', function() {
    const packageToggle = document.querySelector('.package-toggle');
    const packagesList = document.querySelector('.packages-list');
    
    if (packageToggle && packagesList) {
        // Inicialmente mostrar os pacotes
        let isOpen = true;
        
        packageToggle.addEventListener('click', function() {
            isOpen = !isOpen;
            
            if (isOpen) {
                packagesList.style.display = 'flex';
                packageToggle.querySelector('i').className = 'fas fa-chevron-up';
            } else {
                packagesList.style.display = 'none';
                packageToggle.querySelector('i').className = 'fas fa-chevron-down';
            }
        });
    }
    
    // Adicionar animação suave ao scroll
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
    
    // Sistema de Tabs (POSTAGENS / MÍDIA)
    const tabs = document.querySelectorAll('.tab');
    const postsContent = document.getElementById('postsContent');
    const mediaContent = document.getElementById('mediaContent');
    
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', function() {
            // Remove active de todas as tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Adiciona active na tab clicada
            this.classList.add('active');
            
            // Alterna o conteúdo
            if (index === 0) {
                // Tab POSTAGENS
                postsContent.classList.remove('hidden');
                mediaContent.classList.add('hidden');
            } else {
                // Tab MÍDIA
                postsContent.classList.add('hidden');
                mediaContent.classList.remove('hidden');
            }
        });
    });
    
    // Autoplay de vídeos na grade ao passar o mouse
    const mediaItems = document.querySelectorAll('.media-item');
    mediaItems.forEach(item => {
        const video = item.querySelector('video');
        
        if (video) {
            // Play ao passar o mouse
            item.addEventListener('mouseenter', () => {
                video.play().catch(err => console.log('Erro ao reproduzir:', err));
            });
            
            // Pause ao tirar o mouse
            item.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0; // Volta ao início
            });
        }
    });
    
    // Animação de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Aplicar animação aos cards
    const animatedElements = document.querySelectorAll('.subscription-section, .locked-content, .subscription-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
    
    // Adicionar efeito de ripple nos botões
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Adicionar contador de likes animado
    const likeCount = document.querySelector('.profile-header-stats .stat-item:last-child');
    if (likeCount) {
        let count = 0;
        const target = 193100;
        const duration = 2000;
        const increment = target / (duration / 16);
        
        const updateCount = () => {
            count += increment;
            if (count < target) {
                const formatted = (count / 1000).toFixed(1) + 'K';
                requestAnimationFrame(updateCount);
            } else {
                const formatted = '193.1K';
            }
        };
        
        // Comentado para não sobrescrever o HTML
        // updateCount();
    }
    
    // Adicionar efeito parallax no banner
    const banner = document.querySelector('.profile-banner img');
    if (banner) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            banner.style.transform = `translate3d(0, ${rate}px, 0)`;
        });
    }
    
    // Notificações toast (exemplo)
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, var(--primary-blue), #0095d4);
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            font-weight: bold;
            z-index: 10000;
            animation: slideUp 0.3s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // Adicionar CSS para ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes slideUp {
            from {
                transform: translate(-50%, 100px);
                opacity: 0;
            }
            to {
                transform: translate(-50%, 0);
                opacity: 1;
            }
        }
        
        @keyframes slideDown {
            from {
                transform: translate(-50%, 0);
                opacity: 1;
            }
            to {
                transform: translate(-50%, 100px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    
    // Sistema de favoritos
    const starBtns = document.querySelectorAll('.icon-btn .fa-star');
    starBtns.forEach(btn => {
        btn.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            if (btn.classList.contains('far')) {
                btn.classList.remove('far');
                btn.classList.add('fas');
                btn.style.color = '#FFD700';
                showToast('Added to favorites! ⭐');
            } else {
                btn.classList.remove('fas');
                btn.classList.add('far');
                btn.style.color = '';
                showToast('Removed from favorites');
            }
        });
    });
    
    // Sistema de desbloqueio de conteúdo
    const unlockBtn = document.getElementById('unlockBtn');
    const lockOverlay = document.getElementById('lockOverlay');
    const previewVideo = document.getElementById('previewVideo');
    
    // Garante que o vídeo carregue e comece a tocar
    const videoElement = document.querySelector('.preview-video video');
    if (videoElement) {
        videoElement.load();
        
        // Tenta dar play automaticamente
        videoElement.play().catch(err => {
            console.log('Autoplay bloqueado, aguardando interação:', err);
        });
        
        // Play ao passar o mouse (hover)
        const lockedContent = document.getElementById('lockedContent');
        if (lockedContent) {
            lockedContent.addEventListener('mouseenter', () => {
                videoElement.play().catch(err => console.log('Erro ao dar play:', err));
            });
        }
        
        // Play ao clicar em qualquer lugar da área
        if (lockedContent) {
            lockedContent.addEventListener('click', () => {
                if (videoElement.paused) {
                    videoElement.play();
                }
            });
        }
        
        // Debug: verifica se o vídeo está carregando
        videoElement.addEventListener('loadeddata', () => {
            console.log('Vídeo carregado com sucesso!');
            // Força o play quando carregar
            videoElement.play().catch(() => {});
        });
        
        videoElement.addEventListener('error', (e) => {
            console.error('Erro ao carregar vídeo:', e);
        });
        
        videoElement.addEventListener('playing', () => {
            console.log('Vídeo está tocando!');
        });
    }
    
    if (unlockBtn && lockOverlay && previewVideo) {
        unlockBtn.addEventListener('click', function() {
            // Remove o overlay
            lockOverlay.classList.add('hidden');
            
            // Remove o blur do vídeo
            setTimeout(() => {
                previewVideo.classList.remove('blurred');
            }, 100);
            
            // Mostra notificação
            showToast('Content unlocked! 🔓');
            
            // Opcional: depois de 3 segundos, volta a bloquear
            // setTimeout(() => {
            //     lockOverlay.classList.remove('hidden');
            //     previewVideo.classList.add('blurred');
            //     showToast('Conteúdo bloqueado novamente! 🔒');
            // }, 3000);
        });
    }
    
    // Também adiciona funcionalidade aos botões de assinatura
    const subscribeBtns = document.querySelectorAll('.subscribe-btn, .subscribe-btn-small');
    subscribeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Simula desbloqueio ao clicar em assinar
            if (lockOverlay && previewVideo) {
                lockOverlay.classList.add('hidden');
                setTimeout(() => {
                    previewVideo.classList.remove('blurred');
                }, 100);
                showToast('Welcome! Content unlocked! 🎉');
            }
        });
    });
});

// Função para formatar números
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Atualizar contadores dinamicamente
function updateStats() {
    const stats = {
        photos: 388,
        videos: 67,
        streams: 33,
        likes: 193100
    };
    
    // Aqui você pode adicionar lógica para atualizar dinamicamente
}

// Listener para o botão de voltar
const backBtn = document.querySelector('.back-btn');
if (backBtn) {
    backBtn.addEventListener('click', function() {
        window.history.back();
    });
}

// Listener para o botão de ajuda
const helpBtn = document.querySelector('.help-btn');
if (helpBtn) {
    helpBtn.addEventListener('click', function() {
        alert('How can we help you?');
    });
}

// ============================================
// STRIPE PAYMENT SYSTEM + BACKEND
// ============================================

// Backend API URL
const API_URL = 'http://localhost:3000/api';

// Enhanced blur protection system
function applyBlurProtection() {
    console.log('🔒 Applying blur protection...');
    
    // Ensure central video is blurred
    const previewVideo = document.getElementById('previewVideo');
    if (previewVideo) {
        previewVideo.classList.add('blurred');
        
        const video = previewVideo.querySelector('video');
        if (video) {
            video.style.filter = 'blur(8px) brightness(0.8) saturate(0.8)';
            video.style.transform = 'scale(1.05)';
            video.style.pointerEvents = 'none';
            video.style.userSelect = 'none';
            video.style.webkitUserSelect = 'none';
            video.style.mozUserSelect = 'none';
            video.style.msUserSelect = 'none';
            video.style.opacity = '0.8';
        }
        
        console.log('✅ Central video blurred');
    }
    
    // Ensure all media items are blurred
    const mediaItems = document.querySelectorAll('.media-item');
    mediaItems.forEach((item, index) => {
        item.classList.add('blurred');
        
        const img = item.querySelector('img');
        const video = item.querySelector('video');
        
        if (img) {
            img.style.filter = 'blur(5px) brightness(0.8) saturate(0.8)';
            img.style.pointerEvents = 'none';
            img.style.userSelect = 'none';
            img.style.webkitUserSelect = 'none';
            img.style.mozUserSelect = 'none';
            img.style.msUserSelect = 'none';
            img.style.opacity = '0.8';
        }
        
        if (video) {
            video.style.filter = 'blur(5px) brightness(0.8) saturate(0.8)';
            video.style.pointerEvents = 'none';
            video.style.userSelect = 'none';
            video.style.webkitUserSelect = 'none';
            video.style.mozUserSelect = 'none';
            video.style.msUserSelect = 'none';
            video.style.opacity = '0.8';
        }
        
        // Show overlay
        const overlay = item.querySelector('.media-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
        
        console.log(`✅ Media item ${index + 1} blurred`);
    });
    
    // Ensure lock overlay is visible
    const lockOverlay = document.getElementById('lockOverlay');
    if (lockOverlay) {
        lockOverlay.style.display = 'flex';
        lockOverlay.classList.remove('hidden');
        console.log('✅ Lock overlay shown');
    }
    
    // Disable video controls
    const videos = document.querySelectorAll('video');
    videos.forEach((video, index) => {
        video.controls = false;
        video.style.pointerEvents = 'none';
        console.log(`✅ Video ${index + 1} controls disabled`);
    });
    
    // Force a reflow to ensure styles are applied
    document.body.offsetHeight;
    
    console.log('🔒 Blur protection applied successfully!');
}

// Check if user has already paid when loading the page
async function checkPaymentStatus() {
    // Check if there's a saved email
    const savedEmail = localStorage.getItem('user_email');
    
    if (savedEmail) {
        try {
            const response = await fetch(`${API_URL}/subscription-status/${encodeURIComponent(savedEmail)}`);
            const data = await response.json();
            
            if (data.success && data.hasActiveSubscription) {
                unlockAllContent();
                showPaymentStatus(data.subscription);
                return;
            }
        } catch (error) {
            console.error('Error checking status:', error);
            // Apply blur protection if there's an error
            applyBlurProtection();
        }
    }
    
    // Fallback: check old localStorage
    const hasPaid = localStorage.getItem('subscription_active');
    if (hasPaid === 'true') {
        unlockAllContent();
        showPaymentStatus(null);
    } else {
        // Apply blur protection if user hasn't paid
        applyBlurProtection();
    }
}

// Enhanced unlock all content function with multiple blur protection layers
function unlockAllContent() {
    console.log('🔓 Unlocking all content...');
    
    // Remove blur from central video with multiple attempts
    const previewVideo = document.getElementById('previewVideo');
    if (previewVideo) {
        // Remove blur class
        previewVideo.classList.remove('blurred');
        
        // Force remove any inline styles that might override
        const video = previewVideo.querySelector('video');
        if (video) {
            video.style.filter = 'none';
            video.style.transform = 'none';
            video.style.pointerEvents = 'auto';
            video.style.userSelect = 'auto';
            video.style.webkitUserSelect = 'auto';
            video.style.mozUserSelect = 'auto';
            video.style.msUserSelect = 'auto';
            video.style.opacity = '1';
        }
        
        // Remove any pseudo-element overlays
        previewVideo.style.setProperty('--blur-overlay', 'none');
        
        console.log('✅ Central video unlocked');
    }
    
    // Hide the lock overlay
    const lockOverlay = document.getElementById('lockOverlay');
    if (lockOverlay) {
        lockOverlay.style.display = 'none';
        lockOverlay.classList.add('hidden');
        console.log('✅ Lock overlay hidden');
    }
    
    // Remove blur from all media grid items with multiple attempts
    const mediaItems = document.querySelectorAll('.media-item');
    mediaItems.forEach((item, index) => {
        // Remove blur class
        item.classList.remove('blurred');
        
        // Force remove any inline styles
        const img = item.querySelector('img');
        const video = item.querySelector('video');
        
        if (img) {
            img.style.filter = 'none';
            img.style.pointerEvents = 'auto';
            img.style.userSelect = 'auto';
            img.style.webkitUserSelect = 'auto';
            img.style.mozUserSelect = 'auto';
            img.style.msUserSelect = 'auto';
            img.style.opacity = '1';
        }
        
        if (video) {
            video.style.filter = 'none';
            video.style.pointerEvents = 'auto';
            video.style.userSelect = 'auto';
            video.style.webkitUserSelect = 'auto';
            video.style.mozUserSelect = 'auto';
            video.style.msUserSelect = 'auto';
            video.style.opacity = '1';
        }
        
        // Hide overlay
        const overlay = item.querySelector('.media-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
        
        // Remove any pseudo-element overlays
        item.style.setProperty('--blur-overlay', 'none');
        
        console.log(`✅ Media item ${index + 1} unlocked`);
    });
    
    // Allow video playback
    const videos = document.querySelectorAll('video');
    videos.forEach((video, index) => {
        video.controls = true;
        video.style.pointerEvents = 'auto';
        console.log(`✅ Video ${index + 1} controls enabled`);
    });
    
    // Force a reflow to ensure styles are applied
    document.body.offsetHeight;
    
    console.log('🎉 All content unlocked successfully!');
}

// Show confirmed payment status
function showPaymentStatus(subscription) {
    const subscriptionSection = document.querySelector('.subscription-section');
    if (subscriptionSection) {
        let expiresInfo = '';
        if (subscription && subscription.expires_at) {
            const expiresDate = new Date(subscription.expires_at);
            expiresInfo = `<p>Expires on: ${expiresDate.toLocaleDateString('en-US')}</p>`;
        }
        
        const statusHTML = `
            <div class="payment-status">
                <h4>✓ Active Subscription</h4>
                <p>You have full access to content</p>
                ${expiresInfo}
            </div>
        `;
        subscriptionSection.innerHTML = statusHTML;
    }
    
    // Também atualizar sidebar
    const subscriptionCard = document.querySelector('.subscription-card');
    if (subscriptionCard) {
        const statusHTML = `
            <h3>SUBSCRIPTION</h3>
            <div class="payment-status">
                <h4>✓ Active Subscription</h4>
                <p>Full access</p>
            </div>
        `;
        subscriptionCard.innerHTML = statusHTML;
    }
}

// Process approved payment
async function handlePaymentApproved(details, planName, planPrice, email) {
    console.log('Pagamento aprovado:', details);
    
    // Salvar email do usuário
    localStorage.setItem('user_email', email);
    localStorage.setItem('subscription_active', 'true'); // Fallback
    
    // Desbloquear conteúdo
    unlockAllContent();
    
    // Mostrar mensagem de sucesso
    showPaymentStatus(null);
    
    // Mostrar modal de sucesso com link de entrega
    showSuccessModal(planName, planPrice, email);
    
    // Verificar status atualizado do backend
    setTimeout(async () => {
        await checkPaymentStatus();
    }, 2000);
}

// Show success modal after payment
function showSuccessModal(planName, planPrice, email) {
    const modal = document.getElementById('successModal');
    const planDetails = document.getElementById('successPlanDetails');
    const deliveryLink = document.getElementById('deliveryLink');
    
    // Atualizar detalhes do plano
    planDetails.textContent = `Plano ${planName} - $${planPrice}`;
    
    // Configurar link de entrega
    let linkUrl = DELIVERY_CONFIG.defaultLink;
    
    if (DELIVERY_CONFIG.usePlanSpecificLinks && DELIVERY_CONFIG.planLinks[planName]) {
        linkUrl = DELIVERY_CONFIG.planLinks[planName];
    }
    
    // Adicionar email como parâmetro (opcional - útil para rastreamento)
    const urlWithParams = new URL(linkUrl);
    urlWithParams.searchParams.set('email', email);
    urlWithParams.searchParams.set('plan', planName);
    
    deliveryLink.href = urlWithParams.toString();
    
    // Mostrar modal
    modal.classList.add('active');
    
    // Fechar modal ao clicar no botão
    const closeBtn = document.getElementById('closeSuccess');
    closeBtn.onclick = function() {
        modal.classList.remove('active');
    };
    
    // Fechar ao clicar fora
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    };
}

// Variável global para armazenar o plano atual
let currentPaymentPlan = {
    name: '',
    price: 0,
    description: ''
};

// Abrir modal de pagamento
function openPaymentModal(planName, planPrice, planDescription) {
    const modal = document.getElementById('paymentModal');
    const planInfo = document.getElementById('paymentPlanInfo');
    const emailInput = document.getElementById('payerEmail');
    const currencySelect = document.getElementById('currencySelect');
    
    // Salvar informações do plano
    currentPaymentPlan = {
        name: planName,
        price: planPrice,
        description: planDescription
    };
    
    // Atualizar informações do plano
    planInfo.textContent = `${planDescription} - $${planPrice}`;
    
    // Preencher email se já tiver salvo
    const savedEmail = localStorage.getItem('user_email');
    if (savedEmail) {
        emailInput.value = savedEmail;
    }
    
    // Atualizar preço quando mudar moeda
    currencySelect.addEventListener('change', function() {
        updatePriceDisplay();
    });
    
    // Mostrar modal
    modal.classList.add('active');
}

// Atualizar display de preço baseado na moeda
function updatePriceDisplay() {
    const planInfo = document.getElementById('paymentPlanInfo');
    const currencySelect = document.getElementById('currencySelect');
    const currency = currencySelect.value;
    
    let price = currentPaymentPlan.price;
    let symbol = '$';
    
    // Converter para EUR se necessário (taxa aproximada)
    if (currency === 'EUR') {
        price = (price * 0.92).toFixed(2);
        symbol = '€';
    }
    
    planInfo.textContent = `${currentPaymentPlan.description} - ${symbol}${price}`;
}

// Processar pagamento com Stripe
async function processStripePayment() {
    const emailInput = document.getElementById('payerEmail');
    const currencySelect = document.getElementById('currencySelect');
    const stripePayButton = document.getElementById('stripePayButton');
    
    // Validar email
    const email = emailInput.value.trim();
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email!');
        return;
    }
    
    const currency = currencySelect.value;
    const planName = currentPaymentPlan.name;
    let planPrice = currentPaymentPlan.price;
    
    // Converter preço se for EUR
    if (currency === 'EUR') {
        planPrice = (planPrice * 0.92).toFixed(2);
    }
    
    // Desabilitar botão
    stripePayButton.disabled = true;
        stripePayButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    try {
        // Criar sessão de checkout via backend
        const response = await fetch(`${API_URL}/create-checkout-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                plan: planName,
                amount: planPrice,
                currency: currency
            })
        });
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'Erro ao criar sessão de checkout');
        }
        
        // Salvar informações localmente
        localStorage.setItem('user_email', email);
        localStorage.setItem('pending_session_id', result.sessionId);
        localStorage.setItem('pending_plan', planName);
        localStorage.setItem('pending_price', planPrice);
        
        // Redirecionar para checkout do Stripe
        window.location.href = result.url;
        
    } catch (error) {
        console.error('Erro ao criar sessão de checkout:', error);
        alert('Error creating payment. Please try again.');
        
        // Reabilitar botão
        stripePayButton.disabled = false;
        stripePayButton.innerHTML = '<i class="fas fa-credit-card"></i> Pay with Stripe';
    }
}

// Fechar modal de pagamento
function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.classList.remove('active');
}

// Verificar se voltou do checkout do Stripe
async function checkReturnFromCheckout() {
    // Verificar se voltou do Stripe com session_id
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const success = urlParams.get('success');
    const cancelled = urlParams.get('cancelled');
    
    if (cancelled === 'true') {
        showToast('Payment cancelled', 'warning');
        // Limpar URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
    }
    
    if (sessionId && success === 'true') {
        try {
            // Verificar status da sessão
            const response = await fetch(`${API_URL}/check-session-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionId: sessionId
                })
            });
            
            const result = await response.json();
            
            if (result.success && result.isActive) {
                // Limpar dados pendentes
                const planName = localStorage.getItem('pending_plan');
                const planPrice = localStorage.getItem('pending_price');
                const email = localStorage.getItem('user_email');
                
                localStorage.removeItem('pending_session_id');
                localStorage.removeItem('pending_plan');
                localStorage.removeItem('pending_price');
                
                // Process approved payment
                await handlePaymentApproved(result.subscription, planName, planPrice, email);
                
                // Limpar URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        } catch (error) {
            console.error('Erro ao verificar sessão:', error);
        }
    }
    
    // Fallback: check pending session_id in localStorage
    const pendingSessionId = localStorage.getItem('pending_session_id');
    if (pendingSessionId) {
        try {
            const response = await fetch(`${API_URL}/check-session-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionId: pendingSessionId
                })
            });
            
            const result = await response.json();
            
            if (result.success && result.isActive) {
                const planName = localStorage.getItem('pending_plan');
                const planPrice = localStorage.getItem('pending_price');
                const email = localStorage.getItem('user_email');
                
                localStorage.removeItem('pending_session_id');
                localStorage.removeItem('pending_plan');
                localStorage.removeItem('pending_price');
                
                await handlePaymentApproved(result.subscription, planName, planPrice, email);
            }
        } catch (error) {
            console.error('Erro ao verificar sessão pendente:', error);
        }
    }
}

// Event listeners para os botões de assinatura
function initSubscriptionButtons() {
    // Botão Mensal - Main
    const monthlyBtn = document.getElementById('subscribeMonthly');
    if (monthlyBtn) {
        monthlyBtn.addEventListener('click', function() {
            openPaymentModal('Monthly', '3.75', 'Monthly Subscription (31 days)');
        });
    }
    
    // Botão Trimestral
    const quarterlyBtn = document.getElementById('subscribeQuarterly');
    if (quarterlyBtn) {
        quarterlyBtn.addEventListener('click', function() {
            openPaymentModal('Quarterly', '9.99', 'Quarterly Subscription (3 months)');
        });
    }
    
    // Botão Anual
    const yearlyBtn = document.getElementById('subscribeYearly');
    if (yearlyBtn) {
        yearlyBtn.addEventListener('click', function() {
            openPaymentModal('Annual', '29.99', 'Annual Subscription (12 months)');
        });
    }
    
    // Botão Sidebar
    const sidebarBtn = document.getElementById('subscribeSidebar');
    if (sidebarBtn) {
        sidebarBtn.addEventListener('click', function() {
            openPaymentModal('Monthly', '3.75', 'Monthly Subscription (31 days)');
        });
    }
    
    // Botão "INSCREVE-TE" da área bloqueada
    const unlockBtn = document.getElementById('unlockBtn');
    if (unlockBtn) {
        unlockBtn.addEventListener('click', function() {
            openPaymentModal('Monthly', '3.75', 'Monthly Subscription (31 days)');
        });
    }
    
    // Botão de pagamento Stripe
    const stripePayButton = document.getElementById('stripePayButton');
    if (stripePayButton) {
        stripePayButton.addEventListener('click', processStripePayment);
    }
    
    // Botão de fechar modal
    const closeBtn = document.getElementById('closeModal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closePaymentModal);
    }
    
    // Clicar fora do modal para fechar
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closePaymentModal();
            }
        });
    }
    
    // Tecla ESC para fechar modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePaymentModal();
        }
    });
}

// Inicializar tudo quando a página carregar
// Initialize everything when the page loads
window.addEventListener('load', function() {
    console.log('🚀 Page loaded, initializing...');
    
    // Apply blur protection immediately
    setTimeout(() => {
        applyBlurProtection();
    }, 100);
    
    checkReturnFromCheckout(); // Check if returned from checkout
    checkPaymentStatus();
    initSubscriptionButtons();
    
    // Additional blur protection after a delay
    setTimeout(() => {
        const hasPaid = localStorage.getItem('subscription_active');
        if (!hasPaid || hasPaid !== 'true') {
            applyBlurProtection();
        }
    }, 1000);
});

// Monitor and fix blur protection in real-time
function monitorBlurProtection() {
    setInterval(() => {
        const hasPaid = localStorage.getItem('subscription_active');
        const userEmail = localStorage.getItem('user_email');
        
        if (!hasPaid || hasPaid !== 'true' || !userEmail) {
            // Check if blur is still applied
            const previewVideo = document.getElementById('previewVideo');
            const mediaItems = document.querySelectorAll('.media-item');
            const lockOverlay = document.getElementById('lockOverlay');
            
            let needsBlur = false;
            
            // Check central video
            if (previewVideo && !previewVideo.classList.contains('blurred')) {
                needsBlur = true;
            }
            
            // Check media items
            mediaItems.forEach(item => {
                if (!item.classList.contains('blurred')) {
                    needsBlur = true;
                }
            });
            
            // Check lock overlay
            if (lockOverlay && lockOverlay.style.display === 'none') {
                needsBlur = true;
            }
            
            if (needsBlur) {
                console.log('🔒 Blur protection compromised, reapplying...');
                applyBlurProtection();
            }
        }
    }, 2000); // Check every 2 seconds
}

// Start monitoring
monitorBlurProtection();

