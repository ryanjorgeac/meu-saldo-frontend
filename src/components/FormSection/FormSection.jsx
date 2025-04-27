import React, { useState } from "react";
import "./FormSection.css";

function FormSection({ onAddCategory }) {
  const [formData, setFormData] = useState({
    name: "",
    budget: "",
    color: "#4CAF50",
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
    onAddCategory(formData); // Envia os dados para o componente pai
    setFormData({ name: "", budget: "", color: "#4CAF50" }); // Limpa o formulário
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
          <label htmlFor="budget">Orçamento</label>
          <input
            type="text"
            id="budget"
            value={formData.budget}
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