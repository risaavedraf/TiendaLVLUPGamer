// Archivo: Project/src/pages/ProductosPage.tsx

import ProductList from '../component/ProductList';

function ProductosPage() {
  return (
    <div className="album py-5 bg-body-tertiary">
      <div className="container">
        {/* Usamos el título de Productos.html */}
        <h1 className="text-center mb-5">PRODUCTOS</h1>

        {/* Aquí NO pasamos 'limit', por lo que mostrará todos */}
        <ProductList /> 
      </div>
    </div>
  );
}

export default ProductosPage;