# 🏠 Guia COMPLETO de Deploy na Hostinger - OnlyFans Clone

## 📋 Pré-requisitos OBRIGATÓRIOS

1. ✅ **Conta Hostinger** com hospedagem compartilhada (Premium ou Business)
2. ✅ **Node.js** habilitado no painel da Hostinger
3. ✅ **Acesso FTP** ou **File Manager** no painel
4. ✅ **Conta Stripe** configurada (modo produção)
5. ✅ **Domínio** próprio configurado na Hostinger

---

## 🚀 PASSO A PASSO DETALHADO

### 📁 PASSO 1: Preparar Arquivos Localmente

#### 1.1 - Instalar Dependências
```bash
# Abra o terminal na pasta do projeto
npm install

# Aguarde a instalação terminar
# Deve aparecer: "added X packages"
```

#### 1.2 - Testar Localmente
```bash
# Iniciar servidor local
npm start

# Deve aparecer:
# "Servidor rodando na porta 8080"
# "Stripe Mode ativado"
```

#### 1.3 - Verificar Arquivos
Certifique-se que tem estes arquivos:
- ✅ `index.html`
- ✅ `styles.css`
- ✅ `script.js`
- ✅ `server.js`
- ✅ `package.json`
- ✅ `.htaccess`
- ✅ `.env` (com suas credenciais)

---

### 🌐 PASSO 2: Configurar Hostinger

#### 2.1 - Acessar Painel Hostinger
1. Acesse: https://hpanel.hostinger.com
2. Faça login com suas credenciais
3. Clique em **"Gerenciar"** no seu domínio

#### 2.2 - Habilitar Node.js
1. No painel, vá em **"Avançado"**
2. Clique em **"Node.js"**
3. Clique em **"Habilitar Node.js"**
4. Configure:
   - **Versão:** 18.x (recomendado)
   - **Arquivo de entrada:** `server.js`
   - **Porta:** Deixe automática ou use 8080
5. Clique em **"Salvar"**

#### 2.3 - Criar Banco MySQL
1. No painel, vá em **"Bancos de Dados MySQL"**
2. Clique em **"Criar Banco de Dados"**
3. Configure:
   - **Nome:** `u123456789_onlyfans` (substitua pelos seus números)
   - **Usuário:** `u123456789_admin`
   - **Senha:** Crie uma senha forte
4. **ANOTE** essas informações!

---

### 📤 PASSO 3: Upload dos Arquivos

#### 3.1 - Via File Manager (Mais Fácil)
1. No painel Hostinger, vá em **"File Manager"**
2. Navegue até a pasta `public_html`
3. **DELETE** todos os arquivos existentes (se houver)
4. Clique em **"Upload"**
5. Selecione **TODOS** os arquivos do projeto
6. Aguarde o upload terminar (pode demorar alguns minutos)

#### 3.2 - Via FTP (Alternativo)
1. Use FileZilla ou similar
2. Conecte com:
   - **Host:** ftp.seudominio.com
   - **Usuário:** Seu usuário Hostinger
   - **Senha:** Sua senha Hostinger
3. Navegue até `public_html`
4. Faça upload de **TODOS** os arquivos

---

### ⚙️ PASSO 4: Configurar Variáveis de Ambiente

#### 4.1 - Editar Arquivo .env
1. No File Manager, abra o arquivo `.env`
2. Substitua pelo seguinte conteúdo:

```env
# Stripe (SUAS CHAVES DE PRODUÇÃO)
STRIPE_SECRET_KEY=sk_live_SUA_CHAVE_SECRETA_AQUI
STRIPE_PUBLISHABLE_KEY=pk_live_SUA_CHAVE_PUBLICA_AQUI
STRIPE_WEBHOOK_SECRET=whsec_SEU_WEBHOOK_SECRET_AQUI

# Hostinger
PORT=8080
NODE_ENV=production
FRONTEND_URL=https://seudominio.com

# Banco de Dados (SUAS CREDENCIAIS)
DB_HOST=localhost
DB_NAME=u123456789_onlyfans
DB_USER=u123456789_admin
DB_PASS=SUA_SENHA_DO_BANCO
```

#### 4.2 - Salvar Arquivo
1. Clique em **"Salvar"**
2. Verifique se o arquivo foi salvo corretamente

---

### 🔧 PASSO 5: Configurar Stripe

#### 5.1 - Obter Chaves do Stripe
1. Acesse: https://dashboard.stripe.com
2. Vá em **"Desenvolvedores"** → **"Chaves da API"**
3. Copie:
   - **Chave secreta:** `sk_live_...`
   - **Chave publicável:** `pk_live_...`

#### 5.2 - Configurar Webhook
1. No Stripe, vá em **"Desenvolvedores"** → **"Webhooks"**
2. Clique em **"Adicionar endpoint"**
3. Configure:
   - **URL:** `https://seudominio.com/api/stripe-webhook`
   - **Eventos:** Selecione `checkout.session.completed`
4. Clique em **"Adicionar endpoint"**
5. Copie o **"Webhook secret"** (`whsec_...`)

#### 5.3 - Atualizar .env
1. Volte ao File Manager
2. Edite o `.env` com as chaves reais do Stripe
3. Salve o arquivo

---

### 🚀 PASSO 6: Executar Deploy

#### 6.1 - Via Terminal Hostinger
1. No painel Hostinger, vá em **"Terminal"**
2. Execute os comandos:

```bash
# Navegar para a pasta
cd public_html

# Instalar dependências
npm install

# Verificar se tudo está OK
npm start
```

#### 6.2 - Verificar Logs
1. Se aparecer erro, verifique os logs
2. Comando para ver logs: `pm2 logs`

---

### 🌐 PASSO 7: Testar Site

#### 7.1 - Acessar Site
1. Abra o navegador
2. Acesse: `https://seudominio.com`
3. O site deve carregar normalmente

#### 7.2 - Testar Pagamento
1. Clique em **"SUBSCRIBE"**
2. Digite um email válido
3. Use cartão de teste: `4242 4242 4242 4242`
4. Complete o pagamento
5. Verifique se o conteúdo foi desbloqueado

---

## 🔧 CONFIGURAÇÕES IMPORTANTES

### Arquivo .htaccess
- ✅ Já incluído no projeto
- ✅ Configura redirecionamento para Node.js
- ✅ Adiciona segurança e cache

### Estrutura de Arquivos
```
public_html/
├── index.html
├── styles.css
├── script.js
├── server.js
├── package.json
├── .htaccess
├── .env
├── routes/
├── models/
├── utils/
└── Images/
```

---

## 🌐 URLs FINAIS

- **Site:** https://seudominio.com
- **API:** https://seudominio.com/api/
- **Webhook:** https://seudominio.com/api/stripe-webhook

---

## 🛠️ COMANDOS ÚTEIS

```bash
# Instalar dependências
npm install

# Iniciar servidor
npm start

# Ver logs
pm2 logs

# Reiniciar servidor
pm2 restart all

# Parar servidor
pm2 stop all
```

---

## ⚠️ PROBLEMAS COMUNS E SOLUÇÕES

### ❌ Erro: "Cannot find module"
**Solução:** Execute `npm install` novamente

### ❌ Erro: "Port already in use"
**Solução:** Pare outros processos: `pm2 stop all`

### ❌ Erro: "Database connection failed"
**Solução:** Verifique credenciais do banco no `.env`

### ❌ Erro: "Stripe webhook failed"
**Solução:** Verifique URL do webhook no Stripe

### ❌ Site não carrega
**Solução:** Verifique se Node.js está habilitado

---

## 🔐 CONFIGURAÇÃO DO STRIPE

### Webhooks
1. Acesse: https://dashboard.stripe.com/webhooks
2. Adicione endpoint: `https://seudominio.com/api/stripe-webhook`
3. Selecione eventos: `checkout.session.completed`
4. Copie o webhook secret para `.env`

### Cartões de Teste
- **Sucesso:** 4242 4242 4242 4242
- **Falha:** 4000 0000 0000 0002
- **CVV:** Qualquer 3 dígitos
- **Data:** Qualquer data futura

---

## 🆘 SUPORTE

- **Hostinger:** Painel de Suporte
- **Documentação:** https://support.hostinger.com
- **Status:** https://status.hostinger.com
- **Stripe Docs:** https://stripe.com/docs

---

## ✅ CHECKLIST FINAL

- [ ] Arquivos enviados para `public_html`
- [ ] Node.js habilitado no painel
- [ ] Banco MySQL criado
- [ ] Arquivo `.env` configurado
- [ ] Chaves Stripe configuradas
- [ ] Webhook Stripe configurado
- [ ] Site carregando normalmente
- [ ] Pagamento funcionando
- [ ] SSL configurado

**🎉 Se todos os itens estão marcados, seu site está funcionando!**
