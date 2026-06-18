import React, { useState } from "react";
import { parseMoneyInputToCents } from "../../utils/money";
import "./FormSection.css";

function FormSection({ onAddCategory }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "teste",
    icon: "teste",
    budgetAmountInput: "",
    color: "#4CAF50",
    isActive: true,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    const field = id === "budgetAmount" ? "budgetAmountInput" : id;
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      budgetAmount: formData.budgetAmountInput
        ? parseMoneyInputToCents(formData.budgetAmountInput)
        : 0,
    };

    onAddCategory(payload);
    setFormData({
      name: "",
      description: "",
      icon: "",
      budgetAmountInput: "",
      color: "#4CAF50",
      isActive: true,
    }); 
  };

  return (
    <div className="form-section">
      <h3>Adicionar Nova Categoria</h3>
      <form className="crud-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nome da Categoria</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Alimentação"
          />
        </div>

        <div className="form-group">
          <label htmlFor="budgetAmount">Orçamento</label>
          <input
            type="text"
            id="budgetAmount"
            value={formData.budgetAmountInput}
            onChange={handleChange}
            placeholder="Ex: 100,00"
          />
        </div>

        <div className="form-group">
          <label htmlFor="color">Cor</label>
          <select id="color" value={formData.color} onChange={handleChange}>
            <option value="#4CAF50">Verde</option>
            <option value="#E53935">Vermelho</option>
            <option value="#1E88E5">Azul</option>
            <option value="#FFC107">Amarelo</option>
            <option value="#9C27B0">Roxo</option>
          </select>
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

export default FormSection;
