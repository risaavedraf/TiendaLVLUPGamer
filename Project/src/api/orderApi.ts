// Archivo: Project/src/api/orderApi.ts
import axiosInstance from './axiosConfig';
import type { PageResponse } from './productApi';

// ============================================
// TIPOS (TypeScript)
// ============================================

export interface DireccionRequest {
  calle: string;
  numero: string;
  comuna: string;
  ciudad: string;
  region: string;
  codigoPostal?: string;
  indicaciones?: string;
}

export interface DireccionResponse extends DireccionRequest {
  id: number;
}

export interface CheckoutItemRequest {
  productId: number;
  quantity: number;
}

export interface CheckoutRequest {
  items: CheckoutItemRequest[];
  direccionId: number;
}

export interface DetallePedidoResponse {
  id: number;
  productoNombre: string;
  productoImagen: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface PedidoResponse {
  id: number;
  numeroPedido: string;
  fecha: string;
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'EN_PREPARACION' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';
  total: number;
  subtotal: number;
  descuento: number;
  envio: number;
  direccionEnvio: DireccionResponse;
  detalles: DetallePedidoResponse[];
  metodoPago: string;
}

export interface UpdatePedidoEstadoRequest {
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'EN_PREPARACION' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';
}

// ============================================
// FUNCIONES API - PEDIDOS
// ============================================

/**
 * CREAR PEDIDO (Checkout)
 * POST /api/pedidos/checkout
 */
export const createPedido = async (checkout: CheckoutRequest): Promise<PedidoResponse> => {
  const response = await axiosInstance.post<PedidoResponse>('/pedidos/checkout', checkout);
  return response.data;
};

/**
 * OBTENER MIS PEDIDOS
 * GET /api/pedidos/mis-pedidos
 */
export const getMisPedidos = async (page: number = 0, size: number = 10): Promise<PageResponse<PedidoResponse>> => {
  const response = await axiosInstance.get<PageResponse<PedidoResponse>>('/pedidos/mis-pedidos', {
    params: { page, size }
  });
  return response.data;
};

/**
 * OBTENER PEDIDO POR ID
 * GET /api/pedidos/{id}
 */
export const getPedidoById = async (id: number): Promise<PedidoResponse> => {
  const response = await axiosInstance.get<PedidoResponse>(`/pedidos/${id}`);
  return response.data;
};

/**
 * CANCELAR PEDIDO
 * PUT /api/pedidos/{id}/cancelar
 */
export const cancelarPedido = async (id: number): Promise<PedidoResponse> => {
  const response = await axiosInstance.put<PedidoResponse>(`/pedidos/${id}/cancelar`);
  return response.data;
};

// ============================================
// FUNCIONES API - PEDIDOS (ADMIN)
// ============================================

/**
 * OBTENER TODOS LOS PEDIDOS (Admin)
 * GET /api/admin/pedidos
 */
export const getAllPedidos = async (
  page: number = 0,
  size: number = 20,
  estado?: string
): Promise<PageResponse<PedidoResponse>> => {
  const params: any = { page, size };
  if (estado) params.estado = estado;

  const response = await axiosInstance.get<PageResponse<PedidoResponse>>('/admin/pedidos', { params });
  return response.data;
};

/**
 * ACTUALIZAR ESTADO DEL PEDIDO (Admin)
 * PUT /api/admin/pedidos/{id}/estado
 */
export const updatePedidoEstado = async (id: number, estado: UpdatePedidoEstadoRequest): Promise<PedidoResponse> => {
  const response = await axiosInstance.put<PedidoResponse>(`/admin/pedidos/${id}/estado`, estado);
  return response.data;
};

// ============================================
// FUNCIONES API - DIRECCIONES
// ============================================

/**
 * OBTENER MIS DIRECCIONES
 * GET /api/direcciones
 */
export const getMisDirecciones = async (): Promise<DireccionResponse[]> => {
  const response = await axiosInstance.get<DireccionResponse[]>('/direcciones');
  return response.data;
};

/**
 * CREAR DIRECCIÓN
 * POST /api/direcciones
 */
export const createDireccion = async (direccion: DireccionRequest): Promise<DireccionResponse> => {
  const response = await axiosInstance.post<DireccionResponse>('/direcciones', direccion);
  return response.data;
};

/**
 * ACTUALIZAR DIRECCIÓN
 * PUT /api/direcciones/{id}
 */
export const updateDireccion = async (id: number, direccion: DireccionRequest): Promise<DireccionResponse> => {
  const response = await axiosInstance.put<DireccionResponse>(`/direcciones/${id}`, direccion);
  return response.data;
};

/**
 * ELIMINAR DIRECCIÓN
 * DELETE /api/direcciones/{id}
 */
export const deleteDireccion = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/direcciones/${id}`);
};
