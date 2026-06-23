import React, { useState, useCallback, useEffect, useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import { endOfDay, format, isAfter, isBefore, parseISO, startOfDay, subDays } from "date-fns";
import "./Transactions.css";
import CategorySelect from "../../components/transactions/CategorySelect";
import DateInput from "../../components/transactions/DateInput";
import SearchInput from "../../components/transactions/SearchInput";
import AmountInput from "../../components/transactions/AmountInput";
import TransactionsTable from "../../components/transactions/TransactionsTable";
import TransactionFormModal from "../../components/transactions/TransactionFormModal";
import { transactionService, categoryService } from "../../services";
import ptBR from "date-fns/locale/pt-BR";
import { parseMoneyInputToCents } from "../../utils/money";
import { useTransactionsCache } from "../../context/TransactionsContext.jsx";

const PAGE_SIZE = 10;
const CACHE_LIMIT = 100;

function parseAmountToNumber(amount) {
  return Number.parseFloat(String(amount).replace(/\./g, "").replace(",", "."));
}

function toRangeDate(value) {
  return value ? parseISO(value) : null;
}

function buildDefaultRange() {
  const today = new Date();

  return {
    startDate: startOfDay(subDays(today, 6)).toISOString(),
    endDate: endOfDay(today).toISOString(),
  };
}

function Transactions() {
  const { transactionsCache, setTransactionsCache } = useTransactionsCache();
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectCategories] = useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [didHydrateCache, setDidHydrateCache] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  });

  const [currentPage, setCurrentPage] = useState(1);
  const defaultRange = useMemo(() => buildDefaultRange(), []);
  const [filters, setFilters] = useState({
    search: "",
    startDate: defaultRange.startDate,
    endDate: defaultRange.endDate,
    minValue: "",
    maxValue: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

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

  useEffect(() => {
    if (!didHydrateCache && transactionsCache.items.length > 0) {
      setDidHydrateCache(true);
      setFilters((prev) => ({
        ...prev,
        startDate: transactionsCache.rangeStart || prev.startDate,
        endDate: transactionsCache.rangeEnd || prev.endDate,
      }));
    }
  }, [didHydrateCache, transactionsCache]);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const formatDateForBackend = (dateString) => {
    try {
      const date = new Date(dateString);
      
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

  const transformTransactionForBackend = (transaction, { isEditing = false } = {}) => {
    const payload = {
      description: transaction.description.trim(),
      type: transaction.type,
      categoryId: transaction.category,
      date: formatDateForBackend(transaction.date)
    };

    if (!isEditing || transaction.amountInput?.trim()) {
      payload.amountCents = parseMoneyInputToCents(transaction.amountInput);
    }

    return payload;
  };

  const fetchTransactions = useCallback(async ({ force = false } = {}) => {
    if (!categories.length) {
      return;
    }

    if (!force && transactionsCache.items.length > 0) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await transactionService.getTransactions(1, CACHE_LIMIT, {
        startDate: defaultRange.startDate,
        endDate: defaultRange.endDate,
        order: "desc",
      });

      const transformedTransactions = response.data.map((transaction) => {
        const category = categories.find((cat) => cat.value === transaction.categoryId);

        return {
          id: transaction.id,
          description: transaction.description,
          amount: transaction.amount,
          amountValue: parseAmountToNumber(transaction.amount),
          category: transaction.categoryId,
          categoryName: category ? category.label : "Não categorizado",
          date: formatDate(transaction.date),
          rawDate: transaction.date,
          type: transaction.type,
        };
      });

      setTransactionsCache({
        items: transformedTransactions,
        fetchedAt: Date.now(),
        rangeStart: defaultRange.startDate,
        rangeEnd: defaultRange.endDate,
      });
    } catch (err) {
      setError(err.message);
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  }, [categories, defaultRange.endDate, defaultRange.startDate, setTransactionsCache, transactionsCache.items.length]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = useMemo(() => {
    const searchTerm = filters.search.trim().toLowerCase();
    const categoryIds = new Set(selectedCategories.map((category) => category.value));
    const startDate = toRangeDate(filters.startDate);
    const endDate = toRangeDate(filters.endDate);
    const minAmount = filters.minValue ? parseMoneyInputToCents(filters.minValue) / 100 : null;
    const maxAmount = filters.maxValue ? parseMoneyInputToCents(filters.maxValue) / 100 : null;

    return transactionsCache.items.filter((transaction) => {
      const transactionDate = parseISO(transaction.rawDate);

      if (searchTerm && !transaction.description.toLowerCase().includes(searchTerm)) {
        return false;
      }

      if (categoryIds.size > 0 && !categoryIds.has(transaction.category)) {
        return false;
      }

      if (startDate && isBefore(transactionDate, startOfDay(startDate))) {
        return false;
      }

      if (endDate && isAfter(transactionDate, endOfDay(endDate))) {
        return false;
      }

      if (minAmount !== null && transaction.amountValue < minAmount) {
        return false;
      }

      if (maxAmount !== null && transaction.amountValue > maxAmount) {
        return false;
      }

      return true;
    });
  }, [filters.endDate, filters.maxValue, filters.minValue, filters.search, filters.startDate, selectedCategories, transactionsCache.items]);

  useEffect(() => {
    const total = filteredTransactions.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);

    if (safePage !== currentPage) {
      setCurrentPage(safePage);
      return;
    }

    setPagination({
      total,
      page: safePage,
      limit: PAGE_SIZE,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1,
    });
  }, [currentPage, filteredTransactions.length]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      let valA, valB;

      switch (sortField) {
        case "amount":
          valA = a.amountValue;
          valB = b.amountValue;
          break;
        case "date":
          valA = new Date(a.rawDate).getTime();
          valB = new Date(b.rawDate).getTime();
          break;
        default:
          valA = (a[sortField] || "").toLowerCase();
          valB = (b[sortField] || "").toLowerCase();
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredTransactions, sortDirection, sortField]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return sortedTransactions.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, sortedTransactions]);

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
    const isEditing = Boolean(formData.id);

    if (!formData.description?.trim()) {
      alert("Descrição é obrigatória.");
      return;
    }

    if (!isEditing && !formData.amountInput?.trim()) {
      alert("Valor é obrigatório.");
      return;
    }

    if (!formData.category) {
      alert("Categoria é obrigatória.");
      return;
    }

    try {
      const backendData = transformTransactionForBackend(formData, { isEditing });
      
      if (formData.id) {
        await transactionService.updateTransaction(formData.id, backendData);
      } else {
        await transactionService.createTransaction(backendData);
      }

      await fetchTransactions({ force: true });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving transaction:", err);
      const message = err.message === "Invalid money input"
        ? "Informe um valor valido com ate duas casas decimais."
        : err.message;

      alert(`Error: ${message}`);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
      try {
        await transactionService.deleteTransaction(id);
        setIsModalOpen(false);
        await fetchTransactions({ force: true });
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
          <FaPlus style={{ width: "11px" }} /> Nova Transação
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
            maxDate={filters.endDate || defaultRange.endDate}
          />
        </div>

        <div className="transaction-filter-item">
          <DateInput
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            placeholder="Data fim"
            minDate={filters.startDate || defaultRange.startDate}
            maxDate={new Date().toISOString()}
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
            transactions={paginatedTransactions} 
            onEditTransaction={handleEditTransaction}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
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
        onDelete={handleDeleteTransaction}
        transaction={currentTransaction}
        title={currentTransaction ? "Editar Transação" : "Nova Transação"}
        categories={categories}
      />
    </div>
  );
}

export default Transactions;
