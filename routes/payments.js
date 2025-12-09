const express = require('express');
const router = express.Router();
const { createOrder, capturePayment, calculateExpirationDate } = require('../utils/paypal');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

// POST /api/create-order
// Criar order no PayPal
router.post('/create-order', async (req, res) => {
    try {
        const { amount, plan, email } = req.body;

        if (!amount || !plan || !email) {
            return res.status(400).json({
                success: false,
                error: 'Dados incompletos (amount, plan, email)'
            });
        }

        // Verificar/criar usuário
        let user = await User.findOne({ where: { email } });
        if (!user) {
            user = await User.create({ email });
        }

        // Definir descrição
        const descriptions = {
            'Mensal': 'Assinatura Mensal (31 dias) - CarregadoStore',
            'Trimestral': 'Assinatura Trimestral (3 meses) - CarregadoStore',
            'Anual': 'Assinatura Anual (12 meses) - CarregadoStore'
        };

        const description = descriptions[plan] || `Assinatura ${plan} - CarregadoStore`;

        // Criar order no PayPal
        const result = await createOrder(amount, description, plan);

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: 'Erro ao criar order no PayPal'
            });
        }

        // Salvar no banco como pending
        await Subscription.create({
            user_id: user.id,
            plan: plan,
            price: amount,
            status: 'pending',
            paypal_order_id: result.orderId,
            payer_email: email,
            expires_at: null
        });

        res.json({
            success: true,
            orderId: result.orderId
        });

    } catch (error) {
        console.error('Erro em create-order:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// POST /api/capture-payment
// Capturar pagamento após aprovação do usuário
router.post('/capture-payment', async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                error: 'Order ID não fornecido'
            });
        }

        // Capturar pagamento no PayPal
        const result = await capturePayment(orderId);

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: 'Erro ao capturar pagamento'
            });
        }

        const captureData = result.data;
        const transactionId = captureData.purchase_units[0].payments.captures[0].id;

        // Buscar subscription pendente
        const subscription = await Subscription.findOne({
            where: {
                paypal_order_id: orderId,
                status: 'pending'
            }
        });

        if (!subscription) {
            console.warn('⚠️ Subscription não encontrada para order:', orderId);
        } else {
            // Atualizar status para ativo
            const expiresAt = calculateExpirationDate(subscription.plan);
            
            await subscription.update({
                status: 'active',
                transaction_id: transactionId,
                expires_at: expiresAt
            });

            console.log(`✅ Assinatura ativada: ${subscription.payer_email} - ${subscription.plan}`);
        }

        res.json({
            success: true,
            transaction_id: transactionId,
            data: captureData
        });

    } catch (error) {
        console.error('Erro em capture-payment:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;


