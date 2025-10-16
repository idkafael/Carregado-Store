// Supabase Edge Function - Proxy PushinPay + Webhook + Entrega Automática
// Deploy: Copie este código e cole no painel do Supabase

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname
    
    // Pegar token da PushinPay das variáveis de ambiente
    const PUSHINPAY_TOKEN = Deno.env.get('PUSHINPAY_TOKEN')
    if (!PUSHINPAY_TOKEN) {
      throw new Error('PUSHINPAY_TOKEN não configurado')
    }

    // Inicializar Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('📥 Requisição recebida:', path, req.method)

    // ===== CRIAR PIX =====
    if (path === '/create-pix' && req.method === 'POST') {
      const body = await req.json()
      console.log('💳 Criando PIX:', { value: body.value })

      // Fazer requisição para PushinPay
      const response = await fetch('https://api.pushinpay.com.br/api/pix/cashIn', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PUSHINPAY_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const pixData = await response.json()
      console.log('✅ PIX criado:', { id: pixData.id, status: pixData.status })

      return new Response(
        JSON.stringify(pixData),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: response.status
        }
      )
    }

    // ===== CONSULTAR STATUS =====
    if (path.startsWith('/status/') && req.method === 'GET') {
      const transactionId = path.split('/status/')[1]
      console.log('🔍 Consultando status:', transactionId)

      // Consultar na PushinPay
      const response = await fetch(`https://api.pushinpay.com.br/api/pix/status/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PUSHINPAY_TOKEN}`,
          'Accept': 'application/json'
        }
      })

      const statusData = await response.json()
      console.log('📊 Status recebido:', { status: statusData.status, paid: statusData.paid })

      // Normalizar status
      const isPaid = statusData.status === 'paid' || statusData.status === 'approved' || 
                     statusData.status === 'completed' || statusData.status === 'confirmed' || 
                     statusData.paid === true

      // Atualizar no banco se pago
      if (isPaid) {
        await processPaymentConfirmation(supabase, transactionId)
      }

      return new Response(
        JSON.stringify(statusData),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: response.status
        }
      )
    }

    // ===== WEBHOOK PUSHINPAY =====
    if (path === '/webhook' && req.method === 'POST') {
      const webhookData = await req.json()
      console.log('🔔 Webhook recebido:', JSON.stringify(webhookData, null, 2))

      const transactionId = webhookData.id || webhookData.transaction_id || 
                           webhookData.txid || webhookData.reference
      const isPaid = webhookData.status === 'paid' || webhookData.status === 'approved' || 
                     webhookData.status === 'completed' || webhookData.paid === true

      console.log('📊 Webhook processado:', { transactionId, isPaid, status: webhookData.status })

      if (isPaid && transactionId) {
        await processPaymentConfirmation(supabase, transactionId)
      }

      return new Response(
        JSON.stringify({ success: true, received: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Rota não encontrada
    return new Response(
      JSON.stringify({ 
        error: 'Not Found',
        availableRoutes: [
          'POST /create-pix',
          'GET /status/:transactionId',
          'POST /webhook'
        ]
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404
      }
    )

  } catch (error) {
    console.error('❌ Erro:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

// ===== FUNÇÃO AUXILIAR: PROCESSAR CONFIRMAÇÃO DE PAGAMENTO =====
async function processPaymentConfirmation(supabase: any, transactionId: string) {
  console.log('💰 Processando confirmação de pagamento:', transactionId)

  try {
    // 1. Atualizar transação PIX
    const { error: pixError } = await supabase
      .from('pix_transactions')
      .update({ 
        status: 'paid',
        paid_at: new Date().toISOString()
      })
      .eq('transaction_id', transactionId)

    if (pixError) {
      console.error('❌ Erro ao atualizar PIX:', pixError)
      return
    }

    console.log('✅ Transação PIX atualizada')

    // 2. Buscar purchase_id associado
    const { data: pixData, error: fetchError } = await supabase
      .from('pix_transactions')
      .select('purchase_id')
      .eq('transaction_id', transactionId)
      .single()

    if (fetchError || !pixData?.purchase_id) {
      console.error('❌ Erro ao buscar purchase_id:', fetchError)
      return
    }

    console.log('📦 Purchase ID encontrado:', pixData.purchase_id)

    // 3. Atualizar compra para "confirmed"
    const { error: purchaseError } = await supabase
      .from('purchases')
      .update({ 
        status: 'confirmed',
        paid_at: new Date().toISOString()
      })
      .eq('id', pixData.purchase_id)

    if (purchaseError) {
      console.error('❌ Erro ao atualizar compra:', purchaseError)
      return
    }

    console.log('✅ Compra confirmada!')

    // 4. Buscar dados da compra para atualizar LTV do usuário
    const { data: purchaseData } = await supabase
      .from('purchases')
      .select('user_id, amount')
      .eq('id', pixData.purchase_id)
      .single()

    if (purchaseData) {
      // 5. Atualizar LTV e total de compras do usuário
      const { data: profileData } = await supabase
        .from('profiles')
        .select('ltv, total_purchases')
        .eq('id', purchaseData.user_id)
        .single()

      if (profileData) {
        await supabase
          .from('profiles')
          .update({
            ltv: (profileData.ltv || 0) + purchaseData.amount,
            total_purchases: (profileData.total_purchases || 0) + 1
          })
          .eq('id', purchaseData.user_id)

        console.log('✅ LTV do usuário atualizado!')
      }
    }

    console.log('🎉 Processamento completo! Produto liberado para download.')

  } catch (error) {
    console.error('❌ Erro ao processar pagamento:', error)
  }
}
