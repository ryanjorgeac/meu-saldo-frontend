import { useState, useEffect } from 'react';
import FormModal from '../modals/FormModal';
import DateInput from '../transactions/DateInput';
import { formatMoneyInput } from '../../utils/money';
import './CommitmentFormModal.css';

const today = () => new Date().toISOString();

export const FREQUENCY_LABELS = {
  ONCE: 'Único',
  DAILY: 'Diário',
  WEEKLY: 'Semanal',
  MONTHLY: 'Mensal',
  YEARLY: 'Anual',
};

const EMPTY_FORM = {
  description: '',
  type: 'EXPENSE',
  amountInput: '',
  amountDisplay: '',
  frequency: 'MONTHLY',
  date: today(),
  category: '',
};

function CommitmentFormModal({ onClose, onSave, commitment = null, categories }) {
  const isEditing = Boolean(commitment);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    setForm(
      commitment
        ? {
            description: commitment.description || '',
            type: commitment.type || 'EXPENSE',
            amountInput: '',
            amountDisplay: commitment.amount || '',
            frequency: commitment.frequency || 'MONTHLY',
            date: commitment.date || today(),
            category: commitment.categoryId || '',
          }
        : { ...EMPTY_FORM, date: today(), category: categories[0]?.value ?? '' }
    );
  }, [commitment, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (e) => {
    const formatted = formatMoneyInput(e.target.value);
    setForm((prev) => ({ ...prev, amountInput: formatted }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave({ ...form, id: commitment?.id });
  };

  return (
    <FormModal onClose={onClose}>
      <div className="commitment-modal">
        <div className="commitment-modal-header">
          <h2>{isEditing ? 'Editar Compromisso' : 'Novo Compromisso Fixo'}</h2>
          <p>{isEditing ? 'Altere os dados do compromisso' : 'Preencha os dados para registrar um novo compromisso fixo'}</p>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="commitment-form-group">
            <label htmlFor="description">Descrição</label>
            <input
              type="text"
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              maxLength={60}
              placeholder="Ex: Aluguel, Netflix..."
              required
            />
          </div>

          <div className="commitment-form-group">
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

          <div className="commitment-form-group">
            <label>Valor (R$)</label>
            <input
              type="text"
              name="amountInput"
              value={form.amountInput}
              onChange={handleAmountChange}
              placeholder={form.amountDisplay || '0,00'}
            />
          </div>

          <div className="commitment-form-group">
            <label htmlFor="frequency">Frequência</label>
            <select id="frequency" name="frequency" value={form.frequency} onChange={handleChange}>
              {Object.entries(FREQUENCY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="commitment-form-group">
            <label>Data de Referência</label>
            <DateInput
              name="date"
              value={form.date}
              onChange={handleChange}
              placeholder="Selecionar data"
            />
          </div>

          <div className="commitment-form-group">
            <label htmlFor="category">Categoria</label>
            <select id="category" name="category" value={form.category} onChange={handleChange}>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="commitment-modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </FormModal>
  );
}

export default CommitmentFormModal;
