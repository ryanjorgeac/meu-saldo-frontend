import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Header from "./Components/Header/Header.jsx";

import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import GerenciarCategorias from "./pages/GerenciarCategorias/GerenciarCategorias.jsx";
import GerenciarTransacoes from "./pages/GerenciarTransacoes/GerenciarTransacoes.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<GerenciarCategorias />} />
          <Route path="/transactions" element={<GerenciarTransacoes />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
