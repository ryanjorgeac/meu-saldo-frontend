import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import components
import AuthLayout from '../../components/auth/AuthLayout';
import FormContainer from '../../components/auth/FormContainer';
import TextInput from '../../components/auth/TextInput';
import PasswordInput from '../../components/auth/PasswordInput';
import ActionButton from '../../components/auth/ActionButton';
import AuthLink from '../../components/auth/AuthLink';

export default function Register() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Register logic here
  };

  return (
    <AuthLayout>
      <FormContainer 
        title="Crie sua conta" 
        description="Por favor, informe seus dados para continuar"
        error={error}
      >
        <form onSubmit={handleSubmit} className='login-form'>
          <TextInput
            type="text"
            id="name"
            label="Nome"
            placeholder="Insira o seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextInput
            type="text"
            id="surname"
            label="Sobrenome"
            placeholder="Insira o seu sobrenome"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />

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

          <PasswordInput
            id="confirmPassword"
            label="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <ActionButton text="Finalizar cadastro" />
        </form>

        <AuthLink 
          text="Já possui uma conta?" 
          linkText="Faça login" 
          href="/login" 
        />
      </FormContainer>
    </AuthLayout>
  );
}
