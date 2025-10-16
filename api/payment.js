const express = require('express');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Inicializar Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Token de acesso necessário',
      code: 'MISSING_TOKEN'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      error: 'Token inválido',
      code: 'INVALID_TOKEN'
    });
  }
};

// ========================================
// CRIAR PIX
// ========================================
router.post('/create-pix', authenticateToken, [
  body('amount').isNumeric().isFloat({ min: 0.01 }).withMessage('Valor deve ser maior que R$ 0,01'),
  body('productId').isUUID().withMessage('ID do produto inválido'),
  body('productName').trim().isLength({ min: 1, max: 255 }).withMessage('Nome do produto é obrigatório'),
  body('modelId').optional().isUUID().withMessage('ID do modelo inválido'),
  body('modelName').optional().trim().isLength({ max: 255 }).withMessage('Nome do modelo muito longo')
], async (req, res) => {
  try {
    // Validar dados
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const { amount, productId, productName, modelId, modelName } = req.body;
    const userId = req.user.userId;

    // Verificar se produto existe
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('active', true)
      .single();

    if (productError || !product) {
      return res.status(404).json({
        error: 'Produto não encontrado ou inativo',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    // Criar compra no banco
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        user_id: userId,
        product_id: productId,
        product_name: productName,
        amount: amount,
        status: 'pending',
        payment_method: 'pix',
        model_id: modelId || null,
        model_name: modelName || null
      })
      .select()
      .single();

    if (purchaseError) {
      console.error('❌ Erro ao criar compra:', purchaseError);
      return res.status(500).json({
        error: 'Erro ao criar compra',
        code: 'PURCHASE_ERROR'
      });
    }

    // Criar PIX na PushinPay
    const pixData = {
      value: Math.round(amount * 100), // Converter para centavos
      webhook_url: `${process.env.SUPABASE_URL}/functions/v1/pushinpay-proxy/webhook`,
      split_rules: []
    };

    const pushinpayResponse = await axios.post(
      `${process.env.PUSHINPAY_BASE_URL}/api/pix/cashIn`,
      pixData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.PUSHINPAY_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    if (pushinpayResponse.status !== 200) {
      throw new Error(`PushinPay retornou status ${pushinpayResponse.status}`);
    }

    const pixResult = pushinpayResponse.data;
    const transactionId = pixResult.id || pixResult.transaction_id || pixResult.reference;

    // Salvar transação PIX
    const { error: pixError } = await supabase
      .from('pix_transactions')
      .insert({
        purchase_id: purchase.id,
        transaction_id: transactionId,
        qr_code_base64: pixResult.qr_code || pixResult.qr_code_base64,
        emv_code: pixResult.emv_code || pixResult.pix_code,
        status: 'pending',
        amount: amount,
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutos
      });

    if (pixError) {
      console.error('❌ Erro ao salvar transação PIX:', pixError);
    }

    // Atualizar compra com transaction_id
    await supabase
      .from('purchases')
      .update({ transaction_id: transactionId })
      .eq('id', purchase.id);

    res.json({
      success: true,
      message: 'PIX criado com sucesso',
      data: {
        transactionId,
        qrCode: pixResult.qr_code || pixResult.qr_code_base64,
        pixCode: pixResult.emv_code || pixResult.pix_code,
        amount: amount,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Erro ao criar PIX:', error);
    
    if (error.response) {
      return res.status(error.response.status).json({
        error: 'Erro na API de pagamento',
        details: error.response.data
      });
    }

    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// ========================================
// CONSULTAR STATUS DO PIX
// ========================================
router.get('/status/:transactionId', authenticateToken, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user.userId;

    // Verificar se a transação pertence ao usuário
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select('*')
      .eq('transaction_id', transactionId)
      .eq('user_id', userId)
      .single();

    if (purchaseError || !purchase) {
      return res.status(404).json({
        error: 'Transação não encontrada',
        code: 'TRANSACTION_NOT_FOUND'
      });
    }

    // Consultar status na PushinPay
    const statusResponse = await axios.get(
      `${process.env.PUSHINPAY_BASE_URL}/api/pix/status/${transactionId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.PUSHINPAY_TOKEN}`,
          'Accept': 'application/json'
        }
      }
    );

    if (statusResponse.status !== 200) {
      throw new Error(`PushinPay retornou status ${statusResponse.status}`);
    }

    const statusData = statusResponse.data;
    const isPaid = statusData.status === 'paid' || statusData.status === 'approved' || 
                   statusData.status === 'completed' || statusData.status === 'confirmed' || 
                   statusData.paid === true;

    // Se pago, atualizar no banco
    if (isPaid && purchase.status !== 'confirmed') {
      await supabase
        .from('purchases')
        .update({ 
          status: 'confirmed',
          paid_at: new Date().toISOString()
        })
        .eq('id', purchase.id);

      await supabase
        .from('pix_transactions')
        .update({ 
          status: 'paid',
          paid_at: new Date().toISOString()
        })
        .eq('transaction_id', transactionId);

      // Atualizar LTV do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('ltv, total_purchases')
        .eq('id', userId)
        .single();

      if (profile) {
        await supabase
          .from('profiles')
          .update({
            ltv: (profile.ltv || 0) + purchase.amount,
            total_purchases: (profile.total_purchases || 0) + 1
          })
          .eq('id', userId);
      }
    }

    res.json({
      success: true,
      data: {
        transactionId,
        status: statusData.status,
        paid: isPaid,
        amount: purchase.amount,
        productName: purchase.product_name
      }
    });

  } catch (error) {
    console.error('❌ Erro ao consultar status:', error);
    
    if (error.response) {
      return res.status(error.response.status).json({
        error: 'Erro na API de pagamento',
        details: error.response.data
      });
    }

    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// ========================================
// LISTAR COMPRAS DO USUÁRIO
// ========================================
router.get('/purchases', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: purchases, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erro ao buscar compras:', error);
      return res.status(500).json({
        error: 'Erro ao buscar compras',
        code: 'DATABASE_ERROR'
      });
    }

    res.json({
      success: true,
      data: purchases || []
    });

  } catch (error) {
    console.error('❌ Erro ao listar compras:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// ========================================
// WEBHOOK PUSHINPAY (PÚBLICO)
// ========================================
router.post('/webhook', async (req, res) => {
  try {
    const webhookData = req.body;
    console.log('🔔 Webhook recebido:', JSON.stringify(webhookData, null, 2));

    const transactionId = webhookData.id || webhookData.transaction_id || 
                         webhookData.txid || webhookData.reference;
    const isPaid = webhookData.status === 'paid' || webhookData.status === 'approved' || 
                   webhookData.status === 'completed' || webhookData.paid === true;

    if (isPaid && transactionId) {
      // Processar confirmação de pagamento
      await processPaymentConfirmation(transactionId);
    }

    res.json({
      success: true,
      received: true
    });

  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// ========================================
// FUNÇÃO AUXILIAR: PROCESSAR CONFIRMAÇÃO
// ========================================
async function processPaymentConfirmation(transactionId) {
  try {
    console.log('💰 Processando confirmação de pagamento:', transactionId);

    // Atualizar transação PIX
    const { error: pixError } = await supabase
      .from('pix_transactions')
      .update({ 
        status: 'paid',
        paid_at: new Date().toISOString()
      })
      .eq('transaction_id', transactionId);

    if (pixError) {
      console.error('❌ Erro ao atualizar PIX:', pixError);
      return;
    }

    // Buscar purchase_id
    const { data: pixData, error: fetchError } = await supabase
      .from('pix_transactions')
      .select('purchase_id')
      .eq('transaction_id', transactionId)
      .single();

    if (fetchError || !pixData?.purchase_id) {
      console.error('❌ Erro ao buscar purchase_id:', fetchError);
      return;
    }

    // Atualizar compra
    const { error: purchaseError } = await supabase
      .from('purchases')
      .update({ 
        status: 'confirmed',
        paid_at: new Date().toISOString()
      })
      .eq('id', pixData.purchase_id);

    if (purchaseError) {
      console.error('❌ Erro ao atualizar compra:', purchaseError);
      return;
    }

    // Atualizar LTV do usuário
    const { data: purchaseData } = await supabase
      .from('purchases')
      .select('user_id, amount')
      .eq('id', pixData.purchase_id)
      .single();

    if (purchaseData) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('ltv, total_purchases')
        .eq('id', purchaseData.user_id)
        .single();

      if (profileData) {
        await supabase
          .from('profiles')
          .update({
            ltv: (profileData.ltv || 0) + purchaseData.amount,
            total_purchases: (profileData.total_purchases || 0) + 1
          })
          .eq('id', purchaseData.user_id);
      }
    }

    console.log('🎉 Processamento completo! Produto liberado para download.');

  } catch (error) {
    console.error('❌ Erro ao processar pagamento:', error);
  }
}

module.exports = router;
