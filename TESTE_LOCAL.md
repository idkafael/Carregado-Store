# 🧪 Como Testar a Integração PushinPay Localmente

## ❌ Problema Identificado

O erro "Failed to fetch" ocorre porque o projeto está configurado para Vercel Functions, mas estamos tentando testar localmente sem um servidor.

## ✅ Solução: Servidor Local

Criei um servidor local completo para testar a integração PushinPay.

### 🚀 **Opção 1: Setup Automático (Recomendado)**

#### Windows:
```bash
# Execute o script de setup
setup-local.bat
```

#### Linux/Mac:
```bash
# Execute o script de setup
chmod +x setup-local.sh
./setup-local.sh
```

### 🔧 **Opção 2: Setup Manual**

1. **Instalar dependências:**
```bash
npm install express cors dotenv @supabase/supabase-js axios
```

2. **Configurar variáveis de ambiente:**
```bash
# Copiar arquivo de exemplo
cp env.local.example .env.local

# Editar .env.local e configurar:
# - SUPABASE_SERVICE_ROLE_KEY (obrigatório)
# - PUSHINPAY_TOKEN (já configurado)
```

3. **Iniciar servidor:**
```bash
node server-local.js
```

### 🌐 **Acessar o Teste**

Após iniciar o servidor:

- **Site principal:** http://localhost:3000
- **Teste PushinPay:** http://localhost:3000/test
- **API:** http://localhost:3000/api/payment/*

### 📋 **Variáveis de Ambiente Necessárias**

Configure no arquivo `.env.local`:

```env
# Obrigatório - Token do PushinPay (já configurado)
PUSHINPAY_TOKEN=48754|3wdvl7xAOkCJM3gD86aJ78aErQcXVBrTn24qEztJ9629c3ea

# Obrigatório - Supabase (você precisa configurar)
SUPABASE_URL=https://vyibdpwhkklxzuxaouza.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here

# Opcional - CORS para localhost
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### 🧪 **Como Testar**

1. **Inicie o servidor local**
2. **Abra http://localhost:3000/test**
3. **Configure um valor (ex: R$ 10,00)**
4. **Clique em "Criar PIX"**
5. **Monitore o status em tempo real**

### 🔍 **Debug**

O servidor local mostra logs detalhados:
- ✅ Variáveis de ambiente carregadas
- 📡 Requisições da API
- 🔄 Status das transações
- ❌ Erros detalhados

### 🚨 **Problemas Comuns**

1. **"Failed to fetch"** → Servidor não está rodando
2. **"Token inválido"** → Configure SUPABASE_SERVICE_ROLE_KEY
3. **"CORS error"** → Use http://localhost:3000/test

### 📁 **Arquivos Criados**

- `server-local.js` - Servidor Express local
- `package-local.json` - Dependências do servidor
- `env.local.example` - Exemplo de variáveis
- `setup-local.bat` - Script Windows
- `setup-local.sh` - Script Linux/Mac
- `test-pushinpay-simple.html` - Teste sem dependências

### 🎯 **Próximos Passos**

1. Execute o setup local
2. Configure as variáveis de ambiente
3. Teste a integração PushinPay
4. Verifique se os pagamentos funcionam
5. Faça deploy para produção

---

**🎉 Com o servidor local, você pode testar toda a integração PushinPay sem problemas!**
