import { NavLink, Link, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./Header.css";
import DropDown from "../profileMenu/DropDown";

function Header() {
  const location = useLocation();
  const activeIndicatorRef = useRef(null);
  const navContainerRef = useRef(null);

  useEffect(() => {
    if (navContainerRef.current && activeIndicatorRef.current) {
      const activeLink = navContainerRef.current.querySelector('.active');
      
      if (activeLink) {
        const navRect = navContainerRef.current.getBoundingClientRect();
        const activeLinkRect = activeLink.getBoundingClientRect();

        const leftPosition = activeLinkRect.left - navRect.left;

        activeIndicatorRef.current.style.left = `${leftPosition}px`;
        activeIndicatorRef.current.style.width = `${activeLinkRect.width}px`;
        activeIndicatorRef.current.style.opacity = '1';
      }
    }
  }, [location]);

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
          <nav className="nav-buttons" ref={navContainerRef}>
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

            <div className="active-indicator" ref={activeIndicatorRef}></div>
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
