import { getIcon, EditIcon, TrashIcon } from '../../assets/icons';
import "./CategoryCard.css";

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
    budgetAmount = 0,
    spentAmount = 0,
    remainingAmount = 0,
    transactionCount = 0,
    isActive = true
  } = category;

  const spent = spentAmount >= 0 ? spentAmount: spentAmount * -1;
  const progressPercentage = budgetAmount > 0 ? Math.min((spent / budgetAmount) * 100, 100) : 0;

  const rightSizeDescription = description.length > 38 ? `${description.substring(0, 37)}...` : description;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const getCategoryIcon = () => {
    const IconComponent = getIcon(icon, "anchor");
    return <IconComponent />;
  };


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
      <div className="category-card__identification" style={{ '--category-color': color }}>
        <div className="category-card__header">
          <div className="category-card__icon">{getCategoryIcon()}</div>
            <div className="category-card__actions">
              <button 
                className="category-card__action-btn"
                onClick={handleEdit}
                title="Editar categoria"
              >
                <EditIcon />
              </button>
              <button 
                className="category-card__action-btn category-card__action-btn--delete"
                onClick={handleDelete}
                title="Excluir categoria"
              >
                <TrashIcon />
              </button>
          </div>
        </div>

        {/* Category info */}
        <div className="category-card__info">
          <div className="category-card__title">{name}</div>
          <div className="category-card__symbol">R$</div>
          <div className="category-card__amount">{formatCurrency(remainingAmount)}</div>
          <div className="category-card__description">{rightSizeDescription}</div>
        </div>
      </div>
      

      {/* Budget progress */}
      <div className="category-card__budget">
        <div className="category-card__budget-header">
          <span className="category-card__budget-label">Orçamento</span>
          <span className="category-card__budget-amount">R${formatCurrency(budgetAmount)}</span>
        </div>
        
        <div className="category-card__progress">
          <div 
            className="category-card__progress-bar"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="category-card__budget-footer">
          <span className="category-card__transactions">
            {transactionCount} transações
          </span>
          <span className="category-card__spent">
            R${formatCurrency(spent)} gasto
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;