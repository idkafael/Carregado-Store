// Configurações Seguras do Frontend
// Apenas configurações públicas, sem dados sensíveis

const SecureConfig = {
  // URL da API Backend
  apiUrl: 'https://www.carregado.store',
  
  // Configurações de timeout
  timeouts: {
    pixExpiration: 30 * 60 * 1000, // 30 minutos
    statusCheckInterval: 5000, // 5 segundos
    redirectDelay: 3000 // 3 segundos
  },
  
  // Configurações de retry
  retry: {
    maxAttempts: 3,
    delay: 2000 // 2 segundos entre tentativas
  },
  
  // Mensagens do sistema
  messages: {
    creatingPix: 'Criando PIX...',
    waitingPayment: 'Aguardando pagamento...',
    paymentConfirmed: 'Pagamento confirmado!',
    paymentExpired: 'PIX expirado. Crie um novo pagamento.',
    errorCreatingPix: 'Erro ao criar PIX. Tente novamente.',
    errorCheckingStatus: 'Erro ao verificar status. Tente novamente.',
    qrCodeError: 'Erro ao carregar QR Code',
    pixCodeCopied: 'Código PIX copiado!',
    userNotAuthenticated: 'Usuário não autenticado',
    productNotSelected: 'Produto não selecionado'
  },
  
  // Configurações de debug
  debug: {
    enabled: false,
    logLevel: 'info' // 'error', 'warn', 'info', 'debug'
  },
  
  // URLs de redirecionamento
  urls: {
    success: 'agradecimento.html',
    error: 'erro-pagamento.html'
  },
  
  // Configurações de notificação
  notifications: {
    duration: 10000, // 10 segundos
    position: 'top-right'
  }
};

// Função para log com níveis
function logSecure(level, message, data = null) {
  if (!SecureConfig.debug.enabled) return;
  
  const levels = ['error', 'warn', 'info', 'debug'];
  const currentLevel = levels.indexOf(SecureConfig.debug.logLevel);
  const messageLevel = levels.indexOf(level);
  
  if (messageLevel <= currentLevel) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [SECURE-${level.toUpperCase()}]`;
    
    if (data) {
      console.log(prefix, message, data);
    } else {
      console.log(prefix, message);
    }
  }
}

// Função para validar configurações
function validateSecureConfig() {
  const errors = [];
  
  if (!SecureConfig.apiUrl) {
    errors.push('URL da API não configurada');
  }
  
  if (errors.length > 0) {
    logSecure('error', 'Configurações inválidas:', errors);
    return false;
  }
  
  logSecure('info', 'Configurações validadas com sucesso');
  return true;
}

// Função para mostrar notificação
function showSecureNotification(message, type = 'info') {
  if (typeof showNotification === 'function') {
    showNotification(message, type);
  } else {
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
}

// Função para formatar telefone
function formatPhoneNumberSecure(phone) {
  if (!phone) return '';
  
  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Formatar para (XX) XXXXX-XXXX
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  // Formatar para (XX) XXXX-XXXX
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
}

// Função para desformatar telefone
function unformatPhoneNumberSecure(phone) {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

// Função para validar email
function validateEmailSecure(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função para validar senha
function validatePasswordSecure(password) {
  return password && password.length >= 6;
}

// Função para copiar texto para clipboard
async function copyToClipboardSecure(text) {
  try {
    await navigator.clipboard.writeText(text);
    showSecureNotification(SecureConfig.messages.pixCodeCopied, 'success');
    return true;
  } catch (error) {
    console.error('❌ Erro ao copiar:', error);
    showSecureNotification('Erro ao copiar código', 'error');
    return false;
  }
}

// Função para debounce
function debounceSecure(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Função para throttle
function throttleSecure(func, limit) {
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

// Exportar para global
if (typeof window !== 'undefined') {
  window.SecureConfig = SecureConfig;
  window.logSecure = logSecure;
  window.validateSecureConfig = validateSecureConfig;
  window.showSecureNotification = showSecureNotification;
  window.formatPhoneNumberSecure = formatPhoneNumberSecure;
  window.unformatPhoneNumberSecure = unformatPhoneNumberSecure;
  window.validateEmailSecure = validateEmailSecure;
  window.validatePasswordSecure = validatePasswordSecure;
  window.copyToClipboardSecure = copyToClipboardSecure;
  window.debounceSecure = debounceSecure;
  window.throttleSecure = throttleSecure;
}

// Exportar para global (já feito acima)
