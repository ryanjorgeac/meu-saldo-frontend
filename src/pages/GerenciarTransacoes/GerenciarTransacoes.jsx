import React, { useState } from "react";
import "./GerenciarTransacoes.css";

import TransactionForm from "../../components/TransactionForm/TransactionForm.jsx";
import TransactionTable from "../../components/TransactionTable/TransactionTable.jsx";

function GerenciarTransacoes() {
  const [transactions, setTransactions] = useState([]);

  const handleAddTransaction = (newTransaction) => {
    setTransactions((prevTransactions) => [
      ...prevTransactions,
      newTransaction,
    ]);
  };

  const handleEditTransaction = (index) => {
    const transactionToEdit = transactions[index];
    console.log("Editar transação:", transactionToEdit);
   
  };

  const handleDeleteTransaction = (index) => {
    setTransactions((prevTransactions) =>
      prevTransactions.filter((_, i) => i !== index)
    );
  };

  return (
    <main>
      <div className="page-header">
        <h2>Gerenciar Transações</h2>
      </div>

      <section className="crud-section">
        <TransactionForm onAddTransaction={handleAddTransaction} />
        <TransactionTable
          transactions={transactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      </section>
    </main>
  );
}

export default GerenciarTransacoes;
