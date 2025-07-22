import BudgetCard from './BudgetCard';
import './BudgetSummary.css';

const BudgetSummary = ({ 
  totalBudget = 0, 
  totalSpent = 0, 
  remaining = 0 
}) => {
  const calculatedRemaining = remaining || (totalBudget - totalSpent);

  return (
    <div className="budget-summary">
      <BudgetCard
        title="Total Orçado"
        amount={totalBudget}
        variant="default"
        subtitle="Alocação Mensal"
      />
      <BudgetCard
        title="Total Gasto"
        amount={totalSpent}
        variant="spent"
        subtitle="Gastos do Período"
      />
      <BudgetCard
        title="Restante"
        amount={calculatedRemaining}
        variant="remaining"
        subtitle="Disponível"
      />
    </div>
  );
};

export default BudgetSummary;