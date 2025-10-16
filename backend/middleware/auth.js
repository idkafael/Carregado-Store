const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

// Inicializar Supabase com service role (acesso total)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware de autenticação JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Token de acesso necessário',
        code: 'MISSING_TOKEN'
      });
    }

    // Verificar JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar se usuário ainda existe no Supabase
    const { data: user, error } = await supabase.auth.admin.getUserById(decoded.userId);
    
    if (error || !user) {
      return res.status(401).json({ 
        error: 'Token inválido ou usuário não encontrado',
        code: 'INVALID_TOKEN'
      });
    }

    // Adicionar dados do usuário à requisição
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role || 'user'
    };

    next();
  } catch (error) {
    console.error('❌ Erro na autenticação:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Token inválido',
        code: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }

    return res.status(500).json({ 
      error: 'Erro interno na autenticação',
      code: 'AUTH_ERROR'
    });
  }
};

// Middleware para verificar roles específicos
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Usuário não autenticado',
        code: 'NOT_AUTHENTICATED'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Acesso negado. Permissões insuficientes',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

// Middleware para verificar se usuário pode acessar recurso
const requireOwnership = (resourceUserIdField = 'user_id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Usuário não autenticado',
        code: 'NOT_AUTHENTICATED'
      });
    }

    // Para recursos que precisam verificar ownership
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (resourceUserId && resourceUserId !== req.user.id) {
      return res.status(403).json({ 
        error: 'Acesso negado. Você só pode acessar seus próprios recursos',
        code: 'ACCESS_DENIED'
      });
    }

    next();
  };
};

// Função para gerar JWT
const generateToken = (userId, email, role = 'user') => {
  return jwt.sign(
    { 
      userId, 
      email, 
      role,
      iat: Math.floor(Date.now() / 1000)
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: '24h',
      issuer: 'carregado-store-api',
      audience: 'carregado-store-frontend'
    }
  );
};

// Função para verificar se usuário existe no Supabase
const verifyUserExists = async (userId) => {
  try {
    const { data, error } = await supabase.auth.admin.getUserById(userId);
    return { exists: !error && !!data, user: data };
  } catch (error) {
    console.error('❌ Erro ao verificar usuário:', error);
    return { exists: false, user: null };
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  requireOwnership,
  generateToken,
  verifyUserExists
};
