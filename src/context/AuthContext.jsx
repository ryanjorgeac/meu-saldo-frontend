import { createContext, useState, useEffect } from 'react';

const getInitialAuthState = () => {
  const token = localStorage.getItem('authToken');
  return { 
    user: token ? { token } : null,
    loading: false
  };
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getInitialAuthState);

  // Use this for token verification with backend if needed
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Optional: Verify token with backend
          // const response = await fetch('/api/verify-token', {
          //   headers: { 'Authorization': `Bearer ${token}` }
          // });
          // if (!response.ok) throw new Error('Invalid token');
          
          // If verification successful, update user state
          // const userData = await response.json();
          // setAuthState(prev => ({ ...prev, user: userData, loading: false })
        } catch (error) {
          // If token is invalid, clear it
          localStorage.removeItem('authToken');
          setAuthState({ user: null, loading: false });
        }
      }
    };

    // Only run verification if you need backend verification
    // verifyToken();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('authToken', token);
    setAuthState({ user: userData, loading: false });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthState({ user: null, loading: false });
  };

  return (
    <AuthContext.Provider value={{ 
      user: authState.user, 
      loading: authState.loading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;