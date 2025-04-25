export default function FormContainer({ children, title, description, error, success }) {
  return (
    <div className="login-form-container">
      <div className="login-right-texts">
        <h2 className="login-header">{title}</h2>
        <p className="login-description">{description}</p>
        {error && <p className="form-error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </div>
      {children}
    </div>
  );
}