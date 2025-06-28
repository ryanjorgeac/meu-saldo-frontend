import { useState } from "react";
import { useNavigate } from "react-router-dom";
import  authService from "../../services/authService";

import AuthLayout from "../../components/auth/AuthLayout";
import FormContainer from "../../components/auth/FormContainer";
import TextInput from "../../components/auth/TextInput";
import PasswordInput from "../../components/auth/PasswordInput";
import ActionButton from "../../components/auth/ActionButton";
import AuthLink from "../../components/auth/AuthLink";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function Register() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    name: null,
    surname: null,
    email: null,
    password: null,
    confirmPassword: null,
  });

  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateField = (field, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    switch (field) {
      case "name":
        return value ? null : "Nome é obrigatório";
      case "surname":
        return value ? null : "Sobrenome é obrigatório";
      case "email":
        if (!value) return "E-mail é obrigatório";
        return emailRegex.test(value) ? null : "E-mail inválido";
      case "password":
        if (!value) return "Senha é obrigatória";
        if (value.length < 8) return "A senha deve ter pelo menos 8 caracteres";
        return passwordRegex.test(value)
          ? null
          : "A senha deve conter letras maiúsculas, minúsculas e números";
      case "confirmPassword":
        if (!value) return "Confirmação de senha é obrigatória";
        return value === password ? null : "As senhas não coincidem";
      default:
        return null;
    }
  };

  const handleChange = (field, value) => {
    switch (field) {
      case "name":
        setName(value);
        break;
      case "surname":
        setSurname(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        if (confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword:
              value === confirmPassword ? null : "As senhas não coincidem",
          }));
        }
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
    }

    const fieldError = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: fieldError,
    }));
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField("name", name),
      surname: validateField("surname", surname),
      email: validateField("email", email),
      password: validateField("password", password),
      confirmPassword: validateField("confirmPassword", confirmPassword),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        email: email,
        password: password,
        firstName: name,
        lastName: surname,
      };
      await authService.register(userData)
      navigate("/login", {
        state: {
          message: "Cadastro realizado com sucesso! Faça login para continuar.",
        },
      });
    } catch (err) {
      setFormError(err.message || "Erro ao cadastrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <FormContainer
        title="Crie sua conta"
        description="Por favor, informe seus dados para continuar"
        error={formError}
      >
        <form onSubmit={handleSubmit} className="auth-form">
          <TextInput
            type="text"
            id="name"
            label="Nome"
            placeholder="Insira o seu nome"
            value={name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
          />

          <TextInput
            type="text"
            id="surname"
            label="Sobrenome"
            placeholder="Insira o seu sobrenome"
            value={surname}
            onChange={(e) => handleChange('surname', e.target.value)}
            error={errors.surname}
          />

          <TextInput
            type="email"
            id="email"
            label="E-mail"
            placeholder="Insira o seu e-mail"
            value={email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
          />

          <PasswordInput
            value={password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
          />

          <PasswordInput
            id="confirmPassword"
            label="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
          />

          <ActionButton
            text={isLoading ? "Cadastrando..." : "Finalizar cadastro"}
            disabled={isLoading}
            isLoading={isLoading}
          />
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
