const express = require('express');
const router = express.Router();
const { verifyWebhookSignature, calculateExpirationDate } = require('../utils/paypal');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

// POST /api/paypal-webhook
// Receber notificações do PayPal
router.post('/paypal-webhook', async (req, res) => {
    try {
        const webhookEvent = req.body;
        const headers = req.headers;

        console.log('📬 Webhook recebido:', webhookEvent.event_type);

        // Verificar autenticidade do webhook
        const isValid = await verifyWebhookSignature(webhookEvent, headers);

        if (!isValid) {
            console.error('❌ Webhook inválido ou não verificado');
            return res.status(400).send('Webhook verification failed');
        }

        // Processar diferentes tipos de eventos
        switch (webhookEvent.event_type) {
            case 'PAYMENT.CAPTURE.COMPLETED':
                await handlePaymentCompleted(webhookEvent);
                break;

            case 'PAYMENT.CAPTURE.DENIED':
                await handlePaymentDenied(webhookEvent);
                break;

            case 'CHECKOUT.ORDER.APPROVED':
                console.log('✅ Order aprovada:', webhookEvent.resource.id);
                break;

            default:
                console.log('ℹ️ Evento não tratado:', webhookEvent.event_type);
        }

        // Responder ao PayPal que recebemos
        res.status(200).send('OK');

    } catch (error) {
        console.error('❌ Erro no webhook:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Handler para pagamento completado
async function handlePaymentCompleted(event) {
    try {
        const resource = event.resource;
        const orderId = resource.supplementary_data?.related_ids?.order_id;
        const transactionId = resource.id;
        const amount = resource.amount.value;
        const payerEmail = resource.payer?.email_address;

        console.log('💰 Pagamento completado:', {
            orderId,
            transactionId,
            amount,
            payerEmail
        });

        // Buscar subscription pelo order_id
        const subscription = await Subscription.findOne({
            where: { paypal_order_id: orderId }
        });

        if (subscription) {
            // Atualizar status
            const expiresAt = calculateExpirationDate(subscription.plan);
            
            await subscription.update({
                status: 'active',
                transaction_id: transactionId,
                expires_at: expiresAt
            });

            console.log(`✅ Assinatura ativada via webhook: ${subscription.payer_email}`);
        } else {
            console.warn('⚠️ Subscription não encontrada para order:', orderId);
            
            // Se não encontrou, criar uma nova (fallback)
            if (payerEmail) {
                let user = await User.findOne({ where: { email: payerEmail } });
                if (!user) {
                    user = await User.create({ email: payerEmail });
                }

                await Subscription.create({
                    user_id: user.id,
                    plan: 'Mensal', // Default
                    price: amount,
                    status: 'active',
                    transaction_id: transactionId,
                    paypal_order_id: orderId || 'unknown',
                    payer_email: payerEmail,
                    expires_at: calculateExpirationDate('Mensal')
                });

                console.log('✅ Nova assinatura criada via webhook');
            }
        }
    } catch (error) {
        console.error('❌ Erro ao processar pagamento completado:', error);
    }
}

// Handler para pagamento negado
async function handlePaymentDenied(event) {
    try {
        const resource = event.resource;
        const orderId = resource.supplementary_data?.related_ids?.order_id;

        console.log('❌ Pagamento negado:', orderId);

        // Atualizar status para cancelled
        if (orderId) {
            await Subscription.update(
                { status: 'cancelled' },
                { where: { paypal_order_id: orderId } }
            );
        }
    } catch (error) {
        console.error('❌ Erro ao processar pagamento negado:', error);
    }
}

module.exports = router;


