require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { testConnection, syncDatabase } = require('./database');

// Importar rotas
const paymentsRoutes = require('./routes/payments');
const webhooksRoutes = require('./routes/webhooks');
const subscriptionsRoutes = require('./routes/subscriptions');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
    origin: '*', // Em produção, especifique seu domínio
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos (front-end)
app.use(express.static(path.join(__dirname)));

// Log de requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rotas da API
app.use('/api', paymentsRoutes);
app.use('/api', webhooksRoutes);
app.use('/api', subscriptionsRoutes);

// Rota de informações da API
app.get('/api', (req, res) => {
    res.json({
        message: 'CarregadoStore Backend API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            payments: {
                createOrder: 'POST /api/create-order',
                capturePayment: 'POST /api/capture-payment'
            },
            subscriptions: {
                checkStatus: 'GET /api/subscription-status/:email',
                listAll: 'GET /api/subscriptions'
            },
            webhooks: {
                paypal: 'POST /api/paypal-webhook'
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
            console.log(`💳 PayPal Mode: ${process.env.PAYPAL_MODE || 'sandbox'}`);
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


