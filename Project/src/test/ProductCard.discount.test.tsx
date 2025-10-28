import { render, screen } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import ProductCard from "../component/ProductCard";
import { productosArray } from "../data/products";
import { AuthProvider } from "../contexts/AuthContext";

describe("ProductCard descuento", () => {
  afterEach(() => {
    localStorage.removeItem("usuarioLogueado");
  });

  it("muestra precio con descuento para usuarios @duocuc.cl", () => {
    const user = {
      id: 999,
      nombre: "Test",
      apellido: "User",
      email: "test@duocuc.cl",
      contrasenia: "x",
      rol: "Usuario",
    };
    localStorage.setItem("usuarioLogueado", JSON.stringify(user));

    const product = productosArray[0]; // precio 49.99

    render(
      <AuthProvider>
        <ProductCard producto={product} />
      </AuthProvider>
    );

    // Debe mostrar precio original y precio con descuento (10%)
    expect(screen.getByText(/\$49.99/)).toBeInTheDocument();
    expect(screen.getByText(/\$44.99/)).toBeInTheDocument();
  });
});
