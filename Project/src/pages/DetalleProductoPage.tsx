// Archivo: Project/src/pages/DetalleProductoPage.tsx

import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { productosArray } from '../data/products';
import type { Product } from '../data/products';
import { useCart } from '../contexts/CartContext';
//import ProductList from '../components/ProductList'; // Para productos relacionados
import ProductCard from '../component/ProductCard';

function DetalleProductoPage() {
  // 1. Obtener el parámetro ':productId' de la URL
  const { productId } = useParams<{ productId: string }>();
  const { addToCart } = useCart();

  // 2. Estado para guardar el producto encontrado
  const [producto, setProducto] = useState<Product | null>(null);
  // Estado para la imagen principal seleccionada (para la galería)
  const [mainImageSrc, setMainImageSrc] = useState<string>('');

  // 3. Efecto para buscar el producto cuando el productId cambie
  useEffect(() => {
    const id = parseInt(productId || '0', 10); // Convertir a número
    const foundProduct = productosArray.find(p => p.id === id);
    if (foundProduct) {
      setProducto(foundProduct);
      setMainImageSrc(foundProduct.img); // Imagen inicial
    } else {
      setProducto(null); // Producto no encontrado
      setMainImageSrc('');
    }
  }, [productId]); // Se ejecuta cada vez que el 'productId' de la URL cambia

  // Función para cambiar la imagen principal (lógica de DetalleProducto.html)
  const changeImage = (newSrc: string) => {
    setMainImageSrc(newSrc);
    // (Podríamos añadir lógica para resaltar la miniatura activa si quisiéramos)
  };

  // 4. Si el producto no se encuentra, mostrar un mensaje
  if (!producto) {
    return (
      <div className="container my-5 text-center">
        <h2>Producto no encontrado</h2>
        <Link to="/productos" className="btn btn-primary">Volver a Productos</Link>
      </div>
    );
  }

  // 5. Filtrar productos relacionados (lógica de mostrarRelacionados)
  const relatedProducts = productosArray.filter(
    p => p.categoria.id === producto.categoria.id && p.id !== producto.id
  );

  // --- Renderizado del componente (JSX de DetalleProducto.html migrado) ---
  return (
    <div className="container my-5"> {/* Añadido my-5 para espaciado */}
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/productos">Productos</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{producto.categoria.nombre}</li>
        </ol>
      </nav>

      <div className="row mb-5"> {/* Aumentado el margen inferior */}
        {/* Columna Izquierda: Imagen y Miniaturas */}
        <div className="col-md-6 text-center">
          <img
            id="mainImage"
            src={mainImageSrc || producto.img} // Usa el estado o la imagen por defecto
            className="img-fluid border mb-3"
            alt={producto.nombre}
            style={{ maxHeight: '400px', objectFit: 'contain' }} // Estilo para limitar altura
          />
          {/* Miniaturas (Usamos la misma imagen 3 veces como en el original) */}
          <div className="row g-2 justify-content-center">
            {[producto.img, producto.img, producto.img].map((imgSrc, index) => (
              <div className="col-auto" key={index}>
                <img
                  src={imgSrc}
                  className={`img-thumbnail thumb ${mainImageSrc === imgSrc ? 'border-primary border-2' : ''}`} // Resaltado simple
                  onClick={() => changeImage(imgSrc)}
                  width="80"
                  height="80"
                  style={{ cursor: 'pointer', objectFit: 'contain' }}
                  alt={`Miniatura ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Columna Derecha: Datos del Producto */}
        <div className="col-md-6 d-flex flex-column justify-content-start mt-4 mt-md-0">
          <div className="d-flex justify-content-between align-items-start">
            <h1 className="fs-2 text-md-start mb-0">{producto.nombre}</h1>
            <h2 className="fs-2 text-md-end ms-3 text-primary fw-bold">${producto.precio.toFixed(2)}</h2>
          </div>
          <hr /> {/* Reemplaza border-top */}
          
          <p className="text-md-start lead">{producto.descripcion}</p>
          <hr />

          {/* (El input de cantidad no estaba en tu lógica JS original para añadir, 
             así que lo omitimos por ahora para simplificar. 
             Podríamos añadirlo después si es necesario) */}
          {/* <div className="d-flex justify-content-between align-items-center mb-3">
             <h3 className="fs-5 text-md-start mb-0">Cantidad:</h3>
             <input type="number" className="form-control" style={{ width: '80px' }} defaultValue="1" min="1" />
           </div> */}
           
          <div className="d-grid gap-2 col-md-8 mx-md-0 mt-3"> {/* Ajustado ancho y margen */}
            <button
              id="btn-agregar-carrito"
              className="btn btn-primary btn-lg" // Botón más grande
              type="button"
              onClick={() => addToCart(producto)}
            >
              AGREGAR AL CARRITO
            </button>
          </div>
        </div>
      </div>

      {/* Descripción y Especificaciones (Contenido estático por ahora) */}
      <div className='mb-5'>
        <h3 className="fs-4 text-md-start">Descripción del producto</h3>
        <p className="text-md-start">
          {producto.descripcion} (Aquí podríamos poner una descripción más larga si la tuviéramos en los datos).
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
        </p>
      </div>
      <div className='mb-5'>
        <h3 className="fs-4 text-md-start">Especificaciones</h3>
        <ul className="text-md-start">
          <li>Especificación 1...</li>
          <li>Especificación 2...</li>
          {/* ... más especificaciones ... */}
        </ul>
      </div>

      {/* Productos Relacionados */}
      <div>
        <h3 className="mb-4">Productos relacionados</h3> {/* Añadido margen inferior */}
        
        {/* Reutilizamos ProductList, pero le pasamos los productos filtrados */}
        {relatedProducts.length > 0 ? (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3"> 
            {/* Usamos 4 columnas para relacionados */}
            {relatedProducts.map(p => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        ) : (
          <p>No hay otros productos en esta categoría.</p>
        )}
      </div>
    </div>
  );
}

export default DetalleProductoPage;