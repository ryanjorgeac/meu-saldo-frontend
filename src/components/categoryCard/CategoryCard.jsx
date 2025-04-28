import React from "react";
import "./CategoryCard.css";

function CategoryCard({ color, name, budgetAmount }) {
  console.log("Cor recebida:", color);
  return (
    <div className="category-card" style={{ background: color }}>
      <div className="category-name">{name}</div>
      <div className="category-budget">
        Orçamento: {budgetAmount}
      </div>
    </div>
  );
}

export default CategoryCard;