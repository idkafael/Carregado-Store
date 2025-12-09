// API de Pagamentos PIX - Carregado Store
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Configuração do PushinPay
const PUSHINPAY_CONFIG = {
  baseURL: 'https://api.pushinpay.com/v1',
  token: process.env.PUSHINPAY_TOKEN
};

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
    const { action } = req.body;
    const url = req.url;

    // Roteamento baseado na URL
    if (url.includes('/create-pix')) {
      return await handleCreatePix(req, res);
    } else if (url.includes('/check-status/')) {
      const transactionId = url.split('/check-status/')[1];
      return await handleCheckStatus(req, res, transactionId);
    } else if (url.includes('/confirm-payment')) {
      return await handleConfirmPayment(req, res);
    } else if (action) {
      // Fallback para o sistema antigo
      switch (action) {
        case 'create_pix':
          return await handleCreatePix(req, res);
        case 'check_status':
          return await handleCheckStatus(req, res);
        case 'confirm_payment':
          return await handleConfirmPayment(req, res);
        default:
          return res.status(400).json({ error: 'Ação inválida' });
      }
    } else {
      return res.status(400).json({ error: 'Endpoint não encontrado' });
    }
  } catch (error) {
    console.error('Erro no pagamento:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

async function handleCreatePix(req, res) {
  try {
    const { productId, userId, amount, description } = req.body;

    // Validar dados
    if (!amount) {
      return res.status(400).json({ error: 'Valor é obrigatório' });
    }

    console.log('Criando PIX:', { amount, description, productId, userId });

    // Criar PIX via PushinPay
    const pixData = {
      amount: Math.round(amount * 100), // Converter para centavos
      description: description || 'Pagamento via PIX - Carregado Store',
      external_id: `carregado_${Date.now()}`,
      expires_in: 1800 // 30 minutos
    };

    console.log('Dados enviados para PushinPay:', pixData);

    const pushinResponse = await axios.post(
      `${PUSHINPAY_CONFIG.baseURL}/pix/payments`,
      pixData,
      {
        headers: {
          'Authorization': `Bearer ${PUSHINPAY_CONFIG.token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Resposta do PushinPay:', pushinResponse.data);

    if (pushinResponse.data && pushinResponse.data.id) {
      // Criar transação no banco com dados do PIX
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: userId || null,
            product_id: productId || null,
            amount: amount,
            description: description || 'Pagamento via PIX',
            status: 'pending',
            payment_method: 'pix',
            pix_id: pushinResponse.data.id,
            pix_code: pushinResponse.data.pix_code || pushinResponse.data.emv,
            qr_code: pushinResponse.data.qr_code,
            expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            created_at: new Date().toISOString()
          }
        ])
        .select('id')
        .single();

      if (transactionError) {
        console.error('Erro ao criar transação no banco:', transactionError);
        // Mesmo com erro no banco, retornar dados do PIX
      }

      return res.status(200).json({
        success: true,
        id: pushinResponse.data.id,
        transaction_id: transaction?.id || pushinResponse.data.id,
        pix_code: pushinResponse.data.pix_code || pushinResponse.data.emv,
        qr_code: pushinResponse.data.qr_code,
        amount: amount,
        description: description || 'Pagamento via PIX',
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      });
    } else {
      throw new Error('Resposta inválida do PushinPay');
    }
  } catch (error) {
    console.error('Erro ao criar PIX:', error);
    
    // Retornar erro mais específico
    if (error.response) {
      console.error('Erro da API PushinPay:', error.response.data);
      return res.status(500).json({ 
        error: 'Erro na API de pagamento', 
        details: error.response.data?.message || error.response.data?.error 
      });
    }
    
    return res.status(500).json({ 
      error: 'Erro ao criar pagamento PIX',
      details: error.message 
    });
  }
}

async function handleCheckStatus(req, res, transactionId) {
  try {
    // Se transactionId não foi passado como parâmetro, tentar do body
    if (!transactionId) {
      transactionId = req.body?.transactionId;
    }

    if (!transactionId) {
      return res.status(400).json({ error: 'ID da transação não fornecido' });
    }

    console.log('Verificando status da transação:', transactionId);

    // Buscar transação no banco
    const { data: transaction, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (error || !transaction) {
      console.log('Transação não encontrada no banco, tentando verificar diretamente no PushinPay');
      // Se não encontrou no banco, tentar verificar diretamente no PushinPay
      try {
        const statusResponse = await axios.get(
          `${PUSHINPAY_CONFIG.baseURL}/pix/payments/${transactionId}`,
          {
            headers: {
              'Authorization': `Bearer ${PUSHINPAY_CONFIG.token}`
            }
          }
        );

        console.log('Status do PushinPay:', statusResponse.data);

        return res.status(200).json({
          success: true,
          status: statusResponse.data.status || 'pending',
          paid: statusResponse.data.status === 'paid',
          message: statusResponse.data.status === 'paid' ? 'Pagamento confirmado!' : 'Aguardando pagamento...'
        });
      } catch (apiError) {
        console.error('Erro ao verificar status no PushinPay:', apiError);
        return res.status(404).json({ error: 'Transação não encontrada' });
      }
    }

    // Verificar status no PushinPay
    if (transaction.pix_id) {
      try {
        const statusResponse = await axios.get(
          `${PUSHINPAY_CONFIG.baseURL}/pix/payments/${transaction.pix_id}`,
          {
            headers: {
              'Authorization': `Bearer ${PUSHINPAY_CONFIG.token}`
            }
          }
        );

        console.log('Status do PushinPay:', statusResponse.data);

        if (statusResponse.data.status === 'paid') {
          // Atualizar status no banco
          await supabase
            .from('transactions')
            .update({
              status: 'paid',
              paid_at: new Date().toISOString()
            })
            .eq('id', transactionId);

          // Liberar produto para o usuário se tiver dados
          if (transaction.user_id && transaction.product_id) {
            await supabase
              .from('user_products')
              .insert([
                {
                  user_id: transaction.user_id,
                  product_id: transaction.product_id,
                  transaction_id: transactionId,
                  created_at: new Date().toISOString()
                }
              ]);
          }

          return res.status(200).json({
            success: true,
            status: 'paid',
            paid: true,
            message: 'Pagamento confirmado! Produto liberado.'
          });
        } else {
          // Atualizar status no banco com o status atual
          await supabase
            .from('transactions')
            .update({
              status: statusResponse.data.status || 'pending'
            })
            .eq('id', transactionId);
        }
      } catch (apiError) {
        console.error('Erro ao verificar status no PushinPay:', apiError);
        // Continuar com verificação local
      }
    }

    // Verificar se expirou
    if (transaction.expires_at && new Date() > new Date(transaction.expires_at)) {
      await supabase
        .from('transactions')
        .update({ status: 'expired' })
        .eq('id', transactionId);

      return res.status(200).json({
        success: true,
        status: 'expired',
        paid: false,
        message: 'PIX expirado. Crie um novo pagamento.'
      });
    }

    return res.status(200).json({
      success: true,
      status: transaction.status || 'pending',
      paid: transaction.status === 'paid',
      message: 'Aguardando pagamento...'
    });
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    return res.status(500).json({ error: 'Erro ao verificar status do pagamento' });
  }
}

async function handleConfirmPayment(req, res) {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({ error: 'ID da transação não fornecido' });
    }

    console.log('Confirmando pagamento:', transactionId);

    // Buscar transação
    const { data: transaction, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (fetchError || !transaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    // Atualizar status para pago
    const { error } = await supabase
      .from('transactions')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString()
      })
      .eq('id', transactionId);

    if (error) {
      console.error('Erro ao confirmar pagamento:', error);
      return res.status(500).json({ error: 'Erro ao confirmar pagamento' });
    }

    // Liberar produto para o usuário se tiver dados
    if (transaction.user_id && transaction.product_id) {
      await supabase
        .from('user_products')
        .insert([
          {
            user_id: transaction.user_id,
            product_id: transaction.product_id,
            transaction_id: transactionId,
            created_at: new Date().toISOString()
          }
        ]);
    }

    return res.status(200).json({
      success: true,
      status: 'paid',
      message: 'Pagamento confirmado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao confirmar pagamento:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}


