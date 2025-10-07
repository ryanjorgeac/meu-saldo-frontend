import { useState, useEffect } from "react";
import "./Categories.css";
import AddButton from "../../components/common/AddButton";
import CategoryList from "../../components/CategoryList/CategoryList";
import BudgetSummary from "../../components/budget/BudgetSummary";
import { categoryService } from "../../services/categoryService";
import Modal from "../../components/common/Modal";
import CategoryModal from "../../components/categories/CategoryModal";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [budgetData, setBudgetData] = useState({
    totalBudget: 0,
    totalSpent: 0,
    remaining: 0
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    type: "fixed", // Default value, can be "fixed" or "percentage"
    value: "",
    icon: "wallet", // Default icon
    color: "#6200EE" // Default color We will update using gradient colors from backend
  });

  async function fetchCategories(){
    try {
      setLoading(true);
      const response = await categoryService.getCategories();
      setCategories(response);

      const totalBudget = response.reduce((sum, cat) => sum + (cat.budgetAmount || 0), 0);
      const totalSpent = response.reduce((sum, cat) => sum + (cat.spent || 0), 0);
      const remaining = totalBudget - totalSpent;
      
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
      type: "expense",
      placeholder: "",
      icon: "wallet",
      color: "#6200EE"
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