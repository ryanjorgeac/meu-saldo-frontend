import { useState } from 'react';
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function PasswordInput({ 
  id = "password", 
  label = "Senha", 
  placeholder = "••••••••", 
  value, 
  onChange,
  required = true 
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='form-group'>
      <label htmlFor={id}>{label}</label>
      <div className='password-input-container'>
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
        <button
          type="button"
          className='password-toggle'
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}>
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </div>
  );
}