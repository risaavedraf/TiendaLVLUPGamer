import { beforeEach, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { useState } from "react";
import userEvent from "@testing-library/user-event";
import { CartProvider, useCart } from "../../contexts/CartContext";
import { productosArray } from "../../data/products";

beforeEach(() => {
  localStorage.clear();
});

function TestConsumer() {
  const { cartItems, addToCart, modifyQuantity, getCartDetails } = useCart();
  const [details, setDetails] = useState<any[]>([]);
  const product = productosArray[0];

  return (
    <div>
      <button onClick={() => addToCart(product)} data-testid="add-btn">
        Add
      </button>
      <button
        onClick={() => setDetails(getCartDetails())}
        data-testid="details-btn"
      >
        Details
      </button>
      <button
        onClick={() => modifyQuantity(product.id, 1)}
        data-testid="inc-btn"
      >
        Inc
      </button>
      <button
        onClick={() => modifyQuantity(product.id, -1)}
        data-testid="dec-btn"
      >
        Dec
      </button>
      <div data-testid="cart">{JSON.stringify(cartItems)}</div>
      <div data-testid="details">{JSON.stringify(details)}</div>
    </div>
  );
}

test("addToCart añade un ítem nuevo", async () => {
  render(
    <CartProvider>
      <TestConsumer />
    </CartProvider>
  );

  const user = userEvent.setup();
  const addBtn = screen.getByTestId("add-btn");
  await user.click(addBtn);

  const cartDiv = screen.getByTestId("cart");
  // Parseamos el contenido y comprobamos el objeto resultante
  const cart = JSON.parse(cartDiv.textContent || "[]");
  expect(Array.isArray(cart)).toBe(true);
  expect(cart).toHaveLength(1);
  expect(cart[0].id).toBe(productosArray[0].id);
  expect(cart[0].cantidad).toBe(1);
});

test("addToCart incrementa la cantidad al añadir el mismo producto", async () => {
  render(
    <CartProvider>
      <TestConsumer />
    </CartProvider>
  );

  const user = userEvent.setup();
  const addBtn = screen.getByTestId("add-btn");
  // Añadimos el mismo producto dos veces
  await user.click(addBtn);
  await user.click(addBtn);

  const cartDiv = screen.getByTestId("cart");
  const cart = JSON.parse(cartDiv.textContent || "[]");
  expect(Array.isArray(cart)).toBe(true);
  expect(cart).toHaveLength(1);
  expect(cart[0].id).toBe(productosArray[0].id);
  expect(cart[0].cantidad).toBe(2);
});

test("modifyQuantity suma y resta correctamente", async () => {
  render(
    <CartProvider>
      <TestConsumer />
    </CartProvider>
  );

  const user = userEvent.setup();
  const addBtn = screen.getByTestId("add-btn");
  const incBtn = screen.getByTestId("inc-btn");
  const decBtn = screen.getByTestId("dec-btn");

  // Añadimos el producto (cantidad = 1)
  await user.click(addBtn);

  // Incrementamos (cantidad = 2)
  await user.click(incBtn);
  let cartDiv = screen.getByTestId("cart");
  let cart = JSON.parse(cartDiv.textContent || "[]");
  expect(cart[0].cantidad).toBe(2);

  // Decrementamos (cantidad = 1)
  await user.click(decBtn);
  cartDiv = screen.getByTestId("cart");
  cart = JSON.parse(cartDiv.textContent || "[]");
  expect(cart[0].cantidad).toBe(1);

  // Decrementamos otra vez (debe eliminarse)
  await user.click(decBtn);
  cartDiv = screen.getByTestId("cart");
  cart = JSON.parse(cartDiv.textContent || "[]");
  expect(cart).toHaveLength(0);
});

test("getCartDetails devuelve información combinada de products y carrito", async () => {
  render(
    <CartProvider>
      <TestConsumer />
    </CartProvider>
  );

  const user = userEvent.setup();
  const addBtn = screen.getByTestId("add-btn");
  const detailsBtn = screen.getByTestId("details-btn");

  // Añadimos el producto al carrito
  await user.click(addBtn);

  // Solicitamos los detalles combinados
  await user.click(detailsBtn);

  const detailsDiv = screen.getByTestId("details");
  const details = JSON.parse(detailsDiv.textContent || "[]");

  // Debe ser un array con un elemento que combine campos de products.ts y la cantidad
  expect(Array.isArray(details)).toBe(true);
  expect(details).toHaveLength(1);
  const item = details[0];
  // campos desde products.ts
  expect(item).toHaveProperty("id", productosArray[0].id);
  expect(item).toHaveProperty("nombre", productosArray[0].nombre);
  expect(item).toHaveProperty("precio", productosArray[0].precio);
  // campo desde carrito
  expect(item).toHaveProperty("cantidad", 1);
});
