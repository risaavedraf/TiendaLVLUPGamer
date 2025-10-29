// Archivo: Project/src/components/Modal.tsx

import React, { useState, useEffect } from "react";
import type { User } from "../data/users"; // Importamos tipos necesarios
import type { Product } from "../data/products";
import type { Order } from "../data/orders";
import { regionesYComunas } from "../data/locations"; // Para el selector de región/comuna
import { productosArray } from "../data/products";

// Definimos los tipos de datos que el modal puede manejar (por ahora solo User)
type ModalDataType = User | Partial<Product> | Partial<Order>; // Partial<> para flexibilidad

// Definimos las props que recibirá el modal
type ModalProps = {
  isOpen: boolean; // Controla si el modal está visible
  onClose: () => void; // Función para cerrar el modal
  onSave: (data: ModalDataType) => void; // Función para guardar los datos
  type: "user" | "product" | "order"; // Qué tipo de formulario mostrar
  initialData?: ModalDataType | null; // Datos iniciales (para editar en el futuro)
};

function Modal({
  isOpen,
  onClose,
  onSave,
  type,
  initialData = null,
}: ModalProps) {
  // Estado interno para manejar los datos del formulario
  // Usamos un registro genérico para evitar errores de acceso a propiedades
  const [formData, setFormData] = useState<Record<string, any>>(
    initialData ? (initialData as any) : {}
  );

  // Estado para desplegables de usuario
  const [selectedRegion, setSelectedRegion] = useState("");
  const [availableComunas, setAvailableComunas] = useState<string[]>([]);

  // Inicializar el formulario cuando 'initialData' o 'type' cambien (para añadir o editar)
  useEffect(() => {
    if (initialData) {
      // Pre-fill formData and derive helper fields (categoriaId for products,
      // region/comuna for users) so selects show the correct value when
      // editing.
      if (
        type === "product" &&
        "categoria" in initialData &&
        initialData.categoria
      ) {
        // Ensure categoriaId is a string so the select value matches option values
        setFormData({
          ...(initialData as any),
          categoriaId: String((initialData as any).categoria.id),
        });
      } else {
        setFormData(initialData);
      }

      // Si es un usuario y tiene región/comuna, preselecciónalos
      if (type === "user" && "region" in initialData && initialData.region) {
        setSelectedRegion(initialData.region as string);
      }
      if (type === "user" && "comuna" in initialData && initialData.comuna) {
        // (Necesitaríamos poblar availableComunas antes de setear esto para editar)
      }
    } else {
      // Valores por defecto al añadir
      setFormData(type === "user" ? { rol: "Usuario" } : {});
      setSelectedRegion("");
    }
  }, [initialData, type, isOpen]); // Reiniciar si se reabre

  // Poblar comunas cuando cambia la región (similar a RegistroPage)
  useEffect(() => {
    if (selectedRegion) {
      const regionData = regionesYComunas.find(
        (r) => r.region === selectedRegion
      );
      setAvailableComunas(
        regionData ? regionData.comunas.map((c) => c.nombre) : []
      );
    } else {
      setAvailableComunas([]);
    }
    // Si la comuna actual ya no está en la nueva lista, deselecciónala
    if (formData.comuna && !availableComunas.includes(formData.comuna)) {
      handleChange({ target: { name: "comuna", value: "" } } as any);
    }
  }, [selectedRegion]);

  // Handler genérico para cambios en los inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Actualizar formData
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Si cambió la región, actualiza el estado 'selectedRegion'
    if (name === "region") {
      setSelectedRegion(value);
    }
  };

  // Handler para input file (imagen)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      // Guardamos la imagen como data URL en formData.img
      setFormData((prev) => ({ ...prev, img: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Handler para el guardado
  const handleSave = () => {
    // Aquí podríamos añadir validaciones antes de guardar
    onSave(formData as ModalDataType);
    onClose(); // Cerrar el modal después de guardar
  };

  // Si no está abierto, no renderizar nada
  if (!isOpen) {
    return null;
  }

  // --- Renderizado del Modal (JSX de Administrador.html) ---
  return (
    // Overlay oscuro
    <div className="modal-overlay" onClick={onClose} style={styles.overlay}>
      {/* Contenido del modal (evita que el clic en él cierre el modal) */}
      <div
        className="modal-content-admin"
        onClick={(e) => e.stopPropagation()}
        style={styles.content}
      >
        <h3 id="modal-title">
          {initialData ? "Editar" : "Añadir"}{" "}
          {type === "user"
            ? "Usuario"
            : type === "product"
            ? "Producto"
            : "Orden"}
        </h3>

        {/* Renderizado condicional del formulario */}
        {type === "user" && (
          <div style={styles.formFields}>
            <input
              type="text"
              name="run"
              placeholder="Run"
              value={formData.run || ""}
              onChange={handleChange}
              style={styles.input}
            />
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre || ""}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              name="apellido"
              placeholder="Apellidos"
              value={formData.apellido || ""}
              onChange={handleChange}
              style={styles.input}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email || ""}
              onChange={handleChange}
              required
              style={styles.input}
            />
            {/* Contraseña (solo al añadir, o con opción de cambiar al editar) */}
            {!initialData && (
              <input
                type="password"
                name="contrasenia"
                placeholder="Contraseña (temporal)"
                onChange={handleChange}
                required
                style={styles.input}
              />
            )}
            <input
              type="text"
              name="direccion"
              placeholder="Dirección"
              value={formData.direccion || ""}
              onChange={handleChange}
              style={styles.input}
            />
            {/* Selector de Región */}
            <select
              name="region"
              value={selectedRegion}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="">Seleccione Región</option>
              {regionesYComunas.map((r) => (
                <option key={r.region} value={r.region}>
                  {r.region}
                </option>
              ))}
            </select>
            {/* Selector de Comuna */}
            <select
              name="comuna"
              value={formData.comuna || ""}
              onChange={handleChange}
              required
              disabled={!selectedRegion}
              style={styles.input}
            >
              <option value="">Seleccione Comuna</option>
              {availableComunas.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {/* Selector de Rol */}
            <select
              name="rol"
              value={formData.rol || "Usuario"}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="Usuario">Usuario</option>
              <option value="Vendedor">Vendedor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        )}

        {/* (Aquí añadiríamos los campos para 'product' y 'order' de forma similar) */}
        {type === "product" && (
          <div style={styles.formFields}>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre Producto"
              value={formData.nombre || ""}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              name="descripcion"
              placeholder="Descripción"
              value={formData.descripcion || ""}
              onChange={handleChange}
              style={styles.input}
            />
            {/* Imagen: subir archivo (se guardará como data URL) */}
            <input
              type="file"
              name="imgFile"
              accept="image/*"
              onChange={handleFileChange}
              style={styles.input}
            />
            <input
              type="number"
              name="precio"
              placeholder="Precio"
              value={formData.precio || ""}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              style={styles.input}
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={formData.stock || ""}
              onChange={handleChange}
              step="1"
              min="0"
              required
              style={styles.input}
            />
            {/* Selector de Categoría: extraemos categorías desde productosArray */}
            <select
              name="categoriaId"
              value={(formData as any).categoriaId || ""}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="">Seleccione Categoría</option>
              {Array.from(
                new Map(
                  productosArray.map((p) => [p.categoria.id, p.categoria])
                ).values()
              ).map((cat) => (
                <option key={cat.id} value={String(cat.id)}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>
        )}
        {type === "order" && (
          <>
            <p>
              La edición/creación de órdenes se manejaría de forma diferente
              (probablemente con selección de productos).
            </p>
            {/* Formulario de Orden (más complejo, omitido por ahora) */}
          </>
        )}

        {/* Botones */}
        <div style={styles.buttons}>
          <button onClick={handleSave} className="btn btn-success me-2">
            Guardar
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// Estilos básicos en línea (puedes moverlos a admin.css)
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1050, // Encima de otros elementos
  } as React.CSSProperties,
  content: {
    background: "#fff",
    padding: "25px",
    borderRadius: "8px",
    minWidth: "350px",
    maxWidth: "90%",
    maxHeight: "90vh",
    overflowY: "auto", // Para formularios largos
    color: "#333", // Asegurar texto oscuro
    zIndex: 1051,
  } as React.CSSProperties,
  formFields: {
    display: "flex",
    flexDirection: "column",
    gap: "10px", // Espacio entre campos
    margin: "20px 0",
  } as React.CSSProperties,
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%", // Ocupar ancho
    boxSizing: "border-box", // Incluir padding/border en el ancho
  } as React.CSSProperties,
  buttons: {
    display: "flex",
    justifyContent: "flex-end", // Botones a la derecha
    marginTop: "20px",
  } as React.CSSProperties,
};

export default Modal;
