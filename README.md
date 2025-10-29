# 🎭 OnlyFans Clone com Stripe

Um clone completo do OnlyFans com sistema de pagamentos integrado ao Stripe, pronto para deploy em qualquer hospedagem.

## ✨ Funcionalidades

- 🎨 **Interface Responsiva** - Design moderno e mobile-friendly
- 💳 **Pagamentos Stripe** - Integração completa com Stripe
- 🔒 **Sistema de Blur** - Conteúdo protegido com blur inteligente
- 📱 **Design Responsivo** - Funciona em desktop e mobile
- 🎥 **Suporte a Mídia** - Vídeos, imagens e posts
- 💰 **Assinaturas** - Planos mensais, trimestrais e anuais
- 🔐 **Webhooks** - Processamento automático de pagamentos

## 🚀 Deploy Rápido

### Hostinger (Recomendado)
```bash
# 1. Upload dos arquivos via FTP
# 2. Habilitar Node.js no painel
# 3. Configurar banco MySQL
# 4. Executar:
npm install
npm run setup
npm start
```

### Outras Hospedagens
- **Heroku:** `git push heroku main`
- **Vercel:** `vercel --prod`
- **Netlify:** Upload via drag & drop

## 🔧 Configuração

### 1. Variáveis de Ambiente
Crie um arquivo `.env`:
```env
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Servidor
PORT=8080
NODE_ENV=production
FRONTEND_URL=https://seudominio.com

# Banco de Dados
DB_HOST=localhost
DB_NAME=seu_banco
DB_USER=seu_usuario
DB_PASS=sua_senha
```

### 2. Configurar Stripe
1. Criar conta em https://stripe.com
2. Obter chaves de API
3. Configurar webhook: `https://seudominio.com/api/stripe-webhook`
4. Selecionar evento: `checkout.session.completed`

## 📁 Estrutura do Projeto

```
├── 📄 index.html          # Página principal
├── 🎨 styles.css          # Estilos CSS
├── ⚡ script.js           # JavaScript frontend
├── 🖥️ server.js           # Servidor Node.js
├── 📦 package.json         # Dependências
├── 🔧 .htaccess           # Configuração Apache
├── 📁 routes/             # Rotas da API
├── 📁 models/             # Modelos do banco
├── 📁 utils/              # Utilitários
└── 📁 Images/             # Mídia do projeto
```

## 🎯 Como Usar

### Para Clientes
1. **Comprar** o template
2. **Configurar** domínio próprio
3. **Substituir** conteúdo personalizado
4. **Deploy** na hospedagem escolhida

### Para Desenvolvedores
1. **Clone** o repositório
2. **Instale** dependências: `npm install`
3. **Configure** `.env` com suas credenciais
4. **Execute** localmente: `npm start`

## 💳 Teste de Pagamentos

### Cartões de Teste Stripe
- **Sucesso:** `4242 4242 4242 4242`
- **Falha:** `4000 0000 0000 0002`
- **CVV:** Qualquer 3 dígitos
- **Data:** Qualquer data futura

## 🛠️ Comandos Disponíveis

```bash
npm start          # Iniciar servidor
npm run dev        # Modo desenvolvimento
npm run setup      # Configurar para Hostinger
```

## 📞 Suporte

- **Documentação:** Veja `HOSTINGER_DEPLOY.md`
- **Stripe Docs:** https://stripe.com/docs
- **Issues:** Abra uma issue no repositório

## 📄 Licença

Este projeto é comercial. Todos os direitos reservados.

---

**🎉 Pronto para usar! Configure seu domínio e comece a vender!**
