import React, { useState, useEffect } from "react";
import styles from "./dashboard.module.css";
import Carteira from "../../components/Carteira/Carteira";
import Categoria from "../../Components/category/Category";
import Transacoes from "../../components/Transacoes/Transacoes";
import { categoryService } from "../../services/categoryService";

function Dashboard() {
  const [categories, setCategories] = useState([]);

  // Função para buscar categorias do backend
  async function fetchCategories() {
    try {
      const response = await categoryService.getCategories();
      console.log("Categorias recebidas:", response); // Log para verificar as categorias recebidas
      setCategories(response);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  }

  // Busca as categorias ao carregar o componente
  useEffect(() => {
    fetchCategories();
  }, []);

  // Log para verificar o estado atualizado
  useEffect(() => {
    console.log("Categorias no estado atualizado:", categories);
  }, [categories]);

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