export default function ActionButton({ text, disabled = false, isLoading = false }) {
  return (
    <button 
      type="submit" 
      className="auth-submit-button" 
      disabled={disabled || isLoading}
    >
      <div className="auth-button-content">
        {isLoading && <div className="auth-button-spinner"></div>}
        {text}
      </div>
    </button>
  );
}