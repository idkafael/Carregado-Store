// ========================================
// PUSHINPAY REAL - SISTEMA DE PAGAMENTO PIX
// ========================================

class PushinPayReal {
    constructor() {
        this.estado = {
    transacaoId: null,
    status: 'pending',
    intervaloVerificacao: null,
            valorAtual: 0,
            planoAtual: ''
        };
    }

    // Atualizar valor e plano
    atualizarValorPlano(valor, plano) {
        this.estado.valorAtual = Math.round(valor * 100); // Converter para centavos
        this.estado.planoAtual = plano;
        console.log(`PushinPay: Valor atualizado para R$ ${valor} - Plano: ${plano}`);
    }

    // Parar verificação de pagamento
    pararVerificacao() {
        if (this.estado.intervaloVerificacao) {
            clearInterval(this.estado.intervaloVerificacao);
            this.estado.intervaloVerificacao = null;
        }
        console.log('PushinPay: Verificação parada');
    }

    // Criar PIX
    async criarPix() {
        try {
            const response = await fetch('/api/payment/create-pix', {
        method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
        body: JSON.stringify({
                    amount: this.estado.valorAtual,
                    description: this.estado.planoAtual
        })
      });
      
      if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
      }
      
      const data = await response.json();
            this.estado.transacaoId = data.transaction_id || data.id;
            this.estado.status = 'pending';
            
            console.log('PushinPay: PIX criado com sucesso', data);
      return data;
    } catch (error) {
            console.error('PushinPay: Erro ao criar PIX:', error);
      throw error;
    }
    }

    // Exibir QR Code
    exibirQRCode(qrBase64) {
        const qrCodeImg = document.getElementById('qrCodeImg');
        if (qrCodeImg) {
            qrCodeImg.src = `data:image/png;base64,${qrBase64}`;
            qrCodeImg.style.display = 'block';
        }
        console.log('PushinPay: QR Code exibido');
    }

    // Exibir código PIX
    exibirCodigoPix(qrCodeText) {
        const pixCodeInput = document.getElementById('pixCode');
        if (pixCodeInput) {
            pixCodeInput.value = qrCodeText;
        }
        console.log('PushinPay: Código PIX exibido');
    }
  
  // Iniciar verificação de pagamento
  iniciarVerificacao() {
    if (this.estado.intervaloVerificacao) {
      clearInterval(this.estado.intervaloVerificacao);
    }
    
        this.estado.intervaloVerificacao = setInterval(async () => {
            try {
                const response = await fetch(`/api/payment/check-status/${this.estado.transacaoId}`);
                const data = await response.json();
                
                if (data.status === 'paid' || data.paid === true) {
                    this.estado.status = 'paid';
                    this.pararVerificacao();
                    
                    // Notificar pagamento aprovado
                    if (typeof window.onPaymentSuccess === 'function') {
                        window.onPaymentSuccess(data);
                    }
                    
                    console.log('PushinPay: Pagamento aprovado!');
                }
            } catch (error) {
                console.error('PushinPay: Erro na verificação:', error);
            }
        }, 3000); // Verificar a cada 3 segundos

        console.log('PushinPay: Verificação iniciada');
    }

    // Verificar status do pagamento
    async verificarStatus() {
        if (!this.estado.transacaoId) {
            throw new Error('Nenhuma transação ativa');
        }

        try {
            const response = await fetch(`/api/payment/check-status/${this.estado.transacaoId}`);
            const data = await response.json();
            
            this.estado.status = data.status || 'pending';
            return data;
        } catch (error) {
            console.error('PushinPay: Erro ao verificar status:', error);
            throw error;
        }
    }

    // Resetar estado
    reset() {
        this.pararVerificacao();
        this.estado = {
            transacaoId: null,
            status: 'pending',
            intervaloVerificacao: null,
            valorAtual: 0,
            planoAtual: ''
        };
        console.log('PushinPay: Estado resetado');
    }
}

// Criar instância global
window.PushinPayReal = new PushinPayReal();

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PushinPayReal;
}



