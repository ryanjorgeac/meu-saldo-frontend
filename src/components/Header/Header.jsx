import { NavLink } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        {/* Logo e Título */}
        <div className="logo-title">
          <img src="/src/assets/logo.svg" alt="Logo" className="logo" />
          <h1 className="title">Meu saldo</h1>
        </div>

        {/* Navegação */}
        <nav className="nav-buttons">
          <NavLink to="/dashboard" className="nav-link">
            Dashboard
          </NavLink>
          <NavLink to="/categories" className="nav-link">
            Categorias
          </NavLink>
          <NavLink to="/transactions" className="nav-link">
            Transações
          </NavLink>
          <NavLink to="/analytics" className="nav-link">
            Análises
          </NavLink>
        </nav>

        <NavLink to="/profile" className="user-icon">
          <img src="/src/assets/profile-icon.png" alt="Perfil" />
        </NavLink>
      </div>
    </header>
  );
}

export default Header;
