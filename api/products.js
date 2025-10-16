// Vercel Function para produtos
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabase = createClient(
  'https://vyibdpwhkklxzuxaouza.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5aWJkcHdoa2tseHp1eGFvdXphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMTkxMDAsImV4cCI6MjA3NTY5NTEwMH0.ryqLcik3YEKklWygfw8xNTWMuNFC-oHRe8H0iY4FMrY'
);

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
      // Listar produtos
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('id', { ascending: true });

      if (error) {
        console.error('❌ Erro ao buscar produtos:', error);
        return res.status(500).json({
          success: false,
          error: 'Erro ao buscar produtos'
        });
      }

      res.json({
        success: true,
        data: products || []
      });
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
