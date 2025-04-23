import React from "react";
import styles from "./dashboard.module.css";
import Carteira from "../../Components/Carteira/Carteira";
import Categoria from "../../Components/Categorias/Categorias";
import Transacoes from "../../Components/Transacoes/Transacoes";

function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <Carteira />
      <Categoria />
      <Transacoes />
    </div>
  );
}

export default Dashboard;
