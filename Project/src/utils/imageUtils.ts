import type { ProductoResponse } from "../api/productApi";

/**
 * Obtiene la URL válida para la imagen de un producto.
 * Prioriza 'imagenUrl' y luego 'imagenes[0].url'.
 * Transforma URLs absolutas de localhost a relativas para usar el proxy si es necesario.
 */
export const getProductImage = (producto: ProductoResponse): string => {
    let url = "/Img/elementor-placeholder-image.png"; // Default

    if (producto.imagenUrl) {
        url = producto.imagenUrl;
    } else if (producto.imagenes && producto.imagenes.length > 0) {
        url = producto.imagenes[0].url;
    }

    // Limpieza de URLs
    // 1. Si la URL contiene '/api/', extraemos la parte relativa
    let relativeUrl = url;
    if (url.includes("/api/")) {
        const apiIndex = url.indexOf("/api/");
        relativeUrl = url.substring(apiIndex);
    }

    // 2. Decidir cómo devolver la URL según el entorno
    if (import.meta.env.DEV) {
        // En desarrollo, usamos el proxy (ruta relativa)
        return relativeUrl;
    } else {
        // En producción, usamos la URL completa del backend definida en .env
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        // Aseguramos que no haya doble slash //
        const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        return `${cleanBase}${relativeUrl}`;
    }
};
