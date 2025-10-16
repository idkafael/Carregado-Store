const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

// Inicializar Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ========================================
// OBTER PERFIL DO USUÁRIO
// ========================================
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('❌ Erro ao buscar perfil:', error);
      return res.status(500).json({
        error: 'Erro ao buscar perfil',
        code: 'DATABASE_ERROR'
      });
    }

    if (!profile) {
      return res.status(404).json({
        error: 'Perfil não encontrado',
        code: 'PROFILE_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: {
        id: profile.id,
        name: profile.name,
        email: req.user.email,
        phone: profile.phone,
        ltv: profile.ltv || 0,
        total_purchases: profile.total_purchases || 0,
        created_at: profile.created_at
      }
    });

  } catch (error) {
    console.error('❌ Erro ao buscar perfil:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// ========================================
// ATUALIZAR PERFIL DO USUÁRIO
// ========================================
router.put('/profile', authenticateToken, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('phone').optional().isMobilePhone('pt-BR').withMessage('Telefone inválido')
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

    const userId = req.user.id;
    const { name, phone } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: 'Nenhum campo para atualizar',
        code: 'NO_UPDATES'
      });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao atualizar perfil:', error);
      return res.status(500).json({
        error: 'Erro ao atualizar perfil',
        code: 'DATABASE_ERROR'
      });
    }

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: {
        id: profile.id,
        name: profile.name,
        email: req.user.email,
        phone: profile.phone,
        ltv: profile.ltv || 0,
        total_purchases: profile.total_purchases || 0
      }
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar perfil:', error);
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
    const userId = req.user.id;

    const { data: purchases, error } = await supabase
      .from('purchases')
      .select(`
        id,
        product_id,
        product_name,
        amount,
        status,
        payment_method,
        model_id,
        model_name,
        created_at,
        paid_at,
        products (
          id,
          name,
          description,
          price,
          download_url
        )
      `)
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
// OBTER ESTATÍSTICAS DO USUÁRIO
// ========================================
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar perfil com estatísticas
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('ltv, total_purchases')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('❌ Erro ao buscar estatísticas:', profileError);
      return res.status(500).json({
        error: 'Erro ao buscar estatísticas',
        code: 'DATABASE_ERROR'
      });
    }

    // Buscar compras confirmadas
    const { data: purchases, error: purchasesError } = await supabase
      .from('purchases')
      .select('amount, created_at')
      .eq('user_id', userId)
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false });

    if (purchasesError) {
      console.error('❌ Erro ao buscar compras:', purchasesError);
    }

    // Calcular estatísticas
    const totalSpent = purchases?.reduce((sum, purchase) => sum + purchase.amount, 0) || 0;
    const lastPurchase = purchases?.[0]?.created_at || null;
    const averageOrderValue = purchases?.length > 0 ? totalSpent / purchases.length : 0;

    res.json({
      success: true,
      data: {
        ltv: profile?.ltv || 0,
        total_purchases: profile?.total_purchases || 0,
        total_spent: totalSpent,
        average_order_value: averageOrderValue,
        last_purchase: lastPurchase,
        purchase_history: purchases || []
      }
    });

  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// ========================================
// VERIFICAR STATUS DE COMPRA ESPECÍFICA
// ========================================
router.get('/purchases/:purchaseId/status', authenticateToken, async (req, res) => {
  try {
    const { purchaseId } = req.params;
    const userId = req.user.id;

    const { data: purchase, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('id', purchaseId)
      .eq('user_id', userId)
      .single();

    if (error || !purchase) {
      return res.status(404).json({
        error: 'Compra não encontrada',
        code: 'PURCHASE_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: {
        id: purchase.id,
        product_name: purchase.product_name,
        amount: purchase.amount,
        status: purchase.status,
        payment_method: purchase.payment_method,
        created_at: purchase.created_at,
        paid_at: purchase.paid_at,
        transaction_id: purchase.transaction_id
      }
    });

  } catch (error) {
    console.error('❌ Erro ao verificar status da compra:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

module.exports = router;
