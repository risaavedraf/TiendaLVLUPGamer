// Archivo: Project/src/data/users.ts

// 1. Definimos el tipo para un Usuario
export type User = {
  id: number;
  run?: string;
  nombre: string;
  apellido?: string;
  email: string;
  contrasenia: string; // En un proyecto real, esto NUNCA se guarda en texto plano
  direccion?: string;
  rol: "Admin" | "Usuario" | "Vendedor";
};

// 2. Exportamos el array de usuarios
// (He adaptado tu array de administrador.js)
export const usersArray: User[] = [
  {
    id: 1,
    run: "21123123K",
    nombre: "Ricardo",
    apellido: "Saavedra",
    email: "ri.saavedra@duocuc.cl",
    contrasenia: "admin123",
    direccion: "El tabo",
    rol: "Admin",
  },
  {
    id: 2,
    run: "19437243K",
    nombre: "Roberto",
    apellido: "Apellido",
    email: "robe@duocuc.cl",
    contrasenia: "admin123",
    direccion: "Su casa",
    rol: "Usuario",
  },
  {
    id: 3,
    run: "215091503",
    nombre: "Ignacio",
    apellido: "Pérez",
    email: "ign.perezs@duocuc.cl",
    contrasenia: "admin123",
    direccion: "Vergel 2015",
    rol: "Vendedor",
  },
];