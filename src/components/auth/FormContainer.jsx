export default function FormContainer({ children, title, description, error, success }) {
  return (
    <div className="auth-form-container">
      <div className="auth-form-header">
        <h2>{title}</h2>
        <p className="auth-description">{description}</p>
      </div>
      {error && <div className="auth-form-error">{error}</div>}
      {success && <div className="auth-success">{success}</div>}
      {children}
    </div>
  );
}