function ResetPassword() {
  return (
    <div>
      <h1>Redefinir Senha</h1>
      <form>
        <input type="email" placeholder="Digite seu email" />
        <button type="submit">Enviar link de redefinição</button>
      </form>
    </div>
  );
}

export default ResetPassword;
