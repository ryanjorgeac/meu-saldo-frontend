export default function FormContainer({ children, title, description, error }) {
  return (
    <div className="login-form-container">
      <div className="login-right-texts">
        <h2 className="login-header">{title}</h2>
        <p className="login-description">{description}</p>
        {error && <p className="error">{error}</p>}
      </div>
      {children}
    </div>
  );
}