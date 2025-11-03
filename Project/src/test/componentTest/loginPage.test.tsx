import { test, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../../pages/LoginPage";
import { AuthProvider } from "../../contexts/AuthContext";

beforeEach(() => {
  localStorage.clear();
});

test("LoginPage se renderiza con los campos y permite escribir en ellos", async () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </MemoryRouter>
  );

  // Comprobar título y elementos básicos
  expect(screen.getByText(/Inicio de Sesión/i)).toBeTruthy();
  const emailInput = screen.getByLabelText(
    /Correo Electrónico/i
  ) as HTMLInputElement;
  const passwordInput = screen.getByLabelText(
    /Contraseña/i
  ) as HTMLInputElement;
  const submitBtn = screen.getByRole("button", { name: /Iniciar Sesión/i });

  expect(emailInput).toBeTruthy();
  expect(passwordInput).toBeTruthy();
  expect(submitBtn).toBeTruthy();

  // Simular que el usuario escribe en los campos
  const user = userEvent.setup();
  await user.type(emailInput, "usuario@example.com");
  await user.type(passwordInput, "miContrasenia123");

  // Verificar que los valores se actualizaron
  expect(emailInput.value).toBe("usuario@example.com");
  expect(passwordInput.value).toBe("miContrasenia123");

  // Simular clic en Iniciar Sesión
  await user.click(submitBtn);

  // Como no hay usuario en la 'base de datos' el login fallará y debe mostrarse un alert
  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent(/Correo o contraseña incorrectos/i);

  // También aseguramos que el texto del error es visible en la página
  const errText = await screen.findByText(/Correo o contraseña incorrectos/i);
  expect(errText).toBeTruthy();
});

test("llama a login al enviar el formulario", async () => {
  // Mockeamos useAuth para espiar la llamada a login
  const AuthModule = await import("../../contexts/AuthContext");
  const loginMock = vi.fn(() => Promise.resolve({}));
  const spy = vi.spyOn(AuthModule, "useAuth").mockImplementation(
    () =>
      ({
        currentUser: null,
        login: loginMock,
        logout: () => {},
        register: async () => {},
      } as any)
  );

  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

  const emailInput = screen.getByLabelText(
    /Correo Electrónico/i
  ) as HTMLInputElement;
  const passwordInput = screen.getByLabelText(
    /Contraseña/i
  ) as HTMLInputElement;
  const submitBtn = screen.getByRole("button", { name: /Iniciar Sesión/i });

  const user = userEvent.setup();
  await user.type(emailInput, "usuario@example.com");
  await user.type(passwordInput, "miContrasenia123");
  await user.click(submitBtn);

  expect(loginMock).toHaveBeenCalled();
  expect(loginMock).toHaveBeenCalledWith(
    "usuario@example.com",
    "miContrasenia123"
  );

  spy.mockRestore();
});
