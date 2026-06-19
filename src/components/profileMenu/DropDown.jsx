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

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

    return (
      <div className="dropdown" ref={dropdownRef}>
        <div className="profile-icon-container" onClick={toggleDropdown}>
          <img src="/src/assets/profile-icon.png" alt="user-icon" className="user-icon"/>
        </div>

        {open && (
          <div className="dropdown-menu">
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