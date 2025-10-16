// Sistema PushinPay Real - QR Code e Pagamento Funcional
const PushinPayReal = {
  // Configurações
  config: {
    baseUrl: 'https://api.pushinpay.com.br',
    token: '48754|3wdvl7xAOkCJM3gD86aJ78aErQcXVBrTn24qEztJ9629c3ea',
    valor: 5000, // R$ 50,00 em centavos
    webhookUrl: null // Sem webhook por enquanto
  },
  
  // Sincronizar configurações globais (se definidas em PaymentConfig)
  sincronizarConfig() {
    try {
      if (typeof window !== 'undefined' && window.PaymentConfig) {
        const pc = window.PaymentConfig;
        this.config.baseUrl = pc.pushinpay?.baseUrl || this.config.baseUrl;
        this.config.token = pc.pushinpay?.token || this.config.token;
        this.config.webhookUrl = pc.pushinpay?.webhookUrl ?? this.config.webhookUrl;
        this.config.proxy = pc.proxy || { enabled: false };
      }
    } catch (e) {
      console.warn('⚠️ Não foi possível sincronizar PaymentConfig:', e);
    }
  },
  
  // Estado atual
  estado: {
    transacaoId: null,
    status: 'pending',
    intervaloVerificacao: null,
    valorAtual: 5000, // Valor em centavos
    planoAtual: '1 mês'
  },
  
  // Normalizar status vindo da API
  normalizarStatus(dados) {
    if (!dados) return 'pending';
    const raw = (
      (dados.status || dados.payment_status || (dados.data && dados.data.status) || '')
    ).toString().toLowerCase();
    const paidBool = dados.paid === true || (dados.data && dados.data.paid === true);
    if (paidBool) return 'paid';
    const mapPaid = ['paid', 'approved', 'completed', 'confirmed', 'succeeded', 'success', 'done', 'received'];
    if (mapPaid.includes(raw)) return 'paid';
    const mapExpired = ['expired', 'canceled', 'cancelled', 'failed', 'timeout'];
    if (mapExpired.includes(raw)) return 'expired';
    return 'pending';
  },
  
  // Criar PIX real via PushinPay
  async criarPix() {
    try {
      // garantir config sincronizada
      this.sincronizarConfig();
      console.log('🔍 Criando PIX real via PushinPay...');
      
      // Se proxy estiver habilitado, usar o endpoint da Edge Function
      const isProxy = this.config.proxy && this.config.proxy.enabled && this.config.proxy.baseUrl;
      const createUrl = isProxy
        ? `${this.config.proxy.baseUrl}/create-pix`
        : `${this.config.baseUrl}/api/pix/cashIn`;

      // Se usar proxy (Supabase), precisa enviar o token do usuário
      let headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
      
      if (isProxy) {
        // Obter token de autenticação do Supabase
        const session = await window.supabase?.auth?.getSession();
        if (session?.data?.session?.access_token) {
          headers['Authorization'] = `Bearer ${session.data.session.access_token}`;
        }
      } else {
        // Usar token da PushinPay diretamente
        headers['Authorization'] = `Bearer ${this.config.token}`;
      }

      const response = await fetch(createUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          value: this.estado.valorAtual,
          webhook_url: this.config.webhookUrl,
          split_rules: []
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ${response.status}: ${errorData.message || 'Erro desconhecido'}`);
      }
      
      const data = await response.json();
      console.log('✅ PIX criado com sucesso:', data);
      
      // Salvar dados da transação (e persistir para recuperar após refresh)
      this.estado.transacaoId = data.id || data.transaction_id || (data.data && data.data.id) || data.reference || data.uuid || null;
      this.estado.status = this.normalizarStatus(data);
      try {
        localStorage.setItem('pushinpay.transacaoId', this.estado.transacaoId || '');
        localStorage.setItem('pushinpay.valorAtual', String(this.estado.valorAtual));
        localStorage.setItem('pushinpay.planoAtual', this.estado.planoAtual || '');
      } catch (e) {
        console.warn('⚠️ Não foi possível persistir dados da transação:', e);
      }
      
      return data;
      
    } catch (error) {
      console.error('❌ Erro ao criar PIX:', error);
      throw error;
    }
  },
  
  // Consultar status do PIX
  async consultarStatus(transacaoId) {
    try {
      console.log('🔍 Consultando status do PIX:', transacaoId);
      this.sincronizarConfig();
      
      const isProxy = this.config.proxy && this.config.proxy.enabled && this.config.proxy.baseUrl;
      const endpoints = isProxy
        ? [
            `${this.config.proxy.baseUrl}/status/${transacaoId}`
          ]
        : [
            `${this.config.baseUrl}/api/pix/status/${transacaoId}`,
            `${this.config.baseUrl}/api/pix/cashIn/status/${transacaoId}`,
            `${this.config.baseUrl}/api/pix/cashIn/${transacaoId}`
          ];
      let lastError = null;
      for (const url of endpoints) {
        try {
          // Configurar headers com autenticação
          let headers = { 'Accept': 'application/json' };
          
          if (isProxy) {
            // Obter token de autenticação do Supabase
            const session = await window.supabase?.auth?.getSession();
            if (session?.data?.session?.access_token) {
              headers['Authorization'] = `Bearer ${session.data.session.access_token}`;
            }
          } else {
            // Usar token da PushinPay
            headers['Authorization'] = `Bearer ${this.config.token}`;
            headers['Content-Type'] = 'application/json';
          }
          
          const resp = await fetch(url, {
            method: 'GET',
            headers
          });
          if (!resp.ok) {
            if (resp.status === 404) {
              lastError = new Error(`404 em ${url}`);
              continue;
            }
            lastError = new Error(`Erro ${resp.status}: ${resp.statusText}`);
            continue;
          }
          const data = await resp.json();
          const normalized = { ...data, status: this.normalizarStatus(data) };
          console.log('✅ Status consultado:', normalized);
          return normalized;
        } catch (inner) {
          lastError = inner;
          continue;
        }
      }
      if (lastError) throw lastError;
      return null;
      
    } catch (error) {
      console.error('❌ Erro ao consultar status:', error);
      return null;
    }
  },

  // Verificação manual (pode ser conectada a um botão se desejar)
  async verificarAgora() {
    if (!this.estado.transacaoId) {
      const persistido = localStorage.getItem('pushinpay.transacaoId');
      if (persistido) this.estado.transacaoId = persistido;
    }
    if (!this.estado.transacaoId) {
      console.warn('⚠️ Nenhuma transação para verificar');
      return;
    }
    const dados = await this.consultarStatus(this.estado.transacaoId);
    if (!dados) return;
    const statusNormalizado = this.normalizarStatus(dados);
    this.estado.status = statusNormalizado;
    if (statusNormalizado === 'paid') {
      this.pagamentoConfirmado(dados);
      this.pararVerificacao();
    } else if (statusNormalizado === 'expired') {
      this.pixExpirado();
      this.pararVerificacao();
    }
  },
  
  // Exibir QR Code real da PushinPay - VERSÃO CORRIGIDA
  exibirQRCode(qrCodeBase64) {
    const container = document.getElementById('qrCode');
    if (!container) {
      console.error('❌ Container QR Code não encontrado');
      return;
    }
    
    // Limpar container
    container.innerHTML = '';
    
    // Verificar se é uma string base64 válida
    if (!qrCodeBase64 || typeof qrCodeBase64 !== 'string') {
      console.error('❌ QR Code inválido:', qrCodeBase64);
      container.innerHTML = '<p style="color: red; text-align: center;">Erro ao carregar QR Code</p>';
      return;
    }
    
    // Usar o QR Code diretamente (já vem com prefixo data:)
    let qrCodeSrc = qrCodeBase64;
    
    // Criar imagem do QR Code
    const img = document.createElement('img');
    img.src = qrCodeSrc;
    img.alt = 'QR Code PIX PushinPay';
    img.style.maxWidth = '250px';
    img.style.height = 'auto';
    img.style.margin = '0 auto';
    img.style.display = 'block';
    img.style.border = '2px solid #ddd';
    img.style.borderRadius = '8px';
    img.style.backgroundColor = '#ffffff';
    img.style.padding = '10px';
    
    // Adicionar evento de erro
    img.onerror = function() {
      console.error('❌ Erro ao carregar imagem do QR Code');
      container.innerHTML = '<p style="color: red; text-align: center;">Erro ao carregar QR Code</p>';
    };
    
    // Adicionar evento de sucesso
    img.onload = function() {
      console.log('✅ QR Code carregado com sucesso');
    };
    
    container.appendChild(img);
    console.log('✅ QR Code real exibido');
  },
  
  // Exibir código PIX
  exibirCodigoPix(qrCode) {
    const input = document.getElementById('pixCodeInput');
    if (input) {
      input.value = qrCode;
      console.log('✅ Código PIX exibido');
    }
  },
  
  // Iniciar verificação de pagamento
  iniciarVerificacao() {
    if (this.estado.intervaloVerificacao) {
      clearInterval(this.estado.intervaloVerificacao);
    }
    
    console.log('🔄 Iniciando verificação de pagamento...');
    this.sincronizarConfig();
    const intervalMs = (typeof window !== 'undefined' && window.PaymentConfig && window.PaymentConfig.timeouts && window.PaymentConfig.timeouts.statusCheckInterval) ? window.PaymentConfig.timeouts.statusCheckInterval : 5000;
    
    // Recuperar transação persistida se necessário
    if (!this.estado.transacaoId) {
      try {
        const persistido = localStorage.getItem('pushinpay.transacaoId');
        if (persistido) this.estado.transacaoId = persistido;
        const valorPersistido = parseInt(localStorage.getItem('pushinpay.valorAtual') || '0', 10);
        if (valorPersistido > 0) this.estado.valorAtual = valorPersistido;
        const planoPersistido = localStorage.getItem('pushinpay.planoAtual');
        if (planoPersistido) this.estado.planoAtual = planoPersistido;
      } catch (e) {
        console.warn('⚠️ Não foi possível recuperar dados persistidos:', e);
      }
    }

    this.estado.intervaloVerificacao = setInterval(async () => {
      if (!this.estado.transacaoId) return;
      
      const dados = await this.consultarStatus(this.estado.transacaoId);
      
      if (dados) {
        const statusNormalizado = this.normalizarStatus(dados);
        this.estado.status = statusNormalizado;
        
        if (statusNormalizado === 'paid') {
          console.log('🎉 Pagamento confirmado!');
          this.pagamentoConfirmado(dados);
          clearInterval(this.estado.intervaloVerificacao);
        } else if (statusNormalizado === 'expired') {
          console.log('⏰ PIX expirado');
          this.pixExpirado();
          clearInterval(this.estado.intervaloVerificacao);
        } else {
          console.log('🔄 Aguardando pagamento...');
          const waitingMsg = (typeof window !== 'undefined' && window.PaymentConfig && window.PaymentConfig.messages && window.PaymentConfig.messages.waitingPayment) ? window.PaymentConfig.messages.waitingPayment : 'Aguardando pagamento...';
          this.atualizarStatus(waitingMsg);
        }
      }
    }, intervalMs); // Usar intervalo configurado
  },
  
  // Atualizar status na tela - VERSÃO CORRIGIDA
  atualizarStatus(mensagem) {
    const statusDiv = document.getElementById('paymentStatus');
    if (statusDiv) {
      statusDiv.innerHTML = `
        <div class="payment-status">
          <div class="payment-spinner"></div>
          <span>${mensagem}</span>
        </div>
      `;
    }
  },
  
  // Pagamento confirmado - VERSÃO CORRIGIDA
  pagamentoConfirmado(dados) {
    console.log('🎉 Pagamento confirmado!', dados);
    
    // Atualizar status
    const statusDiv = document.getElementById('paymentStatus');
    if (statusDiv) {
      statusDiv.innerHTML = `
        <div class="payment-status success">
          <i class="fas fa-check-circle"></i>
          <span>Pagamento confirmado! Redirecionando...</span>
        </div>
      `;
    }
    
    // Atualizar contador de compras
    this.atualizarContadorCompras();
    
    // Liberar conteúdo
    this.liberarConteudo();
    
    // Salvar no banco de dados para remarketing
    if (typeof Database !== 'undefined') {
      Database.adicionarCliente({
        transactionId: dados.id || this.estado.transacaoId,
        valor: (this.estado.valorAtual / 100).toFixed(2),
        plano: this.estado.planoAtual,
        status: 'paid',
        origem: 'site',
        tags: ['convertido', 'pago', this.estado.planoAtual.toLowerCase().replace(/\s+/g, '_')]
      });
    }
    
    // Limpar dados persistidos da transação
    try {
      localStorage.removeItem('pushinpay.transacaoId');
      localStorage.removeItem('pushinpay.valorAtual');
      localStorage.removeItem('pushinpay.planoAtual');
    } catch (e) {
      console.warn('⚠️ Não foi possível limpar dados persistidos:', e);
    }

    // Redirecionar para página de agradecimento após 3 segundos
    setTimeout(() => {
      this.irParaAgradecimento(dados);
    }, 3000);
  },
  
  // PIX expirado - VERSÃO CORRIGIDA
  pixExpirado() {
    const statusDiv = document.getElementById('paymentStatus');
    if (statusDiv) {
      statusDiv.innerHTML = `
        <div class="payment-status error">
          <i class="fas fa-times-circle"></i>
          <span>PIX expirado. Crie um novo pagamento.</span>
        </div>
      `;
    }

    // Limpar dados persistidos da transação
    try {
      localStorage.removeItem('pushinpay.transacaoId');
      localStorage.removeItem('pushinpay.valorAtual');
      localStorage.removeItem('pushinpay.planoAtual');
    } catch (e) {
      console.warn('⚠️ Não foi possível limpar dados persistidos:', e);
    }
  },
  
  // Liberar conteúdo
  liberarConteudo() {
    console.log('🔓 Liberando conteúdo...');
    
    // Verificar se produto atual está definido
    if (!window.currentProduct) {
      console.error('❌ ERRO CRÍTICO: window.currentProduct não está definido!');
      console.log('🔍 Tentando recuperar produto do estado atual...');
      
      // Tentar recuperar produto do estado do PushinPay
      if (this.estado.planoAtual) {
        console.log('📦 Produto encontrado no estado:', this.estado.planoAtual);
        // Buscar produto pelo título no array de produtos
        const product = window.products ? window.products.find(p => p.title === this.estado.planoAtual) : null;
        if (product) {
          window.currentProduct = product;
          console.log('✅ Produto recuperado:', product.title, product.id);
        }
      }
    }
    
    // Integrar com sistema principal
    if (typeof simulatePaymentConfirmation === 'function') {
      const productId = window.currentProduct ? window.currentProduct.id : null;
      console.log('🎯 Produto ID para confirmação:', productId);
      
      if (productId) {
        console.log('✅ Chamando simulatePaymentConfirmation...');
        simulatePaymentConfirmation(productId);
      } else {
        console.error('❌ ERRO: Não foi possível identificar o produto para confirmação!');
        // Tentar liberar conteúdo mesmo sem produto específico
        this.liberarConteudoGenerico();
      }
    } else {
      console.error('❌ ERRO: simulatePaymentConfirmation não está disponível!');
    }
    
    // Fechar modal de pagamento
    if (typeof closePaymentModal === 'function') {
      setTimeout(() => {
        closePaymentModal();
      }, 2000);
    }
    
    // Remover blur das imagens
    document.querySelectorAll('.blur').forEach(element => {
      element.classList.remove('blur');
    });
    
    // Remover marca d'água
    document.querySelectorAll('.watermark').forEach(element => {
      element.style.display = 'none';
    });
  },
  
  // Liberar conteúdo genérico quando produto específico não é encontrado
  liberarConteudoGenerico() {
    console.log('🔓 Liberando conteúdo genérico...');
    
    // Mostrar notificação de pagamento confirmado
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #25D366, #128C7E);
      color: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 10000;
      font-weight: 600;
      font-size: 18px;
      text-align: center;
      max-width: 400px;
      border: 3px solid rgba(255, 255, 255, 0.2);
    `;
    
    notification.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 15px;">🎉</div>
      <h3 style="margin: 0 0 15px 0;">Pagamento Confirmado!</h3>
      <p style="margin: 0 0 20px 0;">Seu produto será entregue automaticamente.</p>
      <p style="margin: 0; font-size: 14px; opacity: 0.9;">Verifique seus downloads ou entre em contato conosco.</p>
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 5 segundos
    setTimeout(() => {
      notification.remove();
    }, 5000);
    
    // Tentar adicionar botões de download para todos os produtos se usuário estiver logado
    if (window.currentUser && window.updateProductCardsForUser) {
      setTimeout(() => {
        console.log('🔄 Atualizando cards de produtos para usuário logado...');
        window.updateProductCardsForUser();
      }, 2000);
    }
  },
  
  // Ir para página de agradecimento
  irParaAgradecimento(dados) {
    console.log('🎉 Redirecionando para página de agradecimento...');
    
    // Fechar modal primeiro
    this.fecharModal();
    
    // Redirecionar para página de agradecimento com dados
    const params = new URLSearchParams({
      id: dados.id || this.estado.transacaoId,
      valor: (this.estado.valorAtual / 100).toFixed(2).replace('.', ','),
      plano: this.estado.planoAtual,
      status: 'paid',
      timestamp: new Date().toISOString()
    });
    
    // Redirecionar para a página de agradecimento (tolerante à ausência do arquivo)
    const destino = (typeof window !== 'undefined' && window.PaymentConfig && window.PaymentConfig.urls && window.PaymentConfig.urls.success) ? window.PaymentConfig.urls.success : 'agradecimento.html';
    try {
      window.location.href = `${destino}?${params.toString()}`;
    } catch (e) {
      console.warn('⚠️ Redirecionamento falhou, mostrando notificação de sucesso local.');
      this.liberarConteudoGenerico();
    }
  },
  
  // Fechar modal - VERSÃO CORRIGIDA
  fecharModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  },
  
  // Parar verificação
  pararVerificacao() {
    if (this.estado.intervaloVerificacao) {
      clearInterval(this.estado.intervaloVerificacao);
      console.log('⏹️ Verificação parada');
    }
  },
  
  // Atualizar valor e plano
  atualizarValorPlano(valor, plano) {
    this.estado.valorAtual = Math.round(valor * 100); // Converter para centavos
    this.estado.planoAtual = plano;
    console.log('💰 Valor e plano atualizados:', { valor: this.estado.valorAtual, plano: this.estado.planoAtual });
  },
  
  // Atualizar contador de compras
  atualizarContadorCompras() {
    try {
      // Buscar o elemento do contador de produtos vendidos
      const statNumber = document.querySelector('.stat-card .stat-number');
      
      if (statNumber) {
        // Obter valor atual do contador
        const valorAtual = parseInt(statNumber.textContent) || 388;
        
        // Incrementar o contador
        const novoValor = valorAtual + 1;
        statNumber.textContent = novoValor;
        
        // Salvar no localStorage para persistência
        localStorage.setItem('totalCompras', novoValor.toString());
        
        console.log('📊 Contador de compras atualizado:', valorAtual, '→', novoValor);
        
        // Adicionar animação de incremento
        statNumber.style.transform = 'scale(1.1)';
        statNumber.style.color = '#25D366';
        statNumber.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
          statNumber.style.transform = 'scale(1)';
          statNumber.style.color = '';
        }, 1000);
        
        // Mostrar notificação de compra registrada
        this.mostrarNotificacaoCompra(novoValor);
        
      } else {
        console.warn('⚠️ Elemento do contador não encontrado');
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar contador:', error);
    }
  },
  
  // Mostrar notificação de compra registrada
  mostrarNotificacaoCompra(totalCompras) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #25D366, #128C7E);
      color: white;
      padding: 15px 25px;
      border-radius: 50px;
      box-shadow: 0 8px 25px rgba(37, 211, 102, 0.3);
      z-index: 10000;
      font-weight: 600;
      font-size: 16px;
      animation: slideDown 0.5s ease-out;
      border: 2px solid rgba(255, 255, 255, 0.2);
    `;
    
    notification.innerHTML = `
      <i class="fas fa-shopping-cart" style="margin-right: 10px;"></i>
      Compra registrada! Total: ${totalCompras} produtos vendidos
    `;
    
    // Adicionar CSS da animação se não existir
    if (!document.getElementById('compraNotificationStyles')) {
      const style = document.createElement('style');
      style.id = 'compraNotificationStyles';
      style.textContent = `
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          to {
            opacity: 0;
            transform: translateX(-50%) translateY(-100%);
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remover após 4 segundos
    setTimeout(() => {
      notification.style.animation = 'slideUp 0.5s ease-in';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 500);
    }, 4000);
  }
};

// Exportar para global
if (typeof window !== 'undefined') {
  window.PushinPayReal = PushinPayReal;
}
