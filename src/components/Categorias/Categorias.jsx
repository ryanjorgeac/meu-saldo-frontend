import React from "react";
import CategorieCard from "../CategoriasCard/CategoriaCard";
import "./Categoria.css";

const Categoria = () => {
  const categorias = [
    {
      title: "Despesas",
      amount: "2.300,27",
      color: "#4CAF50",
    },
    {
      title: "Lazer",
      amount: "1.500,00",
      color: "#E53935",
    },
    {
      title: "Investimentos",
      amount: "3.200,89",
      color: "#1E88E5",
    },
    {
      title: "Compras",
      amount: "950,10",
      color: "#FF9800",
    },
  ];

  return (
    <main>
      <div className="page-header">
        <h2>Categorias</h2>
        <a href="#" className="view-all">
          Ver todas &rsaquo;
        </a>
      </div>
      <section className="categories">
        {categorias.map((cat, idx) => (
          <CategorieCard key={idx} {...cat} />
        ))}
      </section>
    </main>
  );
};

export default Categoria;
