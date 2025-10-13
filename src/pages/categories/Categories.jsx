import { useState, useEffect } from "react";
import "./Categories.css";
import AddButton from "../../components/common/AddButton";
import CategoryList from "../../components/CategoryList/CategoryList";
import BudgetSummary from "../../components/budget/BudgetSummary";
import { categoryService } from "../../services";
import CategoryModal from "../../components/categories/CategoryModal";
import { DEFAULT_CATEGORY_COLOR } from "../../utils/colors";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [budgetData, setBudgetData] = useState({
    totalBudget: "0,00",
    totalSpent: "0,00",
    remaining: "0,00"
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    budget: 0,
    icon: "happyface", // Default icon
    color: DEFAULT_CATEGORY_COLOR // Default color from utils
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
    console.log('Editar categoria:', categoryId);
    // TODO: Implement edit functionality
    // This could open a modal or navigate to an edit page
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await categoryService.deleteCategory(categoryId);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryId)
      );
      fetchCategories();
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
    }
  };

  const handleAddCategory = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset form data
    setNewCategory({
      name: "",
      description: "",
      budget: 0,
      icon: "happyface",
      color: DEFAULT_CATEGORY_COLOR
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
      // Validate form
      if (!newCategory.name.trim()) {
        alert("Nome da categoria é obrigatório");
        return;
      }
      
      // Call API to create category
      await categoryService.createCategory(newCategory);
      
      // Close modal and refresh categories
      handleCloseModal();
      fetchCategories();
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      alert("Erro ao criar categoria. Tente novamente.");
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
        />
      )}
    </main>
  );
}