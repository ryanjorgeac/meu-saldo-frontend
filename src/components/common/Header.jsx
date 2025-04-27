import { NavLink } from "react-router-dom";
import "./Header.css";
import DropDown from "../../pages/DropDown/DropDown";

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-title">
          <img src="/src/assets/logo.svg" alt="Logo" className="logo" />
          <h1 className="title">Meu Saldo</h1>
        </div>

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
        <div className="profile-container">
         <DropDown></DropDown>
           
         
        </div>

      </div>
    </header>
  );
}

export default Header;
