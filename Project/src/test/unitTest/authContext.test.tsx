import { render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { AuthProvider, useAuth } from "../../contexts/AuthContext";
import { usersArray } from "../../data/users";

function Consumer() {
  const { currentUser, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="user">{currentUser ? currentUser.email : ""}</div>
      <button
        onClick={() =>
          login(usersArray[0].email, usersArray[0].contrasenia).catch(() => {})
        }
      >
        login
      </button>
      <button onClick={() => logout()}>logout</button>
    </div>
  );
}

function BadConsumer() {
  const { currentUser, login } = useAuth();
  const [err, setErr] = useState<string | null>(null);
  return (
    <div>
      <div data-testid="user-bad">{currentUser ? currentUser.email : ""}</div>
      <button
        onClick={() =>
          login("no-such-user@example.test", "wrong").catch((e) =>
            setErr(e?.message || "error")
          )
        }
      >
        login-bad
      </button>
      <div data-testid="err">{err || ""}</div>
    </div>
  );
}

function RegisterConsumer() {
  const { register } = useAuth();
  return (
    <div>
      <button
        onClick={() =>
          register({
            nombre: "Test",
            apellido: "User",
            correo: "test.register@example.local",
            contrasena: "pass1234",
          }).catch(() => {})
        }
      >
        do-register
      </button>
    </div>
  );
}

function RegisterDuplicateConsumer() {
  const { register } = useAuth();
  const [err, setErr] = useState<string | null>(null);
  return (
    <div>
      <button
        onClick={async () => {
          try {
            await register({
              nombre: "Test",
              apellido: "User",
              correo: "dup@example.local",
              contrasena: "pass1234",
            });
            // attempt duplicate
            await register({
              nombre: "Test",
              apellido: "User",
              correo: "dup@example.local",
              contrasena: "pass1234",
            });
          } catch (e: any) {
            setErr(e?.message || "error");
          }
        }}
      >
        do-register-dup
      </button>
      <div data-testid="reg-err">{err || ""}</div>
    </div>
  );
}

describe("Auth - login success", () => {
  beforeEach(() => localStorage.clear());

  it("login() with correct credentials updates currentUser", async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await userEvent.click(screen.getByText("login"));

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent(usersArray[0].email);
    });
  });

  it("login() with incorrect credentials rejects and returns an error message", async () => {
    render(
      <AuthProvider>
        <BadConsumer />
      </AuthProvider>
    );

    await userEvent.click(screen.getByText("login-bad"));

    await waitFor(() => {
      expect(screen.getByTestId("err")).toHaveTextContent(
        /correo o contraseña|Correo o contraseña|error/i
      );
    });
    // ensure currentUser not set
    expect(screen.getByTestId("user-bad")).toHaveTextContent("");
  });

  it("logout() sets currentUser to null", async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    // login first
    await userEvent.click(screen.getByText("login"));
    await waitFor(() =>
      expect(screen.getByTestId("user")).toHaveTextContent(usersArray[0].email)
    );

    // then logout
    await userEvent.click(screen.getByText("logout"));
    await waitFor(() =>
      expect(screen.getByTestId("user")).toHaveTextContent("")
    );
  });

  it("register() saves a user to localStorage usuariosRegistrados", async () => {
    render(
      <AuthProvider>
        <RegisterConsumer />
      </AuthProvider>
    );

    // click register
    await userEvent.click(screen.getByText("do-register"));

    await waitFor(() => {
      const stored = JSON.parse(
        localStorage.getItem("usuariosRegistrados") || "[]"
      );
      expect(Array.isArray(stored)).toBe(true);
      expect(
        stored.find((u: any) => u.correo === "test.register@example.local")
      ).toBeTruthy();
    });
  });

  it("register() fails when email already exists", async () => {
    render(
      <AuthProvider>
        <RegisterDuplicateConsumer />
      </AuthProvider>
    );

    await userEvent.click(screen.getByText("do-register-dup"));

    await waitFor(() => {
      expect(screen.getByTestId("reg-err")).toHaveTextContent(
        /correo ya est|ya está registrado|already/i
      );
    });
    // ensure only one stored
    const stored = JSON.parse(
      localStorage.getItem("usuariosRegistrados") || "[]"
    );
    const matches = stored.filter((u: any) => u.correo === "dup@example.local");
    expect(matches.length).toBe(1);
  });
});
