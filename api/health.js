// Vercel Function para health check
module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: 'production',
      message: 'Carregado Store API funcionando'
    });
  } else {
    res.status(405).json({
      success: false,
      error: 'Método não permitido'
    });
  }
};
