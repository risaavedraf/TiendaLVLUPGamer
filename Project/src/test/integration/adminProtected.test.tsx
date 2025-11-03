import { render, screen } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import App from "../../App";
import { AuthProvider } from "../../contexts/AuthContext";
import { CartProvider } from "../../contexts/CartContext";
import { usersArray } from "../../data/users";

describe("Flujo de acceso Admin (ruta protegida)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("redirige a /login cuando no hay usuario", async () => {
    render(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    // El ProtectedRoute debería redirigir al Login
    const loginHeading = await screen.findByRole("heading", {
      name: /Inicio de Sesión/i,
    });
    expect(loginHeading).toBeInTheDocument();
  });

  test("muestra el Panel de métricas cuando hay un usuario Admin", async () => {
    // Pre-popular localStorage con un usuario Admin (mismo shape que usersArray)
    const admin = usersArray.find((u) => u.rol === "Admin") || {
      id: 999,
      nombre: "Admin",
      apellido: "Test",
      email: "admin@example.com",
      contrasenia: "admin",
      rol: "Admin",
    };
    localStorage.setItem("usuarioLogueado", JSON.stringify(admin));

    render(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    // Ahora deberíamos ver el heading del dashboard de admin
    const panelHeading = await screen.findByText(/Panel de métricas/i);
    expect(panelHeading).toBeInTheDocument();
  });
});
