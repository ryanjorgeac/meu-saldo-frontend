import React, { useState, useCallback, useEffect, useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import { endOfDay, format, isAfter, isBefore, parseISO, startOfDay } from "date-fns";
import "./Transactions.css";
import CategorySelect from "../../components/transactions/CategorySelect";
import DateInput from "../../components/transactions/DateInput";
import SearchInput from "../../components/transactions/SearchInput";
import TransactionsTable from "../../components/transactions/TransactionsTable";
import TransactionFormModal from "../../components/transactions/TransactionFormModal";
import CommitmentFormModal from "../../components/commitments/CommitmentFormModal";
import CommitmentsSidebar from "../../components/commitments/CommitmentsSidebar";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import Toast from "../../components/common/Toast";
import { transactionService, categoryService, commitmentService } from "../../services";
import ptBR from "date-fns/locale/pt-BR";
import { parseMoneyInputToCents, formatMoneyInput } from "../../utils/money";
import { useTransactionsCache } from "../../context/TransactionsContext.jsx";

const PAGE_SIZE = 10;
const FETCH_PAGE_SIZE = 100;

function parseAmountToNumber(amount) {
  return Number.parseFloat(String(amount).replace(/\./g, "").replace(",", "."));
}

function toRangeDate(value) {
  return value ? parseISO(value) : null;
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
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
    minValue: "",
    maxValue: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  // Commitments state
  const [commitments, setCommitments] = useState([]);
  const [commitmentsLoading, setCommitmentsLoading] = useState(false);
  const [isCommitmentModalOpen, setIsCommitmentModalOpen] = useState(false);
  const [editingCommitment, setEditingCommitment] = useState(null);
  const [commitmentToDelete, setCommitmentToDelete] = useState(null);
  const [loggingCommitmentId, setLoggingCommitmentId] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryService.getCategories();
      const formattedCategories = response.map(category => ({
        value: category.id,
        label: category.name,
        color: category.color || null
      }));
      setCategories(formattedCategories);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  const fetchCommitments = useCallback(async () => {
    setCommitmentsLoading(true);
    try {
      const data = await commitmentService.getCommitments();
      setCommitments(data);
    } catch (err) {
      console.error("Error fetching commitments:", err);
    } finally {
      setCommitmentsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchCommitments();
  }, [fetchCategories, fetchCommitments]);

  useEffect(() => {
    if (!didHydrateCache && transactionsCache.items.length > 0) {
      setDidHydrateCache(true);
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
      categoryId: transaction.category || null,
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
      let allData = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await transactionService.getTransactions(page, FETCH_PAGE_SIZE, {
          order: "desc",
        });

        allData = allData.concat(response.data);
        hasMore = response.data.length === FETCH_PAGE_SIZE;
        page++;
      }

      const transformedTransactions = allData.map((transaction) => {
        const category = categories.find((cat) => cat.value === transaction.categoryId);

        return {
          id: transaction.id,
          description: transaction.description,
          amount: transaction.amount,
          amountValue: parseAmountToNumber(transaction.amount),
          category: transaction.categoryId,
          categoryName: category ? category.label : "Sem categoria",
          categoryColor: category?.color || null,
          date: formatDate(transaction.date),
          rawDate: transaction.date,
          createdAt: transaction.createdAt,
          type: transaction.type,
        };
      });

      setTransactionsCache({
        items: transformedTransactions,
        fetchedAt: Date.now(),
      });
    } catch (err) {
      setError(err.message);
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  }, [categories, setTransactionsCache, transactionsCache.items.length]);

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

          if (valA === valB && a.createdAt && b.createdAt) {
            valA = new Date(a.createdAt).getTime();
            valB = new Date(b.createdAt).getTime();
          }
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

  const handleAmountFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: formatMoneyInput(value) }));
    setCurrentPage(1);
  };

  const handleSaveTransaction = async (formData) => {
    const isEditing = Boolean(formData.id);

    if (!formData.description?.trim()) {
      setToast({ message: 'Descrição é obrigatória.', type: 'error' });
      return;
    }

    if (!isEditing && !formData.amountInput?.trim()) {
      setToast({ message: 'Valor é obrigatório.', type: 'error' });
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
      setToast({ message: isEditing ? 'Transação atualizada com sucesso!' : 'Transação criada com sucesso!', type: 'success' });
    } catch (err) {
      console.error("Error saving transaction:", err);
      const message = err.message === "Invalid money input"
        ? "Informe um valor válido com até duas casas decimais."
        : err.message;
      setToast({ message, type: 'error' });
    }
  };

  const handleDeleteTransaction = (transaction) => {
    setTransactionToDelete(transaction);
  };

  const confirmDeleteTransaction = async () => {
    try {
      await transactionService.deleteTransaction(transactionToDelete.id);
      setTransactionToDelete(null);
      setIsModalOpen(false);
      await fetchTransactions({ force: true });
      setToast({ message: 'Transação excluída com sucesso!', type: 'success' });
    } catch (err) {
      console.error("Error deleting transaction:", err);
      setToast({ message: err.message || 'Erro ao excluir transação.', type: 'error' });
      setTransactionToDelete(null);
    }
  };

  const handleSaveCommitment = async (formData) => {
    const isEditing = Boolean(formData.id);
    if (!formData.description?.trim()) {
      setToast({ message: 'Descrição é obrigatória.', type: 'error' });
      return;
    }
    if (!isEditing && !formData.amountInput?.trim()) {
      setToast({ message: 'Valor é obrigatório.', type: 'error' });
      return;
    }
    try {
      const payload = {
        description: formData.description.trim(),
        type: formData.type,
        frequency: formData.frequency,
        date: formData.date,
        categoryId: formData.category || null,
      };
      if (!isEditing || formData.amountInput?.trim()) {
        payload.amountCents = parseMoneyInputToCents(formData.amountInput);
      }
      if (isEditing) {
        await commitmentService.updateCommitment(formData.id, payload);
      } else {
        await commitmentService.createCommitment(payload);
      }
      setIsCommitmentModalOpen(false);
      setEditingCommitment(null);
      await fetchCommitments();
      setToast({ message: isEditing ? 'Compromisso atualizado com sucesso!' : 'Compromisso criado com sucesso!', type: 'success' });
    } catch (err) {
      const message = err.message === 'Invalid money input'
        ? 'Informe um valor válido com até duas casas decimais.'
        : err.message;
      setToast({ message, type: 'error' });
    }
  };

  const handleEditCommitment = (commitment) => {
    setEditingCommitment(commitment);
    setIsCommitmentModalOpen(true);
  };

  const handleDeleteCommitment = (commitment) => {
    setCommitmentToDelete(commitment);
  };

  const confirmDeleteCommitment = async () => {
    try {
      await commitmentService.deleteCommitment(commitmentToDelete.id);
      setCommitmentToDelete(null);
      await fetchCommitments();
      setToast({ message: `Compromisso "${commitmentToDelete.description}" excluído com sucesso!`, type: 'success' });
    } catch (err) {
      setToast({ message: err.message || 'Erro ao excluir compromisso.', type: 'error' });
      setCommitmentToDelete(null);
    }
  };

  const handleLogCommitment = useCallback(async (id) => {
    setLoggingCommitmentId(id);
    try {
      await commitmentService.logCommitment(id);
      setTransactionsCache({ items: [], fetchedAt: null });
      await fetchTransactions({ force: true });
      setToast({ message: 'Transação lançada com sucesso!', type: 'success' });
    } catch (err) {
      setToast({ message: err.message || 'Erro ao lançar compromisso.', type: 'error' });
    } finally {
      setLoggingCommitmentId(null);
    }
  }, [fetchTransactions, setTransactionsCache]);

  return (
    <div className="transactions-page">
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

        <div className="transaction-filter-item transaction-filter-item--fixed">
          <CategorySelect
            selectedCategories={selectedCategories}
            onChange={setSelectCategories}
            options={categories}
          />
        </div>

        <div className="transaction-filter-item transaction-filter-item--fixed">
          <DateInput
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            placeholder="Data início"
            maxDate={filters.endDate || new Date().toISOString()}
          />
        </div>

        <div className="transaction-filter-item transaction-filter-item--fixed">
          <DateInput
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            placeholder="Data fim"
            minDate={filters.startDate || undefined}
            maxDate={new Date().toISOString()}
          />
        </div>

        <div className="transaction-filter-item transaction-filter-item--amount">
          <input
            type="text"
            name="minValue"
            value={filters.minValue}
            onChange={handleAmountFilterChange}
            placeholder="Mín. R$"
          />
        </div>

        <div className="transaction-filter-item transaction-filter-item--amount">
          <input
            type="text"
            name="maxValue"
            value={filters.maxValue}
            onChange={handleAmountFilterChange}
            placeholder="Máx. R$"
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
            onDeleteTransaction={handleDeleteTransaction}
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

      {isModalOpen && (
        <TransactionFormModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTransaction}
          transaction={currentTransaction}
          categories={categories}
        />
      )}
      {transactionToDelete && (
        <ConfirmationModal
          title="Excluir Transação"
          message={`Tem certeza que deseja excluir "${transactionToDelete.description}"?`}
          description="Esta ação não pode ser desfeita."
          onClose={() => setTransactionToDelete(null)}
          onConfirm={confirmDeleteTransaction}
          confirmText="Excluir"
          cancelText="Cancelar"
          isDangerous={true}
        />
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>

      <CommitmentsSidebar
        commitments={commitments}
        loading={commitmentsLoading}
        categories={categories}
        onAdd={() => { setEditingCommitment(null); setIsCommitmentModalOpen(true); }}
        onEdit={handleEditCommitment}
        onDelete={handleDeleteCommitment}
        onLog={handleLogCommitment}
        loggingCommitmentId={loggingCommitmentId}
      />

      {isCommitmentModalOpen && (
        <CommitmentFormModal
          onClose={() => { setIsCommitmentModalOpen(false); setEditingCommitment(null); }}
          onSave={handleSaveCommitment}
          commitment={editingCommitment}
          categories={categories}
        />
      )}
      {commitmentToDelete && (
        <ConfirmationModal
          title="Excluir Compromisso"
          message={`Tem certeza que deseja excluir "${commitmentToDelete.description}"?`}
          description="Esta ação não pode ser desfeita."
          onClose={() => setCommitmentToDelete(null)}
          onConfirm={confirmDeleteCommitment}
          confirmText="Excluir"
          cancelText="Cancelar"
          isDangerous={true}
        />
      )}
    </div>
  );
}

export default Transactions;
