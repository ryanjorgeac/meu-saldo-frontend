import { useNavigate } from "react-router-dom";
import { useState, useContext, useRef, useEffect } from "react";
import "./DropDown.css";
import AuthContext from "../../context/AuthContext";

function DropDown(){
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setOpen(prev => !prev);
  };

  const goToProfile = () => {
    navigate("/profile");
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

    return (
      <div className="dropdown">
        <div className="profile-icon-container" onClick={toggleDropdown}>
          <img src="/src/assets/profile-icon.png" alt="user-icon" className="user-icon"/>
        </div>

        {open && (
          <div className="dropdown-menu">
            <button className="dropdown-button" onClick={goToProfile}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor" />
              </svg>
              Meu Perfil
            </button>
            <button className="dropdown-button" onClick={handleLogout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor" />
              </svg>
              Sair
            </button>
          </div>
        )}
      </div>
    )
}
export default DropDown