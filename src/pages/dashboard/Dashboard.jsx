import React from "react";
import styles from "./dashboard.module.css";
import Carteira from "../../components/Carteira/Carteira";
import Categoria from "../../components/category/Category";
import Transacoes from "../../components/Transacoes/Transacoes";

function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <h1 className={styles.greeting}>Olá, usuário!</h1>
      <Carteira />
      <Categoria />
      <Transacoes />
    </div>
  );
}

export default Dashboard;
