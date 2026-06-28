import { FaPlus, FaPencilAlt, FaTrash, FaPlay } from 'react-icons/fa';
import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FREQUENCY_LABELS } from './CommitmentFormModal';
import './CommitmentsSidebar.css';

function CommitmentsSidebar({
  commitments,
  loading,
  categories,
  onAdd,
  onEdit,
  onDelete,
  onLog,
  loggingCommitmentId,
}) {
  const getCategoryLabel = (categoryId) => {
    const cat = categories.find((c) => c.value === categoryId);
    return cat ? cat.label : 'Sem categoria';
  };

  const formatCommitmentDate = (dateString) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return null;
    }
  };

  return (
    <aside className="commitments-sidebar">
      <div className="commitments-sidebar__header">
        <div className="commitments-sidebar__title-row">
          <h2 className="commitments-sidebar__title">Compromissos Fixos</h2>
          <button className="commitments-sidebar__add-btn" onClick={onAdd} title="Novo Compromisso Fixo">
            <FaPlus size={12} /> Novo
          </button>
        </div>
        <p className="commitments-sidebar__subtitle">Despesas e receitas recorrentes</p>
      </div>

      <div className="commitments-sidebar__list">
        {loading && (
          <div className="commitments-sidebar__empty">
            <p>Carregando compromissos...</p>
          </div>
        )}

        {!loading && commitments.length === 0 && (
          <div className="commitments-sidebar__empty">
            <p>Nenhum compromisso fixo cadastrado.</p>
          </div>
        )}

        {!loading && commitments.map((commitment) => {
          const isExpense = commitment.type === 'EXPENSE';
          const isLogging = loggingCommitmentId === commitment.id;

          return (
            <div key={commitment.id} className="commitment-item">
              <div className="commitment-item__left">
                <span className={`commitment-item__icon ${isExpense ? 'commitment-item__icon--expense' : 'commitment-item__icon--income'}`}>
                  {isExpense ? <FaArrowTrendDown size={11} /> : <FaArrowTrendUp size={11} />}
                </span>
              </div>

              <div className="commitment-item__body">
                <span className="commitment-item__description">{commitment.description}</span>
                <div className="commitment-item__meta">
                  <span className={`commitment-item__amount ${isExpense ? 'commitment-item__amount--expense' : 'commitment-item__amount--income'}`}>
                    {isExpense ? '-' : '+'}R${commitment.amount}
                  </span>
                  <span className="commitment-item__frequency">
                    {FREQUENCY_LABELS[commitment.frequency] ?? commitment.frequency}
                  </span>
                  {commitment.date && (
                    <span className="commitment-item__date">
                      {formatCommitmentDate(commitment.date)}
                    </span>
                  )}
                </div>
                <span className="commitment-item__category">{getCategoryLabel(commitment.categoryId)}</span>
              </div>

              <div className="commitment-item__actions">
                <button
                  className={`commitment-item__btn commitment-item__btn--log ${isLogging ? 'commitment-item__btn--loading' : ''}`}
                  onClick={() => onLog(commitment.id)}
                  disabled={isLogging}
                  title={isLogging ? 'Lançando...' : 'Lançar transação agora'}
                  aria-label="Lançar"
                >
                  <FaPlay size={11} />
                </button>
                <button
                  className="commitment-item__btn commitment-item__btn--edit"
                  onClick={() => onEdit(commitment)}
                  title="Editar"
                  aria-label="Editar compromisso"
                >
                  <FaPencilAlt size={11} />
                </button>
                <button
                  className="commitment-item__btn commitment-item__btn--delete"
                  onClick={() => onDelete(commitment)}
                  title="Excluir"
                  aria-label="Excluir compromisso"
                >
                  <FaTrash size={11} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default CommitmentsSidebar;
