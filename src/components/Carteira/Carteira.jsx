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
        </div>
      </section>
    </main>
  );
}
