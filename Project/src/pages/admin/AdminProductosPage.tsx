// Archivo: Project/src/pages/admin/AdminProductosPage.tsx

import { useState, useEffect } from "react";
import * as productApi from "../../api/productApi";
import type { ProductoResponse } from "../../api/productApi";
import Modal from "../../component/Model";

// Helper para formatear precios en CLP
const formatCLP = (precio: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio);
};

function AdminProductosPage() {
  // 1. Estado para la lista de productos
  const [products, setProducts] = useState<ProductoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Estados para modo eliminar y modal
  const [deleteMode, setDeleteMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProductToEdit, setCurrentProductToEdit] =
    useState<ProductoResponse | null>(null);

  // Cargar productos al montar
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productApi.getProductos(0, 100);
      setProducts(data.content);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      alert('Error al cargar productos');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Funciones de Gestión ---

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  const deleteProduct = async (id: number) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto con ID ${id}?`)) {
      try {
        await productApi.deleteProducto(id);
        setProducts((currentProducts) =>
          currentProducts.filter((p) => p.id !== id)
        );
        alert('Producto eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar producto');
      }
    }
  };

  const handleAddProductClick = () => {
    setCurrentProductToEdit(null);
    setIsModalOpen(true); // Abrir el modal
  };

  // 3. Función para guardar un producto desde el Modal
  const handleSaveProduct = async (productData: Partial<ProductoResponse>) => {
    try {
      // Si productData tiene id, estamos editando
      if (typeof (productData as any).id !== "undefined" && (productData as any).id !== null) {
        const id = Number((productData as any).id);
        const updated = await productApi.updateProducto(id, {
          nombre: productData.nombre,
          descripcion: productData.descripcion,
          precio: productData.precio,
          stock: productData.stock,
          categoriaId: productData.categoria?.id,
          activo: true,
        });
        setProducts((currentProducts) =>
          currentProducts.map((p) => (p.id === id ? updated : p))
        );
        alert('Producto actualizado correctamente');
      } else {
        // Crear nuevo producto
        const nuevo = await productApi.createProducto({
          nombre: productData.nombre || "Nombre no definido",
          descripcion: productData.descripcion || "Sin descripción",
          precio: Number(productData.precio) || 0,
          stock: Number(productData.stock) || 0,
          categoriaId: productData.categoria?.id || 1,
        });
        setProducts((currentProducts) => [...currentProducts, nuevo]);
        alert('Producto creado correctamente');
      }
    } catch (error: any) {
      console.error('Error al guardar producto:', error);
      alert(error.response?.data?.mensaje || 'Error al guardar producto');
    }
  };

  // --- Renderizado ---
  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div id="products" className="section">
      {" "}
      {/* ID por si el CSS lo usa */}
      <h2>📦 Gestión de Productos</h2>
      <div className="table-container">
        {/* Acciones */}
        <div className="actions mb-3">
          <button className="add-btn me-2" onClick={handleAddProductClick}>
            ➕ Añadir Producto
          </button>
          <button
            className={`delete-btn ${deleteMode ? "btn-danger" : ""}`}
            onClick={toggleDeleteMode}
          >
            🗑️ {deleteMode ? "Cancelar Eliminación" : "Activar Eliminación"}
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
                <td>
                  {product.descripcion.substring(0, 50)}
                  {product.descripcion.length > 50 ? "..." : ""}
                </td>
                <td>{formatCLP(product.precio)}</td>
                <td>
                  {product.stock || 0}
                  {product.stock === 0 && (
                    <span className="badge bg-danger ms-2">Sold out</span>
                  )}
                </td>
                {!deleteMode && (
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => {
                        setCurrentProductToEdit(product);
                        setIsModalOpen(true);
                      }}
                    >
                      ✏️ Editar
                    </button>
                  </td>
                )}
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
        onClose={() => {
          setIsModalOpen(false);
          setCurrentProductToEdit(null);
        }}
        onSave={(data) => {
          handleSaveProduct(data as Partial<Product>);
          setCurrentProductToEdit(null);
          setIsModalOpen(false);
        }} // Pasamos la función específica para productos
        type="product"
        initialData={currentProductToEdit || null}
      />
    </div>
  );
}

export default AdminProductosPage;
