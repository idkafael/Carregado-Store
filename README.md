# 🛒 Carregado Store - E-commerce Seguro

Sistema de e-commerce completo com arquitetura de segurança robusta, pagamentos PIX integrados e entrega automática.

## 🚀 Deploy Rápido

### **Configuração Inicial:**
```bash
# 1. Clone o repositório
git clone https://github.com/carregado-store/site.git
cd site

# 2. Execute o setup automático
chmod +x scripts/setup.sh
./scripts/setup.sh

# 3. Configure as variáveis de ambiente
# Edite backend/.env com suas chaves

# 4. Deploy completo
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## 🏗️ Arquitetura

### **Frontend (Vercel)**
- ✅ **Seguro**: Sem dados sensíveis
- ✅ **Rápido**: CDN global
- ✅ **Responsivo**: Mobile-first
- ✅ **SEO**: Otimizado

### **Backend (Railway)**
- ✅ **API REST**: Node.js + Express
- ✅ **Autenticação**: JWT seguro
- ✅ **Rate Limiting**: Proteção contra ataques
- ✅ **CORS**: Configurado para produção

### **Database (Supabase)**
- ✅ **PostgreSQL**: Banco robusto
- ✅ **Auth**: Sistema de usuários
- ✅ **Real-time**: Atualizações em tempo real
- ✅ **Backup**: Automático

### **Pagamentos (PushinPay)**
- ✅ **PIX**: Integração completa
- ✅ **Webhook**: Confirmação automática
- ✅ **Seguro**: Token protegido no backend

## 📁 Estrutura do Projeto

```
carregado-store/
├── 📁 frontend-secure/     # Código seguro do frontend
│   ├── api-client.js      # Cliente API
│   ├── auth-secure.js     # Autenticação
│   ├── payment-secure.js  # Pagamentos
│   └── config-secure.js   # Configurações
├── 📁 backend/            # API Node.js
│   ├── server.js          # Servidor principal
│   ├── middleware/        # Middlewares
│   ├── routes/           # Rotas da API
│   └── package.json      # Dependências
├── 📁 scripts/           # Scripts de deploy
│   ├── setup.sh         # Configuração inicial
│   ├── deploy.sh        # Deploy completo
│   └── update.sh        # Atualização
├── 📄 index.html         # Página principal
├── 📄 vercel.json        # Config Vercel
├── 📄 railway.json       # Config Railway
└── 📄 package.json       # Dependências projeto
```

## 🔧 Configuração

### **Variáveis de Ambiente (Backend)**

Crie `backend/.env`:
```env
# Servidor
PORT=3000
NODE_ENV=production

# JWT (GERE UMA CHAVE FORTE)
JWT_SECRET=sua-chave-super-secreta-aqui-32-chars-min

# Supabase
SUPABASE_URL=https://vyibdpwhkklxzuxaouza.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui

# PushinPay
PUSHINPAY_TOKEN=48754|3wdvl7xAOkCJM3gD86aJ78aErQcXVBrTn24qEztJ9629c3ea
PUSHINPAY_BASE_URL=https://api.pushinpay.com.br

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
ALLOWED_ORIGINS=https://carregado-store.com,https://www.carregado-store.com
```

### **Configuração Frontend**

Crie `.env.local`:
```env
REACT_APP_API_URL=https://carregado-store-backend.railway.app/api
NODE_ENV=production
```

## 🚀 Deploy

### **1. Deploy Automático (Recomendado)**
```bash
# Setup completo
./scripts/setup.sh

# Deploy completo
./scripts/deploy.sh
```

### **2. Deploy Manual**

#### **Frontend (Vercel):**
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### **Backend (Railway):**
```bash
# 1. Acesse https://railway.app
# 2. Conecte GitHub
# 3. Crie projeto
# 4. Configure variáveis de ambiente
# 5. Deploy automático
```

## 🌐 Domínio Personalizado

### **Configuração DNS:**
```
# Registro A
@                    A       76.76.19.61
www                  A       76.76.19.61

# Registro CNAME (opcional)
api                  CNAME   carregado-store-backend.railway.app
```

### **Configuração Vercel:**
1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Vá em Settings > Domains
3. Adicione seu domínio
4. Configure DNS conforme instruções

## 🔒 Segurança

### **Implementado:**
- ✅ **JWT Authentication**: Tokens seguros
- ✅ **Rate Limiting**: Proteção contra ataques
- ✅ **CORS**: Configurado para produção
- ✅ **Helmet**: Headers de segurança
- ✅ **Validação**: Dupla validação (frontend + backend)
- ✅ **Logs**: Auditoria completa
- ✅ **HTTPS**: Obrigatório em produção

### **Dados Protegidos:**
- 🔐 **Tokens**: Apenas no backend
- 🔐 **Chaves**: Variáveis de ambiente
- 🔐 **Lógica**: Server-side
- 🔐 **Validação**: Backend obrigatório

## 📊 Monitoramento

### **Health Checks:**
- ✅ Frontend: `https://carregado-store.com`
- ✅ Backend: `https://carregado-store-backend.railway.app/api/health`

### **Logs:**
- ✅ Vercel: Dashboard > Functions > Logs
- ✅ Railway: Dashboard > Deployments > Logs
- ✅ Supabase: Dashboard > Logs

### **Métricas:**
- ✅ Vercel: Analytics
- ✅ Railway: Metrics
- ✅ Supabase: Database metrics

## 🛠️ Desenvolvimento

### **Comandos Úteis:**
```bash
# Desenvolvimento local
npm run dev

# Backend local
npm run backend:dev

# Testes
npm test

# Atualizar deploy
./scripts/update.sh
```

### **Estrutura de Desenvolvimento:**
```bash
# Frontend local
npm run dev
# Acesse: http://localhost:3000

# Backend local
npm run backend:dev
# API: http://localhost:3000/api
```

## 📞 Suporte

### **URLs Importantes:**
- 🌐 **Frontend:** https://carregado-store.com
- 🔧 **Backend:** https://carregado-store-backend.railway.app
- 📊 **Vercel:** https://vercel.com/dashboard
- 🚂 **Railway:** https://railway.app/dashboard
- 🗄️ **Supabase:** https://supabase.com/dashboard

### **Comandos de Troubleshooting:**
```bash
# Ver logs do backend
railway logs

# Ver logs do frontend
vercel logs

# Status do deploy
vercel ls

# Testar API
curl https://carregado-store-backend.railway.app/api/health
```

## 🎯 Funcionalidades

### **✅ Implementado:**
- 🔐 **Autenticação segura** com JWT
- 💳 **Pagamentos PIX** integrados
- 📦 **Entrega automática** de produtos
- 🛡️ **Segurança robusta** em todas as camadas
- 📱 **Interface responsiva** mobile-first
- ⚡ **Performance otimizada** com CDN
- 🔄 **Deploy automatizado** com scripts
- 📊 **Monitoramento completo** de logs e métricas

### **🚀 Próximas Funcionalidades:**
- 📧 **Email marketing** integrado
- 📈 **Analytics avançado** de vendas
- 🎨 **Temas personalizáveis**
- 🌍 **Multi-idioma** (i18n)
- 📱 **App mobile** (PWA)

---

**🎉 Sistema completo, seguro e pronto para produção!**

Para dúvidas ou suporte, consulte a documentação ou entre em contato.
