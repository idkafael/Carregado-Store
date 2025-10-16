// Configuração do Supabase
const SUPABASE_CONFIG = {
  url: 'https://vyibdpwhkklxzuxaouza.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5aWJkcHdoa2tseHp1eGFvdXphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMTkxMDAsImV4cCI6MjA3NTY5NTEwMH0.ryqLcik3YEKklWygfw8xNTWMuNFC-oHRe8H0iY4FMrY'
};

// Inicializar cliente Supabase
let supabaseDB;
if (typeof window !== 'undefined' && window.supabase) {
  supabaseDB = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  console.log('✅ Supabase inicializado com sucesso!');
} else {
  console.error('❌ SDK do Supabase não carregado!');
}

// ========================================
// MÓDULO DE AUTENTICAÇÃO
// ========================================
const SupabaseAuth = {
  // Registrar novo usuário
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabaseDB.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name || 'Usuário',
            phone: userData.phone || null
          }
        }
      });

      if (error) throw error;

      console.log('✅ Usuário registrado:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao registrar:', error);
      return { success: false, error: error.message };
    }
  },

  // Login
  async signIn(email, password) {
    try {
      const { data, error } = await supabaseDB.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      console.log('✅ Login realizado:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao fazer login:', error);
      return { success: false, error: error.message };
    }
  },

  // Logout
  async signOut() {
    try {
      const { error } = await supabaseDB.auth.signOut();
      if (error) throw error;

      console.log('✅ Logout realizado');
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error);
      return { success: false, error: error.message };
    }
  },

  // Pegar usuário atual
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabaseDB.auth.getUser();
      if (error) throw error;

      if (user && user.id) {
        // Validar se o ID é um UUID válido
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(user.id)) {
          console.error('❌ ID de usuário inválido:', user.id);
          return { success: false, error: 'ID de usuário inválido' };
        }

        // Buscar dados do perfil
        try {
          const { data: profile, error: profileError } = await supabaseDB
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            // PGRST116 = profile não encontrado (ok, criar depois)
            console.warn('⚠️ Erro ao buscar perfil:', profileError);
          }

          return {
            success: true,
            user: {
              id: user.id,
              email: user.email,
              name: profile?.name || user.email?.split('@')[0] || 'Usuário',
              phone: profile?.phone || null,
              ltv: profile?.ltv || 0,
              total_purchases: profile?.total_purchases || 0
            }
          };
        } catch (profileError) {
          console.warn('⚠️ Erro ao buscar perfil, usando dados básicos:', profileError);
          // Retornar usuário básico sem perfil
          return {
            success: true,
            user: {
              id: user.id,
              email: user.email,
              name: user.email?.split('@')[0] || 'Usuário',
              phone: null,
              ltv: 0,
              total_purchases: 0
            }
          };
        }
      }

      return { success: true, user: null };
    } catch (error) {
      console.error('❌ Erro ao buscar usuário:', error);
      return { success: false, error: error.message };
    }
  },

  // Ouvir mudanças de autenticação
  onAuthStateChange(callback) {
    const { data: { subscription } } = supabaseDB.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return subscription;
  }
};

// ========================================
// MÓDULO DE PERFIL
// ========================================
const SupabaseProfile = {
  // Buscar perfil do usuário
  async getProfile(userId) {
    try {
      const { data, error } = await supabaseDB
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao buscar perfil:', error);
      return { success: false, error: error.message };
    }
  },

  // Atualizar perfil
  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabaseDB
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Perfil atualizado:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error);
      return { success: false, error: error.message };
    }
  }
};

// ========================================
// MÓDULO DE PRODUTOS
// ========================================
const SupabaseProducts = {
  // Listar produtos ativos
  async listProducts() {
    try {
      const { data, error } = await supabaseDB
        .from('products')
        .select('*')
        .eq('active', true)
        .order('id', { ascending: true });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao listar produtos:', error);
      return { success: false, error: error.message };
    }
  },

  // Buscar produto por ID
  async getProduct(productId) {
    try {
      const { data, error } = await supabaseDB
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao buscar produto:', error);
      return { success: false, error: error.message };
    }
  }
};

// ========================================
// MÓDULO DE MODELOS
// ========================================
const SupabaseModels = {
  // Listar modelos ativos
  async listModels() {
    try {
      const { data, error } = await supabaseDB
        .from('models')
        .select('*')
        .eq('active', true)
        .order('id', { ascending: true });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao listar modelos:', error);
      return { success: false, error: error.message };
    }
  }
};

// ========================================
// MÓDULO DE COMPRAS
// ========================================
const SupabasePurchases = {
  // Criar nova compra
  async createPurchase(purchaseData) {
    try {
      const { data, error } = await supabaseDB
        .from('purchases')
        .insert([{
          user_id: purchaseData.userId,
          product_id: purchaseData.productId,
          product_name: purchaseData.productName,
          amount: purchaseData.amount,
          status: purchaseData.status || 'pending',
          payment_method: purchaseData.paymentMethod || 'pix',
          transaction_id: purchaseData.transactionId,
          model_id: purchaseData.modelId || null,
          model_name: purchaseData.modelName || null
        }])
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Compra criada:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao criar compra:', error);
      return { success: false, error: error.message };
    }
  },

  // Atualizar status da compra
  async updatePurchaseStatus(purchaseId, status, paidAt = null) {
    try {
      const updates = { status };
      if (paidAt) {
        updates.paid_at = paidAt;
      }

      const { data, error } = await supabaseDB
        .from('purchases')
        .update(updates)
        .eq('id', purchaseId)
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Status da compra atualizado:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao atualizar compra:', error);
      return { success: false, error: error.message };
    }
  },

  // Listar compras do usuário
  async getUserPurchases(userId) {
    try {
      const { data, error } = await supabaseDB
        .from('purchases')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao listar compras:', error);
      return { success: false, error: error.message };
    }
  },

  // Verificar se usuário comprou produto
  async hasUserPurchased(userId, productId) {
    try {
      const { data, error } = await supabaseDB
        .from('purchases')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .eq('status', 'confirmed')
        .limit(1);

      if (error) throw error;

      return { success: true, hasPurchased: data.length > 0 };
    } catch (error) {
      console.error('❌ Erro ao verificar compra:', error);
      return { success: false, error: error.message };
    }
  }
};

// ========================================
// MÓDULO DE TRANSAÇÕES PIX
// ========================================
const SupabasePixTransactions = {
  // Criar transação PIX
  async createPixTransaction(pixData) {
    try {
      const { data, error } = await supabaseDB
        .from('pix_transactions')
        .insert([{
          purchase_id: pixData.purchaseId,
          transaction_id: pixData.transactionId,
          qr_code_base64: pixData.qrCodeBase64,
          emv_code: pixData.emvCode,
          status: pixData.status || 'pending',
          amount: pixData.amount,
          expires_at: pixData.expiresAt
        }])
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Transação PIX criada:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao criar transação PIX:', error);
      return { success: false, error: error.message };
    }
  },

  // Atualizar status da transação PIX
  async updatePixStatus(transactionId, status, paidAt = null) {
    try {
      const updates = { status };
      if (paidAt) {
        updates.paid_at = paidAt;
      }

      const { data, error } = await supabaseDB
        .from('pix_transactions')
        .update(updates)
        .eq('transaction_id', transactionId)
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Status PIX atualizado:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao atualizar PIX:', error);
      return { success: false, error: error.message };
    }
  },

  // Buscar transação PIX
  async getPixTransaction(transactionId) {
    try {
      const { data, error } = await supabaseDB
        .from('pix_transactions')
        .select('*')
        .eq('transaction_id', transactionId)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao buscar transação PIX:', error);
      return { success: false, error: error.message };
    }
  }
};

// Exportar para global
if (typeof window !== 'undefined') {
  window.supabase = supabaseDB;
  window.SupabaseAuth = SupabaseAuth;
  window.SupabaseProfile = SupabaseProfile;
  window.SupabaseProducts = SupabaseProducts;
  window.SupabaseModels = SupabaseModels;
  window.SupabasePurchases = SupabasePurchases;
  window.SupabasePixTransactions = SupabasePixTransactions;
}

