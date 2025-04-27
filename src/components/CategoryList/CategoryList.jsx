import React from "react";
import "./CategoryList.css";

function CategoryList({ categories, onDelete }) {
  return (
    <div className="list-section">
      <h3>Categorias Existentes</h3>
      <div className="categories-list">
        {categories.map((category, index) => (
          <div className="category-item" key={index}>
            <div
              className="category-color-indicator"
              style={{ backgroundColor: category.color }}
            ></div>
            <div className="category-details">
              <div className="category-name">{category.name}</div>
              <div className="category-budget">{category.budgetAmount}</div>
            </div>
            <div className="category-actions">
              <button
                className="btn delete-btn"
                onClick={() => onDelete(category.id)}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryList;
