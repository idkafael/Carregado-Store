// Sistema de Autenticação com Supabase
// Substitui o sistema de localStorage

// Usar currentUser global (definido em window)
window.currentUser = window.currentUser || null;

// ========================================
// INICIALIZAÇÃO
// ========================================
async function initAuth() {
  console.log('🔐 Inicializando autenticação Supabase...');
  
  try {
    // Verificar se há sessão ativa
    const result = await SupabaseAuth.getCurrentUser();
    
    if (result && result.success && result.user) {
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
    
    // Ouvir mudanças de autenticação
    SupabaseAuth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session) {
        const userData = await SupabaseAuth.getCurrentUser();
        if (userData && userData.user) {
          window.currentUser = userData.user;
          await updateUserInterface();
          
          // Iniciar sistema de entrega automática
          if (typeof DeliverySystem !== 'undefined' && DeliverySystem.start) {
            DeliverySystem.start();
          }
          
          // Processar compra pendente se houver
          if (typeof pendingPurchase !== 'undefined' && pendingPurchase) {
            setTimeout(() => {
              if (typeof finalizePendingPurchase === 'function') {
                finalizePendingPurchase();
              }
            }, 1000);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        window.currentUser = null;
        updateUserInterface();
        
        // Parar sistema de entrega automática
        if (typeof DeliverySystem !== 'undefined' && DeliverySystem.stop) {
          DeliverySystem.stop();
        }
      }
    });
  } catch (error) {
    console.error('❌ Erro ao inicializar auth:', error);
    window.currentUser = null;
  }
}

// ========================================
// REGISTRO
// ========================================
async function handleRegisterSupabase() {
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const phoneRaw = document.getElementById('registerPhone').value.trim();
  // Remover formatação do telefone antes de salvar
  const phone = typeof unformatPhoneNumber === 'function' ? unformatPhoneNumber(phoneRaw) : phoneRaw.replace(/\D/g, '');
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirmPassword').value;

  // Validações
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

  // Validar email
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
    // Registrar no Supabase
    const result = await SupabaseAuth.signUp(email, password, { name, phone });

    if (result.success) {
      if (typeof showNotification === 'function') {
        showNotification('Conta criada com sucesso! 🎉', 'success');
      }
      
      // Fazer login automaticamente
      const loginResult = await SupabaseAuth.signIn(email, password);
      
      if (loginResult.success) {
        const userData = await SupabaseAuth.getCurrentUser();
        if (userData && userData.user) {
          window.currentUser = userData.user;
          await updateUserInterface();
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
        }
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
async function handleLoginSupabase() {
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
    const result = await SupabaseAuth.signIn(email, password);

    if (result.success) {
      const userData = await SupabaseAuth.getCurrentUser();
      if (userData && userData.user) {
        window.currentUser = userData.user;
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
async function handleLogoutSupabase() {
  try {
    await SupabaseAuth.signOut();
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
// UI UPDATE
// ========================================
async function updateUserInterface() {
  const loginBtn = document.getElementById('loginBtn');
  const userInfo = document.getElementById('userInfo');
  
  if (!loginBtn || !userInfo) {
    console.warn('⚠️ Elementos de interface não encontrados');
    return;
  }
  
  if (window.currentUser) {
    // Buscar perfil do usuário
    let userName = window.currentUser.user_metadata?.name || window.currentUser.email.split('@')[0];
    let userLtv = 0;
    let userPhone = '';
    
    try {
      const { data: profile } = await SupabaseProfile.getProfile(window.currentUser.id);
      if (profile) {
        userName = profile.name || userName;
        userLtv = profile.ltv || 0;
        userPhone = profile.phone || window.currentUser.user_metadata?.phone || '';
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    }
    
    // Formatar telefone se disponível
    const formattedPhone = userPhone && typeof formatPhoneNumber === 'function' 
      ? formatPhoneNumber(userPhone) 
      : userPhone;
    
    // Usuário logado
    loginBtn.style.display = 'none';
    userInfo.style.display = 'flex';
    
    // Atualizar informações do usuário
    userInfo.innerHTML = `
      <div class="user-avatar">
        <i class="fas fa-user-circle"></i>
      </div>
      <div class="user-details">
        <span class="user-name">${userName}</span>
        ${formattedPhone ? `<span class="user-phone"><i class="fas fa-phone"></i> ${formattedPhone}</span>` : ''}
        <span class="user-ltv">LTV: R$ ${userLtv.toFixed(2)}</span>
      </div>
      <button onclick="handleLogoutSupabase()" class="logout-btn" title="Sair">
        <i class="fas fa-sign-out-alt"></i>
      </button>
    `;
    
    // Atualizar produtos comprados
    updateProductCardsForUserSupabase();
  } else {
    // Usuário não logado
    loginBtn.style.display = 'flex';
    userInfo.style.display = 'none';
  }
}

// ========================================
// PRODUTOS COMPRADOS
// ========================================
async function updateProductCardsForUserSupabase() {
  if (!window.currentUser) return;
  
  try {
    // Buscar compras do usuário
    const { data: purchases } = await SupabasePurchases.getUserPurchases(window.currentUser.id);
    
    if (purchases && purchases.length > 0) {
      purchases.forEach(purchase => {
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
async function hasUserPurchasedProductSupabase(userId, productId) {
  try {
    const result = await SupabasePurchases.hasUserPurchased(userId, productId);
    return result.hasPurchased;
  } catch (error) {
    console.error('Erro ao verificar compra:', error);
    return false;
  }
}

// ========================================
// EXPORTAR PARA GLOBAL (IMEDIATAMENTE)
// ========================================
window.handleRegisterSupabase = handleRegisterSupabase;
window.handleLoginSupabase = handleLoginSupabase;
window.handleLogoutSupabase = handleLogoutSupabase;
window.updateUserInterface = updateUserInterface;
window.updateProductCardsForUserSupabase = updateProductCardsForUserSupabase;
window.hasUserPurchasedProductSupabase = hasUserPurchasedProductSupabase;
window.initAuth = initAuth;

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM carregado, iniciando auth...');
    initAuth();
  });
} else {
  console.log('🚀 DOM já carregado, iniciando auth...');
  initAuth();
}

