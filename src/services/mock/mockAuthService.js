import { mockUser, simulateDelay } from './mockData';

let currentUser = null;
let isAuthenticated = false;

export const mockAuthService = {
  register: async (userData) => {
    await simulateDelay(800);

    if (!userData.name?.trim()) {
    throw new Error("Nome é obrigatório");
    }
    
    if (!userData.email?.trim()) {
    throw new Error("E-mail é obrigatório");
    }
    
    if (!userData.password || userData.password.length < 6) {
    throw new Error("Senha deve ter pelo menos 6 caracteres");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
    throw new Error("E-mail inválido");
    }
    
    if (userData.email === "admin@example.com") {
    throw new Error("Não foi possível cadastrar o usuário com esse e-mail.");
    }

    const newUser = {
    id: Date.now(),
    name: userData.name.trim(),
    email: userData.email.trim().toLowerCase(),
    createdAt: new Date().toISOString()
    };

    const token = `mock-jwt-token-${Date.now()}`;

    currentUser = newUser;
    isAuthenticated = true;

    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    return {
    user: newUser,
    token,
    message: "Usuário cadastrado com sucesso"
    };
  },

  login: async (credentials) => {
    await simulateDelay(600);

    if (!credentials.email?.trim()) {
    throw new Error("E-mail é obrigatório");
    }
    
    if (!credentials.password?.trim()) {
    throw new Error("Senha é obrigatória");
    }

    if (credentials.email === "invalid@example.com") {
    throw new Error("E-mail ou senha inválidos.");
    }

    const user = {
    ...mockUser,
    email: credentials.email.trim().toLowerCase()
    };

    const token = `mock-jwt-token-${Date.now()}`;
    
    currentUser = user;
    isAuthenticated = true;
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return {
    user,
    token,
    message: "Login realizado com sucesso"
    };
  },

  logout: async () => {
    await simulateDelay(200);
    
    try {
      currentUser = null;
      isAuthenticated = false;
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      return {
        message: "Logout realizado com sucesso"
      };
    } catch (error) {
      throw new Error("Erro ao fazer logout");
    }
  },

  forgotPassword: async (email) => {
    await simulateDelay(1000);

    if (!email?.trim()) {
    throw new Error("E-mail é obrigatório");
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
    throw new Error("E-mail inválido");
    }
    
    if (email === "notfound@example.com") {
    throw new Error("E-mail não encontrado em nossa base de dados.");
    }
    
    return {
    message: "Instruções de redefinição de senha enviadas para o e-mail"
    };
  },

  resetPassword: async (token, newPassword) => {
    await simulateDelay(500);

    if (!token?.trim()) {
    throw new Error("Token inválido");
    }
    
    if (!newPassword || newPassword.length < 6) {
    throw new Error("Senha deve ter pelo menos 6 caracteres");
    }
    
    return {
    message: "Senha redefinida com sucesso"
    };
  },

  getCurrentUser: async () => {
    await simulateDelay(100);

    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
    const user = JSON.parse(userStr);
    currentUser = user;
    isAuthenticated = true;
    return user;
    }
    
    if (currentUser && isAuthenticated) {
    return currentUser;
    }
    
    throw new Error("Usuário não autenticado");

  },

  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    return !!(token || isAuthenticated);
  }
};