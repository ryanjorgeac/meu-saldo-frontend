import React from "react";
import CategoryCard from "../categoryCard/CategoryCard";
import "./Category.css";

const Category = ({ categorias = []}) => {

  

  return (
    <div className="category-container">
      <div className="page-header">
        <h2>Categorias</h2>
        <a href="categories" className="view-all">
          Ver todas &rsaquo;
        </a>
      </div>
      <div className="category-cards">
        {categorias.map((category, index) => (
          <CategoryCard key={index} {...category} />
        ))}
      </div>
    </div>
  );
};

export default Category;
