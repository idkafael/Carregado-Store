// Configuração de Produção - Carregado Store
const SecureConfig = {
  apiUrl: 'https://carregado-store-backend.railway.app/api',
  
  timeouts: {
    pixExpiration: 30 * 60 * 1000, // 30 minutos
    statusCheckInterval: 5000, // 5 segundos
    redirectDelay: 3000 // 3 segundos
  },
  
  retry: {
    maxAttempts: 3,
    delay: 2000 // 2 segundos entre tentativas
  },
  
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
  
  debug: {
    enabled: false, // Desabilitado em produção
    logLevel: 'error' // Apenas erros
  },
  
  urls: {
    success: 'agradecimento.html',
    error: 'erro-pagamento.html'
  },
  
  notifications: {
    duration: 10000, // 10 segundos
    position: 'top-right'
  }
};

// Exportar para global
if (typeof window !== 'undefined') {
  window.SecureConfig = SecureConfig;
}
