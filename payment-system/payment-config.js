// Configurações do Sistema de Pagamento
const PaymentConfig = {
  // Configurações da PushinPay
  pushinpay: {
    baseUrl: 'https://api.pushinpay.com.br',
    token: '48754|3wdvl7xAOkCJM3gD86aJ78aErQcXVBrTn24qEztJ9629c3ea',
    webhookUrl: 'https://vyibdpwhkklxzuxaouza.supabase.co/functions/v1/pushinpay-proxy/webhook' // Webhook Supabase
  },
  
  // Proxy seguro (Supabase Edge Functions) para não expor o token no front
  proxy: {
    enabled: false, // ⚠️ PROXY TEMPORARIAMENTE DESABILITADO - chamada direta para testar
    baseUrl: 'https://vyibdpwhkklxzuxaouza.supabase.co/functions/v1/pushinpay-proxy',
    secret: '' // Não precisa de secret com Supabase
  },
  
  // Configurações de timeout
  timeouts: {
    pixExpiration: 30 * 60 * 1000, // 30 minutos em millisegundos
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
    pixCodeCopied: 'Código PIX copiado!'
  },
  
  // Configurações de debug
  debug: {
    enabled: true,
    logLevel: 'info' // 'error', 'warn', 'info', 'debug'
  },
  
  // URLs de redirecionamento
  urls: {
    success: 'agradecimento.html',
    error: 'erro-pagamento.html'
  }
};

// Função para log com níveis
function logPayment(level, message, data = null) {
  if (!PaymentConfig.debug.enabled) return;
  
  const levels = ['error', 'warn', 'info', 'debug'];
  const currentLevel = levels.indexOf(PaymentConfig.debug.logLevel);
  const messageLevel = levels.indexOf(level);
  
  if (messageLevel <= currentLevel) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [PAYMENT-${level.toUpperCase()}]`;
    
    if (data) {
      console.log(prefix, message, data);
    } else {
      console.log(prefix, message);
    }
  }
}

// Função para validar configurações
function validatePaymentConfig() {
  const errors = [];
  
  if (!PaymentConfig.pushinpay.token) {
    errors.push('Token da PushinPay não configurado');
  }
  
  if (!PaymentConfig.pushinpay.baseUrl) {
    errors.push('URL base da PushinPay não configurada');
  }
  
  if (errors.length > 0) {
    logPayment('error', 'Configurações inválidas:', errors);
    return false;
  }
  
  logPayment('info', 'Configurações validadas com sucesso');
  return true;
}

// Exportar para global
if (typeof window !== 'undefined') {
  window.PaymentConfig = PaymentConfig;
  window.logPayment = logPayment;
  window.validatePaymentConfig = validatePaymentConfig;
}





