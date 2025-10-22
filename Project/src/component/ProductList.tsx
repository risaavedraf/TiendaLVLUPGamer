// Archivo: Project/src/components/ProductList.tsx

import { productosArray } from '../data/products';
import ProductCard from './ProductCard';

// 1. Definimos las props que este componente puede recibir
type ProductListProps = {
  limit?: number; // 'limit' es opcional (por eso el '?')
};

// 2. Usamos las props en la definición de la función
function ProductList({ limit }: ProductListProps) {
  
  // 3. Lógica para decidir cuántos productos mostrar
  const productosMostrados = limit 
    ? productosArray.slice(0, limit) 
    : productosArray; // Si no hay límite, usa el array completo

  return (
    // 4. Cambiamos 'row-cols-md-4' a 'row-cols-md-3' para que coincida con el CSS 
    //    de tu Productos.html original
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
      {/* 5. Mapeamos sobre la lista filtrada */}
      {productosMostrados.map(producto => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </div>
  );
}

export default ProductList;