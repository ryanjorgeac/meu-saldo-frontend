import "../../styles/Login.css"
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import loginIllustration from "../../assets/login-illustration.png"
import { FiEye, FiEyeOff } from "react-icons/fi"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log(email, password);
    // try {
    //   // Make API call to your backend
    //   const response = await fetch('/api/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, password })
    //   });
      
    //   const data = await response.json();
      
    //   if (!response.ok) {
    //     throw new Error(data.message || 'Login failed');
    //   }
      
    //   // Call login function from auth context
    //   login(data.user, data.token);
      
    //   // Navigate to the page they were trying to access, or dashboard
    //   navigate(from, { replace: true });
      
    // } catch (err) {
    //   setError(err.message);
    // }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-left-content">
          <h1>Seu lugar preferido para gestão de finanças</h1>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <div className="login-right-texts">
            <h2 className="login-header">Faça login na sua conta</h2>
            <p className="login-description">Por favor, insira os dados abaixo</p>
            {error && <p className="error">{error}</p>}
          </div>

          <form onSubmit={handleSubmit} className='login-form'>
            <div className='form-group'>
              <label htmlFor='email'>E-mail</label>
              <input 
                type="email"
                id="email"
                placeholder="Insira o seu e-mail"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div className='form-group'>
              <label htmlFor='password'>Senha</label>
              <div className='password-input-container'>
                <input 
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <button 
                type="button" 
                className='password-toggle' 
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}>
                  {showPassword ? <FiEyeOff/> : <FiEye/>}
                </button>
              </div>
            </div>

            <div className="forgot-password">
                <a className="login-link" href="/forgot-password">Esqueci a minha senha</a>
            </div>

            <button type="submit" className="login-button">
                Entrar
            </button>
          </form>

          <div className="register-prompt">
                Não possui uma conta ainda? <a className="login-link" href="/register">Cadastre-se</a>
            </div>
        </div>
      </div>
    </div>
  );
}
