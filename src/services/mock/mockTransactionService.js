import { formatCurrencyFromCents } from '../../utils/money';
import { mockTransactions, mockCategories, simulateDelay, generateId } from './mockData';

let transactions = [...mockTransactions];
let categories = [...mockCategories];

export const mockTransactionService = {
  getTransactions: async (page = 1, limit = 10, filters = {}) => {
    await simulateDelay(400);
    
    try {
      let filteredTransactions = [...transactions];

      if (filters.categoryId) {
        const categoryIds = filters.categoryId.split(',');
        filteredTransactions = filteredTransactions.filter(
          t => categoryIds.includes(t.categoryId)
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
        data: paginatedTransactions,
        total: filteredTransactions.length,
        page,
        limit,
        totalPages: Math.ceil(filteredTransactions.length / limit),
        hasNextPage: endIndex < filteredTransactions.length,
        hasPreviousPage: page > 1
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
      
      if (!Number.isInteger(transactionData.amountCents) || transactionData.amountCents <= 0) {
        throw new Error("Valor deve ser maior que zero");
      }
      
      if (!transactionData.categoryId) {
        throw new Error("Categoria é obrigatória");
      }

      const category = categories.find(cat => cat.id === transactionData.categoryId);
      if (!category) {
        throw new Error("Categoria não encontrada");
      }

      const newTransaction = {
        id: generateId(),
        description: transactionData.description.trim(),
        amount: formatCurrencyFromCents(transactionData.amountCents),
        type: transactionData.type || "EXPENSE",
        categoryId: transactionData.categoryId,
        date: transactionData.date || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
      const transactionIndex = transactions.findIndex(t => t.id === id);
      
      if (transactionIndex === -1) {
        throw new Error("Transação não encontrada");
      }

      if (!transactionData.description?.trim()) {
        throw new Error("Descrição é obrigatória");
      }
      
      if (
        transactionData.amountCents !== undefined &&
        (!Number.isInteger(transactionData.amountCents) || transactionData.amountCents <= 0)
      ) {
        throw new Error("Valor deve ser maior que zero");
      }
      
      if (!transactionData.categoryId) {
        throw new Error("Categoria é obrigatória");
      }

      const category = categories.find(cat => cat.id === transactionData.categoryId);
      if (!category) {
        throw new Error("Categoria não encontrada");
      }

      const updatedTransaction = {
        ...transactions[transactionIndex],
        description: transactionData.description.trim(),
        amount: transactionData.amountCents !== undefined
          ? formatCurrencyFromCents(transactionData.amountCents)
          : transactions[transactionIndex].amount,
        type: transactionData.type || transactions[transactionIndex].type,
        categoryId: transactionData.categoryId,
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
      const transactionIndex = transactions.findIndex(t => t.id === id);
      
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
      const transaction = transactions.find(t => t.id === id);
      
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