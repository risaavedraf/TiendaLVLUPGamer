// Archivo: Project/src/pages/admin/AdminUsuariosPage.tsx

import { useState } from 'react';
import { usersArray as initialUsers } from '../../data/users';
import type { User } from '../../data/users';
import Modal from '../../component/Model'; // 1. Importar el Modal // Importamos los usuarios iniciales y el tipo

// (Más adelante crearemos el componente Modal)
// import Modal from '../../components/Modal'; 

function AdminUsuariosPage() {
  // 1. Estado para la lista de usuarios (inicializado con los datos importados)
  const [users, setUsers] = useState<User[]>(initialUsers);
  
  // 2. Estado para el modo de eliminación (lógica de administrador.js)
  const [deleteMode, setDeleteMode] = useState(false);
  
  // 3. Estado para controlar el modal (lo usaremos después)
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [currentUserToEdit, setCurrentUserToEdit] = useState<User | null>(null); // Para editar en el futuro

  // --- Funciones de Gestión ---

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  const deleteUser = (id: number) => {
    if (window.confirm(`¿Estás seguro de eliminar al usuario con ID ${id}?`)) {
      setUsers(currentUsers => currentUsers.filter(user => user.id !== id));
      // En una app real, aquí llamarías a la API para eliminar
    }
  };

  const handleAddUserClick = () => {
    //setCurrentUserToEdit(null); // Asegura que es para añadir, no editar
    setIsModalOpen(true);
  };
  const handleSaveUser = (userData: User) => {
    // Lógica simple para añadir (sin editar por ahora)
    const newUser = {
      ...userData,
      // Generar un ID simple (en una app real, la API lo haría)
      id: Math.max(0, ...users.map(u => u.id)) + 1, 
      // Asegurarse de que la contraseña (si no se editó) no se pierda
      contrasenia: userData.contrasenia || 'default123' 
    };
    setUsers(currentUsers => [...currentUsers, newUser]);
    
    // Aquí también podrías llamar a una API para guardar
  };
  
  // --- Renderizado ---
  return (
    <div id="users" className="section"> {/* Mantenemos ID por si el CSS lo usa */}
      <h2>👥 Gestión de Usuarios</h2>
      <div className="table-container"> {/* Clase del CSS admin */}
        
        {/* Acciones (botones) */}
        <div className="actions mb-3"> {/* Clase del CSS admin */}
          <button className="add-btn me-2" onClick={handleAddUserClick}> {/* Clase CSS */}
            ➕ Añadir Usuario
          </button>
          <button 
            className={`delete-btn ${deleteMode ? 'btn-danger' : ''}`} // Cambia color si está activo
            onClick={toggleDeleteMode}
          >
            🗑️ {deleteMode ? 'Cancelar Eliminación' : 'Activar Eliminación'}
          </button>
        </div>

        {/* Tabla de Usuarios */}
        <table id="users-table" className="table table-striped table-hover"> {/* Clases Bootstrap */}
          <thead>
            <tr>
              <th>ID</th>
              <th>Run</th>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Email</th>
              <th>Dirección</th>
              <th>Rol</th>
              {deleteMode && <th>Acción</th>} {/* Columna extra en modo eliminar */}
            </tr>
          </thead>
          <tbody>
            {/* 4. Mapeamos el ESTADO 'users' para renderizar las filas */}
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.run || 'N/A'}</td>
                <td>{user.nombre}</td>
                <td>{user.apellido || 'N/A'}</td>
                <td>{user.email}</td>
                <td>{user.direccion || 'N/A'}</td>
                <td>{user.rol}</td>
                {/* 5. Mostramos el botón de eliminar solo en modo 'deleteMode' */}
                {deleteMode && (
                  <td>
                    <button 
                      className="btn btn-danger btn-sm delete-x" // Clase CSS + Bootstrap
                      onClick={() => deleteUser(user.id)}
                      title={`Eliminar ${user.nombre}`}
                    >
                      ❌
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveUser} // Pasamos la función de guardado
        type="user" 
        // initialData={currentUserToEdit} // Para editar en el futuro
      />
    </div>
  );
}

export default AdminUsuariosPage;