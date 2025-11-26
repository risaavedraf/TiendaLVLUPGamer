import type { ProductoResponse } from "../api/productApi";

/**
 * Obtiene la URL válida para la imagen de un producto.
 * Prioriza 'imagenUrl' y luego 'imagenes[0].url'.
 * Transforma URLs absolutas de localhost a relativas para usar el proxy si es necesario.
 */
/**
 * Procesa y corrige una URL de imagen (o string base64).
 * Maneja base64 sin prefijo, limpieza de /api/, y URLs absolutas en producción.
 */
export const fixImageUrl = (url: string | undefined): string => {
    if (!url) return "/Img/elementor-placeholder-image.png";

    // 0. Si es base64 (data:image...) devolver tal cual
    if (url.startsWith("data:image")) {
        return url;
    }

    // 1. Detección de Base64 sin prefijo
    if (url.length > 200 && !url.startsWith("http") && !url.startsWith("/")) {
        return `data:image/jpeg;base64,${url}`;
    }

    // Limpieza de URLs
    // 2. Si la URL contiene '/api/', extraemos la parte relativa
    let relativeUrl = url;
    if (url.includes("/api/")) {
        const apiIndex = url.indexOf("/api/");
        relativeUrl = url.substring(apiIndex);
    }

    // 2.5. Fix for backend returning /base64 URL which is text, replace with /download
    if (relativeUrl.endsWith("/base64")) {
        relativeUrl = relativeUrl.replace("/base64", "/download");
    }

    // 3. Decidir cómo devolver la URL según el entorno
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

    return fixImageUrl(url);
};
