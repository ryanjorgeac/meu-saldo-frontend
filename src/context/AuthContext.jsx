import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const getInitialAuthState = () => {
  return { 
    user: null,
    loading: true
  };
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getInitialAuthState);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setAuthState({ user: null, loading: false });
        return;
      }
      
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get('/api/user/profile');
        setAuthState({ 
          user: response.data.user, 
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

  const testLoading = () => {
    setAuthState({ ...authState, loading: true });
    setTimeout(() => {
      setAuthState({ ...authState, loading: false });
    }, 3000);
  };

  return (
    <AuthContext.Provider value={{ 
      user: authState.user, 
      loading: authState.loading, 
      login, 
      logout,
      testLoading // Add this for testing
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;