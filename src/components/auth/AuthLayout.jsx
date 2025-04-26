import "../../styles/AuthLayout.css";

export default function AuthLayout({ children, title }) {
  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-left-content">
          <h1>{title || "Seu lugar preferido para gestão de finanças"}</h1>
        </div>
      </div>

      <div className="login-right">
        {children}
      </div>
    </div>
  );
}