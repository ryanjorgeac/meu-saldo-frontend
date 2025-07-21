import { useState } from "react";

import FormContainer from "../../components/auth/FormContainer";
import TextInput from "../../components/auth/TextInput";
import ActionButton from "../../components/auth/ActionButton";
import AuthLink from "../../components/auth/AuthLink";
import AuthLayout from "../../components/auth/AuthLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateField = (field, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    switch (field) {
      case "email":
        if (!value) return "E-mail é obrigatório";
        return emailRegex.test(value) ? null : "E-mail inválido";
      default:
        return null;
    }
  };

  const handleBlur = () => {
    const fieldError = validateField("email", email);
    setError(fieldError || "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fieldError = validateField("email", email);
    if (fieldError) {
      setError(fieldError);
      return;
    }
    setSuccess("Link de redefinição enviado para seu email");
    setError("");
  };

  return (
    <AuthLayout>
      <FormContainer
        title="Resete a sua senha"
        description="Insira seu e-mail e te enviaremos um link para redefinir sua senha"
        error={error}
        success={success}
      >
        <form onSubmit={handleSubmit} className='auth-form'>
          <TextInput
            type="email"
            id="email"
            label="E-mail"
            placeholder="Informe seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleBlur}
            error={error || null}
          />
          
          <ActionButton text="Enviar" />
        </form>
        <AuthLink
          text="Lembrou da senha?"
          linkText="Fazer login"
          href="/login"
        />
      </FormContainer>
    </AuthLayout>
  );
}
