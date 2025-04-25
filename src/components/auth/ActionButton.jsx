export default function ActionButton({ text, onClick, type = "submit" }) {
  return (
    <button 
      type={type} 
      className="login-button" 
      onClick={onClick}
    >
      {text}
    </button>
  );
}