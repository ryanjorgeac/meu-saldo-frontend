import { useState } from "react";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import "./profile.css";

function Profile() {
  const { user, logout } = useContext(AuthContext);
  const [name, setName] = useState(user ? user.name : "usuário");
  return (
    <>
      <div id="profile-div">
      <div id="img-div">
        <img
        src="/src/assets/profile-icon.png"
        alt="generic user png"
        id="user-img"
      ></img>
      </div>

      <h2>{name}</h2>  
      
      <div>
      <p className="user-data">{name} </p>
            
      <div id="button-div">

      <button id="logout" onClick={logout}>Sair/Deslogar</button>
      
      </div>
      <br></br>
      </div>
      
    </div>
    </>
    
  );
}


export default Profile;

