// Archivo: Project/src/api/index.ts
// Exportar todas las APIs desde un solo archivo para facilitar imports

// Configuración base
export { default as axiosInstance, API_BASE_URL } from './axiosConfig';

// Auth API
export * from './authApi';

// Product API
export * from './productApi';

// Cart API
export * from './cartApi';

// Order API
export * from './orderApi';

// Review API
export * from './reviewApi';

// User API
export * from './userApi';

// Evento API
export * from './eventoApi';
