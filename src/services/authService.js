// src/services/authService.js
// URL directa mientras solucionamos el proxy
const API_BASE_URL = 'http://localhost:8081/api';

export const authService = {
  // Función para hacer login
  async login(credentials) {
    try {
      console.log('🚀 Intentando login con:', { ci: credentials.ci });
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ci: credentials.ci,
          password: credentials.password
        }),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      // Verificar si la respuesta es JSON válido
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('❌ Response is not JSON:', textResponse);
        throw new Error(`Error del servidor (${response.status}): Respuesta no válida`);
      }

      const data = await response.json();
      console.log('📊 Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || `Error HTTP ${response.status}`);
      }

      if (data.success) {
        // Guardar token y datos del usuario en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('tokenExpiry', Date.now() + (8 * 60 * 60 * 1000)); // 8 horas
        
        console.log('✅ Login exitoso');
        return {
          success: true,
          user: data.user,
          token: data.token,
          message: data.message
        };
      }

      return {
        success: false,
        message: data.message || 'Error desconocido'
      };

    } catch (error) {
      console.error('❌ Error en login:', error);
      
      // Determinar el tipo de error para dar mejor feedback
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return {
          success: false,
          message: 'Error de conexión. Verifica que el servidor esté funcionando.'
        };
      }
      
      return {
        success: false,
        message: error.message || 'Error de conexión'
      };
    }
  },

  // Función para logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
  },

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    
    if (!token || !tokenExpiry) {
      return false;
    }

    // Verificar si el token ha expirado
    if (Date.now() > parseInt(tokenExpiry)) {
      this.logout();
      return false;
    }

    return true;
  },

  // Obtener datos del usuario actual
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Obtener token actual
  getToken() {
    return localStorage.getItem('token');
  }
};