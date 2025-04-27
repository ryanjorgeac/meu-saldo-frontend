import React from "react";
import CategorieCard from "../categoryCard/CategoryCard";
import "./Category.css";

const Categoria = () => {
  return (
    <div className="category-container">
      <div className="page-header">
        <h2>Categorias</h2>
        <a href="#" className="view-all">
          Ver todas &rsaquo;
        </a>
      </div>
    </div>
  );
};

export default Categoria;
