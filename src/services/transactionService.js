import api from './api';

export const transactionService = {
    getTransactions: async (page = 1, limit = 10, filters = {}) => {
        try {
            const params = { page, limit, ...filters };
            const response = await api.get('/api/v1/transactions', { params });
            return response.data;
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                case 403:
                    throw new Error('Erro ao buscar categorias. Sem permissão.');
                case 503:
                    throw new Error('Erro no servidor. Por favor, tente novamente mais tarde.');
                default:
                    throw new Error(error.response.data.message || 'Erro ao buscar categorias.');
                }
            } else if (error.request) {
                throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
            } else {
                throw new Error('Erro ao processar a solicitação.');
            }
        }
    },

    createTransaction: async (transaction) => {
        try {
            const response = await api.post('/api/v1/transactions', transaction);
            return response.data;
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                case 400:
                    throw new Error('Erro ao criar transação. Verifique os dados enviados.');
                case 403:
                    throw new Error('Erro ao criar transação. Sem permissão.');
                case 404:
                    throw new Error('Erro ao criar transação. Recurso não encontrado.');
                case 503:
                    throw new Error('Erro no servidor. Por favor, tente novamente mais tarde.');
                default:
                    throw new Error(error.response.data.message || 'Erro ao criar transação.');
                }
            } else if (error.request) {
                throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
            } else {
                throw new Error('Erro ao processar a solicitação.');
            }
        }
    },

    updateTransaction: async (id, transaction) => {
        try {
            const response = await api.patch(`/api/v1/transactions/${id}`, transaction);
            return response.data;
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                case 400:
                    throw new Error('Erro ao atualizar transação. Verifique os dados enviados.');
                case 403:
                    throw new Error('Erro ao atualizar transação. Sem permissão.');
                case 404:
                    throw new Error('Transação não encontrada.');
                case 503:
                    throw new Error('Erro no servidor. Por favor, tente novamente mais tarde.');
                default:
                    throw new Error(error.response.data.message || 'Erro ao atualizar transação.');
                }
            } else if (error.request) {
                throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
            } else {
                throw new Error('Erro ao processar a solicitação.');
            }
        }
    },

    deleteTransaction: async (id) => {
        try {
            const response = await api.delete(`/api/v1/transactions/${id}`);
            return response.data;
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                case 403:
                    throw new Error('Erro ao excluir transação. Sem permissão.');
                case 404:
                    throw new Error('Transação não encontrada.');
                case 503:
                    throw new Error('Erro no servidor. Por favor, tente novamente mais tarde.');
                default:
                    throw new Error(error.response.data.message || 'Erro ao excluir transação.');
                }
            } else if (error.request) {
                throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
            } else {
                throw new Error('Erro ao processar a solicitação.');
            }
        }
    }
}