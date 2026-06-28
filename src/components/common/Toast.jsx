import { useEffect } from "react";
import "./Toast.css";

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast--${type}`} role="alert" aria-live="polite">
      <span className="toast__message">{message}</span>
      <button className="toast__close" onClick={onClose} aria-label="Fechar notificação">
        ×
      </button>
    </div>
  );
}

export default Toast;
