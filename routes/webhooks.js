const express = require('express');
const router = express.Router();
const { constructWebhookEvent, isValidWebhookEvent, calculateExpirationDate } = require('../utils/stripe');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

/**
 * POST /api/stripe-webhook
 * Webhook para receber eventos do Stripe
 */
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    
    try {
        // Construir evento do webhook
        event = constructWebhookEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Erro na verificação do webhook:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    console.log(`📨 Webhook recebido: ${event.type}`);
    
    try {
        // Processar evento baseado no tipo
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(event.data.object);
                break;
                
            case 'payment_intent.succeeded':
                console.log('💳 Pagamento confirmado:', event.data.object.id);
                break;
                
            case 'payment_intent.payment_failed':
                console.log('❌ Pagamento falhou:', event.data.object.id);
                break;
                
            default:
                console.log(`⚠️ Evento não tratado: ${event.type}`);
        }
        
        res.json({ received: true });
        
    } catch (error) {
        console.error('Erro ao processar webhook:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

/**
 * Processar evento checkout.session.completed
 * @param {Object} session - Dados da sessão do Stripe
 */
async function handleCheckoutSessionCompleted(session) {
    try {
        console.log('✅ Checkout session completed:', session.id);
        
        // Buscar assinatura no banco
        const subscription = await Subscription.findOne({
            where: { stripe_session_id: session.id },
            include: [User]
        });
        
        if (!subscription) {
            console.error('❌ Assinatura não encontrada para session:', session.id);
            return;
        }
        
        // Verificar se o pagamento foi realmente pago
        if (session.payment_status !== 'paid') {
            console.log('⚠️ Sessão não foi paga:', session.payment_status);
            return;
        }
        
        // Atualizar assinatura para ativa
        const expirationDate = calculateExpirationDate(subscription.plan);
        
        await subscription.update({
            status: 'active',
            expires_at: expirationDate,
            stripe_payment_intent_id: session.payment_intent
        });
        
        console.log(`🎉 Assinatura ativada para ${subscription.User.email}:`);
        console.log(`   - Plano: ${subscription.plan}`);
        console.log(`   - Valor: $${subscription.price}`);
        console.log(`   - Expira em: ${expirationDate.toISOString()}`);
        
        // Opcional: Enviar email de confirmação aqui
        
    } catch (error) {
        console.error('Erro ao processar checkout.session.completed:', error);
    }
}

/**
 * GET /api/webhook-test
 * Endpoint para testar se o webhook está funcionando
 */
router.get('/webhook-test', (req, res) => {
    res.json({
        success: true,
        message: 'Webhook endpoint funcionando',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

module.exports = router;
