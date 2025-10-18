// ========================================
// CONFIGURAÇÃO PUSHINPAY - CARREGADO STORE
// ========================================

class PushinPayConfig {
    constructor() {
        this.config = {
            // URLs da API
            apiBaseUrl: '/api/payment',
            createPixEndpoint: '/create-pix',
            checkStatusEndpoint: '/check-status',
            confirmPaymentEndpoint: '/confirm-payment',
            
            // Configurações de tempo
            checkInterval: 3000, // 3 segundos
            pixExpirationTime: 30 * 60 * 1000, // 30 minutos em ms
            
            // Configurações de retry
            maxRetries: 3,
            retryDelay: 1000, // 1 segundo
        };
    }

    // Obter URL completa para criar PIX
    getCreatePixUrl() {
        return `${this.config.apiBaseUrl}${this.config.createPixEndpoint}`;
    }

    // Obter URL completa para verificar status
    getCheckStatusUrl(transactionId) {
        return `${this.config.apiBaseUrl}${this.config.checkStatusEndpoint}/${transactionId}`;
    }

    // Obter URL completa para confirmar pagamento
    getConfirmPaymentUrl() {
        return `${this.config.apiBaseUrl}${this.config.confirmPaymentEndpoint}`;
    }

    // Obter intervalo de verificação
    getCheckInterval() {
        return this.config.checkInterval;
    }

    // Obter tempo de expiração do PIX
    getPixExpirationTime() {
        return this.config.pixExpirationTime;
    }

    // Obter configurações de retry
    getRetryConfig() {
        return {
            maxRetries: this.config.maxRetries,
            retryDelay: this.config.retryDelay
        };
    }

    // Validar se o token está configurado
    isTokenConfigured() {
        // Esta validação será feita no backend
        return true;
    }

    // Obter headers padrão para requisições
    getDefaultHeaders() {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    // Obter configurações de timeout
    getTimeoutConfig() {
        return {
            createPix: 10000, // 10 segundos
            checkStatus: 5000, // 5 segundos
            confirmPayment: 10000 // 10 segundos
        };
    }
}

// Criar instância global
window.PushinPayConfig = new PushinPayConfig();

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PushinPayConfig;
}
