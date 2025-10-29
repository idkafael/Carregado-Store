const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Criar uma sessão de checkout do Stripe
 * @param {Object} params - Parâmetros da sessão
 * @param {string} params.email - Email do cliente
 * @param {string} params.plan - Nome do plano (Mensal, Trimestral, Anual)
 * @param {number} params.amount - Valor em centavos
 * @param {string} params.currency - Moeda (usd, eur, brl)
 * @param {string} params.successUrl - URL de sucesso
 * @param {string} params.cancelUrl - URL de cancelamento
 * @returns {Promise<Object>} Sessão criada
 */
async function createCheckoutSession(params) {
    try {
        const { email, plan, amount, currency, successUrl, cancelUrl } = params;
        
        // Converter valor para centavos se necessário
        const amountInCents = Math.round(amount * 100);
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currency.toLowerCase(),
                        product_data: {
                            name: `Assinatura ${plan}`,
                            description: `Acesso completo ao conteúdo por ${getPlanDuration(plan)}`,
                        },
                        unit_amount: amountInCents,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment', // Pagamento único (não recorrente)
            customer_email: email,
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                plan: plan,
                email: email,
                amount: amount.toString(),
                currency: currency
            }
        });
        
        return {
            success: true,
            sessionId: session.id,
            url: session.url,
            publicId: session.id // Para compatibilidade com código existente
        };
        
    } catch (error) {
        console.error('Erro ao criar sessão Stripe:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Recuperar uma sessão de checkout do Stripe
 * @param {string} sessionId - ID da sessão
 * @returns {Promise<Object>} Dados da sessão
 */
async function retrieveCheckoutSession(sessionId) {
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        return {
            success: true,
            session: session,
            paymentStatus: session.payment_status,
            isCompleted: session.payment_status === 'paid'
        };
        
    } catch (error) {
        console.error('Erro ao recuperar sessão Stripe:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Construir evento do webhook Stripe
 * @param {string} payload - Payload do webhook
 * @param {string} signature - Assinatura do webhook
 * @param {string} secret - Secret do webhook
 * @returns {Object} Evento construído
 */
function constructWebhookEvent(payload, signature, secret) {
    try {
        return stripe.webhooks.constructEvent(payload, signature, secret);
    } catch (error) {
        console.error('Erro ao construir evento webhook:', error);
        throw error;
    }
}

/**
 * Obter duração do plano em texto
 * @param {string} plan - Nome do plano
 * @returns {string} Duração do plano
 */
function getPlanDuration(plan) {
    const durations = {
        'Mensal': '31 dias',
        'Trimestral': '3 meses',
        'Anual': '12 meses'
    };
    
    return durations[plan] || 'período indefinido';
}

/**
 * Calcular data de expiração baseada no plano
 * @param {string} plan - Nome do plano
 * @returns {Date} Data de expiração
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

/**
 * Validar se o evento webhook é válido
 * @param {Object} event - Evento do webhook
 * @returns {boolean} Se o evento é válido
 */
function isValidWebhookEvent(event) {
    return event && event.type === 'checkout.session.completed';
}

module.exports = {
    createCheckoutSession,
    retrieveCheckoutSession,
    constructWebhookEvent,
    getPlanDuration,
    calculateExpirationDate,
    isValidWebhookEvent
};
