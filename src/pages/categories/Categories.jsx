import { useState, useEffect } from "react";
import "./Categories.css";
import AddButton from "../../components/common/AddButton";
import CategoryList from "../../components/CategoryList/CategoryList";
import BudgetSummary from "../../components/budget/BudgetSummary";
import { categoryService } from "../../services";
import CategoryModal from "../../components/categories/CategoryModal";
import ErrorModal from "../../components/modals/ErrorModal";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { parseMoneyInputToCents } from "../../utils/money";

export default function Categories() {
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
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    budgetAmountInput: "",
    budgetAmountDisplay: "",
    icon: null,
    color: null,
    isActive: true,
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
      setEditingCategory(categoryToEdit);
      setNewCategory({
        name: categoryToEdit.name,
        description: categoryToEdit.description || "",
        budgetAmountInput: "",
        budgetAmountDisplay: categoryToEdit.budgetAmount || "",
        icon: categoryToEdit.icon,
        color: categoryToEdit.color,
        isActive: categoryToEdit.isActive ?? true,
      });
      setIsModalOpen(true);
    }
  };

  const handleDeleteCategory = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
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
    } catch (error) {
      const errorMsg = error.message || "Erro ao deletar categoria. Tente novamente.";
      setErrorMessage({ title: "Erro ao Deletar Categoria", message: errorMsg });
      setCategoryToDelete(null);
    }
  };

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
    } catch (error) {
      const errorMsg = error.message === "Invalid money input"
        ? "Informe um orcamento valido com ate duas casas decimais."
        : error.message || (editingCategory ? "Erro ao atualizar categoria. Tente novamente." : "Erro ao criar categoria. Tente novamente.");
      const titleMsg = editingCategory ? "Erro ao Atualizar Categoria" : "Erro ao Criar Categoria";
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