export default function ActionButton({ 
  text, 
  disabled = false, 
  isLoading = false, 
  onClick = null,
  type = "submit" 
}) {
  return (
    <button 
      type={type}
      className="auth-submit-button" 
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      <div className="auth-button-content">
        {isLoading && <div className="auth-button-spinner"></div>}
        {text}
      </div>
    </button>
  );
}