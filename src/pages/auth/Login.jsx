import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import authService from "../../services/authService";

import AuthLayout from "../../components/auth/AuthLayout";
import FormContainer from "../../components/auth/FormContainer";
import TextInput from "../../components/auth/TextInput";
import PasswordInput from "../../components/auth/PasswordInput";
import ActionButton from "../../components/auth/ActionButton";
import AuthLink from "../../components/auth/AuthLink";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({
    email: null,
    password: null,
  });
  const [formError, setFormError] = useState("");

  const validateField = (field, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    switch (field) {
      case "email":
        if (!value) return "E-mail é obrigatório";
        return emailRegex.test(value) ? null : "E-mail inválido";
      case "password":
        if (!value) return "Senha é obrigatória";
        if (value.length < 8) return "A senha deve ter pelo menos 8 caracteres";
        return null;
      default:
        return null;
    }
  };

  const handleChange = (field, value) => {
    switch (field) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
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
      email: validateField("email", email),
      password: validateField("password", password),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== null);
  };

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const credentials = {
        email: email,
        password: password,
      };
      const response = await authService.login(credentials);
      login(response.user, response.refreshToken);
      navigate(from);
    } catch (err) {
      setFormError(err.message || "Erro ao fazer login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Seu lugar preferido para gestão de finanças">
      <FormContainer
        title="Faça login na sua conta"
        description="Por favor, insira os dados abaixo"
        error={formError}
        success={success}
      >
        <form onSubmit={handleSubmit} className="auth-form">
          <TextInput
            type="email"
            id="email"
            label="E-mail"
            placeholder="Insira o seu e-mail"
            value={email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={errors.email}
          />

          <PasswordInput
            value={password}
            onChange={(e) => handleChange("password", e.target.value)}
            error={errors.password}
          />

          <AuthLink linkText="Esqueci a minha senha" href="/forgot-password" />

          <ActionButton
            text={isLoading ? "Entrando..." : "Entrar"}
            disabled={isLoading}
            isLoading={isLoading}
          />
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
