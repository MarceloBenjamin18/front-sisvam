import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [loginResponse, setLoginResponse] = useState(null);
  const [requiresPasswordChange, setRequiresPasswordChange] = useState(false);
  const [passwordExpired, setPasswordExpired] = useState(false);

  const validateUserData = (userData) => {
    if (!userData || typeof userData !== 'object') return null;
    const requiredFields = ['id', 'nombres', 'apellidos', 'ci', 'email', 'rol'];
    const isValid = requiredFields.every(field => field in userData);
    return isValid ? userData : null;
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const profileData = authService.getProfileData();
          const validUser = validateUserData(profileData.user);
          if (!validUser) {
            console.error('❌ Datos de usuario no válidos');
            await authService.logout();
            return;
          }
          
          setUser(validUser);
          setToken(profileData.token || null);
          setLoginResponse(profileData.loginResponse || null);
          setRequiresPasswordChange(profileData.requiresPasswordChange || false);
          setPasswordExpired(profileData.passwordExpired || false);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('❌ Error verificando autenticación:', error);
        await authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const result = await authService.login(credentials);
      
      if (result.success) {
        const validUser = validateUserData(result.user);
        if (!validUser) {
          throw new Error('Datos de usuario no válidos recibidos del servidor');
        }
        
        setUser(validUser);
        setToken(result.token || null);
        setLoginResponse(result.loginResponse || result);
        setRequiresPasswordChange(validUser.requiere_cambio_password === 1);
        setPasswordExpired(validUser.password_vencida === 1);
        setIsAuthenticated(true);
        
        return { 
          success: true, 
          message: result.message,
          requiresPasswordChange: validUser.requiere_cambio_password === 1,
          passwordExpired: validUser.password_vencida === 1
        };
      }
      return { success: false, message: result.message };
    } catch (error) {
      console.error('❌ Error en login del contexto:', error);
      return { 
        success: false, 
        message: error.message || 'Error de conexión' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('⚠️ Error en logout:', error);
    }
    
    setUser(null);
    setToken(null);
    setLoginResponse(null);
    setRequiresPasswordChange(false);
    setPasswordExpired(false);
    setIsAuthenticated(false);
  };

  const updateUser = (newUserData) => {
    const updatedUser = authService.updateUser(newUserData);
    if (updatedUser) {
      const validUser = validateUserData(updatedUser);
      if (validUser) {
        setUser(validUser);
        setRequiresPasswordChange(validUser.requiere_cambio_password === 1);
        setPasswordExpired(validUser.password_vencida === 1);
        
        if (loginResponse) {
          setLoginResponse({
            ...loginResponse,
            user: validUser
          });
        }
      }
    }
    return updatedUser;
  };

  const authenticatedRequest = async (url, options = {}) => {
    try {
      return await authService.authenticatedRequest(url, options);
    } catch (error) {
      if (error.message === 'Token expirado') {
        await logout();
      }
      throw error;
    }
  };

  const debugAuth = () => {
    console.group('AuthContext Debug');
    console.log('Context State:', {
      user,
      token,
      isAuthenticated,
      loading,
      requiresPasswordChange,
      passwordExpired
    });
    
    if (authService && typeof authService.debugStoredData === 'function') {
      try {
        authService.debugStoredData();
      } catch (error) {
        console.error('Error calling authService.debugStoredData:', error);
      }
    }
    console.groupEnd();
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    token,
    loginResponse,
    requiresPasswordChange,
    passwordExpired,
    login,
    logout,
    updateUser,
    authenticatedRequest,
    debugAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};