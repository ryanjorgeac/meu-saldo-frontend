export default function AuthLink({ text, linkText, href }) {
  return (
    <div className={text ? "auth-link-section" : "auth-forgot-password"}>
      {text && <>{text} </>}
      <a href={href}>{linkText}</a>
    </div>
  );
}