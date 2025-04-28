import { useState } from "react";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import "./profile.css";


function Profile() {
  const { user, logout } = useContext(AuthContext);
  const [name, setName] = useState(user ?  `${user.firstName} ${user.lastName}` : "usuário");
  const [email, setEmail] = useState(user ? user.email : "Null");
  const [id, setId] = useState(user ? user.id : "Null")

  function format(name){
    if (typeof name === "string") {
      
      return name.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
      
    }
    return name;
  }

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
      <p className="data-label">Nome de usuário</p>
      <p className="user-data">{format(name)} </p>
      <p className="data-label">Email de usuário</p>
      <p className="user-data">{email}</p>
            
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

