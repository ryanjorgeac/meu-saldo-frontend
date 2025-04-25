import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/api/v1/auth/register', userData);
      return response.data;
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error(error.response.data.message || 'Dados inválidos para cadastro.');
          case 409:
            throw new Error('Não foi possível cadastrar o usuário com esse e-mail.');
          case 503:
            throw new Error('Erro no servidor. Por favor, tente novamente mais tarde.');
          default:
            throw new Error(error.response.data.message || 'Erro durante o cadastro.');
        }
      } else if (error.request) {
        throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        throw new Error('Erro ao processar a solicitação.');
      }
    }
  },
  login: async (credentials) => {
    try {
      const response = await api.post('/api/v1/auth/login', credentials);
      return response.data;
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('E-mail ou senha inválidos.');
          case 503:
            throw new Error('Erro no servidor. Por favor, tente novamente mais tarde.');
          default:
            throw new Error(error.response.data.message || 'Erro ao fazer login.');
        }
      } else if (error.request) {
        throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        throw new Error('Erro ao processar a solicitação.');
      }
    }
  },
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/api/v1/auth/reset-password', { email });
      return response.data;
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
          case 404:
            throw new Error('E-mail não encontrado em nossa base de dados.');
          case 429:
            throw new Error('Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.');
          case 500:
          case 502:
          case 503:
            throw new Error('Erro no servidor. Por favor, tente novamente mais tarde.');
          default:
            throw new Error(error.response.data.message || 'Erro ao processar a solicitação.');
        }
      } else if (error.request) {
        throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        throw new Error('Erro ao processar a solicitação.');
      }
    }
  }
};

export default api;