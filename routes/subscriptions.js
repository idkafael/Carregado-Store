const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Subscription = require('../models/Subscription');

/**
 * GET /api/subscription-status/:email
 * Verificar status de assinatura de um usuário
 */
router.get('/subscription-status/:email', async (req, res) => {
    try {
        const email = decodeURIComponent(req.params.email);
        
        if (!email || !email.includes('@')) {
            return res.status(400).json({
                success: false,
                error: 'Email inválido'
            });
        }
        
        // Buscar usuário
        const user = await User.findOne({
            where: { email },
            include: [{
                model: Subscription,
                order: [['created_at', 'DESC']] // Mais recente primeiro
            }]
        });
        
        if (!user) {
            return res.json({
                success: true,
                hasActiveSubscription: false,
                subscription: null
            });
        }
        
        // Verificar se tem assinatura ativa
        const activeSubscription = user.Subscriptions.find(sub => {
            return sub.status === 'active' && 
                   sub.expires_at && 
                   new Date(sub.expires_at) > new Date();
        });
        
        if (activeSubscription) {
            return res.json({
                success: true,
                hasActiveSubscription: true,
                subscription: {
                    plan: activeSubscription.plan,
                    price: activeSubscription.price,
                    expires_at: activeSubscription.expires_at,
                    created_at: activeSubscription.created_at
                }
            });
        } else {
            return res.json({
                success: true,
                hasActiveSubscription: false,
                subscription: null
            });
        }
        
    } catch (error) {
        console.error('Erro ao verificar status da assinatura:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * GET /api/subscriptions
 * Listar todas as assinaturas (admin)
 */
router.get('/subscriptions', async (req, res) => {
    try {
        const subscriptions = await Subscription.findAll({
            include: [User],
            order: [['created_at', 'DESC']]
        });
        
        const formattedSubscriptions = subscriptions.map(sub => ({
            id: sub.id,
            email: sub.User.email,
            name: sub.User.name,
            plan: sub.plan,
            price: sub.price,
            status: sub.status,
            expires_at: sub.expires_at,
            created_at: sub.created_at,
            stripe_session_id: sub.stripe_session_id
        }));
        
        res.json({
            success: true,
            count: subscriptions.length,
            subscriptions: formattedSubscriptions
        });
        
    } catch (error) {
        console.error('Erro ao listar assinaturas:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * GET /api/subscription/:id
 * Obter detalhes de uma assinatura específica
 */
router.get('/subscription/:id', async (req, res) => {
    try {
        const subscriptionId = req.params.id;
        
        const subscription = await Subscription.findByPk(subscriptionId, {
            include: [User]
        });
        
        if (!subscription) {
            return res.status(404).json({
                success: false,
                error: 'Assinatura não encontrada'
            });
        }
        
        res.json({
            success: true,
            subscription: {
                id: subscription.id,
                email: subscription.User.email,
                name: subscription.User.name,
                plan: subscription.plan,
                price: subscription.price,
                status: subscription.status,
                expires_at: subscription.expires_at,
                created_at: subscription.created_at,
                stripe_session_id: subscription.stripe_session_id,
                stripe_payment_intent_id: subscription.stripe_payment_intent_id
            }
        });
        
    } catch (error) {
        console.error('Erro ao obter assinatura:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * PUT /api/subscription/:id/cancel
 * Cancelar uma assinatura
 */
router.put('/subscription/:id/cancel', async (req, res) => {
    try {
        const subscriptionId = req.params.id;
        
        const subscription = await Subscription.findByPk(subscriptionId);
        
        if (!subscription) {
            return res.status(404).json({
                success: false,
                error: 'Assinatura não encontrada'
            });
        }
        
        if (subscription.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                error: 'Assinatura já está cancelada'
            });
        }
        
        await subscription.update({
            status: 'cancelled'
        });
        
        res.json({
            success: true,
            message: 'Assinatura cancelada com sucesso'
        });
        
    } catch (error) {
        console.error('Erro ao cancelar assinatura:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * GET /api/stats
 * Estatísticas gerais do sistema
 */
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalSubscriptions = await Subscription.count();
        
        const activeSubscriptions = await Subscription.count({
            where: {
                status: 'active',
                expires_at: {
                    [require('sequelize').Op.gt]: new Date()
                }
            }
        });
        
        const expiredSubscriptions = await Subscription.count({
            where: {
                status: 'active',
                expires_at: {
                    [require('sequelize').Op.lte]: new Date()
                }
            }
        });
        
        // Atualizar assinaturas expiradas
        if (expiredSubscriptions > 0) {
            await Subscription.update(
                { status: 'expired' },
                {
                    where: {
                        status: 'active',
                        expires_at: {
                            [require('sequelize').Op.lte]: new Date()
                        }
                    }
                }
            );
        }
        
        res.json({
            success: true,
            stats: {
                totalUsers,
                totalSubscriptions,
                activeSubscriptions,
                expiredSubscriptions,
                pendingSubscriptions: await Subscription.count({ where: { status: 'pending' } }),
                cancelledSubscriptions: await Subscription.count({ where: { status: 'cancelled' } })
            }
        });
        
    } catch (error) {
        console.error('Erro ao obter estatísticas:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

module.exports = router;
