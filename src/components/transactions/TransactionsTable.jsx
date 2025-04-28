import React from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import CategoryChip from "./CategoryChip";
import "./TransactionsTable.css";

function TransactionsTable({ transactions, onEditTransaction, onDeleteTransaction }) {
  return (
    <table className="transactions-table">
      <thead>
        <tr>
          <th>Descrição</th>
          <th>Valor</th>
          <th>Categoria</th>
          <th>Data</th>
          <th></th>
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
          transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className={transaction.type === "EXPENSE" ? "expense" : "income"}
            >
              <td>{transaction.description}</td>
              <td className="amount">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(transaction.value)}
              </td>
              <td>
              	<CategoryChip categoryName={transaction.categoryName} />
            	</td>
              <td>{transaction.date}</td>
              <td className="actions">
                <button
                  className="edit-button"
                  onClick={() => onEditTransaction(transaction)}
                >
                  <FaPencilAlt />
                </button>
                <button
                  className="delete-button"
                  onClick={() => onDeleteTransaction(transaction.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default TransactionsTable;
