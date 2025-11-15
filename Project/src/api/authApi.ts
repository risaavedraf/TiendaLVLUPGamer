// Archivo: Project/src/api/authApi.ts
import axiosInstance from "./axiosConfig";

// ============================================
// TIPOS (TypeScript)
// ============================================

// Respuesta del login del backend
export interface LoginResponse {
  token: string;
  usuario: UsuarioResponse;
}

export interface UsuarioResponse {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  username?: string;
  fechaNacimiento?: string;
  roles: string[]; // Cambiar de 'rol' a 'roles' como array
}

// Datos para el login
export interface LoginRequest {
  email: string;
  password: string; // Cambiar de 'contrasenia' a 'password' para coincidir con el backend
}

// Datos para el registro
export interface RegistroRequest {
  username: string;
  email: string;
  password: string;
  name: string;
  lastName: string;
  birthDate: string; // Formato YYYY-MM-DD
}

// ============================================
// FUNCIONES API
// ============================================

/**
 * LOGIN - Iniciar sesión
 * POST /api/auth/login
 */
export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    "/auth/login",
    credentials
  );

  // Guardar el token en localStorage
  if (response.data.token) {
    localStorage.setItem("jwt_token", response.data.token);
    localStorage.setItem(
      "usuarioLogueado",
      JSON.stringify(response.data.usuario)
    );
  }

  return response.data;
};

/**
 * REGISTRO - Crear nueva cuenta
 * POST /api/auth/register
 */
export const registro = async (
  userData: RegistroRequest
): Promise<UsuarioResponse> => {
  const response = await axiosInstance.post<UsuarioResponse>(
    "/auth/register",
    userData
  );
  return response.data;
};

/**
 * OBTENER PERFIL - Datos del usuario actual
 * GET /api/usuarios/perfil
 */
export const getPerfil = async (): Promise<UsuarioResponse> => {
  const response = await axiosInstance.get<UsuarioResponse>("/usuarios/perfil");
  return response.data;
};

/**
 * ACTUALIZAR PERFIL - Modificar datos del usuario
 * PUT /api/usuarios/perfil
 */
export const updatePerfil = async (
  userData: Partial<UsuarioResponse>
): Promise<UsuarioResponse> => {
  const response = await axiosInstance.put<UsuarioResponse>(
    "/usuarios/perfil",
    userData
  );

  // Actualizar localStorage con los nuevos datos
  localStorage.setItem("usuarioLogueado", JSON.stringify(response.data));

  return response.data;
};

/**
 * LOGOUT - Cerrar sesión (solo limpia el localStorage)
 */
export const logout = (): void => {
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("usuarioLogueado");
};
