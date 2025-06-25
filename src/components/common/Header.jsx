import { NavLink, Link } from "react-router-dom";
import "./Header.css";
import DropDown from "../profileMenu/DropDown";

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/dashboard" className="logo-title-link">
          <div className="logo-title">
            <img src="/src/assets/logo.svg" alt="Logo" className="logo" />
            <h1 className="title">Meu Saldo</h1>
          </div>
        </Link>

        <div className="nav-container">
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
        </div>

        <div className="profile-container">
         <DropDown/>         
        </div>

      </div>
    </header>
  );
}

export default Header;
