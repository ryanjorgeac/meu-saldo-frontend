import React from "react";
import { FaPencilAlt } from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import CategoryChip from "./CategoryChip";
import "./TransactionsTable.css";

function SortableHeader({ label, field, sortField, sortDirection, onSort }) {
  const isActive = sortField === field;

  return (
    <th className="sortable-header" onClick={() => onSort(field)}>
      <span className="header-content">
        {label}
        <span className="sort-arrows">
          <span className={`sort-arrow up ${isActive && sortDirection === "asc" ? "active" : ""}`}>↑</span>
          <span className={`sort-arrow down ${isActive && sortDirection === "desc" ? "active" : ""}`}>↓</span>
        </span>
      </span>
    </th>
  );
}

function TransactionsTable({ transactions, onEditTransaction, sortField, sortDirection, onSort }) {
  return (
    <table className="transactions-table">
      <thead className="transactions-table-header">
        <tr>
          <SortableHeader label="Descrição" field="description" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <SortableHeader label="Valor" field="amount" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <SortableHeader label="Categoria" field="categoryName" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <SortableHeader label="Data" field="date" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <th className="actions-header">Ações</th>
        </tr>
      </thead>
      <tbody>
        {transactions.length === 0 ? (
          <tr>
            <td colSpan="5" className="no-transactions">
              Nenhuma transação encontrada
            </td>
          </tr>
        ) : (
          transactions.map((transaction) => {
            const isExpense = transaction.type === "EXPENSE";

            return (
              <tr key={transaction.id}>
                <td>
                  <div className="transaction-description">
                    <span className={`transaction-icon ${isExpense ? "expense-icon" : "income-icon"}`}>
                      {isExpense ? <FaArrowTrendDown size={12} /> : <FaArrowTrendUp size={12} />}
                    </span>
                    <div className="transaction-desc-text">
                      <span className="transaction-title">{transaction.description}</span>
                      <span className="transaction-type-label">{isExpense ? "Despesa" : "Receita"}</span>
                    </div>
                  </div>
                </td>
                <td className={isExpense ? "expense-value" : "income-value"}>
                  {isExpense ? "-" : "+"}R${transaction.amount}
                </td>
                <td>
                  <CategoryChip categoryName={transaction.categoryName} />
                </td>
                <td>{transaction.date}</td>
                <td>
                  <button
                    className="edit-transaction-btn"
                    onClick={() => onEditTransaction(transaction)}
                    aria-label="Editar transação"
                  >
                    <FaPencilAlt />
                  </button>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}

export default TransactionsTable;
