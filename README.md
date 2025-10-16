# 🛒 Carregado Store

Sistema de e-commerce com pagamentos PIX integrados.

## 🌐 Deploy Automático

**Domínio Principal:** `https://carregado.store`

### ✅ Configuração Atual:
- **Frontend:** Deployado automaticamente no Vercel
- **Backend:** Vercel Functions integrado
- **Domínio:** carregado.store (configurado como padrão)
- **SSL:** Automático e renovado automaticamente

### 🚀 Como Fazer Deploy:
1. **Faça mudanças** no código
2. **Commit e push** para o GitHub:
   ```bash
   git add .
   git commit -m "Sua mudança"
   git push
   ```
3. **Deploy automático** no carregado.store

## 📁 Estrutura
```
├── index.html          # Página principal
├── styles.css          # Estilos
├── script.js           # JavaScript principal
├── api/                # Backend (Vercel Functions)
└── frontend-secure/    # Código seguro
```

## 🔧 Desenvolvimento Local
```bash
# Frontend
npm run dev

# Backend
cd api && npm start
```

## 🌐 URLs de Produção
- **Site:** https://carregado.store
- **API:** https://carregado.store/api/*
- **SSL:** Automático
- **Deploy:** Automático a cada push