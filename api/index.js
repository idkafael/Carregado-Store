// API Routes para Vercel - Backend do Carregado Store
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const app = express();

// Inicializar Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Token de acesso necessário',
      code: 'MISSING_TOKEN'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      error: 'Token inválido',
      code: 'INVALID_TOKEN'
    });
  }
};

// Função para gerar token JWT
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  );
};

// ========================================
// MIDDLEWARES DE SEGURANÇA
// ========================================

// Helmet para headers de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configurado
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'https://carregado-store-lk7ifp8wg-rafaels-projects-bc90a5e9.vercel.app',
  'https://carregado-store.vercel.app'
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Muitas requisições. Tente novamente em alguns minutos.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========================================
// ROTAS DA API
// ========================================

// ========================================
// ROTAS DE AUTENTICAÇÃO
// ========================================

// Login
app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return res.status(401).json({
        error: 'Email ou senha incorretos',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const token = generateToken(authData.user.id, email);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.user_metadata?.name || email.split('@')[0]
      }
    });

  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// ========================================
// ROTAS DE PAGAMENTO
// ========================================

// Criar PIX
app.post('/api/payment/create-pix', authenticateToken, [
  body('amount').isNumeric().isFloat({ min: 0.01 }).withMessage('Valor deve ser maior que R$ 0,01'),
  body('productId').isUUID().withMessage('ID do produto inválido'),
  body('productName').trim().isLength({ min: 1, max: 255 }).withMessage('Nome do produto é obrigatório')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const { amount, productId, productName } = req.body;
    const userId = req.user.userId;

    // Criar compra no banco
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        user_id: userId,
        product_id: productId,
        product_name: productName,
        amount: amount,
        status: 'pending',
        payment_method: 'pix'
      })
      .select()
      .single();

    if (purchaseError) {
      console.error('❌ Erro ao criar compra:', purchaseError);
      return res.status(500).json({
        error: 'Erro ao criar compra',
        code: 'PURCHASE_ERROR'
      });
    }

    // Simular criação de PIX (sem PushinPay por enquanto)
    const transactionId = `pix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    res.json({
      success: true,
      message: 'PIX criado com sucesso',
      data: {
        transactionId,
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        pixCode: '00020126580014br.gov.bcb.pix0136a1f4e0ad-3f3a-4b1c-9c7d-8e9f0a1b2c3d040816PIX Teste',
        amount: amount,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Erro ao criar PIX:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// ========================================
// ROTAS DE PRODUTOS
// ========================================

// Listar produtos
app.get('/api/products', async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('id', { ascending: true });

    if (error) {
      console.error('❌ Erro ao buscar produtos:', error);
      return res.status(500).json({
        error: 'Erro ao buscar produtos',
        code: 'DATABASE_ERROR'
      });
    }

    res.json({
      success: true,
      data: products || []
    });

  } catch (error) {
    console.error('❌ Erro ao listar produtos:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// ========================================
// MIDDLEWARE DE ERRO
// ========================================

app.use((err, req, res, next) => {
  console.error('❌ Erro no servidor:', err);
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor' 
      : err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint não encontrado',
    availableEndpoints: [
      'GET /api/health',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'POST /api/payment/create-pix',
      'GET /api/payment/status/:id',
      'GET /api/products',
      'GET /api/user/profile'
    ]
  });
});

module.exports = app;