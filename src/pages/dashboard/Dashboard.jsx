import React, { useState, useEffect } from "react";
import styles from "./dashboard.module.css";
import Carteira from "../../components/Carteira/Carteira";
import Categoria from "../../components/category/Category";
import Transacoes from "../../components/Transacoes/Transacoes";
import { categoryService } from "../../services/categoryService";
import useSafeAsync from "../../hooks/useSafeAsync";

function Dashboard() {
  const [categories, setCategories] = useState([]);
  const { safeAsync } = useSafeAsync();

  useEffect(() => {
    const fetchCategories = safeAsync(async () => {
      try {
        const response = await categoryService.getCategories();
        setCategories(response);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    });

    fetchCategories();
  }, [safeAsync]);

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.greeting}>Olá, usuário!</h1>
      <Carteira />
      <Categoria categorias={categories} />
      <Transacoes />
    </div>
  );
}

export default Dashboard;