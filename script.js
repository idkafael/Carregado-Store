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
                showToast('Adicionado aos favoritos! ⭐');
            } else {
                btn.classList.remove('fas');
                btn.classList.add('far');
                btn.style.color = '';
                showToast('Removido dos favoritos');
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
            showToast('Conteúdo desbloqueado! 🔓');
            
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
                showToast('Bem-vindo! Conteúdo desbloqueado! 🎉');
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
        alert('Como podemos ajudar você?');
    });
}

// ============================================
// SISTEMA DE PAGAMENTO PAYPAL + BACKEND
// ============================================

// URL do backend API
const API_URL = 'http://localhost:3000/api';

// Verificar se usuário já pagou ao carregar a página
async function checkPaymentStatus() {
    // Verificar se tem email salvo
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
            console.error('Erro ao verificar status:', error);
        }
    }
    
    // Fallback: verificar localStorage antigo
    const hasPaid = localStorage.getItem('subscription_active');
    if (hasPaid === 'true') {
        unlockAllContent();
        showPaymentStatus(null);
    }
}

// Desbloquear todo o conteúdo
function unlockAllContent() {
    // Remove blur do vídeo central
    const previewVideo = document.getElementById('previewVideo');
    if (previewVideo) {
        previewVideo.classList.remove('blurred');
    }
    
    // Esconde o overlay de bloqueio
    const lockOverlay = document.getElementById('lockOverlay');
    if (lockOverlay) {
        lockOverlay.style.display = 'none';
    }
    
    // Remove blur de todos os itens da grade de mídia
    const mediaItems = document.querySelectorAll('.media-item');
    mediaItems.forEach(item => {
        item.classList.remove('blurred');
        const overlay = item.querySelector('.media-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    });
    
    // Permite reprodução dos vídeos
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.controls = true;
    });
}

// Mostrar status de pagamento confirmado
function showPaymentStatus(subscription) {
    const subscriptionSection = document.querySelector('.subscription-section');
    if (subscriptionSection) {
        let expiresInfo = '';
        if (subscription && subscription.expires_at) {
            const expiresDate = new Date(subscription.expires_at);
            expiresInfo = `<p>Expira em: ${expiresDate.toLocaleDateString('pt-BR')}</p>`;
        }
        
        const statusHTML = `
            <div class="payment-status">
                <h4>✓ Assinatura Ativa</h4>
                <p>Você tem acesso completo ao conteúdo</p>
                ${expiresInfo}
            </div>
        `;
        subscriptionSection.innerHTML = statusHTML;
    }
    
    // Também atualizar sidebar
    const subscriptionCard = document.querySelector('.subscription-card');
    if (subscriptionCard) {
        const statusHTML = `
            <h3>ASSINATURA</h3>
            <div class="payment-status">
                <h4>✓ Assinatura Ativa</h4>
                <p>Acesso completo</p>
            </div>
        `;
        subscriptionCard.innerHTML = statusHTML;
    }
}

// Processar pagamento aprovado
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

// Mostrar modal de sucesso após pagamento
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
let currentPaymentPlan = null;

// Abrir modal de pagamento
function openPaymentModal(planName, planPrice, planDescription) {
    const modal = document.getElementById('paymentModal');
    const planInfo = document.getElementById('paymentPlanInfo');
    const container = document.getElementById('paypal-button-container');
    const emailInput = document.getElementById('payerEmail');
    
    // Atualizar informações do plano
    planInfo.textContent = `${planDescription} - $${planPrice}`;
    
    // Limpar container anterior
    container.innerHTML = '';
    
    // Preencher email se já tiver salvo
    const savedEmail = localStorage.getItem('user_email');
    if (savedEmail) {
        emailInput.value = savedEmail;
    }
    
    // Verificar se PayPal SDK está carregado
    if (typeof paypal === 'undefined') {
        alert('Erro ao carregar PayPal. Recarregue a página.');
        return;
    }
    
    // Renderizar botão PayPal
    paypal.Buttons({
        style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'pay',
            height: 50
        },
        createOrder: async function(data, actions) {
            // Validar email
            const email = emailInput.value.trim();
            if (!email || !email.includes('@')) {
                alert('Por favor, insira um email válido!');
                throw new Error('Email inválido');
            }
            
            try {
                // Criar order via backend
                const response = await fetch(`${API_URL}/create-order`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        plan: planName,
                        amount: planPrice
                    })
                });
                
                const result = await response.json();
                
                if (!result.success) {
                    throw new Error(result.error || 'Erro ao criar order');
                }
                
                // Salvar email temporariamente
                localStorage.setItem('temp_email', email);
                
                return result.orderId;
            } catch (error) {
                console.error('Erro ao criar order:', error);
                alert('Erro ao criar pagamento. Tente novamente.');
                throw error;
            }
        },
        onApprove: async function(data, actions) {
            try {
                // Capturar pagamento via backend
                const response = await fetch(`${API_URL}/capture-payment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        orderId: data.orderID
                    })
                });
                
                const result = await response.json();
                
                if (!result.success) {
                    throw new Error(result.error || 'Erro ao capturar pagamento');
                }
                
                // Recuperar email
                const email = localStorage.getItem('temp_email') || emailInput.value;
                localStorage.removeItem('temp_email');
                
                // Fechar modal
                closePaymentModal();
                
                // Processar aprovação
                await handlePaymentApproved(result.data, planName, planPrice, email);
                
            } catch (error) {
                console.error('Erro ao aprovar pagamento:', error);
                alert('Erro ao processar pagamento. Entre em contato com o suporte.');
            }
        },
        onError: function(err) {
            console.error('Erro no pagamento:', err);
            alert('Erro ao processar pagamento. Tente novamente.');
        },
        onCancel: function(data) {
            console.log('Pagamento cancelado pelo usuário');
        }
    }).render('#paypal-button-container');
    
    // Mostrar modal
    modal.classList.add('active');
}

// Fechar modal de pagamento
function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.classList.remove('active');
}

// Event listeners para os botões de assinatura
function initSubscriptionButtons() {
    // Botão Mensal - Main
    const monthlyBtn = document.getElementById('subscribeMonthly');
    if (monthlyBtn) {
        monthlyBtn.addEventListener('click', function() {
            openPaymentModal('Mensal', '3.75', 'Assinatura Mensal (31 dias)');
        });
    }
    
    // Botão Trimestral
    const quarterlyBtn = document.getElementById('subscribeQuarterly');
    if (quarterlyBtn) {
        quarterlyBtn.addEventListener('click', function() {
            openPaymentModal('Trimestral', '9.99', 'Assinatura Trimestral (3 meses)');
        });
    }
    
    // Botão Anual
    const yearlyBtn = document.getElementById('subscribeYearly');
    if (yearlyBtn) {
        yearlyBtn.addEventListener('click', function() {
            openPaymentModal('Anual', '29.99', 'Assinatura Anual (12 meses)');
        });
    }
    
    // Botão Sidebar
    const sidebarBtn = document.getElementById('subscribeSidebar');
    if (sidebarBtn) {
        sidebarBtn.addEventListener('click', function() {
            openPaymentModal('Mensal', '3.75', 'Assinatura Mensal (31 dias)');
        });
    }
    
    // Botão "INSCREVE-TE" da área bloqueada
    const unlockBtn = document.getElementById('unlockBtn');
    if (unlockBtn) {
        unlockBtn.addEventListener('click', function() {
            openPaymentModal('Mensal', '3.75', 'Assinatura Mensal (31 dias)');
        });
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
window.addEventListener('load', function() {
    checkPaymentStatus();
    initSubscriptionButtons();
});

// Debug helpers
console.log('🔧 Backend API:', API_URL);
console.log('💡 Para resetar (teste): localStorage.clear()');

