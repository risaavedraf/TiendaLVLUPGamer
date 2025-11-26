// Archivo: Project/src/contexts/AuthContext.tsx

import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import * as authApi from '../api/authApi';
import type { UsuarioResponse } from '../api/authApi';

// Tipos adaptados para compatibilidad con el código existente
export type User = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  run?: string;
  direccion?: string;
  roles: string[]; // Cambiar de 'rol' a 'roles'
};

type RegisterData = {
  username?: string;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  fechaNacimiento?: string; // Opcional para formularios existentes
};

type AuthContextType = {
  currentUser: User | null;
  login: (email: string, contrasenia: string) => Promise<User>;
  logout: () => void;
  register: (newUser: RegisterData) => Promise<string>; // devuelve mensaje
  updateProfile: (userData: Partial<User>) => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Función helper para convertir UsuarioResponse a User
// Permite compatibilidad si el backend alguna vez envía name/lastName
const mapUsuarioToUser = (usuario: UsuarioResponse & { name?: string; lastName?: string }): User => ({
  id: usuario.id,
  nombre: (usuario.nombre || usuario.name || '').trim(),
  apellido: (usuario.apellido || usuario.lastName || '').trim(),
  email: usuario.email,
  run: usuario.run,
  direccion: usuario.direccion,
  roles: usuario.roles || [],
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const usuarioLogueado = localStorage.getItem('usuarioLogueado');
    return usuarioLogueado ? JSON.parse(usuarioLogueado) : null;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Efecto para sincronizar usuario con localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('usuarioLogueado', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('usuarioLogueado');
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
      console.error('Error en login:', error);
      throw new Error(error.response?.data?.mensaje || 'Correo o contraseña incorrectos');
    } finally {
      setIsLoading(false);
    }
  };

  // Lógica de Logout usando API
  const logout = () => {
    const userId = currentUser?.id;
    authApi.logout();
    // Eliminar carritos posibles
    try { localStorage.removeItem('carrito'); } catch { /* ignore */ }
    try { localStorage.removeItem('carrito_guest'); } catch { /* ignore */ }
    if (userId) {
      try { localStorage.removeItem(`carrito_${userId}`); } catch { /* ignore */ }
    }
  // Flag para que CartContext sepa que debe limpiar carrito_guest en siguiente carga
  try { localStorage.setItem('just_logged_out','1'); } catch { /* ignore */ }
    setCurrentUser(null);
    window.location.reload();
  };

  // Lógica de Registro usando API real
  const register = async (newUser: RegisterData): Promise<string> => {
    try {
      setIsLoading(true);
      
  // Usar username proporcionado o derivar del correo
  const username = (newUser.username && newUser.username.trim()) || newUser.correo.split('@')[0];
      
      const created = await authApi.registro({
  username,
        email: newUser.correo,
        password: newUser.contrasena,
        name: newUser.nombre,
        lastName: newUser.apellido,
        birthDate: newUser.fechaNacimiento || '2000-01-01', // Fecha por defecto si no se proporciona
      });
      return `Usuario ${created.nombre} creado`;    
    } catch (error: any) {
      console.error('Error en registro:', error);
      const backendMsg = error.response?.data?.mensaje || error.response?.data?.message;
      throw new Error(backendMsg || 'Error al registrar usuario');
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
      console.error('Error al actualizar perfil:', error);
      throw new Error(error.response?.data?.mensaje || 'Error al actualizar perfil');
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}