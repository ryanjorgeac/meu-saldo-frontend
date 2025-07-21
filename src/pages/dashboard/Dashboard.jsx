import React, { useState, useEffect } from "react";
import styles from "./dashboard.module.css";
import Carteira from "../../components/Carteira/Carteira";
import Categoria from "../../components/category/Category";
import Transacoes from "../../components/Transacoes/Transacoes";
import { categoryService } from "../../services/categoryService";
import { useAuth } from "../../hooks/useAuth";

function Dashboard() {
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        setCategories(response);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchCategories();
  }, []);

  // Display loading or fallback if user data is not available yet
  const username = user?.name || user?.username || user?.email?.split('@')[0] || 'Usuário';

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.greeting}>Olá, {username}!</h1>
      <Carteira />
      <Categoria categorias={categories} />
      <Transacoes />
    </div>
  );
}

export default Dashboard;