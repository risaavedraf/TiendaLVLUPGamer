import { beforeEach, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../../component/Header";
import { AuthProvider } from "../../contexts/AuthContext";
import { CartProvider } from "../../contexts/CartContext";

beforeEach(() => {
  localStorage.clear();
});

test("Header muestra Login y Sign-up cuando no hay usuario", () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <Header />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );

  // Buscar por texto visible
  expect(screen.getByText(/Login/i)).toBeTruthy();
  expect(screen.getByText(/Sign-up/i)).toBeTruthy();
});

test("Header muestra bienvenida y Cerrar Sesión cuando hay usuario autenticado", () => {
  // Pre-cargamos localStorage para que AuthProvider inicialice currentUser
  const mockUser = {
    id: 999,
    nombre: "Ricardo",
    apellido: "Perez",
    email: "ricardo@example.com",
    contrasenia: "secret",
    rol: "Usuario",
  };
  localStorage.setItem("usuarioLogueado", JSON.stringify(mockUser));

  render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <Header />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );

  // Comprobamos el saludo y el botón de cerrar sesión
  expect(screen.getByText(/Bienvenido, Ricardo/i)).toBeTruthy();
  expect(screen.getByText(/Cerrar Sesión/i)).toBeTruthy();
});
