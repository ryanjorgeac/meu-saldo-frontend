import { useNavigate } from "react-router-dom"
function DropDown(){
    const navigate = useNavigate();
    return (
        <>
        <div className="dropdown-container">
            <button onClick={()=>navigate("/login")}>Login</button>
        </div>
        </>
    )
}
export default DropDown