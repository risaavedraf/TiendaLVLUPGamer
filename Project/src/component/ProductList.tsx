// Archivo: Project/src/components/ProductList.tsx

import { productosArray } from "../data/products";
import type { Product } from "../data/products";
import ProductCard from "./ProductCard";
import { useEffect, useState, useRef } from "react";

// 1. Definimos las props que este componente puede recibir
type ProductListProps = {
  limit?: number; // 'limit' es opcional (por eso el '?')
  products?: Product[]; // Agregamos 'products' opcional para paginación
};

// 2. Usamos las props en la definición de la función
function ProductList({ limit, products }: ProductListProps) {
  // Prioridad: si se pasan 'products', los usa tal cual (no infinite scroll).
  // Si no se pasan products ni limit, activamos carga progresiva en el home.
  const productosBase = products || productosArray;

  const enableInfinite = !products && typeof limit === "undefined";

  const initialCount = 12; // cuantos cargar inicialmente en home
  const step = 6; // cuantos cargar cada vez que el usuario baja

  const [visibleCount, setVisibleCount] = useState(() =>
    enableInfinite ? initialCount : limit ?? productosBase.length
  );
  const loadingRef = useRef(false);

  useEffect(() => {
    if (!enableInfinite) return;

    function onScroll() {
      if (loadingRef.current) return;
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 400;
      if (nearBottom && visibleCount < productosBase.length) {
        loadingRef.current = true;
        // pequeña pausa para evitar muchas llamadas
        setTimeout(() => {
          setVisibleCount((v) => Math.min(productosBase.length, v + step));
          loadingRef.current = false;
        }, 250);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enableInfinite, visibleCount, productosBase.length]);

  const productosMostrados = productosBase.slice(0, visibleCount);

  return (
    <>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-3 g-3 g-md-4">
        {productosMostrados.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>
      {enableInfinite && visibleCount < productosBase.length && (
        <div className="text-center mt-4">
          <button
            className="btn btn-outline-primary"
            onClick={() =>
              setVisibleCount((v) => Math.min(productosBase.length, v + step))
            }
          >
            Cargar más
          </button>
        </div>
      )}
    </>
  );
}

export default ProductList;
