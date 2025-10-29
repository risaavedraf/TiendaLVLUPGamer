import { test, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import RegistroPage from "../../pages/RegistroPage";
import { AuthProvider } from "../../contexts/AuthContext";

beforeEach(() => {
  localStorage.clear();
});

test("al seleccionar una Región el dropdown de Comuna se actualiza", async () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <RegistroPage />
      </AuthProvider>
    </MemoryRouter>
  );

  const user = userEvent.setup();

  // Seleccionamos la región 'Región de Coquimbo'
  // Nota: las labels en el componente no están correctamente asociadas por 'htmlFor' al id
  // del select (p.ej. label htmlFor="region" vs select id="regionSelect"), así que
  // getByLabelText no encuentra el select. Usamos getAllByRole('combobox') y tomamos
  // la primera aparición como el select de Región y la segunda como Comuna.
  const selects = screen.getAllByRole("combobox");
  const regionSelect = selects[0] as HTMLSelectElement;
  const comunaSelect = selects[1] as HTMLSelectElement;

  await user.selectOptions(regionSelect, "Región de Coquimbo");

  const optionTexts = Array.from(comunaSelect.options).map((o) => o.text);
  expect(optionTexts).toContain("La Serena");
  expect(optionTexts).toContain("Coquimbo");
});
