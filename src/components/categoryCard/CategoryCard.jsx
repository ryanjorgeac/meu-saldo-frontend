import React from "react";
import "./CategoryCard.css";

function CategoryCard( categoryData ) {
  return (
    <div className="category-card" style={{ borderColor: categoryData.color }}>
      <h4>{categoryData.name}</h4>
      <p> {categoryData.budgetAmount}</p>
    </div>
  );
}

export default CategoryCard;
