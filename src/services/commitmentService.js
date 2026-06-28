import api from "./api";

export const commitmentService = {
  getCommitments: async () => {
    try {
      const response = await api.get("/api/v1/commitments");
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) return [];
      if (error.response) {
        switch (error.response.status) {
          case 503:
            throw new Error("Erro no servidor. Por favor, tente novamente mais tarde.");
          default:
            throw new Error(error.response.data.message || "Erro ao buscar compromissos.");
        }
      } else if (error.request) {
        throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão.");
      } else {
        throw new Error("Erro ao processar a solicitação.");
      }
    }
  },

  getCommitment: async (id) => {
    try {
      const response = await api.get(`/api/v1/commitments/${id}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 404:
            throw new Error("Compromisso não encontrado.");
          case 503:
            throw new Error("Erro no servidor. Por favor, tente novamente mais tarde.");
          default:
            throw new Error(error.response.data.message || "Erro ao buscar compromisso.");
        }
      } else if (error.request) {
        throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão.");
      } else {
        throw new Error("Erro ao processar a solicitação.");
      }
    }
  },

  createCommitment: async (data) => {
    try {
      const response = await api.post("/api/v1/commitments", data);
      return response.data;
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error("Erro ao criar compromisso. Verifique os dados enviados.");
          case 403:
            throw new Error("Sem permissão para criar este compromisso.");
          case 503:
            throw new Error("Erro no servidor. Por favor, tente novamente mais tarde.");
          default:
            throw new Error(error.response.data.message || "Erro ao criar compromisso.");
        }
      } else if (error.request) {
        throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão.");
      } else {
        throw new Error("Erro ao processar a solicitação.");
      }
    }
  },

  updateCommitment: async (id, data) => {
    try {
      const response = await api.patch(`/api/v1/commitments/${id}`, data);
      return response.data;
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error("Erro ao atualizar compromisso. Verifique os dados enviados.");
          case 403:
            throw new Error("Sem permissão para atualizar este compromisso.");
          case 404:
            throw new Error("Compromisso não encontrado.");
          case 503:
            throw new Error("Erro no servidor. Por favor, tente novamente mais tarde.");
          default:
            throw new Error(error.response.data.message || "Erro ao atualizar compromisso.");
        }
      } else if (error.request) {
        throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão.");
      } else {
        throw new Error("Erro ao processar a solicitação.");
      }
    }
  },

  deleteCommitment: async (id) => {
    try {
      await api.delete(`/api/v1/commitments/${id}`);
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 403:
            throw new Error("Sem permissão para excluir este compromisso.");
          case 404:
            throw new Error("Compromisso não encontrado.");
          case 503:
            throw new Error("Erro no servidor. Por favor, tente novamente mais tarde.");
          default:
            throw new Error(error.response.data.message || "Erro ao excluir compromisso.");
        }
      } else if (error.request) {
        throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão.");
      } else {
        throw new Error("Erro ao processar a solicitação.");
      }
    }
  },

  logCommitment: async (id) => {
    try {
      const response = await api.post(`/api/v1/transactions/from-commitment/${id}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error("Erro ao lançar compromisso.");
          case 403:
            throw new Error("Sem permissão para lançar este compromisso.");
          case 404:
            throw new Error("Compromisso não encontrado.");
          case 503:
            throw new Error("Erro no servidor. Por favor, tente novamente mais tarde.");
          default:
            throw new Error(error.response.data.message || "Erro ao lançar compromisso.");
        }
      } else if (error.request) {
        throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão.");
      } else {
        throw new Error("Erro ao processar a solicitação.");
      }
    }
  },
};
