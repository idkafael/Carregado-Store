// ========================================
// SUPABASE PIX TRANSACTIONS - GERENCIAMENTO DE TRANSAÇÕES PIX
// ========================================

const SupabasePixTransactions = {
    // Criar transação PIX no Supabase
    async createPixTransaction(data) {
        try {
            console.log('📝 Criando transação PIX no Supabase:', data);

            const transaction = {
                purchase_id: data.purchaseId,
                transaction_id: data.transactionId,
                qr_code_base64: data.qrCodeBase64,
                qr_code_text: data.qrCodeText,
                amount: data.amount,
                status: data.status || 'pending',
                user_id: window.currentUser?.id || null,
                user_email: window.currentUser?.email || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            // Se tiver Supabase configurado, usar API
            if (typeof window.supabase !== 'undefined') {
                const { data: result, error } = await window.supabase
                    .from('pix_transactions')
                    .insert([transaction])
                    .select()
                    .single();

                if (error) {
                    console.error('❌ Erro ao criar transação no Supabase:', error);
                    throw error;
                }

                console.log('✅ Transação PIX criada no Supabase:', result);
                return result;
            } else {
                // Fallback: salvar localmente se Supabase não estiver disponível
                console.warn('⚠️ Supabase não disponível, salvando localmente');
                const localTransactions = JSON.parse(localStorage.getItem('pix_transactions') || '[]');
                transaction.id = Date.now();
                localTransactions.push(transaction);
                localStorage.setItem('pix_transactions', JSON.stringify(localTransactions));
                console.log('💾 Transação salva localmente:', transaction);
                return transaction;
            }
        } catch (error) {
            console.error('❌ Erro ao criar transação PIX:', error);
            throw error;
        }
    },

    // Atualizar status da transação
    async updateTransactionStatus(transactionId, status, paymentData = {}) {
        try {
            console.log(`📝 Atualizando status da transação ${transactionId} para: ${status}`);

            const updateData = {
                status: status,
                updated_at: new Date().toISOString(),
                ...paymentData
            };

            if (status === 'paid' || status === 'approved') {
                updateData.paid_at = new Date().toISOString();
            }

            if (typeof window.supabase !== 'undefined') {
                const { data, error } = await window.supabase
                    .from('pix_transactions')
                    .update(updateData)
                    .eq('transaction_id', transactionId)
                    .select()
                    .single();

                if (error) {
                    console.error('❌ Erro ao atualizar transação:', error);
                    throw error;
                }

                console.log('✅ Transação atualizada:', data);
                return data;
            } else {
                // Fallback: atualizar localmente
                const localTransactions = JSON.parse(localStorage.getItem('pix_transactions') || '[]');
                const index = localTransactions.findIndex(t => t.transaction_id === transactionId);
                
                if (index !== -1) {
                    localTransactions[index] = { ...localTransactions[index], ...updateData };
                    localStorage.setItem('pix_transactions', JSON.stringify(localTransactions));
                    console.log('💾 Transação atualizada localmente');
                    return localTransactions[index];
                }
                
                return null;
            }
        } catch (error) {
            console.error('❌ Erro ao atualizar status da transação:', error);
            throw error;
        }
    },

    // Buscar transação por ID
    async getTransaction(transactionId) {
        try {
            if (typeof window.supabase !== 'undefined') {
                const { data, error } = await window.supabase
                    .from('pix_transactions')
                    .select('*')
                    .eq('transaction_id', transactionId)
                    .single();

                if (error && error.code !== 'PGRST116') { // PGRST116 = not found
                    console.error('❌ Erro ao buscar transação:', error);
                    throw error;
                }

                return data;
            } else {
                // Fallback: buscar localmente
                const localTransactions = JSON.parse(localStorage.getItem('pix_transactions') || '[]');
                return localTransactions.find(t => t.transaction_id === transactionId) || null;
            }
        } catch (error) {
            console.error('❌ Erro ao buscar transação:', error);
            throw error;
        }
    },

    // Buscar transação por purchase_id
    async getTransactionByPurchaseId(purchaseId) {
        try {
            if (typeof window.supabase !== 'undefined') {
                const { data, error } = await window.supabase
                    .from('pix_transactions')
                    .select('*')
                    .eq('purchase_id', purchaseId)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.error('❌ Erro ao buscar transação por purchase_id:', error);
                    throw error;
                }

                return data;
            } else {
                // Fallback: buscar localmente
                const localTransactions = JSON.parse(localStorage.getItem('pix_transactions') || '[]');
                return localTransactions.find(t => t.purchase_id === purchaseId) || null;
            }
        } catch (error) {
            console.error('❌ Erro ao buscar transação por purchase_id:', error);
            throw error;
        }
    },

    // Listar todas as transações do usuário
    async getUserTransactions(userId) {
        try {
            if (typeof window.supabase !== 'undefined') {
                const { data, error } = await window.supabase
                    .from('pix_transactions')
                    .select('*')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('❌ Erro ao buscar transações do usuário:', error);
                    throw error;
                }

                return data || [];
            } else {
                // Fallback: buscar localmente
                const localTransactions = JSON.parse(localStorage.getItem('pix_transactions') || '[]');
                return localTransactions.filter(t => t.user_id === userId);
            }
        } catch (error) {
            console.error('❌ Erro ao buscar transações do usuário:', error);
            throw error;
        }
    },

    // Verificar se transação foi paga
    async isTransactionPaid(transactionId) {
        try {
            const transaction = await this.getTransaction(transactionId);
            return transaction && (transaction.status === 'paid' || transaction.status === 'approved');
        } catch (error) {
            console.error('❌ Erro ao verificar se transação foi paga:', error);
            return false;
        }
    }
};

// Exportar para uso global
window.SupabasePixTransactions = SupabasePixTransactions;

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SupabasePixTransactions;
}



