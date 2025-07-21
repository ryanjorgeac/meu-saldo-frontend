import { createContext, useState, useEffect, useCallback } from 'react';
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

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem('authToken');
    api.defaults.headers.common['Authorization'] = null;
    setAuthState({ user: null, loading: false });

    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [handleUnauthorized]);

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

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' && !e.newValue) {
        api.defaults.headers.common['Authorization'] = null;
        setAuthState({ user: null, loading: false });

        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const token = localStorage.getItem('authToken');
    if (!token && authState.user) {
      setAuthState({ user: null, loading: false });
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [authState.user]);

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