// Archivo: Project/src/pages/admin/AdminProductosPage.tsx

import { useState } from "react";
import { productosArray as initialProducts } from "../../data/products";
import type { Product } from "../../data/products"; // Datos iniciales y tipo
import Modal from "../../component/Model"; // Nuestro Modal genérico
// renderStockBadge se usa en la UI pública; aquí mostramos el número para administración

function AdminProductosPage() {
  // 1. Estado para la lista de productos
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // 2. Estados para modo eliminar y modal
  const [deleteMode, setDeleteMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProductToEdit, setCurrentProductToEdit] =
    useState<Product | null>(null); // Para editar

  // --- Funciones de Gestión ---

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  const deleteProduct = (id: number) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto con ID ${id}?`)) {
      setProducts((currentProducts) =>
        currentProducts.filter((p) => p.id !== id)
      );
      // Llamada a API aquí en un caso real
    }
  };

  const handleAddProductClick = () => {
    setCurrentProductToEdit(null);
    setIsModalOpen(true); // Abrir el modal
  };

  // 3. Función para guardar un producto desde el Modal
  const handleSaveProduct = (productData: Partial<Product>) => {
    // Resolver categoría: si el modal envía 'categoria' lo usamos; si envía 'categoriaId' buscamos el objeto
    const categoriaResolved = (productData as any).categoria ||
      (typeof (productData as any).categoriaId !== "undefined"
        ? initialProducts.find(
            (p) => p.categoria.id === Number((productData as any).categoriaId)
          )?.categoria
        : undefined) || { id: 99, nombre: "Sin Categoría" };

    // Si productData tiene id, estamos editando
    if (
      typeof (productData as any).id !== "undefined" &&
      (productData as any).id !== null
    ) {
      const id = Number((productData as any).id);
      setProducts((currentProducts) =>
        currentProducts.map((p) => {
          if (p.id === id) {
            const updated: Product = {
              ...p,
              nombre: productData.nombre ?? p.nombre,
              descripcion: productData.descripcion ?? p.descripcion,
              categoria: categoriaResolved ?? p.categoria,
              precio:
                typeof productData.precio !== "undefined"
                  ? Number(productData.precio)
                  : p.precio,
              stock:
                typeof productData.stock !== "undefined"
                  ? Number(productData.stock)
                  : p.stock,
              img: productData.img ?? p.img,
            };
            // También actualizar el array global initialProducts
            try {
              const idx = initialProducts.findIndex((ip) => ip.id === id);
              if (idx >= 0) initialProducts[idx] = updated;
            } catch (e) {
              console.warn(
                "No se pudo actualizar el array global de productos",
                e
              );
            }
            return updated;
          }
          return p;
        })
      );

      return;
    }

    // Si no tiene id, añadimos como nuevo producto
    const newProduct: Product = {
      id: Math.max(0, ...products.map((p) => p.id)) + 1, // Nuevo ID simple
      nombre: productData.nombre || "Nombre no definido",
      descripcion: productData.descripcion || "Sin descripción",
      categoria: categoriaResolved,
      precio: Number(productData.precio) || 0,
      stock: Number(productData.stock) || 0,
      img: productData.img || "/Img/placeholder.png",
    };
    setProducts((currentProducts) => [...currentProducts, newProduct]);
    try {
      initialProducts.push(newProduct);
    } catch (e) {
      console.warn("No se pudo añadir al array global de productos", e);
    }
  };

  // --- Renderizado ---
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
                <td>${product.precio.toFixed(2)}</td>
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
