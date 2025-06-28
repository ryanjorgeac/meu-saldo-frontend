import "../../styles/AuthLayout.css";

export default function AuthLayout({ children, title }) {
  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-left-content">
          <h1>{title || "Seu lugar preferido para gestão de finanças"}</h1>
        </div>
      </div>

      <div className="auth-right">
        {children}
      </div>
    </div>
  );
}