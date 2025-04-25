export default function ActionButton({ text, onClick, type = "submit", disabled = false, isLoading = false }) {
  return (
    <button 
      type={type} 
      className={`login-button ${isLoading ? 'button-loading' : ''}`}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <div className="button-content">
          <div className="button-spinner"></div>
          <span>{text}</span>
        </div>
      ) : text}
    </button>
  );
}