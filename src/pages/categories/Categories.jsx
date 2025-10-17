import { useState, useEffect } from "react";
import "./Categories.css";
import AddButton from "../../components/common/AddButton";
import CategoryList from "../../components/CategoryList/CategoryList";
import BudgetSummary from "../../components/budget/BudgetSummary";
import { categoryService } from "../../services";
import CategoryModal from "../../components/categories/CategoryModal";
import ErrorModal from "../../components/common/ErrorModal";
import { DEFAULT_CATEGORY_COLOR } from "../../utils/colors";
import { parseCurrency } from "../../utils/money";

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
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    budgetAmount: 0,
    icon: "happyFace",
    color: DEFAULT_CATEGORY_COLOR,
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
        budgetAmount: typeof categoryToEdit.budgetAmount === 'string' ? parseCurrency(categoryToEdit.budgetAmount) : categoryToEdit.budgetAmount || 0,
        icon: categoryToEdit.icon,
        color: categoryToEdit.color
      });
      setIsModalOpen(true);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await categoryService.deleteCategory(categoryId);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryId)
      );
      fetchCategories();
    } catch (error) {
      const errorMsg = error.message || "Erro ao deletar categoria. Tente novamente.";
      setErrorMessage({ title: "Erro ao Deletar Categoria", message: errorMsg });
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
      budgetAmount: 0,
      icon: "happyface",
      color: DEFAULT_CATEGORY_COLOR,
      isActive: true,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "name" && value.length > 15) return;
    if (name === "description" && value.length > 30) return;

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

      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, newCategory);
      } else {
        await categoryService.createCategory(newCategory);
      }

      handleCloseModal();
      fetchCategories();
    } catch (error) {
      const errorMsg = error.message || (editingCategory ? "Erro ao atualizar categoria. Tente novamente." : "Erro ao criar categoria. Tente novamente.");
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
    </main>
  );
}