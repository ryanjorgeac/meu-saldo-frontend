import React from "react";
import "./Carteira.css";

export default function Carteira() {
  return (
    <main>
      <section className="card wallet-card">
        <div className="wallet-info">
          <h2>Minha Carteira</h2>
          <div className="wallet-balance">
            <span className="balance-label">Valor disponível na carteira</span>
            <span className="balance-amount">R$ 15.000,00</span>
          </div>
          <div className="wallet-stats">
            <span className="growth positive">
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
              20%
            </span>
            <span className="comparison">Comparado ao mês passado</span>
          </div>
          <div className="wallet-summary">
            <div className="summary-item">
              <span className="summary-label">Categorias</span>
              <span className="summary-value">4</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Transações</span>
              <span className="summary-value">28</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
