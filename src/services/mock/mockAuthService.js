import { mockUser, simulateDelay } from './mockData';

// In-memory storage for auth state
let currentUser = null;
let isAuthenticated = false;

export const mockAuthService = {
  register: async (userData) => {
    await simulateDelay(800);

    // Validate required fields
    if (!userData.name?.trim()) {
    throw new Error("Nome é obrigatório");
    }
    
    if (!userData.email?.trim()) {
    throw new Error("E-mail é obrigatório");
    }
    
    if (!userData.password || userData.password.length < 6) {
    throw new Error("Senha deve ter pelo menos 6 caracteres");
    }
    
    // Simulate email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
    throw new Error("E-mail inválido");
    }
    
    // Simulate checking if email already exists
    if (userData.email === "admin@example.com") {
    throw new Error("Não foi possível cadastrar o usuário com esse e-mail.");
    }
    
    // Create user
    const newUser = {
    id: Date.now(),
    name: userData.name.trim(),
    email: userData.email.trim().toLowerCase(),
    createdAt: new Date().toISOString()
    };
    
    // Simulate JWT token
    const token = `mock-jwt-token-${Date.now()}`;
    
    // Set as current user
    currentUser = newUser;
    isAuthenticated = true;
    
    // Store in localStorage for persistence
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
    
    // Simulate authentication (accept any email/password except specific cases)
    if (credentials.email === "invalid@example.com") {
    throw new Error("E-mail ou senha inválidos.");
    }
    
    // Create mock user
    const user = {
    ...mockUser,
    email: credentials.email.trim().toLowerCase()
    };
    
    // Simulate JWT token
    const token = `mock-jwt-token-${Date.now()}`;
    
    // Set as current user
    currentUser = user;
    isAuthenticated = true;
    
    // Store in localStorage for persistence
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
      // Clear current user
      currentUser = null;
      isAuthenticated = false;
      
      // Clear localStorage
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

    // Validate email
    if (!email?.trim()) {
    throw new Error("E-mail é obrigatório");
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
    throw new Error("E-mail inválido");
    }
    
    // Simulate checking if email exists
    if (email === "notfound@example.com") {
    throw new Error("E-mail não encontrado em nossa base de dados.");
    }
    
    return {
    message: "Instruções de redefinição de senha enviadas para o e-mail"
    };
  },

  resetPassword: async (token, newPassword) => {
    await simulateDelay(500);

    // Validate fields
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

    // Check localStorage for persisted auth
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