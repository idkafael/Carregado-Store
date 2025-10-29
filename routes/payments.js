const express = require('express');
const router = express.Router();
const { createCheckoutSession, retrieveCheckoutSession } = require('../utils/stripe');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

/**
 * POST /api/create-checkout-session
 * Criar uma sessão de checkout do Stripe
 */
router.post('/create-checkout-session', async (req, res) => {
    try {
        const { email, plan, amount, currency } = req.body;
        
        // Validar dados obrigatórios
        if (!email || !plan || !amount || !currency) {
            return res.status(400).json({
                success: false,
                error: 'Email, plano, valor e moeda são obrigatórios'
            });
        }
        
        // Validar email
        if (!email.includes('@')) {
            return res.status(400).json({
                success: false,
                error: 'Email inválido'
            });
        }
        
        // Validar plano
        const validPlans = ['Mensal', 'Trimestral', 'Anual', 'Monthly', 'Quarterly', 'Annual'];
        if (!validPlans.includes(plan)) {
            return res.status(400).json({
                success: false,
                error: 'Plano inválido'
            });
        }
        
        // Validar moeda
        const validCurrencies = ['usd', 'eur', 'brl'];
        if (!validCurrencies.includes(currency.toLowerCase())) {
            return res.status(400).json({
                success: false,
                error: 'Moeda inválida'
            });
        }
        
        // URLs de retorno
        const baseUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:5500';
        const successUrl = `${baseUrl}/index.html?session_id={CHECKOUT_SESSION_ID}&success=true`;
        const cancelUrl = `${baseUrl}/index.html?cancelled=true`;
        
        // Criar sessão de checkout
        const sessionResult = await createCheckoutSession({
            email,
            plan,
            amount: parseFloat(amount),
            currency: currency.toLowerCase(),
            successUrl,
            cancelUrl
        });
        
        if (!sessionResult.success) {
            return res.status(500).json({
                success: false,
                error: sessionResult.error
            });
        }
        
        // Criar ou encontrar usuário
        let user;
        try {
            [user] = await User.findOrCreate({
                where: { email },
                defaults: { email, name: email.split('@')[0] }
            });
        } catch (error) {
            console.error('Erro ao criar/encontrar usuário:', error);
            return res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
        
        // Criar registro de assinatura pendente
        try {
            await Subscription.create({
                user_id: user.id,
                plan,
                price: parseFloat(amount),
                status: 'pending',
                stripe_session_id: sessionResult.sessionId,
                payer_email: email,
                expires_at: null // Será definido quando o pagamento for confirmado
            });
        } catch (error) {
            console.error('Erro ao criar assinatura:', error);
            // Não falhar aqui, pois a sessão já foi criada
        }
        
        res.json({
            success: true,
            sessionId: sessionResult.sessionId,
            url: sessionResult.url,
            publicId: sessionResult.publicId // Para compatibilidade
        });
        
    } catch (error) {
        console.error('Erro no create-checkout-session:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * POST /api/check-session-status
 * Verificar status de uma sessão de checkout
 */
router.post('/check-session-status', async (req, res) => {
    try {
        const { sessionId } = req.body;
        
        if (!sessionId) {
            return res.status(400).json({
                success: false,
                error: 'Session ID é obrigatório'
            });
        }
        
        // Recuperar sessão do Stripe
        const sessionResult = await retrieveCheckoutSession(sessionId);
        
        if (!sessionResult.success) {
            return res.status(500).json({
                success: false,
                error: sessionResult.error
            });
        }
        
        const session = sessionResult.session;
        
        // Buscar assinatura no banco
        const subscription = await Subscription.findOne({
            where: { stripe_session_id: sessionId },
            include: [User]
        });
        
        if (!subscription) {
            return res.status(404).json({
                success: false,
                error: 'Assinatura não encontrada'
            });
        }
        
        // Verificar se o pagamento foi concluído
        if (session.payment_status === 'paid') {
            // Atualizar status da assinatura se ainda estiver pendente
            if (subscription.status === 'pending') {
                await subscription.update({
                    status: 'active',
                    expires_at: calculateExpirationDate(subscription.plan)
                });
            }
            
            return res.json({
                success: true,
                sessionStatus: session.payment_status,
                isActive: true,
                subscription: {
                    plan: subscription.plan,
                    price: subscription.price,
                    expires_at: subscription.expires_at,
                    created_at: subscription.created_at
                }
            });
        } else {
            return res.json({
                success: true,
                sessionStatus: session.payment_status,
                isActive: false,
                subscription: null
            });
        }
        
    } catch (error) {
        console.error('Erro no check-session-status:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * Função auxiliar para calcular data de expiração
 */
function calculateExpirationDate(plan) {
    const now = new Date();
    
    switch (plan) {
        case 'Mensal':
            return new Date(now.getTime() + (31 * 24 * 60 * 60 * 1000));
        case 'Trimestral':
            return new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000));
        case 'Anual':
            return new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000));
        default:
            return new Date(now.getTime() + (31 * 24 * 60 * 60 * 1000));
    }
}

module.exports = router;
