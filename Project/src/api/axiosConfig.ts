// Archivo: Project/src/api/axiosConfig.ts
import axios from 'axios';

// URL base del backend - Cambiar según tu configuración
// Si tu backend está en AWS, reemplaza con la URL de AWS
// Ejemplo: 'https://tu-api.amazonaws.com/api' o 'http://tu-ip-aws:8080/api'
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Crear instancia de Axios con configuración por defecto
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor de PETICIONES: Agrega el token JWT automáticamente
axiosInstance.interceptors.request.use(
  (config) => {
    // Obtener el token del localStorage
    const token = localStorage.getItem('jwt_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de RESPUESTAS: Maneja errores comunes
axiosInstance.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, retornarla tal cual
    return response;
  },
  (error) => {
    // Manejo centralizado de errores
    
    if (error.response) {
      // El servidor respondió con un código de error
      switch (error.response.status) {
        case 401:
          // No autorizado - Token inválido o expirado
          console.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('usuarioLogueado');
          // Redirigir al login (se puede mejorar con React Router)
          window.location.href = '/login';
          break;
          
        case 403:
          // Prohibido - No tiene permisos
          console.error('No tienes permisos para realizar esta acción.');
          break;
          
        case 404:
          // No encontrado
          console.error('Recurso no encontrado.');
          break;
          
        case 409:
          // Conflicto - Email o username ya existe
          console.error('El email o nombre de usuario ya está registrado.');
          break;
          
        case 500:
          // Error del servidor
          console.error('Error interno del servidor. Intenta más tarde.');
          break;
          
        default:
          console.error('Error en la petición:', error.response.data);
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('No se pudo conectar con el servidor. Verifica tu conexión.');
    } else {
      // Algo más salió mal
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { API_BASE_URL };
