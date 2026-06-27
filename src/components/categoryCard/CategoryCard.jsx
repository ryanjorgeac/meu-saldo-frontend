import { MdOutlineEdit as EditIcon, FaTrash as TrashIcon  } from '../icons';
import { Icon } from '../icons';
import "./CategoryCard.css";
import { parseCurrency } from '../../utils/money';
import { resolveCategoryStyle } from '../../utils/colors';

const CategoryCard = ({ 
  category, 
  onEdit, 
  onDelete 
}) => {
  const {
    id,
    name,
    description,
    color,
    icon,
    budgetAmount,
    spentAmount,
    remainingAmount,
    transactionCount = 0,
    isActive = true,
    isDefault = false
  } = category;

  const budget = parseCurrency(budgetAmount);
  const spent = parseCurrency(spentAmount);
  const categoryStyle = resolveCategoryStyle({ color, icon });

  const progressPercentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  const getProgressBarClass = () => {
    if (progressPercentage < 65) return 'category-card__progress-bar--safe';
    if (progressPercentage < 90) return 'category-card__progress-bar--warning';
    return 'category-card__progress-bar--danger';
  };

  const normalizedDescription = description || '';
  const rightSizeDescription = normalizedDescription.length > 38
    ? `${normalizedDescription.substring(0, 37)}...`
    : normalizedDescription;

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(id);
  };

  return (
    <div 
      className={`category-card ${!isActive ? 'category-card--inactive' : ''}`}
    >
      <div className="category-card__identification" style={{ '--category-color': categoryStyle.color }}>
        <div className="category-card__header">
          <div className="category-card__icon">
            <Icon fontSize="22" color="rgba(0, 0, 0, 0.6)" icon={categoryStyle.icon} />
          </div>
          <div className="category-card__actions">
            <button 
              className={`category-card__action-btn ${isDefault ? 'category-card__action-btn--disabled' : ''}`}
              onClick={handleEdit}
              title={isDefault ? "Categorias padrão não podem ser editadas" : "Editar categoria"}
              disabled={isDefault}
            >
              <EditIcon fontSize="20" />
            </button>
            {!isDefault && (
              <button 
                className="category-card__action-btn category-card__action-btn--delete"
                onClick={handleDelete}
                title="Excluir categoria"
              >
                <TrashIcon fontSize="20" />
              </button>
            )}
          </div>
        </div>

        <div className="category-card__info">
          <div className="category-card__title">
            {name}
            {isDefault && <span className="category-card__badge">Padrão</span>}
          </div>
          <div className="category-card__symbol">R$</div>
          <div className="category-card__amount">{remainingAmount}</div>
          <div className="category-card__description">{rightSizeDescription}</div>
        </div>
      </div>

      <div className="category-card__budget">
        <div className="category-card__budget-header">
          <span className="category-card__budget-label">Orçamento</span>
          <span className="category-card__budget-amount">R${budgetAmount}</span>
        </div>
        
        <div className="category-card__progress">
          <div 
            className={`category-card__progress-bar ${getProgressBarClass()}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="category-card__budget-footer">
          <span className="category-card__transactions">
            {transactionCount} transações
          </span>
          <span className="category-card__spent">
            R${spentAmount} gasto
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;