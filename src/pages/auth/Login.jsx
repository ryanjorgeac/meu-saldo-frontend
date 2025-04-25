import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

import AuthLayout from '../../components/auth/AuthLayout';
import FormContainer from '../../components/auth/FormContainer';
import TextInput from '../../components/auth/TextInput';
import PasswordInput from '../../components/auth/PasswordInput';
import ActionButton from '../../components/auth/ActionButton';
import AuthLink from '../../components/auth/AuthLink';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log(email, password);
    // Login logic here
  };

  return (
    <AuthLayout title="Seu lugar preferido para gestão de finanças">
      <FormContainer 
        title="Faça login na sua conta" 
        description="Por favor, insira os dados abaixo"
        error={error}
      >
        <form onSubmit={handleSubmit} className='login-form'>
          <TextInput
            type="email"
            id="email"
            label="E-mail"
            placeholder="Insira o seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <AuthLink 
            linkText="Esqueci a minha senha" 
            href="/forgot-password" 
          />

          <ActionButton text="Entrar" />
        </form>

        <AuthLink 
          text="Não possui uma conta ainda?" 
          linkText="Cadastre-se" 
          href="/register" 
        />
      </FormContainer>
    </AuthLayout>
  );
}
