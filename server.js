require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { testConnection, syncDatabase } = require('./database');

// Importar rotas
const paymentsRoutes = require('./routes/payments');
const webhooksRoutes = require('./routes/webhooks');
const subscriptionsRoutes = require('./routes/subscriptions');

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors({
    origin: '*', // Em produção, especifique seu domínio
    credentials: true
}));

// Headers para permitir CSS e fontes
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; font-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; img-src 'self' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://api.stripe.com;");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos (para Hostinger)
app.use(express.static('.'));

// Log de requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rotas
app.use('/api', paymentsRoutes);
app.use('/api/stripe-webhook', webhooksRoutes);
app.use('/api', subscriptionsRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.json({
        message: 'CarregadoStore Backend API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            payments: {
                createCheckoutSession: 'POST /api/create-checkout-session',
                checkSessionStatus: 'POST /api/check-session-status'
            },
            subscriptions: {
                checkStatus: 'GET /api/subscription-status/:email',
                listAll: 'GET /api/subscriptions',
                getById: 'GET /api/subscription/:id',
                cancel: 'PUT /api/subscription/:id/cancel',
                stats: 'GET /api/stats'
            },
            webhooks: {
                stripe: 'POST /api/stripe-webhook',
                test: 'GET /api/webhook-test'
            }
        }
    });
});

// Rota de health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Handler de erros
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: err.message
    });
});

// Inicializar servidor
async function startServer() {
    try {
        // Testar conexão com banco
        await testConnection();
        
        // Sincronizar modelos
        await syncDatabase();
        
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
            console.log(`📚 Documentação: http://localhost:${PORT}`);
            console.log(`💳 Stripe Mode: ${process.env.NODE_ENV || 'development'}`);
            console.log(`\n✅ Backend pronto para receber requisições!\n`);
        });
    } catch (error) {
        console.error('❌ Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}

startServer();

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Encerrando servidor...');
    process.exit(0);
});


