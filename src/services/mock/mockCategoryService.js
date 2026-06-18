import { formatCurrencyFromCents } from '../../utils/money';
import { mockCategories, simulateDelay, generateId, mockSummary } from './mockData';

let categories = [...mockCategories];

export const mockCategoryService = {
  getCategories: async () => {
    await simulateDelay(300); // Simulate network delay
    return JSON.parse(JSON.stringify(categories));
  },
  getSummary: async () => {
    return mockSummary;
  },
  createCategory: async (categoryData) => {
    await simulateDelay(500);
    
    try {
      if (!categoryData.name?.trim()) {
        throw new Error("Nome da categoria é obrigatório");
      }
      const nameExists = categories.some(
        cat => cat.name.toLowerCase() === categoryData.name.toLowerCase()
      );
      if (nameExists) {
        throw new Error("Já existe uma categoria com este nome");
      }

      const newCategory = {
        id: generateId(),
        name: categoryData.name.trim(),
        description: categoryData.description?.trim() || "",
        icon: categoryData.icon ?? null,
        color: categoryData.color ?? null,
        budgetAmount: formatCurrencyFromCents(categoryData.budgetAmount || 0),
        userId: "6fedcba",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        spentAmount: "0,00",
        incomeAmount: "0,00",
        remainingAmount: "0,00",
        transactionCount: 0
      };

      categories.push(newCategory);
      return newCategory;
    } catch (error) {
      if (error.message.includes("Nome da categoria") || error.message.includes("Já existe")) {
        throw error;
      }
      throw new Error("Erro ao criar categoria. Verifique os dados enviados.");
    }
  },
  updateCategory: async (categoryId, categoryData) => {
    await simulateDelay(400);
    
    try {
      const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
      
      if (categoryIndex === -1) {
        throw new Error("Categoria não encontrada");
      }

      if (!categoryData.name?.trim()) {
        throw new Error("Nome da categoria é obrigatório");
      }

      const nameExists = categories.some(
        cat => cat.id !== categoryId && cat.name.toLowerCase() === categoryData.name.toLowerCase()
      );
      
      if (nameExists) {
        throw new Error("Já existe uma categoria com este nome");
      }

      const updatedCategory = {
        ...categories[categoryIndex],
        name: categoryData.name.trim(),
        description: categoryData.description?.trim() || "",
        type: categoryData.type || categories[categoryIndex].type,
        icon: categoryData.icon ?? categories[categoryIndex].icon,
        color: categoryData.color ?? categories[categoryIndex].color,
        budgetAmount: categoryData.budgetAmount !== undefined
          ? formatCurrencyFromCents(categoryData.budgetAmount)
          : categories[categoryIndex].budgetAmount,
        placeholder: categoryData.placeholder || categories[categoryIndex].placeholder,
        updatedAt: new Date().toISOString()
      };

      categories[categoryIndex] = updatedCategory;
      return updatedCategory;
    } catch (error) {
      if (error.message.includes("Nome da categoria") || 
          error.message.includes("Já existe") || 
          error.message.includes("não encontrada")) {
        throw error;
      }
      throw new Error("Erro ao atualizar categoria.");
    }
  },

  deleteCategory: async (categoryId) => {
    await simulateDelay(300);
    
    try {
      const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
      
      if (categoryIndex === -1) {
        throw new Error("Categoria não encontrada");
      }

      categories.splice(categoryIndex, 1);
      return { message: "Categoria deletada com sucesso" };
    } catch (error) {
      if (error.message.includes("não encontrada")) {
        throw error;
      }
      throw new Error("Erro ao deletar categoria");
    }
  },

  getCategoryById: async (categoryId) => {
    await simulateDelay(200);
    
    try {
      const category = categories.find(cat => cat.id === categoryId);
      
      if (!category) {
        throw new Error("Categoria não encontrada");
      }
      
      return JSON.parse(JSON.stringify(category));
    } catch (error) {
      if (error.message.includes("não encontrada")) {
        throw error;
      }
      throw new Error("Erro ao buscar categoria");
    }
  }
};