import { useState } from 'react';
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function PasswordInput({ 
  id = "password", 
  label = "Senha", 
  placeholder = "••••••••", 
  value, 
  onChange,
  required = true,
  error = null
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='auth-form-group'>
      <label htmlFor={id}>{label}</label>
      <div className='auth-password-container'>
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={error ? 'auth-input-error' : ''}
        />
        <button
          type="button"
          className='auth-password-toggle'
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}>
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
      {error && <p className="auth-field-error">{error}</p>}
    </div>
  );
}