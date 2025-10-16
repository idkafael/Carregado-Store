// API Routes para Vercel - Backend do Carregado Store
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Importar rotas
const authRoutes = require('./auth');
const paymentRoutes = require('./payment');
const productRoutes = require('./products');
const userRoutes = require('./user');

const app = express();

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

app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/products', productRoutes);
app.use('/api/user', userRoutes);

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