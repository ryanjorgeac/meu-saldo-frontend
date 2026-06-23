import React, { useState, useEffect } from 'react';
import './TransactionFormModal.css';
import DateInput from './DateInput';
import AmountInput from './AmountInput';
import { FaTimes } from 'react-icons/fa';

function TransactionFormModal({ 
  isOpen, 
  onClose, 
  onSave,
  onDelete,
  transaction = null, 
  title = "Editar Transação",
  categories
}) {
  const [form, setForm] = useState({
    description: '',
    type: 'EXPENSE',
    amountInput: '',
    amountDisplay: '',
    date: '',
    category: ''
  });

  useEffect(() => {
    if (transaction) {
      setForm({
        description: transaction.description || '',
        type: transaction.type || 'EXPENSE',
        amountInput: '',
        amountDisplay: transaction.amount || '',
        date: transaction.rawDate || transaction.date || '',
        category: transaction.category || ''
      });
    } else {
      setForm({
        description: '',
        type: 'EXPENSE',
        amountInput: '',
        amountDisplay: '',
        date: '',
        category: ''
      });
    }
  }, [transaction, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedTransaction = {
      ...form,
      id: transaction ? transaction.id : undefined,
    };
    
    await onSave(updatedTransaction);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="transaction-modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Descrição</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Descrição da transação"
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Tipo</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="type"
                  value="EXPENSE"
                  checked={form.type === 'EXPENSE'}
                  onChange={handleChange}
                />
                <span>Despesa</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="type"
                  value="INCOME"
                  checked={form.type === 'INCOME'}
                  onChange={handleChange}
                />
                <span>Receita</span>
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label>Valor</label>
            <AmountInput
              name="amountInput"
              value={form.amountInput}
              onChange={handleChange}
              placeholder={form.amountDisplay || "0,00"}
              className="paddingLeft 30px"
            />
          </div>
          
          <div className="form-group">
            <label>Data</label>
            <DateInput
              name="date"
              value={form.date}
              onChange={handleChange}
              placeholder="Selecionar data"
              maxDate={new Date().toISOString()}
            />
          </div>
          
          <div className="form-group">
            <label>Categoria</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="" disabled>Selecione uma categoria</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="modal-actions">
            {transaction && (
              <button type="button" className="delete-button" onClick={() => onDelete(transaction.id)}>
                Excluir
              </button>
            )}
            <div className="modal-actions-right">
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="save-button">
                Salvar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionFormModal;