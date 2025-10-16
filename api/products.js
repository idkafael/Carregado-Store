// Vercel Function para produtos
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabase = createClient(
  'https://vyibdpwhkklxzuxaouza.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5aWJkcHdoa2tseHp1eGFvdXphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMTkxMDAsImV4cCI6MjA3NTY5NTEwMH0.ryqLcik3YEKklWygfw8xNTWMuNFC-oHRe8H0iY4FMrY'
);

// Produtos de fallback caso o Supabase não funcione
const fallbackProducts = [
  {
    id: 1,
    name: "Produto Exemplo 1",
    description: "Descrição do produto exemplo 1",
    price: 29.90,
    image_url: "imagens/produto-padrao.jpg",
    active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Produto Exemplo 2", 
    description: "Descrição do produto exemplo 2",
    price: 49.90,
    image_url: "imagens/produto-padrao.jpg",
    active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: "Produto Exemplo 3",
    description: "Descrição do produto exemplo 3", 
    price: 79.90,
    image_url: "imagens/produto-padrao.jpg",
    active: true,
    created_at: new Date().toISOString()
  }
];

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      console.log('🔍 Tentando buscar produtos do Supabase...');
      
      try {
        // Tentar buscar do Supabase
        const { data: products, error } = await supabase
          .from('products')
          .select('*')
          .eq('active', true)
          .order('id', { ascending: true });

        if (error) {
          console.error('❌ Erro do Supabase:', error);
          throw error;
        }

        if (products && products.length > 0) {
          console.log('✅ Produtos encontrados no Supabase:', products.length);
          return res.json({
            success: true,
            data: products
          });
        } else {
          console.log('⚠️ Nenhum produto no Supabase, usando fallback');
          throw new Error('Nenhum produto encontrado');
        }
      } catch (supabaseError) {
        console.log('⚠️ Erro no Supabase, usando produtos de fallback');
        console.error('Erro:', supabaseError);
        
        return res.json({
          success: true,
          data: fallbackProducts,
          fallback: true
        });
      }
    } else {
      res.status(405).json({
        success: false,
        error: 'Método não permitido'
      });
    }
  } catch (error) {
    console.error('❌ Erro na função:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};
