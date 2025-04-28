import React from "react";
import "./TransactionTable.css";

function TransactionTable({ transactions, onEdit, onDelete }) {
  return (
    <div className="list-section">
      <h3>Transações Existentes</h3>
      <div className="transactions-list">
        {transactions.map((transaction, index) => (
          <div className={`transaction-item ${transaction.type}`} key={index}>
            <div className={`transaction-icon ${transaction.type}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {transaction.type === "INCOME" ? (
                  <polyline points="18 15 12 9 6 15"></polyline>
                ) : (
                  <polyline points="6 9 12 15 18 9"></polyline>
                )}
              </svg>
            </div>
            <div className="transaction-details">
              <div className="transaction-description">
                {transaction.description}
              </div>
              <div className="transaction-category">{transaction.category}</div>
            </div>
            <div
              className={`transaction-amount ${
                transaction.type === "INCOME" ? "positive" : "negative"
              }`}
            >
              {transaction.amount}
            </div>
            <div className="transaction-date">{transaction.date}</div>
            <div className="transaction-actions">
              <button className="btn edit-btn" onClick={() => onEdit(index)}>
                Editar
              </button>
              <button
                className="btn delete-btn"
                onClick={() => onDelete(index)}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionTable;
