# 🚂 Guia de Deploy do Backend no Railway

## 📋 Instruções Passo a Passo

### **1. Acessar Railway**
- Vá para: https://railway.app
- Faça login com sua conta GitHub

### **2. Criar Novo Projeto**
- Clique em "New Project"
- Selecione "Deploy from GitHub repo"
- Conecte seu repositório

### **3. Configurar Variáveis de Ambiente**
No painel do Railway, vá em Variables e adicione:

```env
PORT=3000
NODE_ENV=production
JWT_SECRET=carregado-store-super-secret-jwt-key-2024-production-secure-32-chars-min
SUPABASE_URL=https://vyibdpwhkklxzuxaouza.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
PUSHINPAY_TOKEN=48754|3wdvl7xAOkCJM3gD86aJ78aErQcXVBrTn24qEztJ9629c3ea
PUSHINPAY_BASE_URL=https://api.pushinpay.com.br
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ALLOWED_ORIGINS=https://carregado-store.com,https://www.carregado-store.com,https://carregado-store.vercel.app
```

### **4. Configurar Deploy**
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

### **5. Deploy Automático**
- Railway fará deploy automático
- URL será: `https://carregado-store-backend.railway.app`

## 🔧 Configurações Importantes

### **Health Check:**
- Endpoint: `/api/health`
- Timeout: 100ms

### **CORS:**
- Configurado para aceitar requests do frontend
- Domínios permitidos: carregado-store.com, vercel.app

### **Rate Limiting:**
- 100 requests por 15 minutos por IP
- Proteção contra ataques DDoS

## 📊 Monitoramento

### **Logs:**
- Acesse: Railway Dashboard > Deployments > Logs
- Logs em tempo real disponíveis

### **Métricas:**
- CPU, RAM, Network
- Response times
- Error rates

## 🔗 URLs Finais

- **Frontend:** https://carregado-store-5jeg87q77-rafaels-projects-bc90a5e9.vercel.app
- **Backend:** https://carregado-store-backend.railway.app
- **API Health:** https://carregado-store-backend.railway.app/api/health

## ✅ Checklist de Deploy

- [ ] Railway conectado ao GitHub
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy automático ativo
- [ ] Health check funcionando
- [ ] CORS configurado
- [ ] Rate limiting ativo
- [ ] Logs sendo gerados

## 🚨 Troubleshooting

### **Se o deploy falhar:**
1. Verifique as variáveis de ambiente
2. Confirme que o Root Directory está como `backend`
3. Verifique os logs no Railway Dashboard

### **Se a API não responder:**
1. Teste o health check: `/api/health`
2. Verifique se o PORT está configurado como 3000
3. Confirme que o JWT_SECRET está definido

### **Se CORS falhar:**
1. Verifique ALLOWED_ORIGINS
2. Confirme que o frontend está na lista
3. Teste com curl ou Postman
