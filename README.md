# carregado.store

## 🚀 OnlyFans Stripe Integration

Sistema completo de assinaturas com integração Stripe para conteúdo premium.

### ✨ Funcionalidades

- 💳 **Pagamentos Stripe** - Checkout seguro
- 🔒 **Sistema de Blur** - Proteção de conteúdo
- 📱 **Design Responsivo** - Mobile-first
- 🌐 **Multi-idioma** - Português/Inglês
- 📊 **Dashboard Admin** - Gestão de assinaturas
- 🔔 **Webhooks** - Atualizações automáticas

### 🛠️ Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** SQLite com Sequelize
- **Pagamentos:** Stripe API
- **Deploy:** Vercel

### 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/carregadostore/carregado.store.git
cd carregado.store

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp config.env.txt .env
# Edite o .env com suas chaves Stripe

# Iniciar servidor
npm start
```

### 🔧 Configuração

1. **Stripe API Keys:**
   - Obtenha em: https://dashboard.stripe.com/apikeys
   - Configure no arquivo `.env`

2. **Webhook Stripe:**
   - URL: `https://seu-dominio.com/api/stripe-webhook`
   - Eventos: `checkout.session.completed`

### 🌐 Deploy

#### **Vercel:**
```bash
npm install -g vercel
vercel login
vercel --prod
```

#### **Configuração DNS:**
- **A Record:** `@` → `76.76.19.61`
- **CNAME:** `www` → `cname.vercel-dns.com`

### 📱 Uso

1. **Acesse:** https://carregado.store
2. **Escolha plano** de assinatura
3. **Faça pagamento** via Stripe
4. **Acesse conteúdo** desbloqueado

### 🔒 Segurança

- ✅ Validação de webhooks Stripe
- ✅ Proteção de conteúdo com blur
- ✅ CORS configurado
- ✅ Variáveis de ambiente seguras

### 📊 API Endpoints

- `POST /api/create-checkout-session` - Criar sessão de pagamento
- `POST /api/check-session-status` - Verificar status do pagamento
- `POST /api/stripe-webhook` - Webhook Stripe
- `GET /api/subscription-status/:email` - Status da assinatura

### 🧪 Teste

**Cartões de Teste:**
- `4242 4242 4242 4242` (sucesso)
- `4000 0000 0000 0002` (falha)

### 📞 Suporte

- **Email:** suporte@carregado.store
- **Discord:** carregadostore
- **Telegram:** @carregadostore

### 📄 Licença

MIT License - Veja [LICENSE](LICENSE) para detalhes.

---

**Desenvolvido com ❤️ para carregado.store**
