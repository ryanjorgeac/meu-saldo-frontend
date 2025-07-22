import { useState, useEffect } from "react";
import "./Categories.css";
import AddButton from "../../components/common/AddButton";
import CategoryList from "../../components/CategoryList/CategoryList";
import { categoryService } from "../../services/categoryService";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  async function fetchCategories(){
    try {
      const response = await categoryService.getCategories();
      setCategories(response);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await categoryService.deleteCategory(categoryId);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryId)
      );
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
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
          <p>Adicione, edite ou remova categorias conforme necessário.</p>
        </div>
        <AddButton
          text="Nova Categoria"
          onClick={() => console.log('Adicionar categoria')}
        />
      </div>

      <section className="categories-content">
        <CategoryList categories={categories} onDelete={handleDeleteCategory} />
      </section>
    </main>
  );
}