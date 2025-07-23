import { useState, useEffect } from "react";
import styles from "./dashboard.module.css";
import Carteira from "../../components/Carteira/Carteira";
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

  const username = user?.name || user?.username || user?.email?.split('@')[0] || 'Usuário';

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.greeting}>Olá, {username}!</h1>
      <Carteira />
      <Transacoes />
    </div>
  );
}

export default Dashboard;