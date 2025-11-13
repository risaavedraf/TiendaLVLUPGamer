// Archivo: Project/src/pages/admin/AdminUsuariosPage.tsx

import { useState, useEffect } from 'react';
import * as userApi from '../../api/userApi';
import type { UsuarioResponse } from '../../api/userApi';
import Modal from '../../component/Model'; 

function AdminUsuariosPage() {
  // 1. Estado para la lista de usuarios
  const [users, setUsers] = useState<UsuarioResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 2. Estado para el modo de eliminación
  const [deleteMode, setDeleteMode] = useState(false);
  
  // 3. Estado para controlar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar usuarios al montar
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await userApi.getAllUsuarios(0, 100);
      setUsers(data.content);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      alert('Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Funciones de Gestión ---

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  const deleteUser = async (id: number) => {
    if (window.confirm(`¿Estás seguro de desactivar al usuario con ID ${id}?`)) {
      try {
        await userApi.desactivarUsuario(id);
        await loadUsers(); // Recargar la lista
        alert('Usuario desactivado correctamente');
      } catch (error) {
        console.error('Error al desactivar usuario:', error);
        alert('Error al desactivar usuario');
      }
    }
  };

  const handleAddUserClick = () => {
    //setCurrentUserToEdit(null); // Asegura que es para añadir, no editar
    setIsModalOpen(true);
  };
  const handleSaveUser = async (userData: any) => {
    try {
      // Por ahora solo soportamos actualización
      if (userData.id) {
        await userApi.updateUsuario(userData.id, {
          nombre: userData.nombre,
          apellido: userData.apellido,
          run: userData.run,
          direccion: userData.direccion,
        });
        await loadUsers();
        alert('Usuario actualizado correctamente');
      }
    } catch (error: any) {
      console.error('Error al guardar usuario:', error);
      alert(error.response?.data?.mensaje || 'Error al guardar usuario');
    }
  };
  
  // --- Renderizado ---
  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

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
                <td>{user.nombre || user.name || 'N/A'}</td>
                <td>{user.apellido || user.lastName || 'N/A'}</td>
                <td>{user.email}</td>
                <td>{user.direccion || 'N/A'}</td>
                <td>{user.roles ? user.roles.join(', ') : 'N/A'}</td>
                {deleteMode && (
                  <td>
                    <button
                      className="btn btn-danger btn-sm delete-x"
                      onClick={() => deleteUser(user.id)}
                      title={`Eliminar ${user.nombre || user.name}`}
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