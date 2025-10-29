import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminUsuariosPage from "../../pages/admin/AdminUsuariosPage";

test("al activar eliminación aparece la columna 'Acción'", async () => {
  render(<AdminUsuariosPage />);

  // Antes de activar, la columna 'Acción' no debe existir
  expect(screen.queryByText(/Acción/i)).toBeNull();

  const user = userEvent.setup();
  const deleteBtn = screen.getByText(/Activar Eliminación/i);
  await user.click(deleteBtn);

  // Ahora la columna debe estar visible en el encabezado
  expect(screen.getByText(/Acción/i)).toBeTruthy();
});

test("al hacer click en '➕ Añadir Usuario' se muestra el Modal", async () => {
  render(<AdminUsuariosPage />);

  const user = userEvent.setup();
  const addBtn = screen.getByText(/Añadir Usuario/i);
  await user.click(addBtn);

  // El modal contiene un botón 'Guardar' cuando está abierto
  const guardar = await screen.findByText(/Guardar/i);
  expect(guardar).toBeTruthy();
});
