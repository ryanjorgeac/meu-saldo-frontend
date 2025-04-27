import React, { useState, useEffect } from "react";
import "./GerenciarCategorias.css";
import FormSection from "../../Components/FormSection/FormSection";
import CategoryList from "../../Components/CategoryList/CategoryList";
import { categoryService } from "../../services/categoryService";

export default function GerenciarCategorias() {
  const [categories, setCategories] = useState([]);

  // Função para buscar categorias do backend
  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories(); // Corrigido para chamar o serviço
      setCategories(response); // Atualiza o estado com as categorias do backend
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  // Função para adicionar uma nova categoria
  const handleAddCategory = async (newCategory) => {
    try {
      const newCategoryData = await categoryService.createCategory(newCategory); // Corrigido para chamar o serviço
      setCategories((prevCategories) => [...prevCategories, newCategoryData]); // Atualiza o estado local com a nova categoria
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
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
        {/* Formulário para criar categorias */}
        <FormSection onAddCategory={handleAddCategory} />

        {/* Lista de categorias */}
        <CategoryList categories={categories} />
      </section>
    </main>
  );
}
