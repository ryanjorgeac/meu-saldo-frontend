import React from "react";
import "./CategoriaCard.css";

const CategorieCard = ({ title, amount, color }) => {
  return (
    <div className="category-card" style={{ backgroundColor: color }}>
      <div className="category-title">{title}</div>
      <div className="category-currency">R$</div>
      <div className="category-amount">{amount}</div>
      <div className="category-stats"></div>
    </div>
  );
};

export default CategorieCard;
