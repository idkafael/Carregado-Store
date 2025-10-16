// Sistema de Autenticação Seguro - Frontend
// Usa apenas APIs públicas do backend

// Estado global do usuário
window.currentUser = window.currentUser || null;

// ========================================
// INICIALIZAÇÃO
// ========================================
async function initSecureAuth() {
  console.log('🔐 Inicializando autenticação segura...');
  
  try {
    // Verificar se há token válido
    const result = await apiClient.verifyToken();
    
    if (result.success && result.user) {
      window.currentUser = result.user;
      console.log('✅ Usuário logado:', window.currentUser.email);
      await updateUserInterface();
      
      // Iniciar sistema de entrega automática
      if (typeof DeliverySystem !== 'undefined' && DeliverySystem.start) {
        DeliverySystem.start();
      }
    } else {
      console.log('👤 Nenhum usuário logado');
      window.currentUser = null;
      
      // Parar sistema de entrega automática
      if (typeof DeliverySystem !== 'undefined' && DeliverySystem.stop) {
        DeliverySystem.stop();
      }
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar auth:', error);
    window.currentUser = null;
  }
}

// ========================================
// REGISTRO
// ========================================
async function handleRegisterSecure() {
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const phoneRaw = document.getElementById('registerPhone').value.trim();
  const phone = typeof unformatPhoneNumber === 'function' ? unformatPhoneNumber(phoneRaw) : phoneRaw.replace(/\D/g, '');
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirmPassword').value;

  // Validações básicas
  if (!name || !email || !phone || !password || !confirmPassword) {
    showNotification('Por favor, preencha todos os campos', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showNotification('As senhas não coincidem', 'error');
    return;
  }

  if (password.length < 6) {
    showNotification('A senha deve ter pelo menos 6 caracteres', 'error');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showNotification('Email inválido', 'error');
    return;
  }

  // Mostrar loading
  const btn = document.querySelector('.register-form button[type="submit"]');
  if (!btn) {
    console.error('❌ Botão de registro não encontrado');
    return;
  }
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Criando conta...';

  try {
    // Registrar via API segura
    const result = await apiClient.register(name, email, password, phone);

    if (result.success) {
      window.currentUser = result.user;
      await updateUserInterface();
      
      if (typeof showNotification === 'function') {
        showNotification('Conta criada com sucesso! 🎉', 'success');
      }
      
      if (typeof closeLoginModal === 'function') {
        closeLoginModal();
      }
      
      // Finalizar compra pendente se existir
      if (typeof pendingPurchase !== 'undefined' && pendingPurchase) {
        setTimeout(() => {
          if (typeof finalizePendingPurchase === 'function') {
            finalizePendingPurchase();
          }
        }, 1000);
      }
    } else {
      if (typeof showNotification === 'function') {
        showNotification('Erro ao criar conta: ' + result.error, 'error');
      }
    }
  } catch (error) {
    console.error('Erro ao registrar:', error);
    if (typeof showNotification === 'function') {
      showNotification('Erro ao criar conta. Tente novamente.', 'error');
    }
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

// ========================================
// LOGIN
// ========================================
async function handleLoginSecure() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    showNotification('Por favor, preencha email e senha', 'error');
    return;
  }

  // Mostrar loading
  const btn = document.querySelector('.login-form button[type="submit"]');
  if (!btn) {
    console.error('❌ Botão de login não encontrado');
    return;
  }
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';

  try {
    // Login via API segura
    const result = await apiClient.login(email, password);

    if (result.success) {
      window.currentUser = result.user;
      await updateUserInterface();
      
      if (typeof closeLoginModal === 'function') {
        closeLoginModal();
      }
      
      if (typeof showNotification === 'function') {
        showNotification('Login realizado com sucesso! ✅', 'success');
      }
      
      // Finalizar compra pendente se existir
      if (typeof pendingPurchase !== 'undefined' && pendingPurchase) {
        setTimeout(() => {
          if (typeof finalizePendingPurchase === 'function') {
            finalizePendingPurchase();
          }
        }, 1000);
      }
    } else {
      if (typeof showNotification === 'function') {
        showNotification('Email ou senha incorretos', 'error');
      }
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    if (typeof showNotification === 'function') {
      showNotification('Erro ao fazer login. Tente novamente.', 'error');
    }
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

// ========================================
// LOGOUT
// ========================================
async function handleLogoutSecure() {
  try {
    await apiClient.logout();
    window.currentUser = null;
    updateUserInterface();
    
    if (typeof showNotification === 'function') {
      showNotification('Logout realizado com sucesso', 'success');
    }
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    if (typeof showNotification === 'function') {
      showNotification('Erro ao fazer logout', 'error');
    }
  }
}

// ========================================
// ATUALIZAR INTERFACE
// ========================================
async function updateUserInterface() {
  const loginBtn = document.getElementById('loginBtn');
  const userInfo = document.getElementById('userInfo');
  
  if (!loginBtn || !userInfo) {
    console.warn('⚠️ Elementos de interface não encontrados');
    return;
  }
  
  if (window.currentUser) {
    // Usuário logado
    loginBtn.style.display = 'none';
    userInfo.style.display = 'flex';
    
    // Formatar telefone se disponível
    const formattedPhone = window.currentUser.phone && typeof formatPhoneNumber === 'function' 
      ? formatPhoneNumber(window.currentUser.phone) 
      : window.currentUser.phone;
    
    // Atualizar informações do usuário
    userInfo.innerHTML = `
      <div class="user-avatar">
        <i class="fas fa-user-circle"></i>
      </div>
      <div class="user-details">
        <span class="user-name">${window.currentUser.name}</span>
        ${formattedPhone ? `<span class="user-phone"><i class="fas fa-phone"></i> ${formattedPhone}</span>` : ''}
        <span class="user-ltv">LTV: R$ ${(window.currentUser.ltv || 0).toFixed(2)}</span>
      </div>
      <button onclick="handleLogoutSecure()" class="logout-btn" title="Sair">
        <i class="fas fa-sign-out-alt"></i>
      </button>
    `;
    
    // Atualizar produtos comprados
    await updateProductCardsForUserSecure();
  } else {
    // Usuário não logado
    loginBtn.style.display = 'flex';
    userInfo.style.display = 'none';
  }
}

// ========================================
// PRODUTOS COMPRADOS
// ========================================
async function updateProductCardsForUserSecure() {
  if (!window.currentUser) return;
  
  try {
    // Buscar compras do usuário via API
    const result = await apiClient.getUserPurchases();
    
    if (result.success && result.data && result.data.length > 0) {
      result.data.forEach(purchase => {
        if (purchase.status === 'confirmed' && purchase.product_id) {
          addDownloadButtonToProduct(purchase.product_id);
        }
      });
    }
  } catch (error) {
    console.error('Erro ao atualizar produtos:', error);
  }
}

// ========================================
// VERIFICAR SE COMPROU
// ========================================
async function hasUserPurchasedProductSecure(userId, productId) {
  try {
    const result = await apiClient.hasUserPurchasedProduct(productId);
    return result.success && result.hasPurchased;
  } catch (error) {
    console.error('Erro ao verificar compra:', error);
    return false;
  }
}

// ========================================
// EXPORTAR PARA GLOBAL
// ========================================
window.handleRegisterSecure = handleRegisterSecure;
window.handleLoginSecure = handleLoginSecure;
window.handleLogoutSecure = handleLogoutSecure;
window.updateUserInterface = updateUserInterface;
window.updateProductCardsForUserSecure = updateProductCardsForUserSecure;
window.hasUserPurchasedProductSecure = hasUserPurchasedProductSecure;
window.initSecureAuth = initSecureAuth;

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM carregado, iniciando auth segura...');
    initSecureAuth();
  });
} else {
  console.log('🚀 DOM já carregado, iniciando auth segura...');
  initSecureAuth();
}
