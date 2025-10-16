const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

// Inicializar Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ========================================
// LISTAR PRODUTOS ATIVOS
// ========================================
router.get('/', async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('id', { ascending: true });

    if (error) {
      console.error('❌ Erro ao buscar produtos:', error);
      return res.status(500).json({
        error: 'Erro ao buscar produtos',
        code: 'DATABASE_ERROR'
      });
    }

    res.json({
      success: true,
      data: products || []
    });

  } catch (error) {
    console.error('❌ Erro ao listar produtos:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// ========================================
// BUSCAR PRODUTO POR ID
// ========================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('active', true)
      .single();

    if (error || !product) {
      return res.status(404).json({
        error: 'Produto não encontrado',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('❌ Erro ao buscar produto:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// ========================================
// LISTAR MODELOS ATIVOS
// ========================================
router.get('/models/list', async (req, res) => {
  try {
    const { data: models, error } = await supabase
      .from('models')
      .select('*')
      .eq('active', true)
      .order('id', { ascending: true });

    if (error) {
      console.error('❌ Erro ao buscar modelos:', error);
      return res.status(500).json({
        error: 'Erro ao buscar modelos',
        code: 'DATABASE_ERROR'
      });
    }

    res.json({
      success: true,
      data: models || []
    });

  } catch (error) {
    console.error('❌ Erro ao listar modelos:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// ========================================
// VERIFICAR SE USUÁRIO COMPROU PRODUTO
// ========================================
router.get('/:productId/purchased', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const { data: purchase, error } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('status', 'confirmed')
      .limit(1);

    if (error) {
      console.error('❌ Erro ao verificar compra:', error);
      return res.status(500).json({
        error: 'Erro ao verificar compra',
        code: 'DATABASE_ERROR'
      });
    }

    res.json({
      success: true,
      hasPurchased: purchase && purchase.length > 0
    });

  } catch (error) {
    console.error('❌ Erro ao verificar compra:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// ========================================
// OBTER DADOS DE DOWNLOAD (APENAS PARA COMPRADORES)
// ========================================
router.get('/:productId/download', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    // Verificar se usuário comprou o produto
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('status', 'confirmed')
      .single();

    if (purchaseError || !purchase) {
      return res.status(403).json({
        error: 'Você não comprou este produto',
        code: 'PRODUCT_NOT_PURCHASED'
      });
    }

    // Buscar dados do produto
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return res.status(404).json({
        error: 'Produto não encontrado',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    // Retornar dados de download (sem informações sensíveis)
    res.json({
      success: true,
      data: {
        productId: product.id,
        productName: product.name,
        downloadUrl: product.download_url,
        downloadInstructions: product.download_instructions,
        purchaseDate: purchase.paid_at,
        modelId: purchase.model_id,
        modelName: purchase.model_name
      }
    });

  } catch (error) {
    console.error('❌ Erro ao obter dados de download:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

module.exports = router;
