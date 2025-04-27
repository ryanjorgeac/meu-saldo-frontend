import api from './api';

export const categoryService = {
    getCategories: async () => {
        try {
        const response = await api.get('/api/v1/categories');
        console.log('Response:', response.data); // Log the response data
        return response.data;
        } catch (error) {
        if (error.response) {
            switch (error.response.status) {
            case 401:
                throw new Error('Erro ao buscar categorias. Verifique os dados enviados.');
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
    createCategory: async (categoryData) => {
        try {
        const response = await api.post('/api/v1/categories', categoryData);
        return response.data;
        } catch (error) {
        if (error.response) {
            switch (error.response.status) {
            case 400:
                throw new Error('Erro ao criar categoria. Verifique os dados enviados.');
            case 403:
                throw new Error('Acesso negado. Você não tem permissão para criar esta categoria.');
            case 503:
                throw new Error('Erro no servidor. Por favor, tente novamente mais tarde.');
            default:
                throw new Error(error.response.data.message || 'Erro ao criar categoria.');
            }
        } else if (error.request) {
            throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
        } else {
            throw new Error('Erro ao processar a solicitação.');
        }
        }
    },
};