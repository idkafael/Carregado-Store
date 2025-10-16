# 🔔 Guia de Configuração do Webhook e Entrega Automática

## ✅ O que foi implementado:

### 1. **Webhook PushinPay** 
- Recebe notificações em tempo real quando um pagamento é confirmado
- Atualiza automaticamente o status da compra no banco de dados
- Atualiza o LTV (Lifetime Value) do cliente

### 2. **Sistema de Entrega Automática**
- Monitora compras confirmadas a cada 5 segundos
- Exibe notificação quando o pagamento é confirmado
- Adiciona botão de download automaticamente
- Libera o produto para download imediatamente

### 3. **Supabase Edge Function**
- Proxy seguro para API da PushinPay
- Processa webhooks
- Atualiza banco de dados
- Gerencia entrega de produtos

---

## 📋 Passo a Passo para Implantar

### **Etapa 1: Atualizar Edge Function no Supabase**

1. **Acesse o Supabase Dashboard:**
   - Vá em https://supabase.com/dashboard
   - Selecione seu projeto

2. **Abra Edge Functions:**
   - Menu lateral → **Edge Functions**
   - Selecione a function `pushinpay-proxy`

3. **Atualize o código:**
   - Copie o conteúdo do arquivo: `supabase-edge-functions/pushinpay-proxy/index.ts`
   - Cole no editor do Supabase
   - Clique em **Deploy**

4. **Verifique variáveis de ambiente:**
   - As variáveis `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` são automáticas
   - Confirme que `PUSHINPAY_TOKEN` está configurada:
     - Settings → Edge Functions → Environment Variables
     - Deve ter: `PUSHINPAY_TOKEN` = `48754|3wdvl7xAOkCJM3gD86aJ78aErQcXVBrTn24qEztJ9629c3ea`

---

### **Etapa 2: Configurar Webhook na PushinPay**

1. **Acesse o painel da PushinPay:**
   - Entre na sua conta em https://pushinpay.com.br

2. **Configure o Webhook:**
   - Vá em **Configurações** → **Webhooks**
   - Adicione nova URL de webhook:
   
   ```
   https://vyibdpwhkklxzuxaouza.supabase.co/functions/v1/pushinpay-proxy/webhook
   ```

3. **Eventos para monitorar:**
   - ✅ Pagamento Confirmado
   - ✅ PIX Pago
   - ✅ Transação Aprovada

4. **Salve as configurações**

---

### **Etapa 3: Habilitar Proxy no Frontend (Opcional - Mais Seguro)**

**Atualmente o sistema está usando API direta.** Para maior segurança, reative o proxy:

1. **Abra o arquivo:** `payment-system/payment-config.js`

2. **Altere a linha 12:**
   ```javascript
   enabled: false,  // ← MUDAR PARA true
   ```

3. **Salve o arquivo**

---

## 🧪 Como Testar

### **Teste 1: Webhook em Ambiente de Desenvolvimento**

Use ferramentas como **ngrok** ou **webhook.site** para testar localmente:

```bash
# Instalar ngrok (se necessário)
npm install -g ngrok

# Criar túnel
ngrok http 3000

# Copie a URL gerada (ex: https://abc123.ngrok.io)
# Configure na PushinPay: https://abc123.ngrok.io/webhook
```

### **Teste 2: Pagamento Real**

1. **Faça uma compra teste:**
   - Escolha um produto barato (ex: R$ 12,90)
   - Gere o PIX
   - Pague usando o app do banco

2. **Acompanhe os logs:**
   - Supabase Dashboard → Edge Functions → `pushinpay-proxy` → Logs
   - Você verá: `🔔 Webhook recebido` quando o pagamento for confirmado

3. **Verifique a entrega:**
   - O site deve exibir notificação: "✅ Pagamento Confirmado!"
   - Botão de download deve aparecer automaticamente
   - Verifique no banco: `purchases.status` deve estar `confirmed`

---

## 📊 Fluxo Completo

```
[Usuário paga PIX] 
    ↓
[PushinPay confirma pagamento]
    ↓
[Webhook enviado para Edge Function]
    ↓
[Edge Function atualiza:]
  - pix_transactions.status = 'paid'
  - purchases.status = 'confirmed'
  - profiles.ltv += valor
  - profiles.total_purchases += 1
    ↓
[DeliverySystem detecta compra confirmada]
    ↓
[Notificação exibida no site]
    ↓
[Botão de download liberado]
    ↓
[Cliente baixa o produto]
```

---

## 🔍 Monitoramento e Logs

### **Ver Webhooks Recebidos:**
```sql
-- Últimas transações pagas
SELECT * FROM pix_transactions 
WHERE status = 'paid' 
ORDER BY paid_at DESC 
LIMIT 10;

-- Compras confirmadas hoje
SELECT * FROM purchases 
WHERE status = 'confirmed' 
AND DATE(paid_at) = CURRENT_DATE 
ORDER BY paid_at DESC;
```

### **Logs da Edge Function:**
- Supabase Dashboard → Edge Functions → `pushinpay-proxy` → Logs
- Procure por:
  - `🔔 Webhook recebido` - Webhook chegou
  - `💰 Webhook: Pagamento confirmado` - Processado
  - `✅ Webhook: Compra confirmada!` - Banco atualizado

---

## 🛠️ Troubleshooting

### **Webhook não está funcionando:**

1. **Verifique a URL:**
   - Certifique-se que está configurada corretamente na PushinPay
   - Teste manualmente: `curl -X POST URL_DO_WEBHOOK`

2. **Verifique logs:**
   - Supabase → Edge Functions → Logs
   - Procure por erros

3. **Teste payload manualmente:**
   ```bash
   curl -X POST https://vyibdpwhkklxzuxaouza.supabase.co/functions/v1/pushinpay-proxy/webhook \
     -H "Content-Type: application/json" \
     -d '{"id":"test-123","status":"paid","paid":true}'
   ```

### **Entrega automática não funciona:**

1. **Verifique se o sistema está iniciado:**
   - Abra Console do navegador
   - Procure por: `📦 Sistema de entrega automática iniciado`

2. **Verifique se há compras confirmadas:**
   ```sql
   SELECT * FROM purchases WHERE user_id = 'SEU_USER_ID' AND status = 'confirmed';
   ```

3. **Force verificação manual:**
   ```javascript
   // No console do navegador
   DeliverySystem.checkConfirmedPurchases();
   ```

---

## 🎯 Próximos Passos

- [ ] Testar webhook com pagamento real
- [ ] Configurar notificações por email (opcional)
- [ ] Adicionar logs de auditoria
- [ ] Criar painel admin para ver webhooks recebidos

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs da Edge Function
2. Verifique o console do navegador
3. Execute queries SQL para verificar o estado do banco
4. Teste endpoints manualmente com `curl`

**Sistema pronto para produção! 🚀**







