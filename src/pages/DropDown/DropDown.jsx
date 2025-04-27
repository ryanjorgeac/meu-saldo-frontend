import { useNavigate } from "react-router-dom"
import "./DropDown.css";
import { useState } from "react";

function DropDown(props){
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

  const toggleDropdown = () => {
    setOpen(prev => !prev);
  };

  const goToProfile = () => {
    navigate("/profile");
    setOpen(false);
  };

  const goToLogin = () => {
    navigate("/login");
    setOpen(false);
  };

    return (
        <>
        <div className="dropdown">
        <img src="/src/assets/profile-icon.png" alt="Perfil" className="user-icon" onClick={toggleDropdown}/>
          {open && (
            <div className="dropdown-menu">
               <button className="nav-button" onClick={goToLogin}>Login</button> <br></br>
               <button className="nav-button" onClick={goToProfile}>Profile</button>
            </div>
          )}
            
            
        </div>
        </>
    )
}
export default DropDown