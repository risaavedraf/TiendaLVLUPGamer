export type Address = {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  calle: string;
  depto?: string;
  region: string;
  comuna: string;
  instrucciones?: string;
};

// Función para cargar direcciones guardadas
export const loadSavedAddresses = (userKey: string): Address[] => {
  try {
    return JSON.parse(localStorage.getItem(`direcciones_${userKey}`) || "[]");
  } catch {
    return [];
  }
};

// Función para guardar direcciones
export const saveAddresses = (addresses: Address[], userKey: string) => {
  localStorage.setItem(`direcciones_${userKey}`, JSON.stringify(addresses));
};