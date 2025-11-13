// Archivo: Project/src/api/userApi.ts
import axiosInstance from './axiosConfig';
import type { PageResponse } from './productApi';

// ============================================
// TIPOS (TypeScript)
// ============================================

export interface RolResponse {
  id: number;
  nombre: string; // "ADMIN", "USUARIO", "VENDEDOR"
}

export interface UsuarioResponse {
  id: number;
  username?: string;
  nombre?: string;
  name?: string;
  apellido?: string;
  lastName?: string;
  email: string;
  run?: string;
  direccion?: string;
  roles: string[]; // Cambiar de rol a roles como array
  activo?: boolean;
  fechaRegistro?: string;
  birthDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UsuarioPedidoResponse {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  totalPedidos: number;
  totalGastado: number;
}

export interface UpdateProfileRequest {
  nombre?: string;
  apellido?: string;
  run?: string;
  direccion?: string;
}

export interface AsignarRolRequest {
  usuarioId: number;
  rolNombre: string; // "ADMIN", "USUARIO", "VENDEDOR"
}

// ============================================
// FUNCIONES API - USUARIOS (ADMIN)
// ============================================

/**
 * OBTENER TODOS LOS USUARIOS (Admin)
 * GET /api/admin/usuarios
 */
export const getAllUsuarios = async (
  page: number = 0,
  size: number = 20,
  search?: string
): Promise<PageResponse<UsuarioResponse>> => {
  const params: any = { page, size };
  if (search) params.search = search;
  
  const response = await axiosInstance.get<PageResponse<UsuarioResponse>>('/admin/usuarios', { params });
  return response.data;
};

/**
 * OBTENER USUARIO POR ID (Admin)
 * GET /api/usuarios/{id}
 */
export const getUsuarioById = async (id: number): Promise<UsuarioResponse> => {
  const response = await axiosInstance.get<UsuarioResponse>(`/usuarios/${id}`);
  return response.data;
};

/**
 * ACTUALIZAR USUARIO (Admin)
 * PUT /api/usuarios/{id}
 */
export const updateUsuario = async (id: number, usuario: UpdateProfileRequest): Promise<UsuarioResponse> => {
  const response = await axiosInstance.put<UsuarioResponse>(`/usuarios/${id}`, usuario);
  return response.data;
};

/**
 * DESACTIVAR USUARIO (Admin)
 * PUT /api/usuarios/{id}/desactivar
 */
export const desactivarUsuario = async (id: number): Promise<UsuarioResponse> => {
  const response = await axiosInstance.put<UsuarioResponse>(`/usuarios/${id}/desactivar`);
  return response.data;
};

/**
 * ACTIVAR USUARIO (Admin)
 * PUT /api/usuarios/{id}/activar
 */
export const activarUsuario = async (id: number): Promise<UsuarioResponse> => {
  const response = await axiosInstance.put<UsuarioResponse>(`/usuarios/${id}/activar`);
  return response.data;
};

/**
 * ASIGNAR ROL A USUARIO (Admin)
 * POST /api/usuarios/asignar-rol
 */
export const asignarRol = async (request: AsignarRolRequest): Promise<UsuarioResponse> => {
  const response = await axiosInstance.post<UsuarioResponse>('/usuarios/asignar-rol', request);
  return response.data;
};

/**
 * OBTENER TODOS LOS ROLES (Admin)
 * GET /api/roles
 */
export const getRoles = async (): Promise<RolResponse[]> => {
  const response = await axiosInstance.get<RolResponse[]>('/roles');
  return response.data;
};

/**
 * OBTENER ESTADÍSTICAS DE USUARIOS (Admin)
 * GET /api/usuarios/estadisticas
 */
export const getUsuariosEstadisticas = async (): Promise<{
  totalUsuarios: number;
  usuariosActivos: number;
  nuevosMesActual: number;
}> => {
  const response = await axiosInstance.get('/usuarios/estadisticas');
  return response.data;
};
