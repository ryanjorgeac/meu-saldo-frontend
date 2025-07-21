import { useState } from "react";
import { useNavigate } from "react-router-dom";
import  authService from "../../services/authService";
import { validateField, hasValidationErrors, authValidation } from "../../utils/validation";

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
            confirmPassword: validateField("confirmPassword", confirmPassword, { password: value }),
          }));
        }
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
    }
  };

  const handleBlur = (field) => {
    let value;
    switch (field) {
      case "name":
        value = name;
        break;
      case "surname":
        value = surname;
        break;
      case "email":
        value = email;
        break;
      case "password":
        value = password;
        break;
      case "confirmPassword":
        value = confirmPassword;
        break;
      default:
        return;
    }

    const fieldError = validateField(field, value, { password });
    setErrors((prev) => ({
      ...prev,
      [field]: fieldError,
    }));
  };

  const validateForm = () => {
    const errors = authValidation.validateRegistration({
      name,
      surname,
      email,
      password,
      confirmPassword
    });

    setErrors(errors);
    return !hasValidationErrors(errors);
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
        firstName: name.trim(),
        lastName: surname.trim(),
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
            onBlur={() => handleBlur('name')}
            error={errors.name}
          />

          <TextInput
            type="text"
            id="surname"
            label="Sobrenome"
            placeholder="Insira o seu sobrenome"
            value={surname}
            onChange={(e) => handleChange('surname', e.target.value)}
            onBlur={() => handleBlur('surname')}
            error={errors.surname}
          />

          <TextInput
            type="email"
            id="email"
            label="E-mail"
            placeholder="Insira o seu e-mail"
            value={email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            error={errors.email}
          />

          <PasswordInput
            value={password}
            onChange={(e) => handleChange('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            error={errors.password}
          />

          <PasswordInput
            id="confirmPassword"
            label="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            onBlur={() => handleBlur('confirmPassword')}
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
