import type { ReactElement } from 'react';

/**
 * Devuelve un badge/elemento JSX representando el estado del stock.
 * - stock === 0 -> 'Sold out' (badge rojo)
 * - 0 < stock < 5 -> 'Pocas unidades' (badge amarillo)
 * - stock >= 5 -> muestra 'Stock: N' en texto tenue
 */
export function renderStockBadge(stock?: number): ReactElement | null {
  if (stock === undefined || stock === null) return null;

  if (stock === 0) {
    return <span className="badge bg-danger">Sold out</span>;
  }

  if (stock < 5) {
    return <span className="badge bg-warning text-dark">Pocas unidades</span>;
  }

  // Si hay stock suficiente, no mostramos nada en la vista pública
  return null;
}

export default renderStockBadge;
