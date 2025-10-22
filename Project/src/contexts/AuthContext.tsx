// Archivo: Project/src/contexts/AuthContext.tsx

import { createContext, useState, useContext,useEffect } from 'react';
import type { ReactNode } from 'react';
import { usersArray } from '../data/users';
import type { User } from '../data/users';

// Definimos los datos del usuario registrado en localStorage de registro.js
type RegisteredUser = {
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  rol: "Usuario"; // Asumimos que el rol por defecto es Usuario
}

type AuthContextType = {
  currentUser: User | null;
  login: (email: string, contrasenia: string) => Promise<User>;
  logout: () => void;
  register: (newUser: Omit<RegisteredUser, 'rol'>) => Promise<void>; // 1. Añadir register
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Función para cargar todos los usuarios (BD + LocalStorage)
const getAllUsers = (): User[] => {
  const localUsers: User[] = [];
  const usuariosRegistrados: RegisteredUser[] = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
  
  usuariosRegistrados.forEach((u, idx) => {
    localUsers.push({
      id: usersArray.length + idx + 1, // ID único
      nombre: u.nombre,
      apellido: u.apellido,
      email: u.correo,
      contrasenia: u.contrasena,
      rol: u.rol || "Usuario",
    });
  });
  
  // Combinamos la "base de datos" con los usuarios del localStorage
  return [...usersArray, ...localUsers];
};


export function AuthProvider({ children }: { children: ReactNode }) {
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Replicamos la lógica de administrador.js
    const usuarioLogueado = localStorage.getItem('usuarioLogueado');
    return usuarioLogueado ? JSON.parse(usuarioLogueado) : null;
  });

  // Efecto para guardar/limpiar el usuario en localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('usuarioLogueado', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('usuarioLogueado');
    }
  }, [currentUser]);

  // Lógica de Login
  const login = (email: string, contrasenia: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      const allUsers = getAllUsers();
      
      const user = allUsers.find(
        (u) => u.email === email && u.contrasenia === contrasenia
      );

      if (user) {
        setCurrentUser(user);
        resolve(user); // Éxito
      } else {
        reject(new Error("Correo o contraseña incorrectos")); // Error
      }
    });
  };

  // Lógica de Logout
  const logout = () => {
    setCurrentUser(null);
    // (La redirección la manejaremos en el componente Header)
  };

  // 2. Nueva función REGISTER (lógica de registro.js)
  const register = (newUser: Omit<RegisteredUser, 'rol'>): Promise<void> => {
    return new Promise((resolve, reject) => {
      const usuariosRegistrados: RegisteredUser[] = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
      
      // Validar si el correo ya existe
      if (usuariosRegistrados.some(u => u.correo === newUser.correo)) {
        reject(new Error("El correo ya está registrado."));
        return;
      }
      
      // Añadir el nuevo usuario con el rol por defecto
      const userToSave: RegisteredUser = {
        ...newUser,
        rol: "Usuario"
      };
      
      usuariosRegistrados.push(userToSave);
      localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosRegistrados));
      resolve();
    });
  };

  const value = {
    currentUser,
    login,
    logout,
    register 
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