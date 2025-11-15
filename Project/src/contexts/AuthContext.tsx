// Archivo: Project/src/contexts/AuthContext.tsx

import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import * as authApi from "../api/authApi";
import type { UsuarioResponse } from "../api/authApi";

// Tipos adaptados para compatibilidad con el código existente
export type User = {
  id: number;
  name: string;
  lastname: string;
  email: string;
  username?: string;
  fechaNacimiento?: string;
  roles: string[]; // Cambiar de 'rol' a 'roles'
};

type RegisterData = {
  name: string;
  lastname: string;
  email: string;
  username?: string;
  contrasena: string;
  fechaNacimiento?: string; // Opcional para formularios existentes
};

type AuthContextType = {
  currentUser: User | null;
  login: (email: string, contrasenia: string) => Promise<User>;
  logout: () => void;
  register: (newUser: RegisterData) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Función helper para convertir UsuarioResponse a User
const mapUsuarioToUser = (usuario: UsuarioResponse): User => ({
  id: usuario.id,
  name: usuario.nombre || usuario.nombre || "",
  lastname: usuario.apellido || usuario.apellido || "",
  username: usuario.username || usuario.username || "",
  fechaNacimiento: usuario.fechaNacimiento || usuario.fechaNacimiento || "",
  email: usuario.email,
  roles: usuario.roles || [],
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const usuarioLogueado = localStorage.getItem("usuarioLogueado");
    return usuarioLogueado ? JSON.parse(usuarioLogueado) : null;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Efecto para sincronizar usuario con localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("usuarioLogueado", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("usuarioLogueado");
    }
  }, [currentUser]);

  // Lógica de Login usando API real
  const login = async (email: string, contrasenia: string): Promise<User> => {
    try {
      setIsLoading(true);
      const response = await authApi.login({ email, password: contrasenia }); // Cambiar contrasenia a password
      const user = mapUsuarioToUser(response.usuario);
      setCurrentUser(user);
      return user;
    } catch (error: any) {
      console.error("Error en login:", error);
      throw new Error(
        error.response?.data?.mensaje || "Correo o contraseña incorrectos"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Lógica de Logout usando API
  const logout = () => {
    authApi.logout();
    setCurrentUser(null);
  };

  // Lógica de Registro usando API real
  const register = async (newUser: RegisterData): Promise<void> => {
    try {
      setIsLoading(true);

      // Generar username a partir del email (o usar el nombre)
      const username = newUser.username || newUser.email.split("@")[0];

      await authApi.registro({
        username: username,
        email: newUser.email,
        password: newUser.contrasena,
        name: newUser.name,
        lastName: newUser.lastname,
        birthDate: newUser.fechaNacimiento || "2000-01-01", // Fecha por defecto si no se proporciona
      });
    } catch (error: any) {
      console.error("Error en registro:", error);
      throw new Error(
        error.response?.data?.mensaje || "Error al registrar usuario"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Nueva función para actualizar perfil
  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authApi.updatePerfil(userData);
      const updatedUser = mapUsuarioToUser(response);
      setCurrentUser(updatedUser);
    } catch (error: any) {
      console.error("Error al actualizar perfil:", error);
      throw new Error(
        error.response?.data?.mensaje || "Error al actualizar perfil"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
    updateProfile,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personalizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
