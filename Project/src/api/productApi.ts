// Archivo: Project/src/api/productApi.ts
import axiosInstance from './axiosConfig';

// ============================================
// TIPOS (TypeScript)
// ============================================

export interface CategoriaResponse {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface ProductoImagenResponse {
  id: number;
  url: string;
  esPrincipal: boolean;
}

export interface ProductoResponse {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: CategoriaResponse;
  imagenes: ProductoImagenResponse[];
  imagenUrl?: string; // URL directa de imagen (alternativa)
  activo: boolean;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface CreateProductoRequest {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoriaId: number;
  imagenes?: string[]; // URLs de imágenes
}

export interface UpdateProductoRequest {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
  categoriaId?: number;
  activo?: boolean;
}

export interface CreateCategoriaRequest {
  nombre: string;
  descripcion?: string;
}

// ============================================
// FUNCIONES API - PRODUCTOS
// ============================================

/**
 * OBTENER TODOS LOS PRODUCTOS (con paginación)
 * GET /api/productos?page=0&size=20
 */
export const getProductos = async (
  page: number = 0,
  size: number = 20,
  categoriaId?: number,
  search?: string
): Promise<PageResponse<ProductoResponse>> => {
  const params: any = { page, size };
  if (categoriaId) params.categoriaId = categoriaId;
  if (search) params.search = search;
  
  const response = await axiosInstance.get<PageResponse<ProductoResponse>>('/productos', { params });
  return response.data;
};

/**
 * OBTENER PRODUCTO POR ID
 * GET /api/productos/{id}
 */
export const getProductoById = async (id: number): Promise<ProductoResponse> => {
  const response = await axiosInstance.get<ProductoResponse>(`/productos/${id}`);
  return response.data;
};

/**
 * CREAR PRODUCTO (Admin)
 * POST /api/admin/productos
 */
export const createProducto = async (producto: CreateProductoRequest): Promise<ProductoResponse> => {
  const response = await axiosInstance.post<ProductoResponse>('/admin/productos', producto);
  return response.data;
};

/**
 * ACTUALIZAR PRODUCTO (Admin)
 * PUT /api/admin/productos/{id}
 */
export const updateProducto = async (id: number, producto: UpdateProductoRequest): Promise<ProductoResponse> => {
  const response = await axiosInstance.put<ProductoResponse>(`/admin/productos/${id}`, producto);
  return response.data;
};

/**
 * ELIMINAR PRODUCTO (Admin)
 * DELETE /api/admin/productos/{id}
 */
export const deleteProducto = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/admin/productos/${id}`);
};

/**
 * OBTENER PRODUCTOS DESTACADOS
 * GET /api/productos/destacados
 */
export const getProductosDestacados = async (): Promise<ProductoResponse[]> => {
  const response = await axiosInstance.get<ProductoResponse[]>('/productos/destacados');
  return response.data;
};

// ============================================
// FUNCIONES API - CATEGORÍAS
// ============================================

/**
 * OBTENER TODAS LAS CATEGORÍAS
 * GET /api/categorias
 */
export const getCategorias = async (page: number = 0, size: number = 100): Promise<CategoriaResponse[]> => {
  const response = await axiosInstance.get<PageResponse<CategoriaResponse>>('/categorias', {
    params: { page, size }
  });
  return response.data.content;
};

/**
 * OBTENER CATEGORÍA POR ID
 * GET /api/categorias/{id}
 */
export const getCategoriaById = async (id: number): Promise<CategoriaResponse> => {
  const response = await axiosInstance.get<CategoriaResponse>(`/categorias/${id}`);
  return response.data;
};

/**
 * CREAR CATEGORÍA (Admin)
 * POST /api/categorias
 */
export const createCategoria = async (categoria: CreateCategoriaRequest): Promise<CategoriaResponse> => {
  const response = await axiosInstance.post<CategoriaResponse>('/categorias', categoria);
  return response.data;
};

/**
 * ACTUALIZAR CATEGORÍA (Admin)
 * PUT /api/categorias/{id}
 */
export const updateCategoria = async (id: number, categoria: CreateCategoriaRequest): Promise<CategoriaResponse> => {
  const response = await axiosInstance.put<CategoriaResponse>(`/categorias/${id}`, categoria);
  return response.data;
};

/**
 * ELIMINAR CATEGORÍA (Admin)
 * DELETE /api/categorias/{id}
 */
export const deleteCategoria = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/categorias/${id}`);
};
