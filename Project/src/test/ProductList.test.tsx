import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProductList from "../component/ProductList";

describe("Componente: ProductList", () => {
  it("renderiza inicialmente 12 productos en home (infinite scroll)", () => {
    const { container } = render(<ProductList />);
    const cards = container.querySelectorAll(".product-card");
    expect(cards.length).toBe(12);
  });
});
