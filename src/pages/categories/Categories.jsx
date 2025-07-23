import { useState, useEffect } from "react";
import "./Categories.css";
import AddButton from "../../components/common/AddButton";
import CategoryList from "../../components/CategoryList/CategoryList";
import BudgetSummary from "../../components/budget/BudgetSummary";
import { categoryService } from "../../services/categoryService";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [budgetData, setBudgetData] = useState({
    totalBudget: 0,
    totalSpent: 0,
    remaining: 0
  });

  async function fetchCategories(){
    try {
      setLoading(true);
      const response = await categoryService.getCategories();
      setCategories(response);

      // Calculate budget totals from the categories including spent amounts
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
      // Recalculate budget after deletion
      fetchCategories();
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
    }
  };

  const handleAddCategory = () => {
    console.log('Adicionar nova categoria');
    // TODO: Implement add functionality
    // This could open a modal or navigate to a create page
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
    </main>
  );
}