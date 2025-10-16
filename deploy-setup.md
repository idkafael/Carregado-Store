# 🚀 Guia de Deploy Completo - Carregado Store

## 📋 Pré-requisitos

### 1. **Contas Necessárias:**
- ✅ [Vercel](https://vercel.com) - Frontend
- ✅ [Railway](https://railway.app) - Backend
- ✅ [Supabase](https://supabase.com) - Database
- ✅ [PushinPay](https://pushinpay.com.br) - Pagamentos
- ✅ Domínio personalizado (ex: carregado-store.com)

### 2. **Ferramentas Locais:**
```bash
# Instalar Node.js 18+
# Instalar Git
# Instalar Vercel CLI
npm install -g vercel
```

## 🔧 Configuração Completa

### **PASSO 1: Configurar Backend (Railway)**

#### 1.1 Criar projeto no Railway:
```bash
# 1. Acesse https://railway.app
# 2. Conecte sua conta GitHub
# 3. Crie novo projeto
# 4. Conecte o repositório
```

#### 1.2 Configurar variáveis de ambiente no Railway:
```env
# No painel do Railway, adicione:
PORT=3000
NODE_ENV=production
JWT_SECRET=sua-chave-super-secreta-aqui-32-chars-min
SUPABASE_URL=https://vyibdpwhkklxzuxaouza.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
PUSHINPAY_TOKEN=48754|3wdvl7xAOkCJM3gD86aJ78aErQcXVBrTn24qEztJ9629c3ea
PUSHINPAY_BASE_URL=https://api.pushinpay.com.br
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ALLOWED_ORIGINS=https://carregado-store.com,https://www.carregado-store.com
```

#### 1.3 Deploy do Backend:
```bash
# O Railway fará deploy automático quando você conectar o repositório
# URL do backend será: https://carregado-store-backend.railway.app
```

### **PASSO 2: Configurar Frontend (Vercel)**

#### 2.1 Preparar arquivos para deploy:
```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
echo "REACT_APP_API_URL=https://carregado-store-backend.railway.app/api" > .env.local
```

#### 2.2 Deploy no Vercel:
```bash
# 1. Login no Vercel
vercel login

# 2. Deploy inicial
vercel

# 3. Deploy de produção
vercel --prod
```

#### 2.3 Configurar domínio personalizado:
```bash
# 1. No painel do Vercel:
# 2. Vá em Settings > Domains
# 3. Adicione: carregado-store.com
# 4. Configure DNS conforme instruções
```

### **PASSO 3: Configurar DNS**

#### 3.1 Configurações DNS (Cloudflare/Registro.br):
```
# Registro A
@                    A       76.76.19.61
www                  A       76.76.19.61

# Registro CNAME (se necessário)
api                  CNAME   carregado-store-backend.railway.app
```

#### 3.2 Configurar SSL:
- ✅ Vercel gerencia SSL automaticamente
- ✅ Railway gerencia SSL automaticamente

### **PASSO 4: Atualizar Configurações**

#### 4.1 Atualizar frontend para usar backend:
```javascript
// Em frontend-secure/config-secure.js
const SecureConfig = {
  apiUrl: 'https://carregado-store-backend.railway.app/api',
  // ... resto da configuração
};
```

#### 4.2 Atualizar CORS no backend:
```javascript
// Em backend/server.js
const allowedOrigins = [
  'https://carregado-store.com',
  'https://www.carregado-store.com'
];
```

## 🔄 Scripts de Deploy Automatizado

### **Script de Deploy Completo:**
```bash
#!/bin/bash
# deploy.sh

echo "🚀 Iniciando deploy completo..."

# 1. Instalar dependências
echo "📦 Instalando dependências..."
npm install
cd backend && npm install && cd ..

# 2. Deploy backend
echo "🔧 Deploy do backend..."
# Railway faz deploy automático

# 3. Deploy frontend
echo "🌐 Deploy do frontend..."
vercel --prod

echo "✅ Deploy concluído!"
echo "🌐 Frontend: https://carregado-store.com"
echo "🔧 Backend: https://carregado-store-backend.railway.app"
```

### **Script de Atualização:**
```bash
#!/bin/bash
# update.sh

echo "🔄 Atualizando aplicação..."

# 1. Atualizar backend
echo "🔧 Atualizando backend..."
# Railway faz deploy automático

# 2. Atualizar frontend
echo "🌐 Atualizando frontend..."
vercel --prod

echo "✅ Atualização concluída!"
```

## 📊 Monitoramento

### **Health Checks:**
- ✅ Frontend: `https://carregado-store.com`
- ✅ Backend: `https://carregado-store-backend.railway.app/api/health`

### **Logs:**
- ✅ Vercel: Painel > Functions > Logs
- ✅ Railway: Painel > Deployments > Logs

### **Métricas:**
- ✅ Vercel: Analytics no painel
- ✅ Railway: Metrics no painel

## 🔒 Segurança

### **Configurações de Segurança:**
- ✅ HTTPS obrigatório
- ✅ CORS restritivo
- ✅ Rate limiting ativo
- ✅ Headers de segurança
- ✅ Variáveis de ambiente protegidas

### **Backup:**
- ✅ Código: GitHub
- ✅ Database: Supabase backup automático
- ✅ Configurações: Documentadas

## 🚨 Troubleshooting

### **Problemas Comuns:**

#### 1. **CORS Error:**
```bash
# Verificar allowedOrigins no backend
# Verificar URL da API no frontend
```

#### 2. **Deploy Failed:**
```bash
# Verificar logs no Railway/Vercel
# Verificar variáveis de ambiente
```

#### 3. **Domain Not Working:**
```bash
# Verificar DNS
# Aguardar propagação (até 24h)
```

## 📞 Suporte

### **Comandos Úteis:**
```bash
# Ver logs do backend
railway logs

# Ver logs do frontend
vercel logs

# Status do deploy
vercel ls
```

### **URLs Importantes:**
- 🌐 **Frontend:** https://carregado-store.com
- 🔧 **Backend:** https://carregado-store-backend.railway.app
- 📊 **Vercel Dashboard:** https://vercel.com/dashboard
- 🚂 **Railway Dashboard:** https://railway.app/dashboard
- 🗄️ **Supabase Dashboard:** https://supabase.com/dashboard

---

**🎯 Resultado:** Sistema completo deployado com domínio personalizado e máxima segurança!
