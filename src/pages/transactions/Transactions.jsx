import React, { useState, useCallback, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import "./Transactions.css";
import CategorySelect from "../../components/transactions/CategorySelect";
import DateInput from "../../components/transactions/DateInput";
import SearchInput from "../../components/transactions/SearchInput";
import AmountInput from "../../components/transactions/AmountInput";
import TransactionsTable from "../../components/transactions/TransactionsTable";
import TransactionFormModal from "../../components/transactions/TransactionFormModal";
import { transactionService } from "../../services/transactionService";
import { categoryService } from "../../services/categoryService";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

function Transactions() {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectCategories] = useState([])
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    startDate: "",
    endDate: "",
    minValue: "",
    maxValue: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryService.getCategories();
      const formattedCategories = response.map(category => ({
        value: category.id,
        label: category.name
      }));
      setCategories(formattedCategories);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  const transformTransaction = (transaction) => {
    const category = categories.find(cat => cat.value === transaction.categoryId);
    return {
      id: transaction.id,
      description: transaction.description,
      value: transaction.amount,
      category: transaction.categoryId,
      categoryName: category ? category.label : 'Não categorizado',
      date: formatDate(transaction.date),
      type: transaction.type
    };
  };

  const formatDateForBackend = (dateString) => {
    try {
      let date;
      
      if (dateString.includes('/')) {
        const parts = dateString.split('/');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        date = new Date(year, month, day);
      } else {
        date = new Date(dateString);
      }
      
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }

      date.setUTCHours(12, 0, 0, 0);
      
      const isoString = date.toISOString();
      return isoString;
    } catch (e) {
      console.error("Error formatting date for backend:", e);
      return new Date().toISOString();
    }
  };

  const transformTransactionForBackend = (transaction) => {
    return {
      description: transaction.description,
      amount: `${Math.abs(transaction.value)}`,
      type: transaction.type,
      categoryId: transaction.category,
      date: formatDateForBackend(transaction.date)
    };
  };

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const filterParams = {
        page: currentPage,
        search: filters.search || undefined,
        categoryId: selectedCategories.length ? selectedCategories.map(c => c.value).join(',') : undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        minAmount: filters.minValue || undefined,
        maxAmount: filters.maxValue || undefined
      };
      
      const response = await transactionService.getTransactions(currentPage, 10, filterParams);
      
      const transformedTransactions = response.data.map(transaction => transformTransaction(transaction));
      setTransactions(transformedTransactions);
      
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
        hasNextPage: response.hasNextPage,
        hasPreviousPage: response.hasPreviousPage
      });
    } catch (err) {
      setError(err.message);
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, selectedCategories, categories]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleEditTransaction = (transaction) => {
    setCurrentTransaction(transaction);
    setIsModalOpen(true);
  };
  
  const handleNewTransaction = () => {
    setCurrentTransaction(null);
    setIsModalOpen(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleSaveTransaction = async (formData) => {
    try {
      const backendData = transformTransactionForBackend(formData);
      
      if (formData.id) {
        await transactionService.updateTransaction(formData.id, backendData);
      } else {
        await transactionService.createTransaction(backendData);
      }
      
      fetchTransactions();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving transaction:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
      try {
        await transactionService.deleteTransaction(id);
        fetchTransactions();
      } catch (err) {
        console.error("Error deleting transaction:", err);
        alert(`Error: ${err.message}`);
      }
    }
  };

  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <h1>Histórico de Transações</h1>
        <button className="new-transaction-btn" onClick={handleNewTransaction}>
          <FaPlus style={{ width: "12px" }} /> Nova Transação
        </button>
      </div>

      <div className="transactions-filters">
        <div className="transaction-filter-item">
          <SearchInput
            value={filters.search}
            onChange={handleFilterChange}
            name="search"
          />
        </div>

        <div className="transaction-filter-item">
          <CategorySelect
            selectedCategories={selectedCategories}
            onChange={setSelectCategories}
            options={categories}
          />
        </div>

        <div className="transaction-filter-item">
          <DateInput
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            placeholder="Data início"
          />
        </div>

        <div className="transaction-filter-item">
          <DateInput
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            placeholder="Data fim"
          />
        </div>

        <div className="transaction-filter-item">
          <AmountInput
            name="minValue"
            value={filters.minValue}
            onChange={handleFilterChange}
            placeholder="Valor mínimo $"
          />
        </div>

        <div className="transaction-filter-item">
        <AmountInput
            name="maxValue"
            value={filters.maxValue}
            onChange={handleFilterChange}
            placeholder="Valor máximo $"
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="transactions-table-container">
        {loading ? (
          <div className="loading">Carregando transações...</div>
        ) : (
          <TransactionsTable 
            transactions={transactions} 
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}
      </div>

      <div className="pagination">
        <button
          className="pagination-button"
          disabled={!pagination.hasPreviousPage}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Anterior
        </button>
        <span className="page-info">
          Página {pagination.page} de {pagination.totalPages || 1}
        </span>
        <button
          className="pagination-button"
          disabled={!pagination.hasNextPage}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Próxima
        </button>
      </div>

      <TransactionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        transaction={currentTransaction}
        title={currentTransaction ? "Editar Transação" : "Nova Transação"}
        categories={categories}
      />
    </div>
  );
}

export default Transactions;
