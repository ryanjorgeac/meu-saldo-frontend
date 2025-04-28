import React, { useState, useEffect } from "react";
import "./GerenciarCategorias.css";
import FormSection from "../../Components/FormSection/FormSection";
import CategoryList from "../../Components/CategoryList/CategoryList";
import { categoryService } from "../../services/categoryService";

export default function GerenciarCategorias() {
  const [categories, setCategories] = useState([]);

  // Função para buscar categorias do backend
  async function fetchCategories(){
    try {
      const response = await categoryService.getCategories();
      setCategories(response);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  // Função para adicionar uma nova categoria
  const handleAddCategory = async (newCategory) => {
    try {
      const newCategoryData = await categoryService.createCategory(newCategory);
      setCategories((prevCategories) => [...prevCategories, newCategoryData]);
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
    }
  };

  // Função para deletar uma categoria
  const handleDeleteCategory = async (categoryId) => {
    try {
      await categoryService.deleteCategory(categoryId); // Chama o backend para deletar
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryId)
      ); // Remove a categoria do estado local
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
    }
  };

  // Busca as categorias ao carregar o componente
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