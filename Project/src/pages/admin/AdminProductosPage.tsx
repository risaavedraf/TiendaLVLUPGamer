// Archivo: Project/src/pages/admin/AdminProductosPage.tsx

import { useState } from 'react';
import { productosArray as initialProducts } from '../../data/products';
import type { Product } from '../../data/products'; // Datos iniciales y tipo
import Modal from '../../component/Model'; // Nuestro Modal genérico

function AdminProductosPage() {
  // 1. Estado para la lista de productos
  const [products, setProducts] = useState<Product[]>(initialProducts);
  
  // 2. Estados para modo eliminar y modal
  const [deleteMode, setDeleteMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [currentProductToEdit, setCurrentProductToEdit] = useState<Product | null>(null); // Para editar

  // --- Funciones de Gestión ---

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  const deleteProduct = (id: number) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto con ID ${id}?`)) {
      setProducts(currentProducts => currentProducts.filter(p => p.id !== id));
      // Llamada a API aquí en un caso real
    }
  };

  const handleAddProductClick = () => {
    // setCurrentProductToEdit(null);
    setIsModalOpen(true); // Abrir el modal
  };

  // 3. Función para guardar un producto desde el Modal
  const handleSaveProduct = (productData: Partial<Product>) => {
    // Lógica simple para añadir
    const newProduct: Product = {
      // Valores por defecto o asegurados
      id: Math.max(0, ...products.map(p => p.id)) + 1, // Nuevo ID simple
      nombre: productData.nombre || 'Nombre no definido',
      descripcion: productData.descripcion || 'Sin descripción',
      // Asegurarse de que categoría exista o poner una por defecto
      categoria: productData.categoria || { id: 99, nombre: "Sin Categoría" }, 
      precio: Number(productData.precio) || 0,
      stock: Number(productData.stock) || 0,
      img: productData.img || '/Img/placeholder.png', // Imagen por defecto si no se añade
    };
    setProducts(currentProducts => [...currentProducts, newProduct]);
    
    // Llamada a API aquí en un caso real
  };


  // --- Renderizado ---
  return (
    <div id="products" className="section"> {/* ID por si el CSS lo usa */}
      <h2>📦 Gestión de Productos</h2>
      <div className="table-container">
        
        {/* Acciones */}
        <div className="actions mb-3">
          <button className="add-btn me-2" onClick={handleAddProductClick}>
            ➕ Añadir Producto
          </button>
          <button 
            className={`delete-btn ${deleteMode ? 'btn-danger' : ''}`}
            onClick={toggleDeleteMode}
          >
            🗑️ {deleteMode ? 'Cancelar Eliminación' : 'Activar Eliminación'}
          </button>
        </div>

        {/* Tabla de Productos */}
        <table id="products-table" className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock</th>
              {/* Podríamos añadir Categoría e Imagen si quisiéramos */}
              {deleteMode && <th>Acción</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.nombre}</td>
                {/* Acortamos descripción para la tabla */}
                <td>{product.descripcion.substring(0, 50)}{product.descripcion.length > 50 ? '...' : ''}</td>
                <td>${product.precio.toFixed(2)}</td>
                <td>{product.stock || 0}</td> 
                {deleteMode && (
                  <td>
                    <button 
                      className="btn btn-danger btn-sm delete-x"
                      onClick={() => deleteProduct(product.id)}
                      title={`Eliminar ${product.nombre}`}
                    >
                      ❌
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Usamos el Modal, pero ahora con type="product" */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveProduct} // Pasamos la función específica para productos
        type="product" 
        // initialData={currentProductToEdit} 
      />
    </div>
  );
}

export default AdminProductosPage;