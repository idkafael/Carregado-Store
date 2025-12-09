const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

// GET /api/subscription-status/:email
// Verificar se usuário tem assinatura ativa
router.get('/subscription-status/:email', async (req, res) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email não fornecido'
            });
        }

        // Buscar usuário
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.json({
                success: true,
                hasActiveSubscription: false,
                message: 'Usuário não encontrado'
            });
        }

        // Buscar assinatura ativa e não expirada
        const now = new Date();
        const subscription = await Subscription.findOne({
            where: {
                user_id: user.id,
                status: 'active',
                expires_at: {
                    [Op.gt]: now // Maior que agora (não expirou)
                }
            },
            order: [['created_at', 'DESC']]
        });

        if (subscription) {
            res.json({
                success: true,
                hasActiveSubscription: true,
                subscription: {
                    plan: subscription.plan,
                    price: subscription.price,
                    expires_at: subscription.expires_at,
                    created_at: subscription.created_at
                }
            });
        } else {
            res.json({
                success: true,
                hasActiveSubscription: false,
                message: 'Nenhuma assinatura ativa encontrada'
            });
        }

    } catch (error) {
        console.error('Erro em subscription-status:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/subscriptions (Admin - listar todas)
router.get('/subscriptions', async (req, res) => {
    try {
        const subscriptions = await Subscription.findAll({
            include: [User],
            order: [['created_at', 'DESC']],
            limit: 100
        });

        res.json({
            success: true,
            count: subscriptions.length,
            subscriptions: subscriptions
        });

    } catch (error) {
        console.error('Erro ao listar subscriptions:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// POST /api/check-and-expire
// Verificar e expirar assinaturas vencidas (Cron job pode chamar)
router.post('/check-and-expire', async (req, res) => {
    try {
        const now = new Date();

        const result = await Subscription.update(
            { status: 'expired' },
            {
                where: {
                    status: 'active',
                    expires_at: {
                        [Op.lt]: now // Menor que agora (expirou)
                    }
                }
            }
        );

        console.log(`⏰ ${result[0]} assinaturas expiradas`);

        res.json({
            success: true,
            expired_count: result[0]
        });

    } catch (error) {
        console.error('Erro ao expirar subscriptions:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;


