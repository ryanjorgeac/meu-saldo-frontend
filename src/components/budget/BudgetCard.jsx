import './BudgetCard.css';

const BudgetCard = ({ 
  title, 
  amount, 
  variant = 'default',
  subtitle 
}) => {
  return (
    <div className={`budget-card budget-card--${variant}`}>
      <div className="budget-card__header">
        <h3 className="budget-card__title">{title}</h3>
      </div>
      <div className="budget-card__content">
        <span className={`budget-card__amount budget-card__amount--${variant}`}>
          {amount}
        </span>
        {subtitle && (
          <p className="budget-card__subtitle">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default BudgetCard;