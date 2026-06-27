import { useState, useEffect } from 'react';
import FormModal from '../modals/FormModal';
import AmountInput from './AmountInput';
import DateInput from './DateInput';
import './TransactionFormModal.css';

const today = () => new Date().toISOString();

const EMPTY_FORM = {
  description: '',
  type: 'EXPENSE',
  amountInput: '',
  amountDisplay: '',
  date: today(),
  category: '',
};

function TransactionFormModal({ onClose, onSave, onDelete, transaction = null, categories }) {
  const isEditing = Boolean(transaction);

  const [form, setForm] = useState(EMPTY_FORM);

  // Reset form whenever the modal is opened for a different transaction (or new)
  useEffect(() => {
    setForm(
      transaction
        ? {
            description: transaction.description || '',
            type: transaction.type || 'EXPENSE',
            amountInput: '',
            amountDisplay: transaction.amount || '',
            date: transaction.rawDate || transaction.date || today(),
            category: transaction.category || '',
          }
        : { ...EMPTY_FORM, date: today() }
    );
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave({ ...form, id: transaction?.id });
  };

  return (
    <FormModal onClose={onClose}>
      <div className="transaction-modal">
        <div className="transaction-modal-header">
          <h2>{isEditing ? 'Editar Transação' : 'Nova Transação'}</h2>
          <p>{isEditing ? 'Altere os dados da transação' : 'Preencha os dados para registrar uma nova transação'}</p>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="transaction-form-group">
            <label htmlFor="description">Descrição</label>
            <input
              type="text"
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              maxLength={60}
              placeholder="Ex: Almoço no restaurante"
              required
            />
          </div>

          <div className="transaction-form-group">
            <label>Tipo</label>
            <div className="type-toggle">
              <button
                type="button"
                className={`type-option ${form.type === 'EXPENSE' ? 'type-option--expense' : ''}`}
                onClick={() => setForm((prev) => ({ ...prev, type: 'EXPENSE' }))}
              >
                Despesa
              </button>
              <button
                type="button"
                className={`type-option ${form.type === 'INCOME' ? 'type-option--income' : ''}`}
                onClick={() => setForm((prev) => ({ ...prev, type: 'INCOME' }))}
              >
                Receita
              </button>
            </div>
          </div>

          <div className="transaction-form-group">
            <label>Valor (R$)</label>
            <AmountInput
              name="amountInput"
              value={form.amountInput}
              onChange={handleChange}
              placeholder={form.amountDisplay || '0,00'}
            />
          </div>

          <div className="transaction-form-group">
            <label>Data</label>
            <DateInput
              name="date"
              value={form.date}
              onChange={handleChange}
              placeholder="Selecionar data"
              maxDate={today()}
            />
          </div>

          <div className="transaction-form-group">
            <label htmlFor="category">Categoria</label>
            <select id="category" name="category" value={form.category} onChange={handleChange}>
              <option value="">Sem categoria</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="transaction-modal-actions">
            {isEditing && (
              <button type="button" className="btn btn-danger" onClick={() => onDelete(transaction.id)}>
                Excluir
              </button>
            )}
            <div className="transaction-modal-actions-right">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                {isEditing ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </FormModal>
  );
}

export default TransactionFormModal;