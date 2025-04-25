export default function AuthLink({ text, linkText, href, className = "login-link" }) {
  return (
    <div className={text ? "register-prompt" : "forgot-password"}>
      {text && <>{text} </>}
      <a className={className} href={href}>{linkText}</a>
    </div>
  );
}