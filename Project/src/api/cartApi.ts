// Archivo: Project/src/api/cartApi.ts
import axiosInstance from './axiosConfig';
import type { ProductoResponse } from './productApi';

// ============================================
// TIPOS (TypeScript)
// ============================================

export interface CarritoItemResponse {
  id: number;
  producto: ProductoResponse;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface CarritoResponse {
  id: number;
  items: CarritoItemResponse[];
  total: number;
}

export interface AddCarritoItemRequest {
  productoId: number;
  cantidad: number;
}

export interface UpdateCarritoItemRequest {
  cantidad: number;
}

// ============================================
// FUNCIONES API - CARRITO
// ============================================

/**
 * OBTENER CARRITO ACTUAL
 * GET /api/carrito
 */
export const getCarrito = async (): Promise<CarritoResponse> => {
  const response = await axiosInstance.get<CarritoResponse>('/carrito');
  return response.data;
};

/**
 * AGREGAR PRODUCTO AL CARRITO
 * POST /api/carrito/items
 */
export const addItemCarrito = async (item: AddCarritoItemRequest): Promise<CarritoResponse> => {
  const response = await axiosInstance.post<CarritoResponse>('/carrito/items', item);
  return response.data;
};

/**
 * ACTUALIZAR CANTIDAD DE UN ITEM
 * PUT /api/carrito/items/{itemId}
 */
export const updateItemCarrito = async (itemId: number, cantidad: number): Promise<CarritoResponse> => {
  const response = await axiosInstance.put<CarritoResponse>(`/carrito/items/${itemId}`, { cantidad });
  return response.data;
};

/**
 * ELIMINAR ITEM DEL CARRITO
 * DELETE /api/carrito/items/{itemId}
 */
export const removeItemCarrito = async (itemId: number): Promise<CarritoResponse> => {
  const response = await axiosInstance.delete<CarritoResponse>(`/carrito/items/${itemId}`);
  return response.data;
};

/**
 * VACIAR CARRITO
 * DELETE /api/carrito
 */
export const clearCarrito = async (): Promise<void> => {
  await axiosInstance.delete('/carrito');
};

/**
 * APLICAR CUPÓN
 * POST /api/carrito/cupon
 */
export const aplicarCupon = async (codigoCupon: string): Promise<CarritoResponse> => {
  const response = await axiosInstance.post<CarritoResponse>('/carrito/cupon', { codigo: codigoCupon });
  return response.data;
};
