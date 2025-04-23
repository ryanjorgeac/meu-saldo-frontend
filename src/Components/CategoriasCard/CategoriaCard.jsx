import React from "react";
import "./CategoriaCard.css";

const CategorieCard = ({ title, amount, color, growth, positive }) => {
  return (
    <div className="category-card" style={{ backgroundColor: color }}>
      <div className="category-title">{title}</div>
      <div className="category-currency">R$</div>
      <div className="category-amount">{amount}</div>
      <div className="category-stats">
        <span className={`growth ${positive ? "positive" : "negative"}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline
              points={positive ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}
            ></polyline>
          </svg>
          {growth}
        </span>
        <span className="comparison">Comparado ao mês passado</span>
      </div>
    </div>
  );
};

export default CategorieCard;
