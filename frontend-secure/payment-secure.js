// Sistema de Pagamento Seguro - Frontend
// Todas as operações sensíveis são feitas via backend

const SecurePaymentSystem = {
  // Estado atual
  estado: {
    transacaoId: null,
    status: 'pending',
    intervaloVerificacao: null,
    valorAtual: 0,
    planoAtual: ''
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
  
  // Criar PIX via API segura
  async criarPix() {
    try {
      console.log('🔍 Criando PIX via API segura...');
      
      if (!window.currentUser) {
        throw new Error('Usuário não autenticado');
      }

      if (!window.currentProduct) {
        throw new Error('Produto não selecionado');
      }

      // Criar PIX via API backend
      const result = await apiClient.createPix(
        this.estado.valorAtual,
        window.currentProduct.id,
        window.currentProduct.title,
        window.currentProduct.selectedModel?.id || null,
        window.currentProduct.selectedModel?.name || null
      );

      if (result.success) {
        console.log('✅ PIX criado com sucesso:', result.data);
        
        // Salvar dados da transação
        this.estado.transacaoId = result.data.transactionId;
        this.estado.status = 'pending';
        
        // Persistir dados
        try {
          localStorage.setItem('secure.transacaoId', this.estado.transacaoId || '');
          localStorage.setItem('secure.valorAtual', String(this.estado.valorAtual));
          localStorage.setItem('secure.planoAtual', this.estado.planoAtual || '');
        } catch (e) {
          console.warn('⚠️ Não foi possível persistir dados:', e);
        }
        
        return result.data;
      } else {
        throw new Error(result.error || 'Erro ao criar PIX');
      }
      
    } catch (error) {
      console.error('❌ Erro ao criar PIX:', error);
      throw error;
    }
  },
  
  // Consultar status do PIX via API segura
  async consultarStatus(transacaoId) {
    try {
      console.log('🔍 Consultando status do PIX:', transacaoId);
      
      const result = await apiClient.checkPixStatus(transacaoId);
      
      if (result.success) {
        const normalized = { 
          ...result.data, 
          status: this.normalizarStatus(result.data) 
        };
        console.log('✅ Status consultado:', normalized);
        return normalized;
      } else {
        throw new Error(result.error || 'Erro ao consultar status');
      }
      
    } catch (error) {
      console.error('❌ Erro ao consultar status:', error);
      return null;
    }
  },

  // Verificação manual
  async verificarAgora() {
    if (!this.estado.transacaoId) {
      const persistido = localStorage.getItem('secure.transacaoId');
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
  
  // Exibir QR Code
  exibirQRCode(qrCodeBase64) {
    const container = document.getElementById('qrCode');
    if (!container) {
      console.error('❌ Container QR Code não encontrado');
      return;
    }
    
    container.innerHTML = '';
    
    if (!qrCodeBase64 || typeof qrCodeBase64 !== 'string') {
      console.error('❌ QR Code inválido:', qrCodeBase64);
      container.innerHTML = '<p style="color: red; text-align: center;">Erro ao carregar QR Code</p>';
      return;
    }
    
    let qrCodeSrc = qrCodeBase64;
    
    const img = document.createElement('img');
    img.src = qrCodeSrc;
    img.alt = 'QR Code PIX';
    img.style.maxWidth = '250px';
    img.style.height = 'auto';
    img.style.margin = '0 auto';
    img.style.display = 'block';
    img.style.border = '2px solid #ddd';
    img.style.borderRadius = '8px';
    img.style.backgroundColor = '#ffffff';
    img.style.padding = '10px';
    
    img.onerror = function() {
      console.error('❌ Erro ao carregar imagem do QR Code');
      container.innerHTML = '<p style="color: red; text-align: center;">Erro ao carregar QR Code</p>';
    };
    
    img.onload = function() {
      console.log('✅ QR Code carregado com sucesso');
    };
    
    container.appendChild(img);
    console.log('✅ QR Code exibido');
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
    const intervalMs = 5000; // 5 segundos
    
    // Recuperar transação persistida se necessário
    if (!this.estado.transacaoId) {
      try {
        const persistido = localStorage.getItem('secure.transacaoId');
        if (persistido) this.estado.transacaoId = persistido;
        const valorPersistido = parseFloat(localStorage.getItem('secure.valorAtual') || '0');
        if (valorPersistido > 0) this.estado.valorAtual = valorPersistido;
        const planoPersistido = localStorage.getItem('secure.planoAtual');
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
          this.atualizarStatus('Aguardando pagamento...');
        }
      }
    }, intervalMs);
  },
  
  // Atualizar status na tela
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
  
  // Pagamento confirmado
  pagamentoConfirmado(dados) {
    console.log('🎉 Pagamento confirmado!', dados);
    
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
    
    // Limpar dados persistidos
    try {
      localStorage.removeItem('secure.transacaoId');
      localStorage.removeItem('secure.valorAtual');
      localStorage.removeItem('secure.planoAtual');
    } catch (e) {
      console.warn('⚠️ Não foi possível limpar dados persistidos:', e);
    }

    // Redirecionar após 3 segundos
    setTimeout(() => {
      this.irParaAgradecimento(dados);
    }, 3000);
  },
  
  // PIX expirado
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

    // Limpar dados persistidos
    try {
      localStorage.removeItem('secure.transacaoId');
      localStorage.removeItem('secure.valorAtual');
      localStorage.removeItem('secure.planoAtual');
    } catch (e) {
      console.warn('⚠️ Não foi possível limpar dados persistidos:', e);
    }
  },
  
  // Liberar conteúdo
  liberarConteudo() {
    console.log('🔓 Liberando conteúdo...');
    
    if (!window.currentProduct) {
      console.error('❌ ERRO CRÍTICO: window.currentProduct não está definido!');
      this.liberarConteudoGenerico();
      return;
    }
    
    // Integrar com sistema principal
    if (typeof simulatePaymentConfirmation === 'function') {
      const productId = window.currentProduct.id;
      console.log('🎯 Produto ID para confirmação:', productId);
      
      if (productId) {
        console.log('✅ Chamando simulatePaymentConfirmation...');
        simulatePaymentConfirmation(productId);
      } else {
        console.error('❌ ERRO: Não foi possível identificar o produto!');
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
  
  // Liberar conteúdo genérico
  liberarConteudoGenerico() {
    console.log('🔓 Liberando conteúdo genérico...');
    
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
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
    
    // Atualizar cards de produtos se usuário estiver logado
    if (window.currentUser && window.updateProductCardsForUserSecure) {
      setTimeout(() => {
        console.log('🔄 Atualizando cards de produtos...');
        window.updateProductCardsForUserSecure();
      }, 2000);
    }
  },
  
  // Ir para página de agradecimento
  irParaAgradecimento(dados) {
    console.log('🎉 Redirecionando para página de agradecimento...');
    
    this.fecharModal();
    
    const params = new URLSearchParams({
      id: dados.id || this.estado.transacaoId,
      valor: this.estado.valorAtual.toFixed(2).replace('.', ','),
      plano: this.estado.planoAtual,
      status: 'paid',
      timestamp: new Date().toISOString()
    });
    
    const destino = 'agradecimento.html';
    try {
      window.location.href = `${destino}?${params.toString()}`;
    } catch (e) {
      console.warn('⚠️ Redirecionamento falhou, mostrando notificação local.');
      this.liberarConteudoGenerico();
    }
  },
  
  // Fechar modal
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
    this.estado.valorAtual = valor;
    this.estado.planoAtual = plano;
    console.log('💰 Valor e plano atualizados:', { valor: this.estado.valorAtual, plano: this.estado.planoAtual });
  },
  
  // Atualizar contador de compras
  atualizarContadorCompras() {
    try {
      const statNumber = document.querySelector('.stat-card .stat-number');
      
      if (statNumber) {
        const valorAtual = parseInt(statNumber.textContent) || 388;
        const novoValor = valorAtual + 1;
        statNumber.textContent = novoValor;
        
        localStorage.setItem('totalCompras', novoValor.toString());
        
        console.log('📊 Contador de compras atualizado:', valorAtual, '→', novoValor);
        
        statNumber.style.transform = 'scale(1.1)';
        statNumber.style.color = '#25D366';
        statNumber.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
          statNumber.style.transform = 'scale(1)';
          statNumber.style.color = '';
        }, 1000);
        
        this.mostrarNotificacaoCompra(novoValor);
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar contador:', error);
    }
  },
  
  // Mostrar notificação de compra
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
    
    document.body.appendChild(notification);
    
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
  window.SecurePaymentSystem = SecurePaymentSystem;
  
  // Alias para compatibilidade com script.js
  window.PushinPayReal = SecurePaymentSystem;
}
