import { useState, useEffect, useCallback } from "react";
import "./Categories.css";
import AddButton from "../../components/common/AddButton";
import CategoryList from "../../components/CategoryList/CategoryList";
import BudgetSummary from "../../components/budget/BudgetSummary";
import { categoryService, transactionService } from "../../services";
import CategoryModal from "../../components/categories/CategoryModal";
import ErrorModal from "../../components/modals/ErrorModal";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import Toast from "../../components/common/Toast";
import { parseMoneyInputToCents } from "../../utils/money";
import { useTransactionsCache } from "../../context/TransactionsContext";

export default function Categories() {
  const { setTransactionsCache } = useTransactionsCache();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [budgetData, setBudgetData] = useState({
    totalBudget: "0,00",
    totalSpent: "0,00",
    remaining: "0,00"
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [refillingCategoryId, setRefillingCategoryId] = useState(null);
  const [toast, setToast] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    budgetAmountInput: "",
    budgetAmountDisplay: "",
    icon: null,
    color: null,
    isActive: true,
    isDefault: false,
  });

  async function fetchCategories(){
    try {
      setLoading(true);
      const categoryResponse = await categoryService.getCategories();
      const summaryResponse = await categoryService.getSummary();
      setCategories(categoryResponse);

      const totalBudget = summaryResponse.totalBudget;
      const totalSpent = summaryResponse.totalSpent;
      const remaining = summaryResponse.remainingBudget;
      
      setBudgetData({ totalBudget, totalSpent, remaining });
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (categoryId) => {
    const categoryToEdit = categories.find(cat => cat.id === categoryId);
    if (categoryToEdit) {
      if (categoryToEdit.isDefault) {
        setErrorMessage({ 
          title: "Categoria Padrão", 
          message: "Categorias padrão não podem ser editadas. Estas categorias são essenciais para o funcionamento do sistema." 
        });
        return;
      }

      setEditingCategory(categoryToEdit);
      setNewCategory({
        name: categoryToEdit.name,
        description: categoryToEdit.description || "",
        budgetAmountInput: "",
        budgetAmountDisplay: categoryToEdit.budgetAmount || "",
        icon: categoryToEdit.icon,
        color: categoryToEdit.color,
        isActive: categoryToEdit.isActive ?? true,
        isDefault: categoryToEdit.isDefault ?? false,
      });
      setIsModalOpen(true);
    }
  };

  const handleDeleteCategory = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    
    if (category?.isDefault) {
      setErrorMessage({ 
        title: "Categoria Padrão", 
        message: "Categorias padrão não podem ser deletadas. Estas categorias são essenciais para o funcionamento do sistema." 
      });
      return;
    }
    
    setCategoryToDelete(category);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    try {
      await categoryService.deleteCategory(categoryToDelete.id);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryToDelete.id)
      );
      setCategoryToDelete(null);
      fetchCategories();
      setToast({ message: `Categoria "${categoryToDelete.name}" excluída com sucesso!`, type: 'success' });
    } catch (error) {
      let errorMsg = error.message || "Erro ao deletar categoria. Tente novamente.";
      let titleMsg = "Erro ao Deletar Categoria";
      
      if (error.message && error.message.toLowerCase().includes("padrão")) {
        titleMsg = "Categoria Padrão";
      }
      
      setErrorMessage({ title: titleMsg, message: errorMsg });
      setCategoryToDelete(null);
    }
  };

  const handleRefillCategory = useCallback(async (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;
    setRefillingCategoryId(categoryId);
    try {
      const today = new Date().toISOString();
      const payload = {
        categoryId: category.id,
        amountCents: parseMoneyInputToCents(category.budgetAmount),
        type: 'INCOME',
        description: `Reabastecimento: ${category.name}`,
        date: today,
      }
      await transactionService.createTransaction(payload);
      setToast({ message: `Categoria "${category.name}" reabastecida com sucesso!`, type: 'success' });
      setTransactionsCache({ items: [], fetchedAt: null });
      fetchCategories();
    } catch (error) {
      setToast({ message: error.message || 'Erro ao reabastecer categoria. Tente novamente.', type: 'error' });
    } finally {
      setRefillingCategoryId(null);
    }
  }, [categories, setTransactionsCache]);

  const handleAddCategory = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setNewCategory({
      name: "",
      description: "",
      budgetAmountInput: "",
      budgetAmountDisplay: "",
      icon: null,
      color: null,
      isActive: true,
      isDefault: false,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "name" && value.length > 20) return;
    if (name === "description" && value.length > 48) return;

    setNewCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateCategory = async () => {
    try {
      if (!newCategory.name.trim()) {
        alert("Nome da categoria é obrigatório");
        return;
      }

      const categoryPayload = {
        name: newCategory.name.trim(),
        description: newCategory.description.trim(),
        icon: newCategory.icon ?? null,
        color: newCategory.color ?? null,
        isActive: newCategory.isActive ?? true,
      };

      if (editingCategory) {
        if (newCategory.budgetAmountInput.trim()) {
          categoryPayload.budgetAmount = parseMoneyInputToCents(newCategory.budgetAmountInput);
        }
        await categoryService.updateCategory(editingCategory.id, categoryPayload);
      } else {
        categoryPayload.budgetAmount = newCategory.budgetAmountInput
          ? parseMoneyInputToCents(newCategory.budgetAmountInput)
          : 0;
        await categoryService.createCategory(categoryPayload);
      }

      handleCloseModal();
      fetchCategories();
      setToast({ message: editingCategory ? 'Categoria atualizada com sucesso!' : 'Categoria criada com sucesso!', type: 'success' });
    } catch (error) {
      let errorMsg;
      let titleMsg;
      
      if (error.message === "Invalid money input") {
        errorMsg = "Informe um orçamento válido com até duas casas decimais.";
        titleMsg = editingCategory ? "Erro ao Atualizar Categoria" : "Erro ao Criar Categoria";
      } else if (error.message && error.message.toLowerCase().includes("padrão")) {
        errorMsg = error.message;
        titleMsg = "Categoria Padrão";
      } else {
        errorMsg = error.message || (editingCategory ? "Erro ao atualizar categoria. Tente novamente." : "Erro ao criar categoria. Tente novamente.");
        titleMsg = editingCategory ? "Erro ao Atualizar Categoria" : "Erro ao Criar Categoria";
      }
      
      setErrorMessage({ title: titleMsg, message: errorMsg });
    }
  };
   
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <main className="categories-page">
      <div className="category-page-header">
        <div className="category-page-header-text">
          <h2>Categorias</h2>
          <p>Gerencie suas categorias de despesas e receitas</p>
        </div>
        <AddButton
          text="Nova Categoria"
          onClick={handleAddCategory}
        />
      </div>

      <BudgetSummary 
        totalBudget={budgetData.totalBudget}
        totalSpent={budgetData.totalSpent}
        remaining={budgetData.remaining}
      />

      <section className="categories-content">
        <CategoryList 
          categories={categories} 
          loading={loading}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          onRefill={handleRefillCategory}
          refillingCategoryId={refillingCategoryId}
        />
      </section>
      {isModalOpen && (
        <CategoryModal
          onClose={handleCloseModal}
          category={newCategory}
          onChange={handleInputChange}
          onSave={handleCreateCategory}
          setCategory={setNewCategory}
          isEditing={!!editingCategory}
        />
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {errorMessage && (
        <ErrorModal
          title={errorMessage.title}
          message={errorMessage.message}
          onClose={() => setErrorMessage(null)}
        />
      )}
      {categoryToDelete && (
        <ConfirmationModal
          title="Deletar Categoria"
          message={`Tem certeza que deseja deletar a categoria "${categoryToDelete.name}"?`}
          description="Esta ação não pode ser desfeita. Todas as transações associadas a esta categoria serão afetadas."
          onClose={() => setCategoryToDelete(null)}
          onConfirm={confirmDeleteCategory}
          confirmText="Deletar"
          cancelText="Cancelar"
          isDangerous={true}
        />
      )}
    </main>
  );
}