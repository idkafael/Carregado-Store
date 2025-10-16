// Sistema de Entrega Automática
// Monitora compras confirmadas e libera downloads automaticamente

const DeliverySystem = {
  // Configurações
  config: {
    checkInterval: 5000, // Verificar a cada 5 segundos
    notificationDuration: 10000 // Duração da notificação (10s)
  },

  // Estado
  state: {
    intervalId: null,
    lastCheck: null,
    processingTransactionId: null
  },

  // Iniciar monitoramento
  async start() {
    console.log('📦 Sistema de entrega automática iniciado');
    
    // Verificar imediatamente
    await this.checkConfirmedPurchases();
    
    // Verificar periodicamente
    this.state.intervalId = setInterval(() => {
      this.checkConfirmedPurchases();
    }, this.config.checkInterval);
  },

  // Parar monitoramento
  stop() {
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId);
      this.state.intervalId = null;
      console.log('📦 Sistema de entrega automática parado');
    }
  },

  // Verificar compras confirmadas
  async checkConfirmedPurchases() {
    if (!window.currentUser) return;

    try {
      // Buscar compras do usuário
      const { data: purchases, error } = await window.supabase
        .from('purchases')
        .select('*')
        .eq('user_id', window.currentUser.id)
        .eq('status', 'confirmed')
        .order('paid_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar compras:', error);
        return;
      }

      if (purchases && purchases.length > 0) {
        console.log(`✅ ${purchases.length} compra(s) confirmada(s) encontrada(s)`);
        
        // Processar cada compra confirmada
        for (const purchase of purchases) {
          await this.processPurchase(purchase);
        }
      }
    } catch (error) {
      console.error('❌ Erro ao verificar compras:', error);
    }
  },

  // Processar compra individual
  async processPurchase(purchase) {
    try {
      // Adicionar botão de download ao produto
      const productElement = document.querySelector(`[data-product-id="${purchase.product_id}"]`);
      if (productElement) {
        this.addDownloadButton(productElement, purchase);
      }

      // Exibir notificação (apenas uma vez por transação)
      if (!this.hasNotified(purchase.id)) {
        this.showPurchaseNotification(purchase);
        this.markAsNotified(purchase.id);
      }

      // Atualizar interface do usuário
      if (typeof updateProductCardsForUserSupabase === 'function') {
        await updateProductCardsForUserSupabase();
      }
    } catch (error) {
      console.error('❌ Erro ao processar compra:', error);
    }
  },

  // Adicionar botão de download
  addDownloadButton(productElement, purchase) {
    // Verificar se já tem botão de download
    if (productElement.querySelector('.download-btn')) {
      return;
    }

    // Criar botão de download
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'btn-primary download-btn';
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> Baixar Agora';
    downloadBtn.onclick = () => this.showDownloadModal(purchase);

    // Encontrar container de botões
    const btnContainer = productElement.querySelector('.product-actions') || 
                        productElement.querySelector('.product-card');
    
    if (btnContainer) {
      btnContainer.appendChild(downloadBtn);
      console.log('✅ Botão de download adicionado ao produto:', purchase.product_id);
    }
  },

  // Exibir modal de download
  async showDownloadModal(purchase) {
    console.log('📥 Abrindo modal de download:', purchase);

    // Buscar dados do produto
    const product = window.PRODUCTS?.find(p => p.id === purchase.product_id);
    
    if (!product) {
      alert('Produto não encontrado!');
      return;
    }

    // Preparar produto com modelo selecionado (se houver)
    const productWithModel = { ...product };
    if (purchase.model_id && purchase.model_name) {
      productWithModel.selectedModel = {
        id: purchase.model_id,
        name: purchase.model_name
      };
    }

    // Chamar função global de download
    if (typeof showDownloadModal === 'function') {
      showDownloadModal(productWithModel);
    } else {
      // Fallback: abrir link diretamente
      if (product.downloadLink) {
        window.open(product.downloadLink, '_blank');
      }
    }
  },

  // Exibir notificação de compra confirmada
  showPurchaseNotification(purchase) {
    console.log('🎉 Exibindo notificação de compra confirmada');

    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = 'purchase-notification success';
    notification.innerHTML = `
      <div class="notification-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <div class="notification-content">
        <h4>✅ Pagamento Confirmado!</h4>
        <p>${purchase.product_name}</p>
        <p class="notification-action">Seu produto já está disponível para download!</p>
      </div>
      <button class="notification-close" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `;

    // Adicionar ao body
    document.body.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    // Remover após duração configurada
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, this.config.notificationDuration);

    // Som de sucesso (opcional)
    this.playSuccessSound();
  },

  // Verificar se já foi notificado
  hasNotified(purchaseId) {
    const notified = localStorage.getItem(`notified_${purchaseId}`);
    return notified === 'true';
  },

  // Marcar como notificado
  markAsNotified(purchaseId) {
    localStorage.setItem(`notified_${purchaseId}`, 'true');
  },

  // Tocar som de sucesso
  playSuccessSound() {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUA0PWrLn77BdGAg+ltryxnMpBSh+zPLaizsIGGS57OihUhENUKrm8LVkHQU2jdXzyn0vBSh+zO/ajDcIF2S47OSiUBINUKrm8LVkHQU2jdXzyn0vBSh+zO/ajDcIF2S47OSiUBINUKrm8LVkHQU2jdXzyn0vBSh+zO/ajDcIF2S47OSiUBINUKrm8LVkHQU2jdXzyn0vBSh+zO/ajDcIF2S47OSiUBINUKrm8LVkHQU2jdXzyn0vBSh+zO/ajDcIF2S47OSiUBINUKrm8LVkHQU2jdXzyn0vBSh+zO/ajDcIF2S47OSiUBINUKrm8LVkHQU2jdXzyn0vBSh+zO/ajDcIF2S47OSiUBINUKrm8LVkHQU2jdXzyn0vBSh+zO/ajDcIF2S47OSiUBINUKrm8LVkHQU2jdXzyn0vBSh+zO/ajDcIF2S47OSiUBINUKrm8LVkHQU2jdXzyn0vBSh+zO/ajDcIF2S47OSiUBINUKrm8LVkHQU2jdXzyn0vBSh+zO/ajDcIF2S47OSiUBINUKrm8LVkHQU2jdXzyn0vBSh+zO/ajDcIF2S47OSiUBINUKrm8LVkHQU2jdXzyn0vBSh+zO/ajDcIF2S47OSiUBINUKrm8LVkHQU2jdXzyn0vBSh+zO/ajDcIF2S47OSiUBINUKrm8LVkHQU2jdXzyn0vBSh+zO/ajDcIF2S47OSiUBINUKrm8LVkHQU2jdXzyn0vBSh+zO/ajDcIF2S47OSiUBINUKrm8LVkHQU2jdXzyn0vBSh+zO/ajDcIF2S47OSiUBINUKrm8LVkHQU2jdXzyn0vBSh+zO/ajDcIF2S47OSiUBINUKrm8LVkHQU2jdXzyn0vBSh+zO/ajDcIF2S47OSiUBINUKrm8LVkHQU2jdXzyn0vBSh+zO/ajDcIF2S47OSiUBINUKrm8LVkHQU2jdXzyn0vBSh+zO/ajDcIF2S47OSiUBINUKrm8LVkHQU2jdXzyn0vBSh+zO/ajDcIF2S47OSiUBINUKrm8LVkHQU2jdXzyn0vBSh+zO/ajDcIF2S47OSiUBINUKrm8LVkHQU2jdXzyn0vBSh+zO/ajDcIF2S47OSiUBINUKrm8LVkHQU2jdXzyn0vBSh+zO/ajDcIF2S47OSiUBINUKrm8LVkHQU2jdXzyn0vBQ==');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (e) {
      // Silenciar erro de áudio
    }
  },

  // Verificar compra específica (para polling ativo)
  async checkSpecificTransaction(transactionId) {
    if (!transactionId) return;
    
    console.log('🔍 Verificando transação:', transactionId);
    
    try {
      const { data, error } = await window.supabase
        .from('pix_transactions')
        .select('*, purchases(*)')
        .eq('transaction_id', transactionId)
        .single();

      if (error) {
        console.error('❌ Erro ao buscar transação:', error);
        return;
      }

      if (data && data.status === 'paid' && data.purchases) {
        console.log('💰 Transação paga encontrada!');
        await this.processPurchase(data.purchases);
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Erro ao verificar transação:', error);
      return false;
    }
  }
};

// Exportar para global
if (typeof window !== 'undefined') {
  window.DeliverySystem = DeliverySystem;
  
  // Iniciar automaticamente quando usuário estiver logado
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (window.currentUser) {
        DeliverySystem.start();
      }
    });
  } else {
    if (window.currentUser) {
      DeliverySystem.start();
    }
  }
}


