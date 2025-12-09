# 🚀 Integração PushinPay - Carregado Store

## 📋 Visão Geral

Esta integração permite processar pagamentos PIX usando o gateway PushinPay com autenticação por token. O sistema foi completamente atualizado para usar a API oficial do PushinPay.

## 🔧 Configuração

### 1. Variáveis de Ambiente

Certifique-se de que as seguintes variáveis estão configuradas no seu ambiente:

```env
# Token do PushinPay (obrigatório)
PUSHINPAY_TOKEN=48754|3wdvl7xAOkCJM3gD86aJ78aErQcXVBrTn24qEztJ9629c3ea

# Supabase (para armazenar transações)
SUPABASE_URL=https://vyibdpwhkklxzuxaouza.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# CORS
ALLOWED_ORIGINS=https://carregado.store,https://www.carregado.store
```

### 2. Estrutura de Arquivos

```
payment-system/
├── pushinpay-config.js      # Configurações do PushinPay
├── pushinpay-real.js        # Cliente principal do PushinPay
└── payment-styles.css       # Estilos do sistema de pagamento

api/
└── payment.js               # API backend para processar pagamentos
```

## 🚀 Como Usar

### 1. No Frontend

```javascript
// Inicializar o sistema
const pushinPay = window.PushinPayReal;

// Definir valor e descrição
pushinPay.atualizarValorPlano(50.00, 'Produto Teste');

// Criar PIX
const pixData = await pushinPay.criarPix();

// Exibir QR Code
if (pixData.qr_code) {
    pushinPay.exibirQRCode(pixData.qr_code);
}

// Exibir código PIX
if (pixData.pix_code) {
    pushinPay.exibirCodigoPix(pixData.pix_code);
}

// Iniciar verificação automática
pushinPay.iniciarVerificacao();

// Callback para pagamento aprovado
window.onPaymentSuccess = function(data) {
    console.log('Pagamento aprovado!', data);
};
```

### 2. Endpoints da API

#### Criar PIX
```http
POST /api/payment/create-pix
Content-Type: application/json

{
    "amount": 50.00,
    "description": "Produto Teste",
    "productId": "123",
    "userId": "456"
}
```

**Resposta:**
```json
{
    "success": true,
    "id": "pix_123456",
    "transaction_id": "123",
    "pix_code": "00020126580014br.gov.bcb.pix...",
    "qr_code": "base64_encoded_qr_code",
    "amount": 50.00,
    "description": "Produto Teste",
    "expires_at": "2024-01-01T12:30:00.000Z"
}
```

#### Verificar Status
```http
GET /api/payment/check-status/{transactionId}
```

**Resposta:**
```json
{
    "success": true,
    "status": "paid",
    "paid": true,
    "message": "Pagamento confirmado! Produto liberado."
}
```

## 🧪 Testando a Integração

### 1. Arquivo de Teste

Use o arquivo `test-pushinpay.html` para testar a integração:

1. Abra `test-pushinpay.html` no navegador
2. Configure o valor e descrição
3. Clique em "Criar PIX"
4. Use o QR Code ou código PIX para pagar
5. Monitore o status em tempo real

### 2. Teste Manual

```javascript
// No console do navegador
const pushinPay = window.PushinPayReal;

// Testar criação
pushinPay.atualizarValorPlano(10.00, 'Teste');
const pix = await pushinPay.criarPix();
console.log('PIX criado:', pix);

// Testar verificação
const status = await pushinPay.verificarStatus();
console.log('Status:', status);
```

## 🔄 Fluxo de Pagamento

1. **Cliente seleciona produto** → `atualizarValorPlano()`
2. **Sistema cria PIX** → `criarPix()` → API PushinPay
3. **Exibe QR Code/Código** → `exibirQRCode()` / `exibirCodigoPix()`
4. **Inicia verificação** → `iniciarVerificacao()` (a cada 3s)
5. **Pagamento detectado** → `onPaymentSuccess()` callback
6. **Produto liberado** → Sistema atualiza status

## 🛠️ Configurações Avançadas

### Personalizar URLs da API

```javascript
// Em pushinpay-config.js
const config = {
    apiBaseUrl: '/api/payment',
    createPixEndpoint: '/create-pix',
    checkStatusEndpoint: '/check-status',
    checkInterval: 3000, // 3 segundos
    pixExpirationTime: 30 * 60 * 1000 // 30 minutos
};
```

### Personalizar Headers

```javascript
// Adicionar headers customizados
const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer custom-token',
    'X-Custom-Header': 'value'
};
```

## 🚨 Tratamento de Erros

### Erros Comuns

1. **Token inválido**: Verifique `PUSHINPAY_TOKEN`
2. **Valor inválido**: Use valores positivos em reais
3. **Rede indisponível**: Verifique conectividade
4. **PIX expirado**: Crie um novo PIX após 30 minutos

### Logs de Debug

```javascript
// Ativar logs detalhados
console.log('PushinPay Debug:', pushinPay.estado);
console.log('Config:', pushinPay.config);
```

## 📊 Monitoramento

### Métricas Importantes

- Taxa de conversão de PIX
- Tempo médio de pagamento
- Erros de API
- PIXs expirados

### Logs da API

A API registra todos os eventos importantes:
- Criação de PIX
- Verificações de status
- Pagamentos confirmados
- Erros de integração

## 🔒 Segurança

### Boas Práticas

1. **Nunca exponha o token** no frontend
2. **Use HTTPS** em produção
3. **Valide dados** antes de enviar
4. **Monitore logs** regularmente
5. **Configure CORS** adequadamente

### Validações

- Valor mínimo: R$ 0,01
- Valor máximo: R$ 10.000,00
- Descrição: máximo 100 caracteres
- Expiração: 30 minutos

## 🆘 Suporte

### Problemas Conhecidos

1. **QR Code não aparece**: Verifique se `qr_code` está na resposta
2. **Status não atualiza**: Verifique se a verificação está ativa
3. **PIX não é criado**: Verifique token e conectividade

### Contato

- **PushinPay**: [Documentação oficial](https://pushinpay.com/docs)
- **Carregado Store**: [Instagram](https://instagram.com/carregado.ads)

## 📝 Changelog

### v2.0.0 - Integração PushinPay
- ✅ Integração completa com PushinPay API
- ✅ Autenticação por token
- ✅ Verificação automática de status
- ✅ Sistema de configuração flexível
- ✅ Arquivo de teste incluído
- ✅ Tratamento robusto de erros
- ✅ Logs detalhados para debug

---

**🎉 A integração está pronta para uso em produção!**
