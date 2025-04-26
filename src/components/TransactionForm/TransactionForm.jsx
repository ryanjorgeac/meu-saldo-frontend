import React, { useState } from "react";
import "./TransactionForm.css";

function TransactionForm({ onAddTransaction }) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense",
    category: "1",
    date: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTransaction(formData);
    setFormData({
      description: "",
      amount: "",
      type: "expense",
      category: "1",
      date: "",
    });
  };

  return (
    <div className="form-section">
      <h3>Adicionar Nova Transação</h3>
      <form className="crud-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="description">Descrição</label>
          <input
            type="text"
            id="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ex: Compras no mercado"
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Valor</label>
          <input
            type="text"
            id="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Ex: 150,00"
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">Tipo</label>
          <select id="type" value={formData.type} onChange={handleChange}>
            <option value="expense">Despesa</option>
            <option value="income">Receita</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category">Categoria</label>
          <select
            id="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="1">Despesas</option>
            <option value="2">Lazer</option>
            <option value="3">Investimentos</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Data</label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn primary-btn">
            Adicionar
          </button>
        </div>
      </form>
    </div>
  );
}

export default TransactionForm;
