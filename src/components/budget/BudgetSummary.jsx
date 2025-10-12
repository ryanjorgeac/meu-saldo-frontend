import BudgetCard from './BudgetCard';
import './BudgetSummary.css';

const BudgetSummary = ({ 
  totalBudget = "0,00", 
  totalSpent = "0,00", 
  remaining = "0,00" 
}) => {
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
        amount={remaining}
        variant="remaining"
        subtitle="Disponível"
      />
    </div>
  );
};

export default BudgetSummary;