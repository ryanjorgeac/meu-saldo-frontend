import React from "react";
import "./ListSection.css";

function ListSection() {
  const categories = [
    { name: "Despesas", budget: "R$ 2.300,27", color: "#4CAF50" },
    { name: "Lazer", budget: "R$ 2.300,27", color: "#E53935" },
    { name: "Investimentos", budget: "R$ 2.300,27", color: "#1E88E5" },
    { name: "Despesas", budget: "R$ 2.300,27", color: "#4CAF50" },
  ];

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
              <div className="category-budget">{category.budget}</div>
            </div>
            <div className="category-actions">
              <button className="btn edit-btn">Editar</button>
              <button className="btn delete-btn">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListSection;
