// Archivo: Project/src/api/reviewApi.ts
import axiosInstance from './axiosConfig';

// ============================================
// TIPOS (TypeScript)
// ============================================

export interface ReviewResponse {
  id: number;
  usuarioNombre: string;
  productoId: number;
  calificacion: number; // 1-5
  comentario: string;
  fecha: string;
  verificado: boolean; // Si el usuario compró el producto
}

export interface ReviewRequest {
  productoId: number;
  calificacion: number;
  comentario: string;
}

export interface ReviewStats {
  promedioCalificacion: number;
  totalReviews: number;
  distribucion: {
    estrellas5: number;
    estrellas4: number;
    estrellas3: number;
    estrellas2: number;
    estrellas1: number;
  };
}

// ============================================
// FUNCIONES API - REVIEWS
// ============================================

/**
 * OBTENER REVIEWS DE UN PRODUCTO
 * GET /api/productos/{productoId}/reviews
 */
export const getProductoReviews = async (productoId: number): Promise<ReviewResponse[]> => {
  const response = await axiosInstance.get<ReviewResponse[]>(`/productos/${productoId}/reviews`);
  return response.data;
};

/**
 * OBTENER ESTADÍSTICAS DE REVIEWS DE UN PRODUCTO
 * GET /api/productos/{productoId}/reviews/stats
 */
export const getProductoReviewStats = async (productoId: number): Promise<ReviewStats> => {
  const response = await axiosInstance.get<ReviewStats>(`/productos/${productoId}/reviews/stats`);
  return response.data;
};

/**
 * CREAR REVIEW
 * POST /api/reviews
 */
export const createReview = async (review: ReviewRequest): Promise<ReviewResponse> => {
  const response = await axiosInstance.post<ReviewResponse>('/reviews', review);
  return response.data;
};

/**
 * ACTUALIZAR REVIEW
 * PUT /api/reviews/{id}
 */
export const updateReview = async (id: number, review: Partial<ReviewRequest>): Promise<ReviewResponse> => {
  const response = await axiosInstance.put<ReviewResponse>(`/reviews/${id}`, review);
  return response.data;
};

/**
 * ELIMINAR REVIEW
 * DELETE /api/reviews/{id}
 */
export const deleteReview = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/reviews/${id}`);
};

/**
 * OBTENER MIS REVIEWS
 * GET /api/reviews/mis-reviews
 */
export const getMisReviews = async (): Promise<ReviewResponse[]> => {
  const response = await axiosInstance.get<ReviewResponse[]>('/reviews/mis-reviews');
  return response.data;
};
