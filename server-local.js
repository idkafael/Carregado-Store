// Servidor local para testar a API PushinPay
const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Importar a API de pagamento
const paymentAPI = require('./api/payment.js');

// Rota para a API de pagamento
app.all('/api/payment/*', async (req, res) => {
    // Simular o objeto req do Vercel
    const vercelReq = {
        method: req.method,
        url: req.url,
        body: req.body,
        headers: req.headers
    };
    
    // Simular o objeto res do Vercel
    const vercelRes = {
        status: (code) => {
            res.status(code);
            return vercelRes;
        },
        json: (data) => {
            res.json(data);
        },
        setHeader: (name, value) => {
            res.setHeader(name, value);
        },
        end: () => {
            res.end();
        }
    };
    
    try {
        await paymentAPI(vercelReq, vercelRes);
    } catch (error) {
        console.error('Erro na API:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para teste
app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-pushinpay-simple.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`🧪 Teste: http://localhost:${PORT}/test`);
    console.log(`📱 Site: http://localhost:${PORT}`);
    console.log('');
    console.log('📋 Variáveis de ambiente necessárias:');
    console.log(`   PUSHINPAY_TOKEN: ${process.env.PUSHINPAY_TOKEN ? '✅ Configurado' : '❌ Não configurado'}`);
    console.log(`   SUPABASE_URL: ${process.env.SUPABASE_URL ? '✅ Configurado' : '❌ Não configurado'}`);
    console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Configurado' : '❌ Não configurado'}`);
});
