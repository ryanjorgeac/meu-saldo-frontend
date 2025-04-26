import React, { useState } from "react";
import "./GerenciarCategorias.css";
import FormSection from "../../components/FormSection/FormSection";
import CategoryList from "../../components/CategoryList/CategoryList";

export default function CategoriasPage() {
  const [categories, setCategories] = useState([]);

  const handleAddCategory = (newCategory) => {
    setCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  const handleEditCategory = (index) => {
    const categoryToEdit = categories[index];
    console.log("Editar categoria:", categoryToEdit);
    // Aqui você pode implementar a lógica de edição
  };

  const handleDeleteCategory = (index) => {
    setCategories((prevCategories) =>
      prevCategories.filter((_, i) => i !== index)
    );
  };

  return (
    <main>
      <div className="page-header">
        <h2>Gerenciar Categorias</h2>
      </div>

      <section className="crud-section">
        <FormSection onAddCategory={handleAddCategory} />
        <CategoryList
          categories={categories}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />
      </section>
    </main>
  );
}
