// API de Produtos - Carregado Store
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { action } = req.query;

    switch (action) {
      case 'list':
        return await handleListProducts(req, res);
      
      case 'get':
        return await handleGetProduct(req, res);
      
      case 'categories':
        return await handleGetCategories(req, res);
      
      default:
        return res.status(400).json({ error: 'Ação inválida' });
    }
  } catch (error) {
    console.error('Erro nos produtos:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

async function handleListProducts(req, res) {
  try {
    const { category, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Erro ao buscar produtos:', error);
      return res.status(500).json({ error: 'Erro ao buscar produtos' });
    }

    return res.status(200).json({
      success: true,
      products: products || [],
      total: products?.length || 0
    });
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function handleGetProduct(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'ID do produto não fornecido' });
    }

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('active', true)
      .single();

    if (error || !product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    return res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function handleGetCategories(req, res) {
  try {
    const { data: categories, error } = await supabase
      .from('products')
      .select('category')
      .eq('active', true);

    if (error) {
      console.error('Erro ao buscar categorias:', error);
      return res.status(500).json({ error: 'Erro ao buscar categorias' });
    }

    // Extrair categorias únicas
    const uniqueCategories = [...new Set(categories.map(item => item.category))];

    return res.status(200).json({
      success: true,
      categories: uniqueCategories
    });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}


