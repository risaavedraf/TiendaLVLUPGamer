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
  rolId: number;
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
 * GET /api/admin/usuarios/{id}
 */
export const getUsuarioById = async (id: number): Promise<UsuarioResponse> => {
  const response = await axiosInstance.get<UsuarioResponse>(`/admin/usuarios/${id}`);
  return response.data;
};

/**
 * ACTUALIZAR USUARIO (Admin)
 * PUT /api/admin/usuarios/{id}
 */
export const updateUsuario = async (id: number, usuario: UpdateProfileRequest): Promise<UsuarioResponse> => {
  const response = await axiosInstance.put<UsuarioResponse>(`/admin/usuarios/${id}`, usuario);
  return response.data;
};

/**
 * DESACTIVAR USUARIO (Admin)
 * PUT /api/admin/usuarios/{id}/desactivar
 */
export const desactivarUsuario = async (id: number): Promise<UsuarioResponse> => {
  const response = await axiosInstance.put<UsuarioResponse>(`/admin/usuarios/${id}/desactivar`);
  return response.data;
};

/**
 * ACTIVAR USUARIO (Admin)
 * PUT /api/admin/usuarios/{id}/activar
 */
export const activarUsuario = async (id: number): Promise<UsuarioResponse> => {
  const response = await axiosInstance.put<UsuarioResponse>(`/admin/usuarios/${id}/activar`);
  return response.data;
};

/**
 * ASIGNAR ROL A USUARIO (Admin)
 * POST /api/admin/usuarios/{id}/roles
 */
export const asignarRol = async (userId: number, rolId: number): Promise<UsuarioResponse> => {
  const response = await axiosInstance.post<UsuarioResponse>(`/admin/usuarios/${userId}/roles`, { rolId });
  return response.data;
};

/**
 * ELIMINAR ROL DE USUARIO (Admin)
 * DELETE /api/admin/usuarios/{userId}/roles/{rolId}
 */
export const removeRolFromUser = async (userId: number, rolId: number): Promise<UsuarioResponse> => {
  const response = await axiosInstance.delete<UsuarioResponse>(`/admin/usuarios/${userId}/roles/${rolId}`);
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
 * CREAR ROL (Admin)
 * POST /api/roles
 */
export const createRol = async (nombre: string): Promise<RolResponse> => {
  const response = await axiosInstance.post<RolResponse>('/roles', { nombre });
  return response.data;
};

/**
 * ELIMINAR ROL (Admin)
 * DELETE /api/roles/{id}
 */
export const deleteRol = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/roles/${id}`);
};

/**
 * OBTENER ESTADÍSTICAS DE USUARIOS (Admin)
 * GET /api/admin/usuarios/estadisticas
 */
export const getUsuariosEstadisticas = async (): Promise<{
  totalUsuarios: number;
  usuariosActivos: number;
  nuevosMesActual: number;
}> => {
  const response = await axiosInstance.get('/admin/usuarios/estadisticas');
  return response.data;
};
