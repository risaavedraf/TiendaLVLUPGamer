import { render, screen, waitFor, within } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../../App";
import { AuthProvider } from "../../contexts/AuthContext";
import { CartProvider } from "../../contexts/CartContext";
import { productosArray } from "../../data/products";

describe("Integración - flujo añadir al carrito", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("Añadir un producto desde la lista actualiza localStorage y el badge del header", async () => {
    render(
      <MemoryRouter initialEntries={["/productos"]}>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    // Simular un clic en el enlace 'Productos' del header
    const productosLink = screen.getByRole("link", { name: /Productos/i });
    await userEvent.click(productosLink);

    // Encontrar un producto por nombre en la lista (ejemplo: Teclado Gamer Redragon)
    const productoNombre = await screen.findByText(/Teclado Gamer Redragon/i);
    expect(productoNombre).toBeInTheDocument();

    // Localizar el botón 'Añadir al Carrito' dentro de la tarjeta del producto
    const productCard = productoNombre.closest(".card");
    expect(productCard).toBeTruthy();
    const addBtn = within(productCard as HTMLElement).getByRole("button", {
      name: /Añadir al Carrito/i,
    });
    // Pulsar el botón del producto encontrado
    await userEvent.click(addBtn);

    // Comprobar que localStorage contiene el carrito con 1 ítem
    await waitFor(() => {
      const stored = localStorage.getItem("carrito");
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored as string);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(1);
      expect(parsed[0]).toHaveProperty("cantidad", 1);
      // El id debe coincidir con el primer producto mostrado
      const firstProductId = productosArray.find((p) => (p.stock ?? 0) > 0)?.id;
      if (firstProductId !== undefined) {
        expect(parsed[0]).toHaveProperty("id", firstProductId);
      }
    });

    // Comprobar que el header muestra '1' en el icono del carrito
    const allLinks = screen.getAllByRole("link");
    const cartLink = allLinks.find(
      (a) => a.getAttribute("href") === "/carrito"
    );
    expect(cartLink).toBeDefined();
    // Dentro del enlace al carrito debe aparecer la burbuja/badge con '1'
    const badgeInCart = within(cartLink as HTMLElement).getByText("1");
    expect(badgeInCart).toBeInTheDocument();

    // Simular clic en el icono del carrito para navegar a /carrito
    await userEvent.click(cartLink as HTMLElement);

    // Comprobar que la ruta cambió mostrando la página del carrito
    // Buscamos el heading principal (h1) que contiene 'Mi Carrito' o similar
    const carritoHeading = await screen.findByRole("heading", {
      name: /Mi Carrito|Carrito de Compras|Carrito/i,
    });
    expect(carritoHeading).toBeInTheDocument();

    // Verificar que el producto agregado aparece en la página del carrito
    // Buscamos dentro del <main> para evitar coincidir con toasts u otros textos
    const mainRegion = await screen.findByRole("main");
    const productoEnCarrito = await within(mainRegion).findByText(
      /Teclado Gamer Redragon/i
    );
    expect(productoEnCarrito).toBeInTheDocument();
  });
});
