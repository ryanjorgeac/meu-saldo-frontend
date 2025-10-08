import { mockTransactions, mockCategories, simulateDelay, generateId } from './mockData';

let transactions = [...mockTransactions];
let categories = [...mockCategories];

export const mockTransactionService = {
  getTransactions: async (page = 1, limit = 10, filters = {}) => {
    await simulateDelay(400);
    
    try {
      let filteredTransactions = [...transactions];

      if (filters.categoryId) {
        filteredTransactions = filteredTransactions.filter(
          t => t.categoryId === parseInt(filters.categoryId)
        );
      }
      
      if (filters.type) {
        filteredTransactions = filteredTransactions.filter(
          t => t.type === filters.type
        );
      }
      
      if (filters.startDate) {
        filteredTransactions = filteredTransactions.filter(
          t => new Date(t.date) >= new Date(filters.startDate)
        );
      }
      
      if (filters.endDate) {
        filteredTransactions = filteredTransactions.filter(
          t => new Date(t.date) <= new Date(filters.endDate)
        );
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredTransactions = filteredTransactions.filter(
          t => t.description.toLowerCase().includes(searchTerm) ||
               t.categoryName.toLowerCase().includes(searchTerm)
        );
      }

      filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
      
      return {
        transactions: paginatedTransactions,
        totalCount: filteredTransactions.length,
        totalPages: Math.ceil(filteredTransactions.length / limit),
        currentPage: page,
        hasNext: endIndex < filteredTransactions.length,
        hasPrev: page > 1
      };
    } catch {
      throw new Error('Erro ao buscar transações.');
    }
  },

  createTransaction: async (transactionData) => {
    await simulateDelay(500);
    
    try {
      if (!transactionData.description?.trim()) {
        throw new Error("Descrição é obrigatória");
      }
      
      if (!transactionData.amount || transactionData.amount <= 0) {
        throw new Error("Valor deve ser maior que zero");
      }
      
      if (!transactionData.categoryId) {
        throw new Error("Categoria é obrigatória");
      }

      const category = categories.find(cat => cat.id === parseInt(transactionData.categoryId));
      if (!category) {
        throw new Error("Categoria não encontrada");
      }

      const newTransaction = {
        id: generateId(),
        description: transactionData.description.trim(),
        amount: parseFloat(transactionData.amount),
        type: transactionData.type || "expense",
        categoryId: parseInt(transactionData.categoryId),
        categoryName: category.name,
        date: transactionData.date || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      };
      
      transactions.push(newTransaction);
      return newTransaction;
    } catch (error) {
      if (error.message.includes("Descrição") || 
          error.message.includes("Valor") || 
          error.message.includes("Categoria")) {
        throw error;
      }
      throw new Error("Erro ao criar transação. Verifique os dados enviados.");
    }
  },

  updateTransaction: async (id, transactionData) => {
    await simulateDelay(400);
    
    try {
      const transactionIndex = transactions.findIndex(t => t.id === parseInt(id));
      
      if (transactionIndex === -1) {
        throw new Error("Transação não encontrada");
      }

      if (!transactionData.description?.trim()) {
        throw new Error("Descrição é obrigatória");
      }
      
      if (!transactionData.amount || transactionData.amount <= 0) {
        throw new Error("Valor deve ser maior que zero");
      }
      
      if (!transactionData.categoryId) {
        throw new Error("Categoria é obrigatória");
      }

      const category = categories.find(cat => cat.id === parseInt(transactionData.categoryId));
      if (!category) {
        throw new Error("Categoria não encontrada");
      }

      const updatedTransaction = {
        ...transactions[transactionIndex],
        description: transactionData.description.trim(),
        amount: parseFloat(transactionData.amount),
        type: transactionData.type || transactions[transactionIndex].type,
        categoryId: parseInt(transactionData.categoryId),
        categoryName: category.name,
        date: transactionData.date || transactions[transactionIndex].date,
        updatedAt: new Date().toISOString()
      };
      
      transactions[transactionIndex] = updatedTransaction;
      return updatedTransaction;
    } catch (error) {
      if (error.message.includes("Descrição") || 
          error.message.includes("Valor") || 
          error.message.includes("Categoria") ||
          error.message.includes("não encontrada")) {
        throw error;
      }
      throw new Error("Erro ao atualizar transação.");
    }
  },

  deleteTransaction: async (id) => {
    await simulateDelay(300);
    
    try {
      const transactionIndex = transactions.findIndex(t => t.id === parseInt(id));
      
      if (transactionIndex === -1) {
        throw new Error("Transação não encontrada");
      }
      
      transactions.splice(transactionIndex, 1);
      return { message: "Transação deletada com sucesso" };
    } catch (error) {
      if (error.message.includes("não encontrada")) {
        throw error;
      }
      throw new Error("Erro ao deletar transação");
    }
  },

  getTransactionById: async (id) => {
    await simulateDelay(200);
    
    try {
      const transaction = transactions.find(t => t.id === parseInt(id));
      
      if (!transaction) {
        throw new Error("Transação não encontrada");
      }
      
      return JSON.parse(JSON.stringify(transaction));
    } catch (error) {
      if (error.message.includes("não encontrada")) {
        throw error;
      }
      throw new Error("Erro ao buscar transação");
    }
  }
};