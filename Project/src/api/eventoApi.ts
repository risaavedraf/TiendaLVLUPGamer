// Archivo: Project/src/api/eventoApi.ts
import axiosInstance from './axiosConfig';
import type { PageResponse } from './productApi';

// ============================================
// TIPOS (TypeScript)
// ============================================

export interface EventoResponse {
  id: number;
  name: string;
  description: string;
  date: string; // ISO string format
  locationName: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventoRequest {
  name: string;
  description: string;
  date: string; // ISO string format
  locationName: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
}

export interface UpdateEventoRequest {
  name?: string;
  description?: string;
  date?: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
}

// ============================================
// FUNCIONES API - EVENTOS
// ============================================

/**
 * OBTENER TODOS LOS EVENTOS (con paginación)
 * GET /api/eventos?page=0&size=20
 */
export const getEventos = async (
  page: number = 0,
  size: number = 20,
  query?: string
): Promise<PageResponse<EventoResponse>> => {
  const params: any = { page, size };
  if (query) params.query = query;
  
  const response = await axiosInstance.get<PageResponse<EventoResponse>>('/eventos', { params });
  return response.data;
};

/**
 * OBTENER EVENTO POR ID
 * GET /api/eventos/{id}
 */
export const getEventoById = async (id: number): Promise<EventoResponse> => {
  const response = await axiosInstance.get<EventoResponse>(`/eventos/${id}`);
  return response.data;
};

/**
 * CREAR EVENTO (Admin)
 * POST /api/admin/eventos
 */
export const createEvento = async (evento: CreateEventoRequest): Promise<EventoResponse> => {
  const response = await axiosInstance.post<EventoResponse>('/admin/eventos', evento);
  return response.data;
};

/**
 * ACTUALIZAR EVENTO (Admin)
 * PUT /api/admin/eventos/{id}
 */
export const updateEvento = async (id: number, evento: UpdateEventoRequest): Promise<EventoResponse> => {
  const response = await axiosInstance.put<EventoResponse>(`/admin/eventos/${id}`, evento);
  return response.data;
};

/**
 * ELIMINAR EVENTO (Admin)
 * DELETE /api/admin/eventos/{id}
 */
export const deleteEvento = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/admin/eventos/${id}`);
};
