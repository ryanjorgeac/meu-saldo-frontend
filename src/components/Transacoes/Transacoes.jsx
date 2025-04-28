import React from "react";
import "./Transacoes.css";

const Transacoes = () => {
  return (
    <main>
      <div className="page-header">
        <h2>Transações Recentes</h2>
        <a href="transactions" className="view-all">
          Ver todas &rsaquo;
        </a>
      </div>

      <section className="transactions">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Descrição ⇅</th>
              <th>Valor ⇅</th>
              <th>Categoria ⇅</th>
              <th>Data ⇅</th>
            </tr>
          </thead>
          <tbody>
            <tr className="expense">
              <td>
                <div className="transaction-icon expense">
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
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                Compras no mercado
              </td>
              <td className="negative">-R$150,00</td>
              <td>
                <span
                  className="category-badge"
                  style={{
                    backgroundColor: "rgba(229, 57, 53, 0.2)",
                    color: "#E53935",
                  }}
                >
                  Lazer
                </span>
              </td>
              <td>01 de Abril de 2025</td>
            </tr>
            <tr className="income">
              <td>
                <div className="transaction-icon income">
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
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                </div>
                Ações recebidas S&P500
              </td>
              <td className="positive">+R$250,00</td>
              <td>
                <span
                  className="category-badge"
                  style={{
                    backgroundColor: "rgba(30, 136, 229, 0.2)",
                    color: "#1E88E5",
                  }}
                >
                  Investimentos
                </span>
              </td>
              <td>01 de Abril de 2025</td>
            </tr>
            <tr className="expense">
              <td>
                <div className="transaction-icon expense">
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
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                Conta de luz
              </td>
              <td className="negative">-R$120,00</td>
              <td>
                <span
                  className="category-badge"
                  style={{
                    backgroundColor: "rgba(255, 193, 7, 0.2)",
                    color: "#FFC107",
                  }}
                >
                  Contas
                </span>
              </td>
              <td>02 de Abril de 2025</td>
            </tr>
            <tr className="income">
              <td>
                <div className="transaction-icon income">
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
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                </div>
                Salário
              </td>
              <td className="positive">+R$3.000,00</td>
              <td>
                <span
                  className="category-badge"
                  style={{
                    backgroundColor: "rgba(76, 175, 80, 0.2)",
                    color: "#4CAF50",
                  }}
                >
                  Renda
                </span>
              </td>
              <td>05 de Abril de 2025</td>
            </tr>
            <tr className="expense">
              <td>
                <div className="transaction-icon expense">
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
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                Assinatura Netflix
              </td>
              <td className="negative">-R$39,90</td>
              <td>
                <span
                  className="category-badge"
                  style={{
                    backgroundColor: "rgba(156, 39, 176, 0.2)",
                    color: "#9C27B0",
                  }}
                >
                  Entretenimento
                </span>
              </td>
              <td>06 de Abril de 2025</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default Transacoes;
