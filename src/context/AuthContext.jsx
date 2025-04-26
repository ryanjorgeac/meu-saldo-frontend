import { createContext, useState, useEffect } from 'react';
import api from '../services/api';


const AuthContext = createContext({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {}
});

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({ 
    user: null,
    loading: true
  });

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setAuthState({ user: null, loading: false });
        return;
      }
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get('/api/v1/users/profile');

        setAuthState({ 
          user: response.data, 
          loading: false 
        });
      } catch (error) {
        localStorage.removeItem('authToken');
        api.defaults.headers.common['Authorization'] = null;
        setAuthState({ user: null, loading: false });
      }
    };

    verifyAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('authToken', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setAuthState({ user: userData, loading: false });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    api.defaults.headers.common['Authorization'] = null;
    setAuthState({ user: null, loading: false });
  };

  return (
    <AuthContext.Provider value={{ 
      user: authState.user, 
      loading: authState.loading, 
      login, 
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;