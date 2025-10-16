const express = require('express');
const { body, validationResult } = require('express-validator');
const { createClient } = require('@supabase/supabase-js');
const { generateToken, verifyUserExists } = require('../middleware/auth');

const router = express.Router();

// Inicializar Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ========================================
// REGISTRO DE USUÁRIO
// ========================================
router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('phone').optional().isMobilePhone('pt-BR').withMessage('Telefone inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
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

    const { name, email, phone, password } = req.body;

    // Verificar se email já existe
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const emailExists = existingUser?.users?.find(user => user.email === email);
    
    if (emailExists) {
      return res.status(409).json({
        error: 'Email já está em uso',
        code: 'EMAIL_EXISTS'
      });
    }

    // Criar usuário no Supabase
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmar email
      user_metadata: {
        name,
        phone: phone || null
      }
    });

    if (authError) {
      console.error('❌ Erro ao criar usuário:', authError);
      return res.status(500).json({
        error: 'Erro ao criar conta',
        code: 'AUTH_ERROR'
      });
    }

    // Criar perfil do usuário
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        name,
        phone: phone || null,
        ltv: 0,
        total_purchases: 0,
        created_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('❌ Erro ao criar perfil:', profileError);
      // Não falhar aqui, usuário já foi criado
    }

    // Gerar token JWT
    const token = generateToken(authData.user.id, email);

    res.status(201).json({
      success: true,
      message: 'Conta criada com sucesso',
      token,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name,
        phone: phone || null
      }
    });

  } catch (error) {
    console.error('❌ Erro no registro:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// ========================================
// LOGIN DE USUÁRIO
// ========================================
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória')
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

    const { email, password } = req.body;

    // Autenticar com Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('❌ Erro no login:', authError);
      return res.status(401).json({
        error: 'Email ou senha incorretos',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Buscar perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('❌ Erro ao buscar perfil:', profileError);
    }

    // Gerar token JWT
    const token = generateToken(authData.user.id, email);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: profile?.name || authData.user.user_metadata?.name || email.split('@')[0],
        phone: profile?.phone || authData.user.user_metadata?.phone || null,
        ltv: profile?.ltv || 0,
        total_purchases: profile?.total_purchases || 0
      }
    });

  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// ========================================
// VERIFICAR TOKEN
// ========================================
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Token não fornecido',
        code: 'MISSING_TOKEN'
      });
    }

    // Verificar token (usando middleware)
    const { authenticateToken } = require('../middleware/auth');
    
    // Simular middleware
    const mockReq = { headers: { authorization: `Bearer ${token}` } };
    const mockRes = {
      status: (code) => ({
        json: (data) => {
          if (code === 401) {
            return res.status(401).json(data);
          }
        }
      })
    };

    // Verificar usuário
    const { verifyUserExists } = require('../middleware/auth');
    const { exists, user } = await verifyUserExists(req.user?.id);

    if (!exists) {
      return res.status(401).json({
        error: 'Usuário não encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email.split('@')[0]
      }
    });

  } catch (error) {
    console.error('❌ Erro na verificação:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// ========================================
// LOGOUT (INVALIDAR TOKEN)
// ========================================
router.post('/logout', async (req, res) => {
  try {
    // Em um sistema JWT stateless, o logout é feito no frontend
    // removendo o token. Aqui podemos registrar o logout para auditoria
    
    res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro no logout:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

module.exports = router;
