import React, { useState, useEffect } from "react";
import "./GerenciarCategorias.css";
import FormSection from "../../components/FormSection/FormSection";
import CategoryList from "../../components/CategoryList/CategoryList";
import { categoryService } from "../../services/categoryService";

export default function GerenciarCategorias() {
  const [categories, setCategories] = useState([]);


  async function fetchCategories(){
    try {
      const response = await categoryService.getCategories();
      setCategories(response);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };


  const handleAddCategory = async (newCategory) => {
    try {
      const newCategoryData = await categoryService.createCategory(newCategory);
      setCategories((prevCategories) => [...prevCategories, newCategoryData]);
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
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
      console.error("Erro ao deletar categoria:", error);
    }
  };

  
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <main>
      <div className="page-header">
        <h2>Gerenciar Categorias</h2>
      </div>

      <section className="crud-section">
        <FormSection onAddCategory={handleAddCategory} />
        <CategoryList categories={categories} onDelete={handleDeleteCategory} />
      </section>
    </main>
  );
}