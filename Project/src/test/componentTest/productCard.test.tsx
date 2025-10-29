import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "../../component/ProductCard";
import { AuthProvider } from "../../contexts/AuthContext";
import { CartProvider } from "../../contexts/CartContext";

test("ProductCard renderiza nombre, precio e imagen del producto", () => {
  const mockProduct = {
    id: 123,
    nombre: "Mock Teclado",
    descripcion: "Descripción del teclado mock",
    categoria: { id: 1, nombre: "Teclados" },
    precio: 99.5,
    stock: 5,
    img: "/Img/mock-teclado.png",
  };

  render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <ProductCard producto={mockProduct} />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );

  // Nombre
  expect(screen.getByText(/Mock Teclado/i)).toBeTruthy();

  // Precio formateado con 2 decimales y prefijo $
  expect(screen.getByText(`$${mockProduct.precio.toFixed(2)}`)).toBeTruthy();

  // Imagen: buscar por alt text y comprobar que el src contiene la ruta esperada
  const img = screen.getByAltText(/Mock Teclado/i) as HTMLImageElement;
  expect(img).toBeTruthy();
  expect(img.src).toContain(mockProduct.img);
});
