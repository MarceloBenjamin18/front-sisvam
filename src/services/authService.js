const API_BASE_URL = 'http://localhost:8081/api';

// Helper functions
const getLocalStorageItem = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return null;
  }
};

const setLocalStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
  }
};

// Core functions
const getToken = () => getLocalStorageItem('token');

const getCurrentUser = () => {
  const userStr = getLocalStorageItem('user');
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

const getLoginResponse = () => {
  const responseStr = getLocalStorageItem('loginResponse');
  try {
    return responseStr ? JSON.parse(responseStr) : null;
  } catch (error) {
    console.error('Error parsing login response:', error);
    return null;
  }
};

const storeLoginData = (loginResponse) => {
  if (!loginResponse) return;
  
  try {
    setLocalStorageItem('loginResponse', JSON.stringify(loginResponse));
    setLocalStorageItem('token', loginResponse.token || '');
    setLocalStorageItem('user', JSON.stringify(loginResponse.user || {}));
    
    const expirationTime = Date.now() + (8 * 60 * 60 * 1000);
    setLocalStorageItem('tokenExpiry', expirationTime.toString());
    
    if (loginResponse.user) {
      setLocalStorageItem(
        'requiresPasswordChange', 
        String(loginResponse.user.requiere_cambio_password === 1)
      );
      setLocalStorageItem(
        'passwordExpired', 
        String(loginResponse.user.password_vencida === 1)
      );
    }
  } catch (error) {
    console.error('Error storing login data:', error);
  }
};

const requiresPasswordChange = () => {
  return getLocalStorageItem('requiresPasswordChange') === 'true';
};

const isPasswordExpired = () => {
  return getLocalStorageItem('passwordExpired') === 'true';
};

const getProfileData = () => ({
  user: getCurrentUser(),
  token: getToken(),
  loginResponse: getLoginResponse(),
  requiresPasswordChange: requiresPasswordChange(),
  passwordExpired: isPasswordExpired()
});

const isAuthenticated = () => {
  const token = getToken();
  const tokenExpiry = getLocalStorageItem('tokenExpiry');
  
  if (!token || !tokenExpiry) return false;

  if (Date.now() > parseInt(tokenExpiry)) {
    logoutLocal();
    return false;
  }

  return true;
};

const logout = async () => {
  const token = getToken();
  
  if (token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        console.warn('Logout server error, proceeding with local cleanup');
      }
    } catch (error) {
      console.error('Error during server logout:', error);
    }
  }

  clearAllData();
};

const logoutLocal = () => {
  clearAllData();
};

const clearAllData = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('loginResponse');
    localStorage.removeItem('requiresPasswordChange');
    localStorage.removeItem('passwordExpired');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

const authenticatedRequest = async (url, options = {}) => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const defaultOptions = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, { ...options, ...defaultOptions });
    
    if (response.status === 401) {
      logoutLocal();
      throw new Error('Token expirado');
    }
    
    return response;
  } catch (error) {
    console.error('Error en petición autenticada:', error);
    throw error;
  }
};

const updateUser = (newUserData) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  try {
    const updatedUser = { ...currentUser, ...newUserData };
    setLocalStorageItem('user', JSON.stringify(updatedUser));
    
    const loginResponse = getLoginResponse();
    if (loginResponse) {
      const updatedLoginResponse = {
        ...loginResponse,
        user: updatedUser
      };
      setLocalStorageItem('loginResponse', JSON.stringify(updatedLoginResponse));
    }
    
    if ('requiere_cambio_password' in newUserData) {
      setLocalStorageItem(
        'requiresPasswordChange', 
        String(newUserData.requiere_cambio_password === 1)
      );
    }
    
    if ('password_vencida' in newUserData) {
      setLocalStorageItem(
        'passwordExpired', 
        String(newUserData.password_vencida === 1)
      );
    }
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

const login = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ci: credentials.ci,
        password: credentials.password
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      storeLoginData(data);
      return {
        success: true,
        user: data.user,
        token: data.token,
        message: data.message,
        loginResponse: data
      };
    }

    return {
      success: false,
      message: data.message || 'Error desconocido'
    };
  } catch (error) {
    console.error('Error en login:', error);
    return {
      success: false,
      message: error.message || 'Error de conexión'
    };
  }
};

const debugStoredData = () => {
  console.group('authService Debug');
  console.log('Token:', getToken());
  console.log('User:', getCurrentUser());
  console.log('LoginResponse:', getLoginResponse());
  console.log('RequiresPasswordChange:', requiresPasswordChange());
  console.log('PasswordExpired:', isPasswordExpired());
  console.log('IsAuthenticated:', isAuthenticated());
  console.groupEnd();
};

export const authService = {
  login,
  storeLoginData,
  getLoginResponse,
  requiresPasswordChange,
  isPasswordExpired,
  getProfileData,
  logout,
  logoutLocal,
  clearAllData,
  isAuthenticated,
  getCurrentUser,
  getToken,
  authenticatedRequest,
  updateUser,
  debugStoredData
};